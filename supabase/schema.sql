-- BoringDeskSelector Schema
-- Run this in your Supabase SQL editor

-- Desks table (static configuration)
CREATE TABLE IF NOT EXISTS desks (
  id TEXT PRIMARY KEY,
  area TEXT NOT NULL,
  label TEXT NOT NULL,
  is_reservable BOOLEAN DEFAULT TRUE,
  pod TEXT,
  position_row INTEGER,
  position_col INTEGER
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  desk_id TEXT REFERENCES desks(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(desk_id, date)
);

-- Enable RLS
ALTER TABLE desks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read desks" ON desks FOR SELECT USING (true);
CREATE POLICY "Public read reservations" ON reservations FOR SELECT USING (true);
CREATE POLICY "Public insert reservations" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update reservations" ON reservations FOR UPDATE USING (true);
CREATE POLICY "Public delete reservations" ON reservations FOR DELETE USING (true);

-- Seed desk data
INSERT INTO desks (id, area, label, is_reservable, pod, position_row, position_col) VALUES
  -- Onsite HS - Left Pod
  ('HS-L-00', 'Onsite HS', 'X', false, 'hs-left', 0, 0),
  ('HS1',     'Onsite HS', 'HS1', true, 'hs-left', 0, 1),
  ('HS2',     'Onsite HS', 'HS2', true, 'hs-left', 1, 0),
  ('HS3',     'Onsite HS', 'HS3', true, 'hs-left', 1, 1),
  ('HS-L-20', 'Onsite HS', 'X', false, 'hs-left', 2, 0),
  ('HS-L-21', 'Onsite HS', 'X', false, 'hs-left', 2, 1),

  -- Onsite HS - Right Pod
  ('HS-R-00', 'Onsite HS', 'X', false, 'hs-right', 0, 0),
  ('HS-R-01', 'Onsite HS', 'X', false, 'hs-right', 0, 1),
  ('HS4',     'Onsite HS', 'HS4', true, 'hs-right', 1, 0),
  ('HS5',     'Onsite HS', 'HS5', true, 'hs-right', 1, 1),
  ('HS-R-20', 'Onsite HS', 'X', false, 'hs-right', 2, 0),
  ('HS-R-21', 'Onsite HS', 'X', false, 'hs-right', 2, 1),

  -- Onsite LS
  ('LS1', 'Onsite LS', 'LS1', true, 'ls-main', 0, 0),
  ('LS2', 'Onsite LS', 'LS2', true, 'ls-main', 0, 1),
  ('LS3', 'Onsite LS', 'LS3', true, 'ls-main', 1, 0),
  ('LS4', 'Onsite LS', 'LS4', true, 'ls-main', 1, 1),

  -- Synergist
  ('S1', 'Synergist', 'S1', true, 'syn-main', 0, 0),
  ('S2', 'Synergist', 'S2', true, 'syn-main', 0, 1),
  ('S3', 'Synergist', 'S3', true, 'syn-main', 1, 0),
  ('S4', 'Synergist', 'S4', true, 'syn-main', 1, 1),
  ('S5', 'Synergist', 'S5', true, 'syn-main', 2, 0),
  ('S6', 'Synergist', 'S6', true, 'syn-main', 2, 1),
  ('S7', 'Synergist', 'S7', true, 'syn-main', 3, 0),
  ('S8', 'Synergist', 'S8', true, 'syn-main', 3, 1)
ON CONFLICT (id) DO NOTHING;

-- WFH entries table
CREATE TABLE IF NOT EXISTS wfh_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, name)
);

ALTER TABLE wfh_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read wfh_entries" ON wfh_entries FOR SELECT USING (true);
CREATE POLICY "Public insert wfh_entries" ON wfh_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public delete wfh_entries" ON wfh_entries FOR DELETE USING (true);
