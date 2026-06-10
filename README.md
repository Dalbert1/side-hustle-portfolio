# The Forking Good Club

Recipe sharing app with a feed, personal recipe box, ratings, nutrition info, and a grocery cart. React + Vite + Tailwind + Supabase, packaged for iOS and Android with Capacitor. The same codebase also runs as a plain web app.

This repo is the standalone home of the app formerly living at `side-hustle-portfolio/recipebox`.

## Stack

- React 19, Vite, Tailwind 4, react-router (hash routing)
- Supabase: auth, Postgres, storage (recipe photos)
- Capacitor 8: native iOS and Android shells, deep links, native key-value storage for sessions

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

`.env.example` contains the real publishable Supabase keys, so the copy is all you need.

## Mobile development (on your Mac)

Every time the web code changes, rebuild and sync it into the native projects:

```bash
npm run sync
```

### iOS

Requires Xcode (App Store) and CocoaPods is not needed (Capacitor 8 uses Swift Package Manager).

```bash
npm run ios
```

In Xcode: select the `App` target, set your team under Signing & Capabilities, pick your iPhone as the run destination, and hit Run. With a free personal Apple ID the install works but expires after 7 days; re-run from Xcode to refresh. App Store distribution requires the paid Apple Developer Program ($99/year).

### Android

Requires Android Studio.

```bash
npm run android
```

Run on an emulator or device from Android Studio. To hand someone an installable APK without the Play Store:

```bash
cd android && ./gradlew assembleDebug
# output: android/app/build/outputs/apk/debug/app-debug.apk
```

Play Store distribution requires a Google Play developer account ($25 one time) and a signed release AAB (`./gradlew bundleRelease` after configuring a signing key).

## One-time Supabase configuration

Password reset emails open the app via a deep link on mobile. In the Supabase dashboard, under Authentication, then URL Configuration, add this to the redirect allowlist:

```
com.forkinggoodclub.app://reset-password
```

The web redirect that is already configured stays as is.

## App icons and splash screens

The native projects currently use Capacitor's default icons. To generate real ones, drop a 1024x1024 `icon.png` (and optionally a 2732x2732 `splash.png`) into an `assets/` folder and run:

```bash
npx @capacitor/assets generate
```

## Known performance issues (inherited from the original recipebox)

Findings from a June 2026 review of the original app. This codebase inherited all of these patterns, so they apply here too, ranked by impact:

1. **Photos are uploaded and served at full size.** `ImageUpload.jsx` uploads the raw camera file (often 4 to 12 MB) to Supabase Storage with no resizing, and the Feed renders those originals in small cards. This is the dominant cause of slow loads on phones. Fix: compress client-side before upload (canvas, cap ~1600px wide, JPEG quality ~0.8).
2. **Feed waterfall.** `Feed.jsx` runs three sequential queries per page (recipes, then profiles, then comments), and the comment-count query downloads every comment row to count in JavaScript. Fix: a single query with PostgREST embeds, e.g. `select('..., user_profiles(display_name, rsn, email), recipe_comments(count)')`.
3. **Grocery cart chattiness.** `CartContext.addRecipeToCart` issues up to 3 sequential requests per ingredient plus a full cart reload; a 15-ingredient recipe is ~45 round trips. `removeRecipeFromCart` has an N+1 count loop. Fix: batch upserts or a Postgres RPC.
4. **My Recipes over-fetches.** `Home.jsx` uses `select('*')`, pulling full ingredients, steps, notes, and nutrition just to render cards, and loads favorites eagerly. Fix: explicit column list (the Feed already does this) and lazy-load the favorites tab.
5. **Recipe detail waterfall.** Five sequential queries (recipe, author, like status, comments, commenter profiles). Fix: embeds plus `Promise.all`.
6. **Like taps feel laggy.** Feed and Recipe await the network before updating state. Fix: optimistic updates (set state first, then fire the request).
7. **Single JS bundle.** ~495 KB (138 KB gzipped) with no route splitting. `React.lazy` per route would trim first paint. Minor next to the image issue.
8. **Search.** `ilike '%term%'` cannot use an index. Fine at current scale; add a pg_trgm index if the recipe count grows.

The database side is in good shape: `like_count` is trigger-maintained and sensible indexes exist on `recipes(user_id)`, `recipes(category)`, tags (GIN), and `recipe_comments(recipe_id)`.

## How the mobile pieces fit together

- `capacitor.config.json` defines the app id (`com.forkinggoodclub.app`), the display name, and `dist/` as the web source.
- `src/lib/supabase.js` stores auth sessions in native storage (Capacitor Preferences) on device, because iOS can evict webview localStorage.
- `src/components/DeepLinkHandler.jsx` catches `appUrlOpen` events, establishes the Supabase session from reset links, and routes to the reset screen.
- `android/` and `ios/` are generated Capacitor projects. They are checked in (this is the Capacitor convention) and safe to open directly in Android Studio and Xcode.
