import Joi from 'joi';

export const authSchemas = {
  requestOTP: Joi.object({
    email: Joi.string().email().required(),
  }),
  verifyOTP: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(4).pattern(/^\d+$/).required(),
    user_name: Joi.string().min(1).max(255).optional(),
    phone: Joi.string().max(20).optional(),
    password: Joi.string().min(6).required(),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  refresh: Joi.object({
    refresh_token: Joi.string().required(),
  }),
};

export const userSchemas = {
  updateMe: Joi.object({
    user_name: Joi.string().min(1).max(255).optional(),
    phone: Joi.string().max(20).optional(),
  }),
};

export const shipmentSchemas = {
  create: Joi.object({
    receiver_name: Joi.string().min(1).max(255).required(),
    receiver_phone: Joi.string().max(20).required(),
    receiver_address: Joi.string().min(1).required(),
    source_hub_id: Joi.string().uuid().required(),
    dest_hub_id: Joi.string().uuid().required(),
    delivery_type: Joi.string().valid('hub_to_hub', 'roadside_pickup').required(),
    roadside_description: Joi.string().optional().when('delivery_type', {
      is: 'roadside_pickup',
      then: Joi.optional(),
      otherwise: Joi.forbidden(),
    }),
    sender_external_name: Joi.string().max(255).optional(),
    sender_external_phone: Joi.string().max(20).optional(),
    sender_external_address: Joi.string().optional(),
    total_price: Joi.number().min(0).optional(),

    // ✅ parcels can be an array OR a JSON string that parses to an array
    parcels: Joi.alternatives().try(
      Joi.array().items(
        Joi.object({
          category: Joi.string().max(100).optional(),
          size: Joi.string().valid('small', 'medium', 'large').required(),
          is_fragile: Joi.boolean().optional(),
          parcel_description: Joi.string().optional(),
        })
      ),
      Joi.string().custom((value, helpers) => {
        try {
          const parsed = JSON.parse(value);
          if (!Array.isArray(parsed)) {
            throw new Error();
          }
          return parsed; // ✅ Joi will replace the string with parsed array
        } catch (err) {
          return helpers.error('any.invalid', {
            message: 'parcels must be a valid JSON array string',
          });
        }
      }, 'JSON parser for parcels')
    ).optional(),
  }),

  update: Joi.object({
    receiver_name: Joi.string().min(1).max(255).optional(),
    receiver_phone: Joi.string().max(20).optional(),
    receiver_address: Joi.string().min(1).optional(),
    source_hub_id: Joi.string().uuid().optional(),
    dest_hub_id: Joi.string().uuid().optional(),
    delivery_type: Joi.string().valid('hub_to_hub', 'roadside_pickup').optional(),
    roadside_description: Joi.string().optional(),
    total_price: Joi.number().min(0).optional(),
    parcels: Joi.array().items(
      Joi.object({
        parcel_id: Joi.string().uuid().optional(),
        category: Joi.string().max(100).optional(),
        size: Joi.string().valid('small', 'medium', 'large').optional(),
        is_fragile: Joi.boolean().optional(),
        parcel_description: Joi.string().optional(),
        _delete: Joi.boolean().optional(),
      })
    ).optional(),
  }),

  query: Joi.object({
    status: Joi.string().valid(
      'pending',
      'approved',
      'verified',
      'assigned',
      'in_transit',
      'arrived_at_dest',
      'delivered',
      'cancelled'
    ).optional(),
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
  }),
};

export const parcelSchemas = {
  create: Joi.object({
    category: Joi.string().max(100).optional(),
    size: Joi.string().valid('small', 'medium', 'large').required(),
    is_fragile: Joi.boolean().optional(),
    parcel_description: Joi.string().optional(),
  }),
  update: Joi.object({
    category: Joi.string().max(100).optional(),
    size: Joi.string().valid('small', 'medium', 'large').optional(),
    is_fragile: Joi.boolean().optional(),
    parcel_description: Joi.string().optional(),
  }),
};

export const tripSchemas = {
  availability: Joi.object({
    startHub: Joi.string().uuid().required(),
    destHub: Joi.string().uuid().required(),
    date: Joi.date().iso().required(),
  }),
};

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map((detail) => detail.message),
      });
    }
    next();
  };
};

export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map((detail) => detail.message),
      });
    }
    next();
  };
};

export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map((detail) => detail.message),
      });
    }
    next();
  };
};

