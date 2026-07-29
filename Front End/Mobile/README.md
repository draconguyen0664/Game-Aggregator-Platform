# Game Aggregator Ops Companion

React Native operations companion for the Game Aggregator Platform. It focuses on high-signal mobile workflows instead of duplicating the three web portals.

## Features

- Secure Spring authentication with tokens stored in Expo SecureStore.
- Optional Face ID, Touch ID, or fingerprint session unlock.
- Responsive live dashboard backed by incident, deployment, and ledger services.
- Incident acknowledgement, self-assignment, timeline notes, and resolution.
- Deployment state controls and rollback requests.
- Push notification permission flow and Android operations channel.
- TanStack Query loading, error, pull-to-refresh, and empty states.
- FlashList feeds, Zustand navigation, Reanimated transitions, and optional Sentry reporting.

## Configure

Copy `.env.example` to `.env`:

```powershell
Copy-Item .env.example .env
```

Android Emulator uses `10.0.2.2` by default. iOS Simulator and web use `127.0.0.1`. For a physical device, set `EXPO_PUBLIC_BACKEND_HOST` to the development computer's LAN address and allow the backend ports through the local firewall.

## Run

Start the Docker backend first, then:

```powershell
npm install
npm run android
```

Use `npm run ios` on macOS or `npm run web` for the browser build. Remote push notifications on Android require an Expo development build; Expo Go supports local notifications but not remote push on current SDK versions.

## Quality checks

```powershell
npm run typecheck
npm run lint
npm test -- --runInBand
npx expo config --type public
```

Never commit login credentials, Expo push tokens, refresh tokens, or Sentry auth tokens. `EXPO_PUBLIC_SENTRY_DSN` is optional.
