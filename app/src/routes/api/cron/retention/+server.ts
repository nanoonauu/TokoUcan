import { json, type RequestHandler } from '@sveltejs/kit';
import { retentionWorker } from '#lib/server/modules/retention.js';

export const POST: RequestHandler = async () => {
	try {
		const result = await retentionWorker.executePurgeJob();

		return json({
			success: true,
			data: result
		});
	} catch (err) {
		const errorMessage = (err as Error).message;
		return json(
			{
				success: false,
				error: errorMessage
			},
			{ status: 500 }
		);
	}
};

export const GET: RequestHandler = async () => {
	try {
		const upcoming24h = await retentionWorker.getUpcomingPurgeCount(24);
		const upcoming7d = await retentionWorker.getUpcomingPurgeCount(24 * 7);

		return json({
			success: true,
			data: {
				upcomingPurgesIn24Hours: upcoming24h,
				upcomingPurgesIn7Days: upcoming7d
			}
		});
	} catch (err) {
		const errorMessage = (err as Error).message;
		return json(
			{
				success: false,
				error: errorMessage
			},
			{ status: 500 }
		);
	}
};
