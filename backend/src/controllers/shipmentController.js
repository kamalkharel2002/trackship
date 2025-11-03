import pool from '../db/index.js';

export const shipmentController = {
  async createShipment(req, res, next) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const userId = req.user?.userId || null;

      let {
        receiver_name,
        receiver_phone,
        receiver_address,
        source_hub_id,
        dest_hub_id,
        delivery_type,
        roadside_description,
        sender_external_name,
        sender_external_phone,
        sender_external_address,
        total_price = 0,
        parcels = [],
      } = req.body;

      // ✅ Handle case where parcels is a JSON string (from form-data)
      if (typeof parcels === 'string') {
        try {
          parcels = JSON.parse(parcels);
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: 'Invalid parcels format. Must be a valid JSON array.',
          });
        }
      }

      // Validate it's an array
      if (!Array.isArray(parcels)) {
        return res.status(400).json({
          success: false,
          message: '"parcels" must be an array',
        });
      }

      // 🚚 Insert shipment
      const result = await client.query(
        `INSERT INTO shipments (
          sender_id, receiver_id, sender_external_name, sender_external_phone,
          sender_external_address, receiver_name, receiver_phone, receiver_address,
          source_hub_id, dest_hub_id, delivery_type, roadside_description, total_price
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *`,
        [
          userId,
          null,
          sender_external_name || null,
          sender_external_phone || null,
          sender_external_address || null,
          receiver_name,
          receiver_phone,
          receiver_address,
          source_hub_id,
          dest_hub_id,
          delivery_type,
          roadside_description || null,
          total_price,
        ]
      );

      const shipmentId = result.rows[0].shipment_id;

      // 📦 Insert parcels
      const createdParcels = [];
      if (parcels.length > 0) {
        for (const parcel of parcels) {
          const parcelResult = await client.query(
            `INSERT INTO parcels (
              shipment_id, category, size, is_fragile, parcel_description
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
              shipmentId,
              parcel.category || null,
              parcel.size,
              parcel.is_fragile || false,
              parcel.parcel_description || null,
            ]
          );
          createdParcels.push(parcelResult.rows[0]);
        }
      }

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Shipment created successfully',
        data: {
          ...result.rows[0],
          parcels: createdParcels,
        },
      });
    } catch (error) {
      await client.query('ROLLBACK');
      next(error);
    } finally {
      client.release();
    }
  },

  async getShipments(req, res, next) {
    try {
      const userId = req.user.userId;
      const { status, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      let query = `
        SELECT s.*,
               sh.hub_name as source_hub_name,
               dh.hub_name as dest_hub_name,
               sender.user_name as sender_name,
               receiver.user_name as receiver_account_name
        FROM shipments s
        LEFT JOIN hubs sh ON s.source_hub_id = sh.hub_id
        LEFT JOIN hubs dh ON s.dest_hub_id = dh.hub_id
        LEFT JOIN users sender ON s.sender_id = sender.user_id
        LEFT JOIN users receiver ON s.receiver_id = receiver.user_id
        WHERE s.sender_id = $1 OR s.receiver_id = $1
      `;
      const values = [userId];
      let paramCount = 2;

      if (status) {
        query += ` AND s.status = $${paramCount++}`;
        values.push(status);
      }

      query += ` ORDER BY s.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
      values.push(limit, offset);

      const result = await pool.query(query, values);

      // Get parcels for all shipments
      const shipmentIds = result.rows.map(row => row.shipment_id);
      const shipmentsWithParcels = [...result.rows];

      if (shipmentIds.length > 0) {
        const parcelsQuery = `
          SELECT * FROM parcels 
          WHERE shipment_id = ANY($1::uuid[])
          ORDER BY created_at
        `;
        const parcelsResult = await pool.query(parcelsQuery, [shipmentIds]);

        // Group parcels by shipment_id
        const parcelsByShipment = {};
        parcelsResult.rows.forEach(parcel => {
          if (!parcelsByShipment[parcel.shipment_id]) {
            parcelsByShipment[parcel.shipment_id] = [];
          }
          parcelsByShipment[parcel.shipment_id].push(parcel);
        });

        // Add parcels to each shipment
        shipmentsWithParcels.forEach(shipment => {
          shipment.parcels = parcelsByShipment[shipment.shipment_id] || [];
        });
      } else {
        shipmentsWithParcels.forEach(shipment => {
          shipment.parcels = [];
        });
      }

      // Get total count
      let countQuery = `
        SELECT COUNT(*) as total
        FROM shipments
        WHERE sender_id = $1 OR receiver_id = $1
      `;
      const countValues = [userId];

      if (status) {
        countQuery += ` AND status = $2`;
        countValues.push(status);
      }

      const countResult = await pool.query(countQuery, countValues);
      const total = parseInt(countResult.rows[0].total);

      res.json({
        success: true,
        data: shipmentsWithParcels,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getShipmentById(req, res, next) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;

      const result = await pool.query(
        `SELECT s.*,
                sh.hub_name as source_hub_name, sh.address as source_hub_address,
                dh.hub_name as dest_hub_name, dh.address as dest_hub_address,
                sender.user_name as sender_name, sender.email as sender_email,
                receiver.user_name as receiver_name, receiver.email as receiver_email
         FROM shipments s
         LEFT JOIN hubs sh ON s.source_hub_id = sh.hub_id
         LEFT JOIN hubs dh ON s.dest_hub_id = dh.hub_id
         LEFT JOIN users sender ON s.sender_id = sender.user_id
         LEFT JOIN users receiver ON s.receiver_id = receiver.user_id
         WHERE s.shipment_id = $1 AND (s.sender_id = $2 OR s.receiver_id = $2)`,
        [id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Shipment not found',
        });
      }

      // Get parcels for this shipment
      const parcels = await pool.query(
        `SELECT * FROM parcels WHERE shipment_id = $1 ORDER BY created_at`,
        [id]
      );

      res.json({
        success: true,
        data: {
          ...result.rows[0],
          parcels: parcels.rows,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async updateShipment(req, res, next) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const userId = req.user.userId;
      const { id } = req.params;

      // Check if shipment exists and is owned by user and status is pending
      const checkResult = await client.query(
        `SELECT sender_id, status FROM shipments WHERE shipment_id = $1`,
        [id]
      );

      if (checkResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          message: 'Shipment not found',
        });
      }

      const shipment = checkResult.rows[0];

      if (shipment.sender_id !== userId) {
        await client.query('ROLLBACK');
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this shipment',
        });
      }

      if (shipment.status !== 'pending') {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: 'Can only update shipments with status pending',
        });
      }

      // Build update query
      const {
        receiver_name,
        receiver_phone,
        receiver_address,
        source_hub_id,
        dest_hub_id,
        delivery_type,
        roadside_description,
        total_price,
      } = req.body;

      const updates = [];
      const values = [];
      let paramCount = 1;

      if (receiver_name !== undefined) {
        updates.push(`receiver_name = $${paramCount++}`);
        values.push(receiver_name);
      }
      if (receiver_phone !== undefined) {
        updates.push(`receiver_phone = $${paramCount++}`);
        values.push(receiver_phone);
      }
      if (receiver_address !== undefined) {
        updates.push(`receiver_address = $${paramCount++}`);
        values.push(receiver_address);
      }
      if (source_hub_id !== undefined) {
        updates.push(`source_hub_id = $${paramCount++}`);
        values.push(source_hub_id);
      }
      if (dest_hub_id !== undefined) {
        updates.push(`dest_hub_id = $${paramCount++}`);
        values.push(dest_hub_id);
      }
      if (delivery_type !== undefined) {
        updates.push(`delivery_type = $${paramCount++}`);
        values.push(delivery_type);
      }
      if (roadside_description !== undefined) {
        updates.push(`roadside_description = $${paramCount++}`);
        values.push(roadside_description);
      }
      if (total_price !== undefined) {
        updates.push(`total_price = $${paramCount++}`);
        values.push(total_price);
      }

      // Handle parcels if provided
      const { parcels } = req.body;
      
      // Check if there's anything to update
      if (updates.length === 0 && (!parcels || !Array.isArray(parcels) || parcels.length === 0)) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: 'No fields to update',
        });
      }

      let result;
      if (updates.length > 0) {
        values.push(id);
        const query = `UPDATE shipments
                       SET ${updates.join(', ')}
                       WHERE shipment_id = $${paramCount}
                       RETURNING *`;

        result = await client.query(query, values);
      } else {
        // Only updating parcels, fetch current shipment
        result = await client.query(
          `SELECT * FROM shipments WHERE shipment_id = $1`,
          [id]
        );
      }
      if (parcels && Array.isArray(parcels)) {
        // Get existing parcels for this shipment
        const existingParcelsResult = await client.query(
          `SELECT parcel_id FROM parcels WHERE shipment_id = $1`,
          [id]
        );
        const existingParcelIds = new Set(
          existingParcelsResult.rows.map(row => row.parcel_id)
        );

        const parcelsToDelete = new Set();
        const parcelsToUpdate = new Map();
        const parcelsToCreate = [];

        // Process parcels array
        for (const parcel of parcels) {
          if (parcel._delete && parcel.parcel_id) {
            // Mark for deletion
            parcelsToDelete.add(parcel.parcel_id);
          } else if (parcel.parcel_id) {
            // Mark for update
            if (existingParcelIds.has(parcel.parcel_id)) {
              parcelsToUpdate.set(parcel.parcel_id, parcel);
            }
          } else {
            // Mark for creation
            parcelsToCreate.push(parcel);
          }
        }

        // Delete parcels
        if (parcelsToDelete.size > 0) {
          await client.query(
            `DELETE FROM parcels WHERE parcel_id = ANY($1::uuid[])`,
            [Array.from(parcelsToDelete)]
          );
        }

        // Update parcels
        for (const [parcelId, parcelData] of parcelsToUpdate) {
          const parcelUpdates = [];
          const parcelValues = [];
          let parcelParamCount = 1;

          if (parcelData.category !== undefined) {
            parcelUpdates.push(`category = $${parcelParamCount++}`);
            parcelValues.push(parcelData.category);
          }
          if (parcelData.size !== undefined) {
            parcelUpdates.push(`size = $${parcelParamCount++}`);
            parcelValues.push(parcelData.size);
          }

          if (parcelData.is_fragile !== undefined) {
            parcelUpdates.push(`is_fragile = $${parcelParamCount++}`);
            parcelValues.push(parcelData.is_fragile);
          }
          if (parcelData.parcel_description !== undefined) {
            parcelUpdates.push(`parcel_description = $${parcelParamCount++}`);
            parcelValues.push(parcelData.parcel_description);
          }

          if (parcelUpdates.length > 0) {
            parcelValues.push(parcelId);
            await client.query(
              `UPDATE parcels SET ${parcelUpdates.join(', ')} WHERE parcel_id = $${parcelParamCount}`,
              parcelValues
            );
          }
        }

        // Create new parcels
        for (const parcel of parcelsToCreate) {
          await client.query(
            `INSERT INTO parcels (
              shipment_id, category, size, is_fragile, parcel_description
            )
            VALUES ($1, $2, $3, $4, $5)`,
            [
              id,
              parcel.category || null,
              parcel.size,
              parcel.is_fragile || false,
              parcel.parcel_description || null,
            ]
          );
        }
      }

      // Get updated shipment with parcels
      const updatedShipment = result.rows[0];
      const parcelsResult = await client.query(
        `SELECT * FROM parcels WHERE shipment_id = $1 ORDER BY created_at`,
        [id]
      );

      await client.query('COMMIT');

      res.json({
        success: true,
        message: 'Shipment updated successfully',
        data: {
          ...updatedShipment,
          parcels: parcelsResult.rows,
        },
      });
    } catch (error) {
      await client.query('ROLLBACK');
      next(error);
    } finally {
      client.release();
    }
  },

  async cancelShipment(req, res, next) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const userId = req.user.userId;
      const { id } = req.params;

      // Check ownership and status
      const checkResult = await client.query(
        `SELECT sender_id, status FROM shipments WHERE shipment_id = $1`,
        [id]
      );

      if (checkResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          message: 'Shipment not found',
        });
      }

      const shipment = checkResult.rows[0];

      if (shipment.sender_id !== userId) {
        await client.query('ROLLBACK');
        return res.status(403).json({
          success: false,
          message: 'Not authorized to cancel this shipment',
        });
      }

      if (shipment.status === 'cancelled' || shipment.status === 'delivered') {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: `Cannot cancel shipment with status: ${shipment.status}`,
        });
      }

      // Update status
      const result = await client.query(
        `UPDATE shipments
         SET status = 'cancelled'
         WHERE shipment_id = $1
         RETURNING *`,
        [id]
      );

      await client.query('COMMIT');

      res.json({
        success: true,
        message: 'Shipment cancelled successfully',
        data: result.rows[0],
      });
    } catch (error) {
      await client.query('ROLLBACK');
      next(error);
    } finally {
      client.release();
    }
  },
};

