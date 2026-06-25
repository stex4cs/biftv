-- Seed: BIF 2 (completed) + BIF 3 (upcoming)
-- Idempotent — upserts on slug, so it's safe to re-run.

insert into public.events (
  slug, title, subtitle, sponsor_line, poster_url, date,
  doors_open, main_event_time, venue, venue_city, description,
  fights, prices, status, vod_available_at
) values
(
  'bif-2', 'BIF 2 — Beogradski Sajam',
  'Kengur crowned new BIF Champion',
  'Powered by Oktagonbet',
  '/posters/bif-2-poster.png',
  '2026-06-20T19:00:00+02:00',
  '19:00', '22:00',
  'Beogradski Sajam, Hala 3', 'Beograd',
  'The night that crowned Kengur as BIF Champion. Five main fights, a 3v1 handicap, surprises that lit up Hall 3. Watch the full replay.',
  '[
    {"id":"f1","order":1,"startTimeHint":"20:00","fighter1":"Nenad Antonio","fighter2":"Ćure, Riđi & Loki","isHandicap":true,"rounds":5,"roundDuration":"1.5 min","breakDuration":"1.5 min","result":{"winner":"Ćure, Riđi & Loki","method":"TKO"}},
    {"id":"f2","order":2,"startTimeHint":"20:30","fighter1":"Ksima","fighter2":"Bakić","rounds":3,"roundDuration":"3 min","breakDuration":"1 min","result":{"winner":"Bakić","method":"TKO"}},
    {"id":"f3","order":3,"startTimeHint":"21:00","fighter1":"Bukur","fighter2":"Pena Kamen","rounds":5,"roundDuration":"1 min","breakDuration":"1 min","result":{"winner":"Pena Kamen","method":"TKO"}},
    {"id":"f4","order":4,"startTimeHint":"21:30","fighter1":"Duka Prase","fighter2":"Marko Filipović","matchType":"co-main","rounds":5,"roundDuration":"2 min","breakDuration":"2 min","result":{"winner":"Duka Prase","method":"SD"}},
    {"id":"f5","order":5,"startTimeHint":"22:00","fighter1":"Marko Jack","fighter2":"Kengur","matchType":"main","rounds":5,"roundDuration":"2 min","breakDuration":"2 min","result":{"winner":"Kengur","method":"TKO"}}
  ]'::jsonb,
  '{"livePass":9,"vodPass":5,"bundlePass":12,"currency":"EUR"}'::jsonb,
  'vod',
  '2026-06-22T00:00:00+02:00'
),
(
  'bif-3', 'BIF 3',
  'The crown belongs to whoever takes it',
  'Powered by Oktagonbet',
  '/posters/bif-3-poster.png',
  '2026-10-15T19:00:00+02:00',
  '19:00', '22:00',
  'TBA', 'Beograd',
  'After Kengur dethroned Marko Jack at BIF 2, the line of challengers is forming. BIF 3 sets the next chapter — new fights, returning legends, and surprises live from Belgrade.',
  '[]'::jsonb,
  '{"livePass":9,"vodPass":5,"bundlePass":12,"currency":"EUR"}'::jsonb,
  'upcoming',
  null
)
on conflict (slug) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  sponsor_line = excluded.sponsor_line,
  poster_url = excluded.poster_url,
  date = excluded.date,
  doors_open = excluded.doors_open,
  main_event_time = excluded.main_event_time,
  venue = excluded.venue,
  venue_city = excluded.venue_city,
  description = excluded.description,
  fights = excluded.fights,
  prices = excluded.prices,
  status = excluded.status,
  vod_available_at = excluded.vod_available_at,
  updated_at = now();
