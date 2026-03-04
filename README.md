# BORINGDESKSELECTOR.COM

> Reserve your desk. No drama. Just desks.

A nerdy, terminal-aesthetic desk reservation system built with Python (FastAPI), Supabase, and React.

## Office Layout

- **Onsite HS** — Hot Seats: HS1, HS2, HS3 (left pod) and HS4, HS5 (right pod)
- **Onsite LS** — Lounge Seats: LS1–LS4
- **Synergist** — S1–S8

## Setup

### 1. Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL editor
3. Copy your project URL and anon key

### 2. Backend

```bash
cd backend
cp .env.example .env
# Fill in SUPABASE_URL and SUPABASE_KEY in .env

python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

uvicorn main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

### 3. Frontend

```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:8000

npm install
npm run dev
```

Open: http://localhost:5173

## Features

- 7-day booking window (today → today + 7)
- Visual floor map matching the real office layout
- Click to reserve, click to edit or release
- Real-time availability indicators
- Nerdy matrix/terminal aesthetic

## Tech Stack

| Layer    | Tech          |
|----------|---------------|
| Backend  | Python + FastAPI |
| Database | Supabase (PostgreSQL) |
| Frontend | React + TypeScript + Vite |
| Styling  | Tailwind CSS  |
| Font     | JetBrains Mono |
