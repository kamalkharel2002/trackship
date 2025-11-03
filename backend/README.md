# TrackShip Backend - Customer Module

A Node.js + Express backend API for TrackShip, focusing on the Customer/User module for shipment tracking and management.

## Features

- **Authentication**: Email-based OTP authentication with JWT access and refresh tokens
- **User Management**: Customer profile management
- **Shipments**: Create, view, update, and cancel shipments (supports guest users)
- **Integrated Parcels**: Create, update, and delete parcels directly within shipment operations
  - Parcels can be included when creating shipments
  - All shipment endpoints return parcels with shipment data
  - Parcels can be managed (create/update/delete) through shipment update endpoint
- **Standalone Parcel Management**: Traditional parcel endpoints for granular control
- **Hubs**: View available shipping hubs
- **Trips**: Check trip availability for shipments
- **Notifications**: User notifications system
- **Dashboard**: Shipment statistics and recent activity

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, CORS, bcrypt
- **Email**: Nodemailer (OTP delivery)
- **Validation**: Joi
- **Containerization**: Docker Compose

## Project Structure

```
src/
├── config/          # Configuration files
├── db/              # Database connection, migrations, seeds
│   ├── migrations/  # SQL migration files
│   └── seeds/       # SQL seed files
├── controllers/     # Route controllers
├── middlewares/     # Express middlewares (auth, error handling)
├── routes/          # API route definitions
├── services/        # Business logic services (auth, email, notifications)
├── utils/           # Utility functions (validation)
└── server.js        # Application entry point
```

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL (via Docker Compose)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `env.example` to `.env` and fill in your configuration:

```bash
cp env.example .env
```

Edit `.env` with your settings:

```env
# Server
PORT=3000
NODE_ENV=development

# Database (matches docker-compose.yml)
PGHOST=localhost
PGPORT=5432
PGUSER=trackship_user
PGPASSWORD=trackship_password
PGDATABASE=trackship_db

# JWT Secrets (change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# OTP
OTP_EXPIRY_MINUTES=10

# Email SMTP (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@trackship.com
```

**Note**: For Gmail, you'll need to:
1. Enable 2-factor authentication
2. Generate an App Password (not your regular password)
3. Use the App Password in `SMTP_PASS`

