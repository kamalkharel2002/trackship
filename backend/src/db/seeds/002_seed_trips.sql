-- Seed sample transporter user (for trips)
INSERT INTO users (user_id, user_name, email, role) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Transport Co', 'transporter@trackship.com', 'transporter')
ON CONFLICT (email) DO NOTHING;

-- Seed sample trips with hub relations
INSERT INTO trips (trip_id, transporter_id, vehicle_info, trip_date, route_info, trip_status) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Truck BP-A-2233', CURRENT_DATE + INTERVAL '1 day', 'Near Thimphu Central Hub to Paro Airport Hub', 'scheduled'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Van BP-E-1234', CURRENT_DATE + INTERVAL '2 days', 'Near Paro Airport Hub to Punakha Hub', 'scheduled'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Truck BP-E-2234', CURRENT_DATE + INTERVAL '3 days', 'Near Punakha Hub to Phuntsholing Hub', 'scheduled')
ON CONFLICT DO NOTHING;

-- Link trips to hubs
INSERT INTO trip_hubs (trip_id, hub_id, is_departure, is_destination) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', true, false),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', false, true),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', true, false),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '44444444-4444-4444-4444-444444444444', false, true),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '55555555-5555-5555-5555-555555555555', true, false),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', false, true)
ON CONFLICT DO NOTHING;

