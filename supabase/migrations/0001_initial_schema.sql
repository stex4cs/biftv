-- =============================================
-- BIF.TV — Initial Database Schema
-- Run this in Supabase SQL editor when the project is created.
-- =============================================

create extension if not exists "uuid-ossp";

-- Events table
create table if not exists public.events (
    id uuid primary key default uuid_generate_v4(),
    slug text unique not null,
    title text not null,
    subtitle text,
    sponsor_line text,
    poster_url text,
    trailer_video_url text,
    date timestamptz not null,
    doors_open text,
    main_event_time text,
    venue text,
    venue_city text,
    description text,
    fights jsonb default '[]'::jsonb,
    -- Prices stored as object: {livePass: 9, vodPass: 5, bundlePass: 12, currency: 'EUR'}
    prices jsonb not null,
    status text not null default 'upcoming' check (status in ('upcoming','live','ended','vod')),
    mux_live_stream_id text,
    mux_playback_id text,
    mux_stream_key text,
    vod_available_at timestamptz,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create index events_status_idx on public.events (status);
create index events_date_idx on public.events (date desc);

-- Purchases table
create table if not exists public.purchases (
    id uuid primary key default uuid_generate_v4(),
    user_email text not null,
    event_id uuid references public.events(id) on delete restrict,
    amount numeric(10,2) not null,
    currency text not null default 'EUR',
    stripe_payment_intent_id text unique,
    stripe_customer_id text,
    pass_type text not null check (pass_type in ('live','vod','bundle')),
    status text not null default 'pending' check (status in ('pending','succeeded','refunded','failed')),
    purchased_at timestamptz default now() not null,
    refunded_at timestamptz,
    metadata jsonb default '{}'::jsonb
);

create index purchases_email_idx on public.purchases (lower(user_email));
create index purchases_event_idx on public.purchases (event_id);
create index purchases_status_idx on public.purchases (status);

-- Access tokens (per purchase access record)
create table if not exists public.access_tokens (
    token text primary key,
    purchase_id uuid references public.purchases(id) on delete cascade,
    user_email text not null,
    event_id uuid references public.events(id) on delete cascade,
    pass_type text not null,
    expires_at timestamptz not null,
    active_device_id text,
    active_device_user_agent text,
    last_heartbeat_at timestamptz,
    revoked boolean default false not null,
    created_at timestamptz default now() not null
);

create index access_tokens_email_idx on public.access_tokens (lower(user_email));
create index access_tokens_event_idx on public.access_tokens (event_id);

-- Sessions (track concurrent viewers + anti-share)
create table if not exists public.viewer_sessions (
    id uuid primary key default uuid_generate_v4(),
    access_token text references public.access_tokens(token) on delete cascade,
    device_id text not null,
    ip_address inet,
    user_agent text,
    started_at timestamptz default now() not null,
    last_heartbeat_at timestamptz default now() not null,
    ended_at timestamptz
);

create index viewer_sessions_token_idx on public.viewer_sessions (access_token);
create index viewer_sessions_active_idx on public.viewer_sessions (last_heartbeat_at)
    where ended_at is null;

-- Email subscribers (for BIF 3 launch announcement etc.)
create table if not exists public.email_subscribers (
    email text primary key,
    source text default 'website',
    subscribed_at timestamptz default now() not null
);

-- Updated-at trigger function
create or replace function public.set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
    before update on public.events
    for each row execute function public.set_updated_at();

-- =============================================
-- Row Level Security (RLS)
-- =============================================
alter table public.events enable row level security;
alter table public.purchases enable row level security;
alter table public.access_tokens enable row level security;
alter table public.viewer_sessions enable row level security;
alter table public.email_subscribers enable row level security;

-- Events: anyone can read upcoming/live/vod events
drop policy if exists events_read on public.events;
create policy events_read on public.events
    for select using (status in ('upcoming','live','vod','ended'));

-- Purchases / access_tokens / sessions: only service_role can access
-- (we'll go through API routes with service role, not from the browser)

-- Email subscribers: anyone can insert their own email
drop policy if exists email_subscribers_insert on public.email_subscribers;
create policy email_subscribers_insert on public.email_subscribers
    for insert with check (true);
