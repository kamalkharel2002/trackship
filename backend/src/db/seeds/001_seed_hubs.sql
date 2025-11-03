-- Seed hubs data (Bhutan context with valid coordinates)  
INSERT INTO hubs (hub_id, hub_name, address, latitude, longitude) VALUES
('11111111-1111-1111-1111-111111111111', 'Thimphu Central Hub', 'Norzin Lam, Thimphu City', 27.4728, 89.6390),
('22222222-2222-2222-2222-222222222222', 'Paro Airport Hub', 'Paro International Airport Road, Paro', 27.4030, 89.4240),
('33333333-3333-3333-3333-333333333333', 'Punakha Hub', 'Near Punakha Dzong, Punakha', 27.5910, 89.8770),
('44444444-4444-4444-4444-444444444444', 'Phuentsholing Hub', 'Norzim Lam, Phuentsholing, Chukha District', 26.8638, 89.3883),
('55555555-5555-5555-5555-555555555555', 'Gelephu Hub', 'Sarpang District, Gelephu Town', 26.8814, 90.4641)
ON CONFLICT DO NOTHING;
