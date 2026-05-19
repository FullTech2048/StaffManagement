# StaffManagement

Phase 1 employee management module built with React, Express, Supabase Auth, Supabase PostgreSQL, and private Supabase Storage.

## Structure

- `client/` - React + Vite employee management UI.
- `server/` - Express API using the Supabase service role key server-side only.
- `supabase/employee_management.sql` - employees/admin tables, updated_at triggers, and private `employee-photos` bucket setup.

## Setup

1. Install dependencies:

```bash
npm install --prefix server
npm install --prefix client
```

2. Create Supabase schema and storage bucket:

Run `supabase/employee_management.sql` in the Supabase SQL editor for your project.

3. Configure environment variables:

Create `server/.env` from `server/.env.example`:

```bash
PORT=4000
FRONTEND_URLS=http://localhost:5173
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=Staff Management <onboarding@resend.dev>
```

Create `client/.env` from `client/.env.example`:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=http://localhost:4000/api
```

Never place the Supabase service role key in frontend files. The frontend must only use the Supabase anon key.

4. Run locally:

```bash
npm run dev:server
npm run dev:client
```

The API runs on `http://localhost:4000` and the React app runs on `http://localhost:5173`.

5. Create an admin account:

Visit `http://localhost:5173/signup` and sign up with an email, full name, and password. The app creates the Supabase Auth user and stores the profile in `admin_profiles`.
Signup is handled by the Express API with the Supabase service role key, so Supabase Auth email templates are not used. Admin signup emails are sent through Resend.

## Deployment

### Backend on Railway

Create a Railway service from this repository and use these settings:

- Root directory: `server`
- Install command: `npm install`
- Start command: `npm start`

Set these Railway environment variables:

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
FRONTEND_URLS=https://your-vercel-app.vercel.app
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=Staff Management <admin@your-domain.com>
```

Railway provides `PORT` automatically, so you do not need to set it there. After deploy, copy the Railway public domain, for example `https://your-api.up.railway.app`.

### Frontend on Vercel

Create a Vercel project from this repository and use these settings:

- Root directory: `client`
- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

Set this Vercel environment variable:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=https://your-api.up.railway.app/api
```

Redeploy Vercel after changing frontend environment variables; Vite embeds these values at build time.

### Production CORS

The backend only allows requests from `FRONTEND_URLS` and local Vite development. Make sure Railway `FRONTEND_URLS` includes the deployed Vercel URL, including `https://`. Multiple frontend URLs can be comma-separated, for example `https://your-vercel-app.vercel.app,https://your-custom-domain.com`.

## API

- `GET /api/employees` - list active employees with signed photo URLs.
- `GET /api/employees/:id` - get one active employee with a signed photo URL.
- `GET /api/employees/:id/photo-url` - get one active employee's signed photo URL.
- `POST /api/employees` - create an employee with optional multipart `photo`.
- `PUT /api/employees/:id` - update employee fields and optionally replace the photo.
- `DELETE /api/employees/:id` - soft delete by setting `is_active = false`.
- `POST /api/auth/signup` - create a Supabase Auth admin user, save `admin_profiles`, and send a Resend email.

All employee routes require a Supabase Auth admin access token:

```bash
Authorization: Bearer <access_token>
```

Employee photos are uploaded to the private `employee-photos` bucket under `employees/{employeeId}/{uuid}.{extension}`. The database stores only `photo_path`; the backend generates signed URLs when records are read.

## Admin Auth SQL

Run `supabase/employee_management.sql`, or run this admin-specific SQL in the Supabase SQL editor if the employee schema already exists:

```sql
create table if not exists public.admin_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists admin_profiles_set_updated_at on public.admin_profiles;

create trigger admin_profiles_set_updated_at
before update on public.admin_profiles
for each row
execute function public.set_updated_at();
```

## Testing Admin Access

1. Start the backend and frontend with the env vars above.
2. Visit `http://localhost:5173/signup`.
3. Sign up with email, full name, password, and confirm password.
4. Confirm a Supabase Auth user and an `admin_profiles` row are created.
5. Confirm Resend sends the admin account email.
6. Confirm `/employees` loads and employee create/edit/delete/photo upload still work.
7. Sign out and confirm `/employees` redirects to `/login`.
8. Call an employee API without `Authorization` and confirm it returns `401`.