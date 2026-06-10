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

## How the mobile pieces fit together

- `capacitor.config.json` defines the app id (`com.forkinggoodclub.app`), the display name, and `dist/` as the web source.
- `src/lib/supabase.js` stores auth sessions in native storage (Capacitor Preferences) on device, because iOS can evict webview localStorage.
- `src/components/DeepLinkHandler.jsx` catches `appUrlOpen` events, establishes the Supabase session from reset links, and routes to the reset screen.
- `android/` and `ios/` are generated Capacitor projects. They are checked in (this is the Capacitor convention) and safe to open directly in Android Studio and Xcode.
