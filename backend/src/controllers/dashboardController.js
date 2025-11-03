import pool from '../db/index.js';

export const dashboardController = {
  async getDashboard(req, res, next) {
    try {
      const userId = req.user.userId;

      // Get shipment counts by status
      const countsResult = await pool.query(
        `SELECT status, COUNT(*) as count
         FROM shipments
         WHERE sender_id = $1 OR receiver_id = $1
         GROUP BY status`,
        [userId]
      );

      const counts = {
        pending: 0,
        approved: 0,
        verified: 0,
        assigned: 0,
        in_transit: 0,
        arrived_at_dest: 0,
        delivered: 0,
        cancelled: 0,
      };

      countsResult.rows.forEach((row) => {
        counts[row.status] = parseInt(row.count);
      });

      // Get recent shipments (limit 5)
      const recentShipments = await pool.query(
        `SELECT s.*,
                sh.hub_name as source_hub_name,
                dh.hub_name as dest_hub_name
         FROM shipments s
         LEFT JOIN hubs sh ON s.source_hub_id = sh.hub_id
         LEFT JOIN hubs dh ON s.dest_hub_id = dh.hub_id
         WHERE s.sender_id = $1 OR s.receiver_id = $1
         ORDER BY s.created_at DESC
         LIMIT 5`,
        [userId]
      );

      res.json({
        success: true,
        data: {
          counts,
          recent_shipments: recentShipments.rows,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

