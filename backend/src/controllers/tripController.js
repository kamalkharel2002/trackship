import pool from '../db/index.js';

export const tripController = {
  async getAvailability(req, res, next) {
    try {
      const { startHub, destHub, date } = req.query;

      // Query trips that match the route and date
      const result = await pool.query(
        `SELECT DISTINCT t.*, u.user_name as transporter_name, u.email as transporter_email
         FROM trips t
         JOIN trip_hubs th1 ON t.trip_id = th1.trip_id AND th1.hub_id = $1 AND th1.is_departure = true
         JOIN trip_hubs th2 ON t.trip_id = th2.trip_id AND th2.hub_id = $2 AND th2.is_destination = true
         LEFT JOIN users u ON t.transporter_id = u.user_id
         WHERE t.trip_date = $3 AND t.trip_status IN ('scheduled', 'in_progress')
         ORDER BY t.trip_date, t.created_at`,
        [startHub, destHub, date]
      );

      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      next(error);
    }
  },
};

