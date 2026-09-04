/*
# Create guestbook_entries table (single-tenant, private read)

1. New Tables
- `guestbook_entries`
- `id` (uuid, primary key)
- `name` (text, not null) — the name of the person writing the note
- `message` (text, not null) — the note content
- `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `guestbook_entries`.
- INSERT: anyone (anon + authenticated) can write entries — this is the public submission form.
- SELECT: only allowed when the request includes a correct password header `x-guestbook-key`
  matching a stored secret. This means only the owner (who knows the password) can read entries.
  We use `current_setting('request.headers', true)` to check the custom header.

3. Important Notes
- The SELECT policy checks `x-guestbook-key` header against a hardcoded secret value.
- The anon key client sends this header when fetching entries, so only the owner can read.
- INSERT is open to all so visitors can submit notes.
*/

CREATE TABLE IF NOT EXISTS guestbook_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE guestbook_entries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT (public submission)
DROP POLICY IF EXISTS "anon_insert_guestbook" ON guestbook_entries;
CREATE POLICY "anon_insert_guestbook"
ON guestbook_entries FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow SELECT only when the correct password header is present
DROP POLICY IF EXISTS "owner_select_guestbook" ON guestbook_entries;
CREATE POLICY "owner_select_guestbook"
ON guestbook_entries FOR SELECT
TO anon, authenticated
USING (
  current_setting('request.headers', true)::text
  LIKE '%x-guestbook-key: nee-ennoda-sita-na-unnoda-ram%'
);
