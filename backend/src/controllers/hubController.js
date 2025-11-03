import pool from '../db/index.js';

export const hubController = {
  async getHubs(req, res, next) {
    try {
      const result = await pool.query(
        `SELECT hub_id, hub_name, address, latitude, longitude, created_at
         FROM hubs
         ORDER BY hub_name`
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

