# SevaAgent setup

1. Run `npm install` and `npm run dev`.
2. In Supabase SQL Editor, run `supabase/schema.sql`.
   For an existing installation, run `supabase/add-e-kalyan-scheme.sql` to add E-Kalyan Scholarship to the live services catalogue.
   If signup returns “Database error saving new user”, run `supabase/fix-auth-signup.sql` in the SQL Editor.
3. In Storage, create a **private** bucket named `documents`.
4. Create citizen/admin users in Authentication → Users.
5. Give the admin user's UUID the `admin` role in `profiles` using the SQL comment at the bottom of the schema.
6. Copy `.env.local.example` to `.env.local` and fill in Supabase URL, publishable key and the server-only service role key.
7. Optional: add `GEMINI_API_KEY` and `GEMINI_MODEL`. Without it, the assistant uses a deterministic demo fallback.
8. The public navbar has no Admin link. Admin is at `/admin` and is server-checked against `profiles.role='admin'`.
9. Vercel: add the same environment variables under Project Settings → Environment Variables. Never commit `.env.local`, the service-role key, or the Gemini key.

Demo flow: Home → Services → service detail → AI text/voice guidance → application → document upload → `/admin` → Verify → Issue certificate.
