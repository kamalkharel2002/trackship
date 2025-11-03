-- Add trip-hub relation tables for availability queries
CREATE TABLE trip_hubs (
    trip_id UUID REFERENCES trips(trip_id) ON DELETE CASCADE,
    hub_id UUID REFERENCES hubs(hub_id) ON DELETE CASCADE,
    is_departure BOOLEAN DEFAULT false,
    is_destination BOOLEAN DEFAULT false,
    PRIMARY KEY (trip_id, hub_id)
);

CREATE INDEX idx_trip_hubs_trip ON trip_hubs(trip_id);
CREATE INDEX idx_trip_hubs_hub ON trip_hubs(hub_id);

