import pool from '../db/index.js';

export const userController = {
  async getMe(req, res, next) {
    try {
      const userId = req.user.userId;
      const result = await pool.query(
        `SELECT user_id, user_name, email, phone, role, created_at
         FROM users
         WHERE user_id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      next(error);
    }
  },

  async updateMe(req, res, next) {
    try {
      const userId = req.user.userId;
      const { user_name, phone } = req.body;

      const updates = [];
      const values = [];
      let paramCount = 1;

      if (user_name !== undefined) {
        updates.push(`user_name = $${paramCount++}`);
        values.push(user_name);
      }

      if (phone !== undefined) {
        updates.push(`phone = $${paramCount++}`);
        values.push(phone);
      }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No fields to update',
        });
      }

      values.push(userId);
      const query = `UPDATE users
                     SET ${updates.join(', ')}
                     WHERE user_id = $${paramCount}
                     RETURNING user_id, user_name, email, phone, role, created_at`;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      res.json({
        success: true,
        message: 'User updated successfully',
        data: result.rows[0],
      });
    } catch (error) {
      next(error);
    }
  },
};

