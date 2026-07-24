# Deploying Kalyanam & Co. (free)

Everything here uses **free tiers** — Vercel (Hobby), Supabase (free), Resend
(free), Google Gemini (free). The only eventual optional cost is a custom domain
(~$10/yr), needed only to email arbitrary users via Resend.

**You can keep changing the site after deploying** — every `git push` to the
main branch triggers an automatic redeploy on Vercel.

## 1. Push to GitHub

The repo is already on GitHub. Make sure your latest commits are pushed:

```bash
git push
```

## 2. Import into Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New… → Project**.
2. Import this GitHub repo. Vercel auto-detects Next.js — no config needed.
3. Before the first deploy, add the environment variables below.

## 3. Environment variables (Vercel → Project → Settings → Environment Variables)

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<ref>.supabase.co` | public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon key | public |
| `SUPABASE_SERVICE_ROLE_KEY` | your service-role key | **server-only — never prefix with NEXT_PUBLIC** |
| `GEMINI_API_KEY` | your Gemini key | **server-only** (AI advisor) |
| `RESEND_API_KEY` | your Resend key | **server-only** (emails). Optional — without it, email cleanly no-ops and everything else still works. |
| `NEXT_PUBLIC_SITE_URL` | `https://your-vercel-url.vercel.app` | optional; used for links inside emails |

Copy the values from your local `.gitignore`'d `.env.local`. Set them for
**Production** (and Preview if you want previews to work).

## 4. Deploy

Click **Deploy**. First build takes ~1–2 min. After that, the site is live on a
`*.vercel.app` URL and served from Vercel's global CDN (fast, cached).

## 5. Keep Supabase awake (free projects pause after ~7 days idle)

The repo already has `.github/workflows/keep-alive.yml`. Add two **GitHub repo
secrets** (Settings → Secrets and variables → Actions) so it can ping Supabase:

- `SUPABASE_URL` = `https://<ref>.supabase.co`
- `SUPABASE_ANON_KEY` = your anon key (never the service-role key)

Then run it once by hand (Actions tab → Supabase keep-alive → Run workflow) to
confirm it's green.

## 6. Email — going from "test" to "real"

Emails send via **Resend**. Out of the box the `FROM` address is Resend's test
sender (`onboarding@resend.dev`), which **only delivers to your own Resend
account email**. That's fine for testing.

To email real users (welcome + vendor approval emails):

1. In Resend, **verify a domain** you own (add the DNS records they give you).
2. Change `FROM` in `lib/email/client.ts` to e.g. `Kalyanam & Co. <hello@yourdomain>`.
3. Push — it redeploys automatically.

## Post-deploy smoke test

- Landing page loads; the music player appears bottom-left and plays.
- Sign up a couple → lands on the dashboard (and, with a real Resend key + your
  own email, you get the welcome email).
- Marketplace loads; a hero search for a known city returns the vendor.
- `/dashboard/advisor` streams a reply.

## Notes

- **Migrations** (all 13 in `supabase/migrations/`) are already applied to the
  live project. New migrations must be run manually in the Supabase SQL editor.
- **Secrets never ship to the browser** — verified: the client bundle contains
  none of the service-role / Gemini / Resend key values.