```

### 4. Run Database Migrations

```bash
npm run migrate
```

This creates all required database tables and schema.

### 5. Seed Initial Data

```bash
npm run seed
```

This populates:
- Sample hubs (5 locations)
- Sample transporter user
- Sample trips with hub relationships

### 6. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

All endpoints are prefixed with `/api/v1`

### Authentication

- `POST /api/v1/auth/request-otp` - Request OTP code via email
- `POST /api/v1/auth/verify-otp` - Verify OTP and get JWT tokens
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout (requires auth)
- `POST /api/v1/auth/login` - Login

### Users

- `GET /api/v1/users/me` - Get current user profile (requires auth)
- `PUT /api/v1/users/me` - Update current user profile (requires auth)

### Shipments

- `POST /api/v1/shipments` - Create shipment with optional parcels (optionally authenticated for guest users)
- `GET /api/v1/shipments` - List shipments with parcels (query: `?status=&page=&limit=`) (requires auth)
- `GET /api/v1/shipments/:id` - Get shipment details with parcels (requires auth)
- `PUT /api/v1/shipments/:id` - Update shipment and manage parcels (only when status='pending' and owner) (requires auth)
- `POST /api/v1/shipments/:id/cancel` - Cancel shipment (requires auth)

**Note**: All shipment endpoints now include parcel items in their responses. Parcels can be created, updated, or deleted as part of shipment operations.

### Parcels

- `POST /api/v1/shipments/:shipmentId/parcels` - Add parcel to shipment (requires auth)
- `PUT /api/v1/parcels/:id` - Update parcel (requires auth)
- `DELETE /api/v1/parcels/:id` - Delete parcel (requires auth)

## Shipment API Details

### POST /api/v1/shipments - Create Shipment

Creates a new shipment with optional parcels included in the same request.

**Authentication**: Optional (guest users can create shipments)

**Request Body**:
```json
{
  "receiver_name": "string (required, max 255 chars)",
  "receiver_phone": "string (required, max 20 chars)",
  "receiver_address": "string (required)",
  "source_hub_id": "uuid (required)",
  "dest_hub_id": "uuid (required)",
  "delivery_type": "string (required, 'hub_to_hub' | 'roadside_pickup')",
  "roadside_description": "string (optional, required if delivery_type='roadside_pickup')",
  "sender_external_name": "string (optional, max 255 chars)",
  "sender_external_phone": "string (optional, max 20 chars)",
  "sender_external_address": "string (optional)",
  "total_price": "number (optional, min 0, default 0)",
  "parcels": [
    {
      "category": "string (optional, max 100 chars)",
      "size": "string (required, 'small' | 'medium' | 'large')",
      "item_value": "number (optional, min 0, default 0)",
      "is_insured": "boolean (optional, default false)",
      "is_fragile": "boolean (optional, default false)",
      "parcel_description": "string (optional)"
    }
  ]
}
```

**Response**: Returns shipment object with created parcels included in `parcels` array.

### GET /api/v1/shipments - List Shipments

Retrieves a paginated list of shipments with their parcels included.

**Authentication**: Required

**Query Parameters**:
- `status` (optional): Filter by status (`pending`, `approved`, `verified`, `assigned`, `in_transit`, `arrived_at_dest`, `delivered`, `cancelled`)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response**: Returns array of shipments, each with a `parcels` array containing all associated parcels.

### GET /api/v1/shipments/:id - Get Shipment Details

Retrieves a single shipment by ID with all its parcels.

**Authentication**: Required

**Response**: Returns shipment object with `parcels` array containing all associated parcels.

### PUT /api/v1/shipments/:id - Update Shipment

Updates shipment fields and/or manages parcels (create, update, delete).

**Authentication**: Required

**Authorization**: Only the shipment owner (sender_id) can update

**Constraints**: Can only update shipments with `status='pending'`

**Request Body**:
```json
{
  "receiver_name": "string (optional, min 1, max 255 chars)",
  "receiver_phone": "string (optional, max 20 chars)",
  "receiver_address": "string (optional, min 1)",
  "source_hub_id": "uuid (optional)",
  "dest_hub_id": "uuid (optional)",
  "delivery_type": "string (optional, 'hub_to_hub' | 'roadside_pickup')",
  "roadside_description": "string (optional)",
  "total_price": "number (optional, min 0)",
  "parcels": [
    {
      // Create new parcel - omit parcel_id
      "category": "string (optional, max 100 chars)",
      "size": "string (optional, 'small' | 'medium' | 'large')",
      "item_value": "number (optional, min 0)",
      "is_insured": "boolean (optional)",
      "is_fragile": "boolean (optional)",
      "parcel_description": "string (optional)"
    },
    {
      // Update existing parcel - include parcel_id
      "parcel_id": "uuid (optional)",
      "category": "string (optional, max 100 chars)",
      "size": "string (optional, 'small' | 'medium' | 'large')",
      "item_value": "number (optional, min 0)",
      "is_insured": "boolean (optional)",
      "is_fragile": "boolean (optional)",
      "parcel_description": "string (optional)"
    },
    {
      // Delete existing parcel - include parcel_id and _delete
      "parcel_id": "uuid (required)",
      "_delete": true
    }
  ]
}
```

**Parcel Operations**:
1. **Create**: Parcels without `parcel_id` are created as new parcels
2. **Update**: Parcels with `parcel_id` (and no `_delete` flag) are updated with provided fields
3. **Delete**: Parcels with `parcel_id` and `_delete: true` are deleted from the shipment

**Note**: You can update only parcels without updating shipment fields. Simply provide only the `parcels` array in the request body.

**Response**: Returns updated shipment object with `parcels` array containing all current parcels (after create/update/delete operations).

### Hubs

- `GET /api/v1/hubs` - List all hubs (public)

### Trips

- `GET /api/v1/trips/availability` - Check trip availability (query: `?startHub=&destHub=&date=`) (public)


### Dashboard

- `GET /api/v1/dashboard` - Get dashboard data (shipment counts by status, recent shipments) (requires auth)

## Authentication Flow

1. **Request OTP**: Send email to `/auth/request-otp`
2. **Verify OTP**: Send email and OTP to `/auth/verify-otp`
   - If user doesn't exist, creates new user automatically
   - Returns `access_token` and `refresh_token`
3. **Use Access Token**: Include in `Authorization: Bearer <token>` header
4. **Refresh Token**: When access token expires, use `/auth/refresh` with `refresh_token`
5. **Logout**: Use `/auth/logout` to invalidate refresh token

## Example API Usage

### 1. Request OTP

```bash
curl -X POST http://localhost:3000/api/v1/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### 2. Verify OTP and Get Tokens

```bash
curl -X POST http://localhost:3000/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456",
    "user_name": "John Doe",
    "phone": "+1234567890",
    "password": "12345"
  }'
```

