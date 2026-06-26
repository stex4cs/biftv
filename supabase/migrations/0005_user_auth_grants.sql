-- Allow authenticated users (Supabase Auth) to read their own access_tokens.
-- service_role still bypasses RLS as before.

grant select on public.access_tokens to authenticated;

drop policy if exists "Users read own access_tokens" on public.access_tokens;
create policy "Users read own access_tokens"
  on public.access_tokens
  for select
  to authenticated
  using (lower(user_email) = lower(coalesce(auth.email(), '')));

-- Also let authenticated read their own purchases (forward-compat for AltaPay)
grant select on public.purchases to authenticated;

drop policy if exists "Users read own purchases" on public.purchases;
create policy "Users read own purchases"
  on public.purchases
  for select
  to authenticated
  using (lower(user_email) = lower(coalesce(auth.email(), '')));

-- Events still readable by everyone (already covered by existing policy)
