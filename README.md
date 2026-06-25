# BIF.TV — PPV Streaming Platform

Standalone PPV streaming platform for **Balkan Influence Fighting (BIF)**.

Lives at: **bif.tv**
Companion marketing site: **bif.events** (separate repo)

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind |
| Hosting | Vercel Pro |
| Edge auth | Vercel Edge Functions |
| Database / Auth | Supabase (Postgres + Auth + Realtime + Storage) |
| Streaming | Mux (Live + VOD + ABR + DRM) |
| Payments | Stripe Checkout |
| Email | Resend |
| Errors | Sentry |
| Analytics | Vercel Analytics + GA4 + Meta Pixel |

---

## Repo layout

```
biftv/
├── app/                # Next.js App Router routes
│   ├── (marketing)/    # Public pages
│   ├── (auth)/         # Login / magic link
│   ├── (paywall)/      # Checkout / purchase
│   ├── watch/[id]/     # PPV watch player
│   ├── replay/[id]/    # VOD replay player
│   └── api/            # API routes
│       ├── stripe/     # Stripe webhooks + checkout
│       ├── mux/        # Mux webhooks + signed URL
│       └── access/     # Access token endpoints
├── components/         # Shared React components
├── lib/                # Helpers (Supabase, Mux, Stripe clients)
├── types/              # Shared TypeScript types
├── supabase/           # Migrations + RLS policies
└── public/             # Static assets
```

---

## Local development

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open http://localhost:3000

---

## Environment variables

See `.env.example` for the full list.

---

## Deployment

Auto-deploys from `main` branch to Vercel.

Preview deployments per PR.

---

## Status

| Phase | Target | Done |
|---|---|---|
| Skeleton + landing | Day 1-3 | — |
| Auth + DB + Stripe | Day 4-7 | — |
| Mux live + watch page | Day 8-12 | — |
| Anti-share / device limit | Day 13-15 | — |
| Soft launch + load test | Day 16-21 | — |
| BIF 3 live event | TBD | — |

---

© Balkan Influence Fighting. All rights reserved.