Response:
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "user": {
      "user_id": "...",
      "user_name": "John Doe",
      "email": "user@example.com",
      "phone": "+1234567890",
      "role": "customer"
    },
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc..."
  }
}
```

### 3. Create Shipment with Parcels (Authenticated)

```bash
curl -X POST http://localhost:3000/api/v1/shipments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "receiver_name": "Jane Smith",
    "receiver_phone": "+9876543210",
    "receiver_address": "123 Main St, City",
    "source_hub_id": "11111111-1111-1111-1111-111111111111",
    "dest_hub_id": "22222222-2222-2222-2222-222222222222",
    "delivery_type": "hub_to_hub",
    "total_price": 25.50,
    "parcels": [
      {
        "category": "Electronics",
        "size": "medium",
        "is_fragile": true,
        "parcel_description": "Laptop computer"
      },
      {
        "category": "Clothing",
        "size": "small",
        "is_fragile": false,
        "parcel_description": "Winter jacket"
      }
    ]
  }'
```

Response:
```json
{
  "success": true,
  "message": "Shipment created successfully",
  "data": {
    "shipment_id": "uuid-here",
    "sender_id": "uuid-here",
    "receiver_name": "Jane Smith",
    "receiver_phone": "+9876543210",
    "receiver_address": "123 Main St, City",
    "source_hub_id": "11111111-1111-1111-1111-111111111111",
    "dest_hub_id": "22222222-2222-2222-2222-222222222222",
    "delivery_type": "hub_to_hub",
    "status": "pending",
    "total_price": 25.50,
    "created_at": "2024-01-01T00:00:00.000Z",
    "parcels": [
      {
        "parcel_id": "uuid-here",
        "shipment_id": "uuid-here",
        "category": "Electronics",
        "size": "medium",
        "is_fragile": true,
        "parcel_description": "Laptop computer",
        "created_at": "2024-01-01T00:00:00.000Z"
      },
      {
        "parcel_id": "uuid-here",
        "shipment_id": "uuid-here",
        "category": "Clothing",
        "size": "small",
        "is_fragile": false,
        "parcel_description": "Winter jacket",
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### 4. Create Shipment with Parcels (Guest - No Auth Required)

```bash
curl -X POST http://localhost:3000/api/v1/shipments \
  -H "Content-Type: application/json" \
  -d '{
    "sender_external_name": "Guest Sender",
    "sender_external_phone": "+1111111111",
    "sender_external_address": "456 Guest St",
    "receiver_name": "Jane Smith",
    "receiver_phone": "+9876543210",
    "receiver_address": "123 Main St, City",
    "source_hub_id": "11111111-1111-1111-1111-111111111111",
    "dest_hub_id": "22222222-2222-2222-2222-222222222222",
    "delivery_type": "hub_to_hub",
    "total_price": 25.50,
    "parcels": [
      {
        "size": "large",
        "item_value": 50.00,
        "is_fragile": true,
        "parcel_description": "Furniture piece"
      }
    ]
  }'
```

### 5. Create Shipment with Roadside Pickup

```bash
curl -X POST http://localhost:3000/api/v1/shipments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "receiver_name": "Jane Smith",
    "receiver_phone": "+9876543210",
    "receiver_address": "123 Main St, City",
    "source_hub_id": "11111111-1111-1111-1111-111111111111",
    "dest_hub_id": "22222222-2222-2222-2222-222222222222",
    "delivery_type": "roadside_pickup",
    "roadside_description": "Red building, second floor, ring doorbell twice",
    "parcels": [
      {
        "size": "medium",
        "item_value": 75.00,
        "is_insured": true
      }
    ]
  }'
```

### 6. Get Shipments List (with Parcels)

```bash
curl -X GET "http://localhost:3000/api/v1/shipments?status=pending&page=1&limit=10" \
  -H "Authorization: Bearer <access_token>"
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "shipment_id": "uuid-here",
      "sender_id": "uuid-here",
      "receiver_name": "Jane Smith",
      "receiver_phone": "+9876543210",
      "receiver_address": "123 Main St, City",
      "source_hub_id": "uuid-here",
      "dest_hub_id": "uuid-here",
      "delivery_type": "hub_to_hub",
      "status": "pending",
      "total_price": 25.50,
      "created_at": "2024-01-01T00:00:00.000Z",
      "source_hub_name": "Hub A",
      "dest_hub_name": "Hub B",
      "sender_name": "John Doe",
      "parcels": [
        {
          "parcel_id": "uuid-here",
          "shipment_id": "uuid-here",
          "category": "Electronics",
          "size": "medium",
          "item_value": 150.00,
          "is_insured": true,
          "is_fragile": true,
          "parcel_description": "Laptop computer",
          "created_at": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### 7. Get Shipment by ID (with Parcels)

```bash
curl -X GET http://localhost:3000/api/v1/shipments/{shipment_id} \
  -H "Authorization: Bearer <access_token>"
```

Response:
```json
{
  "success": true,
  "data": {
    "shipment_id": "uuid-here",
    "sender_id": "uuid-here",
    "receiver_name": "Jane Smith",
    "receiver_phone": "+9876543210",
    "receiver_address": "123 Main St, City",
    "source_hub_id": "uuid-here",
    "dest_hub_id": "uuid-here",
    "source_hub_name": "Hub A",
    "source_hub_address": "123 Hub Street",
    "dest_hub_name": "Hub B",
    "dest_hub_address": "456 Hub Avenue",
    "delivery_type": "hub_to_hub",
    "status": "pending",
    "total_price": 25.50,
    "created_at": "2024-01-01T00:00:00.000Z",
    "parcels": [
      {
        "parcel_id": "uuid-here",
        "shipment_id": "uuid-here",
        "category": "Electronics",
        "size": "medium",
        "item_value": 150.00,
        "is_insured": true,
        "is_fragile": true,
        "parcel_description": "Laptop computer",
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### 8. Update Shipment with Parcel Operations

The update endpoint allows you to:
- **Create new parcels**: Include parcels without `parcel_id`
- **Update existing parcels**: Include parcels with `parcel_id` and updated fields
- **Delete parcels**: Include parcels with `parcel_id` and `_delete: true`

```bash
curl -X PUT http://localhost:3000/api/v1/shipments/{shipment_id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "total_price": 30.00,
    "parcels": [
      {
        "parcel_id": "existing-parcel-uuid",
        "size": "large",
        "item_value": 200.00,
        "is_insured": true
      },
      {
        "parcel_id": "another-existing-parcel-uuid",
        "_delete": true
      },
      {
        "category": "Books",
        "size": "small",
        "item_value": 25.00,
        "is_fragile": false
      }
    ]
  }'
```

In this example:
- First parcel: Updates the existing parcel (changes size, item_value, and is_insured)
- Second parcel: Deletes the existing parcel (using `_delete: true`)
- Third parcel: Creates a new parcel (no `parcel_id` provided)

Response:
```json
{
  "success": true,
  "message": "Shipment updated successfully",
  "data": {
    "shipment_id": "uuid-here",
    "total_price": 30.00,
    "status": "pending",
    "parcels": [
      {
        "parcel_id": "existing-parcel-uuid",
        "shipment_id": "uuid-here",
        "size": "large",
        "item_value": 200.00,
        "is_insured": true,
        "created_at": "2024-01-01T00:00:00.000Z"
      },
      {
        "parcel_id": "new-parcel-uuid",
        "shipment_id": "uuid-here",
        "category": "Books",
        "size": "small",
        "item_value": 25.00,
        "is_fragile": false,
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

**Note**: You can also update only parcels without updating shipment fields. Simply omit all shipment fields and only provide the `parcels` array.

### 9. Update Shipment Fields Only

```bash
curl -X PUT http://localhost:3000/api/v1/shipments/{shipment_id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "receiver_phone": "+9999999999",
    "total_price": 35.00
  }'
```

### 10. Get Dashboard Data

```bash
curl -X GET http://localhost:3000/api/v1/dashboard \
  -H "Authorization: Bearer <access_token>"
```

## Database Schema

### Tables

- **users**: Customer and transporter accounts
- **hubs**: Shipping hub locations
- **shipments**: Shipment records with status tracking
- **parcels**: Individual parcels within shipments
- **trips**: Transporter trip schedules
- **trip_hubs**: Junction table linking trips to hubs
- **refresh_tokens**: Hashed refresh tokens for JWT

### Shipment Status Flow

```
pending → approved → verified → assigned → in_transit → arrived_at_dest → delivered
                                                              ↓
                                                          cancelled
```

## Security Features

- **JWT Authentication**: Access and refresh token pattern
- **Bcrypt Hashing**: Refresh tokens stored as hashes
- **Parameterized Queries**: SQL injection prevention
- **Helmet**: Security headers
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: Joi schema validation on all endpoints

## Development

### Database Migrations

Add new migrations to `src/db/migrations/` and run:

```bash
npm run migrate
```

### Seeding Data

Add new seed files to `src/db/seeds/` and run:

```bash
npm run seed
```

### Health Check

```bash
curl http://localhost:3000/health
```

## Production Considerations

1. **Environment Variables**: Use strong, unique secrets for JWT
2. **Database**: Use managed PostgreSQL service
3. **OTP Storage**: Replace in-memory OTP store with Redis
4. **Email Service**: Use production SMTP service (SendGrid, AWS SES, etc.)
5. **CORS**: Configure specific origins instead of `*`
6. **Rate Limiting**: Add rate limiting middleware
7. **Logging**: Implement proper logging system
8. **Error Handling**: Customize error responses for production

## Troubleshooting

### Email Not Working

- Verify SMTP credentials in `.env`
- For Gmail, ensure App Password is used (not regular password)
- Check SMTP settings match your email provider

### Migration Errors

- Ensure PostgreSQL is running before migrations
- Drop and recreate database if schema conflicts occur
- Check migration files are in correct order

## License

ISC
