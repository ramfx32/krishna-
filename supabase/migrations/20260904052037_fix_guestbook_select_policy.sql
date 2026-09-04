/*
# Fix guestbook SELECT policy header matching

The request.headers setting in PostgREST is a JSON string like:
{"x-guestbook-key":"nee-ennoda-sita-na-unnoda-ram",...}

The previous LIKE pattern expected "x-guestbook-key: value" (with space)
but the actual JSON format uses "x-guestbook-key":"value" (with quotes).
Updated the LIKE pattern to match regardless of JSON formatting.
*/

DROP POLICY IF EXISTS "owner_select_guestbook" ON guestbook_entries;

CREATE POLICY "owner_select_guestbook"
ON guestbook_entries FOR SELECT
TO anon, authenticated
USING (
  current_setting('request.headers', true)::text
  LIKE '%x-guestbook-key%nee-ennoda-sita-na-unnoda-ram%'
);
