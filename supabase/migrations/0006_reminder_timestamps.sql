-- Track which reminders have been sent per access token so the cron job
-- can run every 15 min without double-sending.

alter table public.access_tokens
  add column if not exists reminder_24h_sent_at timestamptz,
  add column if not exists reminder_1h_sent_at timestamptz;

create index if not exists access_tokens_reminder_24h_idx
  on public.access_tokens (reminder_24h_sent_at)
  where reminder_24h_sent_at is null;

create index if not exists access_tokens_reminder_1h_idx
  on public.access_tokens (reminder_1h_sent_at)
  where reminder_1h_sent_at is null;
