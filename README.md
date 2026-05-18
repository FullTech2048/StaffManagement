# StaffManagement

Phase 1 employee management module built with React, Express, Supabase PostgreSQL, and private Supabase Storage.

## Structure

- `client/` - React + Vite employee management UI.
- `server/` - Express API using the Supabase service role key server-side only.
- `supabase/employee_management.sql` - employees table, updated_at trigger, and private `employee-photos` bucket setup.

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
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Create `client/.env` from `client/.env.example`:

```bash
VITE_API_BASE_URL=http://localhost:4000/api
```

Never place the Supabase service role key in frontend files.

4. Run locally:

```bash
npm run dev:server
npm run dev:client
```

The API runs on `http://localhost:4000` and the React app runs on `http://localhost:5173`.

## API

- `GET /api/employees` - list active employees with signed photo URLs.
- `GET /api/employees/:id` - get one active employee with a signed photo URL.
- `POST /api/employees` - create an employee with optional multipart `photo`.
- `PUT /api/employees/:id` - update employee fields and optionally replace the photo.
- `DELETE /api/employees/:id` - soft delete by setting `is_active = false`.

Employee photos are uploaded to the private `employee-photos` bucket under `employees/{employeeId}/{uuid}.{extension}`. The database stores only `photo_path`; the backend generates signed URLs when records are read.