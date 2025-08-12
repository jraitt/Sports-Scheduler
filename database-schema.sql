-- Sports Scheduler Database Schema
-- Run this in your Supabase SQL Editor

-- Create players table
CREATE TABLE IF NOT EXISTS players (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    skill VARCHAR(50) NOT NULL CHECK (skill IN ('Beginner', 'Intermediate', 'Advanced')),
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matches table  
CREATE TABLE IF NOT EXISTS matches (
    id BIGSERIAL PRIMARY KEY,
    date DATE NOT NULL,
    time TIME NOT NULL,
    court INTEGER NOT NULL,
    players INTEGER[] NOT NULL DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courts table (for future use)
CREATE TABLE IF NOT EXISTS courts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default courts
INSERT INTO courts (id, name, location) VALUES 
(1, 'Sue L', 'Backyard'),
(2, 'Hudson', 'Rec'),
(3, 'Litchfield', 'School')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (optional - for future auth)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE courts ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (since no auth yet)
CREATE POLICY "Allow all operations on players" ON players
    FOR ALL TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all operations on matches" ON matches
    FOR ALL TO anon, authenticated  
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all operations on courts" ON courts
    FOR ALL TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_players_updated_at 
    BEFORE UPDATE ON players 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at 
    BEFORE UPDATE ON matches 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();