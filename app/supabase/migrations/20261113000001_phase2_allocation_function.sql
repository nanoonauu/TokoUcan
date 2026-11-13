-- Migration: 20261113000001_phase2_allocation_function.sql
-- Description: Atomic inventory allocation functions using FOR UPDATE SKIP LOCKED for Phase 2

-- 1. Helper function: Allocate single item vault credentials
create or replace function public.allocate_vault_credentials(
  p_order_id uuid,
  p_order_item_id uuid,
  p_buyer_id uuid,
  p_product_id uuid,
  p_quantity integer default 1
)
returns setof public.vault_credentials as $$
declare
  v_available_count integer;
  v_allocated_count integer;
begin
  if p_quantity is null or p_quantity < 1 then
    raise exception 'INVALID_QUANTITY: Kuantitas alokasi minimal 1 unit.';
  end if;

  -- Check available stock
  select count(*) into v_available_count
  from public.vault_credentials
  where product_id = p_product_id
    and status = 'available'
    and deleted_at is null;

  if v_available_count < p_quantity then
    raise exception 'INSUFFICIENT_STOCK: Stok tidak mencukupi (tersedia: %, diminta: %)', v_available_count, p_quantity;
  end if;

  -- Lock and allocate
  return query
  with locked_stock as (
    select id
    from public.vault_credentials
    where product_id = p_product_id
      and status = 'available'
      and deleted_at is null
    order by created_at asc
    limit p_quantity
    for update skip locked
  )
  update public.vault_credentials vc
  set
    order_id = p_order_id,
    order_item_id = p_order_item_id,
    buyer_id = p_buyer_id,
    status = 'delivered',
    delivered_at = now(),
    purge_at = now() + interval '30 days',
    updated_at = now()
  from locked_stock
  where vc.id = locked_stock.id
  returning vc.*;

  get diagnostics v_allocated_count = row_count;
  if v_allocated_count < p_quantity then
    raise exception 'CONCURRENT_ALLOCATION_CONFLICT: Stok sedang dialokasikan oleh transaksi lain. Coba sesaat lagi.';
  end if;
end;
$$ language plpgsql security definer set search_path = public;

-- 2. Helper function: Atomically allocate all items for an entire order and mark order as paid
create or replace function public.allocate_order_inventory(
  p_order_id uuid
)
returns table(
  order_id uuid,
  allocated_count integer,
  order_status text
) as $$
declare
  v_order record;
  v_item record;
  v_allocated_total integer := 0;
  v_allocated_for_item integer := 0;
begin
  -- Lock order row
  select * into v_order
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'ORDER_NOT_FOUND: Pesanan dengan ID % tidak ditemukan.', p_order_id;
  end if;

  if v_order.status = 'paid' then
    return query select v_order.id, 0, 'paid'::text;
    return;
  end if;

  if v_order.status in ('cancelled', 'expired', 'failed') then
    raise exception 'INVALID_ORDER_STATUS: Pesanan berstatus % tidak dapat dialokasikan.', v_order.status;
  end if;

  -- Allocate each order item
  for v_item in
    select id, product_id, quantity
    from public.order_items
    where order_items.order_id = p_order_id
  loop
    with locked_stock as (
      select id
      from public.vault_credentials
      where product_id = v_item.product_id
        and public.vault_credentials.status = 'available'
        and deleted_at is null
      order by created_at asc
      limit v_item.quantity
      for update skip locked
    ),
    updated_rows as (
      update public.vault_credentials vc
      set
        order_id = v_order.id,
        order_item_id = v_item.id,
        buyer_id = v_order.buyer_id,
        status = 'delivered',
        delivered_at = now(),
        purge_at = now() + interval '30 days',
        updated_at = now()
      from locked_stock
      where vc.id = locked_stock.id
      returning vc.id
    )
    select count(*) into v_allocated_for_item from updated_rows;

    if v_allocated_for_item < v_item.quantity then
      raise exception 'INSUFFICIENT_STOCK: Stok produk % tidak mencukupi (dialokasikan % dari %)', v_item.product_id, v_allocated_for_item, v_item.quantity;
    end if;

    v_allocated_total := v_allocated_total + v_allocated_for_item;
  end loop;

  -- Mark order as paid
  update public.orders
  set
    status = 'paid',
    paid_at = coalesce(paid_at, now()),
    updated_at = now()
  where id = p_order_id;

  -- Audit trail
  insert into public.audit_logs (
    actor_id,
    actor_role,
    action,
    resource_type,
    resource_id,
    details
  ) values (
    v_order.buyer_id,
    'system',
    'order.delivered',
    'orders',
    p_order_id::text,
    jsonb_build_object('total_allocated', v_allocated_total, 'order_id', p_order_id)
  );

  return query select v_order.id, v_allocated_total, 'paid'::text;
end;
$$ language plpgsql security definer set search_path = public;

-- Permissions
grant execute on function public.allocate_vault_credentials(uuid, uuid, uuid, uuid, integer) to authenticated, service_role;
grant execute on function public.allocate_order_inventory(uuid) to authenticated, service_role;

