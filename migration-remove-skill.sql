-- Migration: Remove skill column from players table
-- Run this in your Supabase SQL Editor to fix the database

-- Step 1: Drop the existing check constraint
ALTER TABLE players DROP CONSTRAINT IF EXISTS players_skill_check;

-- Step 2: Remove the NOT NULL constraint from skill column
ALTER TABLE players ALTER COLUMN skill DROP NOT NULL;

-- Step 3: (Optional) Drop the skill column entirely if you want to remove it completely
-- Uncomment the line below if you want to completely remove the skill column
-- ALTER TABLE players DROP COLUMN IF EXISTS skill;

-- Verification query - run this to check the table structure
-- SELECT column_name, is_nullable, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'players' AND table_schema = 'public';