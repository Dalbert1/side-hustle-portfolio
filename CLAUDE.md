# The Forking Good Club

Recipe sharing app for web, iOS, and Android. Extracted from the
side-hustle-portfolio repo to live standalone; see README.md for the
architecture and build workflow.

## Key Rules

- React + Vite + Tailwind + Supabase, wrapped with Capacitor for mobile.
- After changing web code, run `npm run sync` so the native projects pick it up.
- The `android/` and `ios/` directories are generated Capacitor projects and
  are checked in on purpose. Edit native config (AndroidManifest.xml,
  Info.plist) directly when needed; `cap sync` does not overwrite those.
- The deep link scheme `com.forkinggoodclub.app` must stay in sync across
  capacitor.config.json, AndroidManifest.xml, Info.plist, AuthContext.jsx,
  and the Supabase auth redirect allowlist.
- Mobile-first responsive design.
- Never use "em dash" for anything, it makes it obvious when things are
  generated with AI.
