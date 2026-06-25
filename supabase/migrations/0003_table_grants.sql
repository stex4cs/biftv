-- Grant explicit table privileges to Supabase roles.
-- Needed when "Automatically expose new tables" was OFF at project setup.

grant usage on schema public to anon, authenticated, service_role;

-- service_role: full access on everything (used by server API routes with sb_secret_ key)
grant all privileges on all tables in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;
grant all privileges on all functions in schema public to service_role;

-- events: public read (RLS policy already restricts which rows)
grant select on public.events to anon, authenticated;

-- email_subscribers: anon can insert (matches existing RLS insert policy)
grant insert on public.email_subscribers to anon, authenticated;

-- Default privileges for future tables
alter default privileges in schema public
    grant all on tables to service_role;
alter default privileges in schema public
    grant all on sequences to service_role;
alter default privileges in schema public
    grant all on functions to service_role;
