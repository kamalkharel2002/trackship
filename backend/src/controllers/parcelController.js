import pool from '../db/index.js';

export const parcelController = {
  async createParcel(req, res, next) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const userId = req.user.userId;
      const { shipmentId } = req.params;

      // Verify shipment ownership
      const shipmentCheck = await client.query(
        `SELECT sender_id, status FROM shipments WHERE shipment_id = $1`,
        [shipmentId]
      );

      if (shipmentCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          message: 'Shipment not found',
        });
      }

      if (shipmentCheck.rows[0].sender_id !== userId) {
        await client.query('ROLLBACK');
        return res.status(403).json({
          success: false,
          message: 'Not authorized to add parcels to this shipment',
        });
      }

      const {
        category,
        size,
        is_fragile = false,
        parcel_description,
      } = req.body;

      const result = await client.query(
        `INSERT INTO parcels (
          shipment_id, category, size, is_fragile, parcel_description
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
          shipmentId,
          category || null,
          size,
          is_fragile,
          parcel_description || null,
        ]
      );

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Parcel created successfully',
        data: result.rows[0],
      });
    } catch (error) {
      await client.query('ROLLBACK');
      next(error);
    } finally {
      client.release();
    }
  },

  async updateParcel(req, res, next) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const userId = req.user.userId;
      const { id } = req.params;

      // Verify parcel ownership through shipment
      const parcelCheck = await client.query(
        `SELECT p.parcel_id, s.sender_id, s.status
         FROM parcels p
         JOIN shipments s ON p.shipment_id = s.shipment_id
         WHERE p.parcel_id = $1`,
        [id]
      );

      if (parcelCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          message: 'Parcel not found',
        });
      }

      if (parcelCheck.rows[0].sender_id !== userId) {
        await client.query('ROLLBACK');
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this parcel',
        });
      }

      if (parcelCheck.rows[0].status !== 'pending') {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: 'Can only update parcels for shipments with status pending',
        });
      }

      // Build update query
      const {
        category,
        size,
        is_fragile,
        parcel_description,
      } = req.body;

      const updates = [];
      const values = [];
      let paramCount = 1;

      if (category !== undefined) {
        updates.push(`category = $${paramCount++}`);
        values.push(category);
      }
      if (size !== undefined) {
        updates.push(`size = $${paramCount++}`);
        values.push(size);
      }
      if (is_fragile !== undefined) {
        updates.push(`is_fragile = $${paramCount++}`);
        values.push(is_fragile);
      }
      if (parcel_description !== undefined) {
        updates.push(`parcel_description = $${paramCount++}`);
        values.push(parcel_description);
      }

      if (updates.length === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: 'No fields to update',
        });
      }

      values.push(id);
      const query = `UPDATE parcels
                     SET ${updates.join(', ')}
                     WHERE parcel_id = $${paramCount}
                     RETURNING *`;

      const result = await client.query(query, values);
      await client.query('COMMIT');

      res.json({
        success: true,
        message: 'Parcel updated successfully',
        data: result.rows[0],
      });
    } catch (error) {
      await client.query('ROLLBACK');
      next(error);
    } finally {
      client.release();
    }
  },

  async deleteParcel(req, res, next) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const userId = req.user.userId;
      const { id } = req.params;

      // Verify parcel ownership through shipment
      const parcelCheck = await client.query(
        `SELECT p.parcel_id, s.sender_id, s.status
         FROM parcels p
         JOIN shipments s ON p.shipment_id = s.shipment_id
         WHERE p.parcel_id = $1`,
        [id]
      );

      if (parcelCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          message: 'Parcel not found',
        });
      }

      if (parcelCheck.rows[0].sender_id !== userId) {
        await client.query('ROLLBACK');
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this parcel',
        });
      }

      if (parcelCheck.rows[0].status !== 'pending') {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: 'Can only delete parcels for shipments with status pending',
        });
      }

      await client.query('DELETE FROM parcels WHERE parcel_id = $1', [id]);
      await client.query('COMMIT');

      res.json({
        success: true,
        message: 'Parcel deleted successfully',
      });
    } catch (error) {
      await client.query('ROLLBACK');
      next(error);
    } finally {
      client.release();
    }
  },
};

