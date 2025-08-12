# Supabase Setup Guide

Follow these steps to set up multi-user persistent storage for your Sports Scheduler.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** 
3. Sign up/Sign in with GitHub (recommended)
4. Click **"New Project"**
5. Choose organization and fill in:
   - **Name:** `sports-scheduler` 
   - **Database Password:** Generate a strong password (save it!)
   - **Region:** Choose closest to your users
6. Click **"Create new project"** (takes ~2 minutes)

## Step 2: Get Your Credentials

1. In your project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL:** `https://xxxxxxxxxxxxx.supabase.co`
   - **Project API Key (anon public):** `eyJhbGciOiJIUzI1...`

## Step 3: Configure Environment Variables

1. Create `.env` file in your project root:
```bash
# Copy .env.example to .env
cp .env.example .env
```

2. Edit `.env` with your credentials:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `database-schema.sql`
3. Paste into SQL Editor and click **"Run"**
4. Verify tables were created in **Table Editor**

## Step 5: Run with Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access at http://localhost:3000
```

## Step 6: Test Multi-User Functionality

1. Open app in multiple browsers/computers
2. Add players/matches in one browser
3. Refresh other browsers - data should sync!

## Troubleshooting

### Environment Variables Not Loading
- Ensure `.env` file is in project root
- Restart Docker container after changing `.env`
- Check Docker logs: `docker-compose logs`

### Database Connection Issues  
- Verify URLs and keys in Supabase dashboard
- Check RLS policies are set (should allow all for now)
- View Network tab in browser dev tools for API errors

### CORS Issues
- Supabase allows all origins by default
- If issues, add `http://localhost:3000` in Supabase → Settings → API → CORS

## Features Enabled

✅ **Multi-user data sharing** - All users see same data
✅ **Real-time updates** - Changes sync across browsers  
✅ **Persistent storage** - Data survives restarts
✅ **Scalable** - Handles many concurrent users
✅ **Free tier** - 500MB database, 2GB bandwidth/month