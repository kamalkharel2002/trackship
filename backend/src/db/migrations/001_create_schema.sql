-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('customer', 'transporter', 'admin');
CREATE TYPE shipment_status AS ENUM (
    'pending',
    'approved',
    'verified',
    'assigned',
    'in_transit',
    'arrived_at_dest',
    'delivered',
    'cancelled'
);
CREATE TYPE parcel_size AS ENUM ('small', 'medium', 'large');
CREATE TYPE delivery_type AS ENUM ('hub_to_hub', 'roadside_pickup');
CREATE TYPE trip_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');

-- Users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role user_role DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hubs table
CREATE TABLE hubs (
    hub_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hub_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipments table
CREATE TABLE shipments (
    shipment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    receiver_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    sender_external_name VARCHAR(255),
    sender_external_phone VARCHAR(20),
    sender_external_address TEXT,
    receiver_name VARCHAR(255) NOT NULL,
    receiver_phone VARCHAR(20) NOT NULL,
    receiver_address TEXT NOT NULL,
    transporter_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    status shipment_status DEFAULT 'pending',
    source_hub_id UUID REFERENCES hubs(hub_id),
    dest_hub_id UUID REFERENCES hubs(hub_id),
    delivery_type delivery_type NOT NULL,
    roadside_description TEXT,
    total_price NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Parcels table
CREATE TABLE parcels (
    parcel_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID REFERENCES shipments(shipment_id) ON DELETE CASCADE,
    category VARCHAR(100),
    size parcel_size NOT NULL,
    is_fragile BOOLEAN DEFAULT false,
    parcel_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trips table
CREATE TABLE trips (
    trip_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transporter_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    vehicle_info VARCHAR(255),
    trip_date DATE NOT NULL,
    route_info TEXT,
    trip_status trip_status DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Refresh tokens table
CREATE TABLE refresh_tokens (
    token_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Create indexes
CREATE INDEX idx_shipments_sender ON shipments(sender_id);
CREATE INDEX idx_shipments_receiver ON shipments(receiver_id);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_parcels_shipment ON parcels(shipment_id);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);


