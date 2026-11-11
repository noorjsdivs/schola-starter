# Firebase Authentication (Google sign-in)

## What it is

Firebase Authentication is Google's hosted identity service. Schola uses it for **one purpose only**: federated Google sign-in. The Firebase Web SDK runs the popup flow in the browser and hands us a short-lived ID token; the Firebase Admin SDK on `apps/api` verifies that token and we issue our own `schola_access` / `schola_refresh` cookies — exactly the same session shape a password login produces.

We do **not** use Firebase Hosting, Firestore, Realtime Database, FCM, Functions, Storage, or any other Firebase product. The dependency boundary stops at `firebase/auth` (web) and `firebase-admin/auth` (server).

## Why we use it

- Google's popup flow is battle-tested — better UX than rolling our own OAuth2 dance against `accounts.google.com`.
- `firebase-admin.auth().verifyIdToken()` handles signature verification, audience/issuer checks, clock-skew tolerance, and key rotation for us.
- No new auth-only infra: the Firebase ID token is consumed once on `POST /auth/google` and discarded; nothing about Firebase persists in our session, cookies, or database beyond the user's `googleId`.

## Free tier / pricing summary (verify at signup)

- **Spark (free):** unlimited Authentication users for Google as a sign-in provider. Phone-auth has separate verification quotas — not used by Schola.
- See https://firebase.google.com/pricing.

## Signup, step by step

1. Go to https://console.firebase.google.com → **Add project**. Name it `schola` (or reuse an existing project). Disable Google Analytics unless you want it — Schola doesn't use it.
2. In the new project, **Authentication → Get started → Sign-in method → Google → Enable**. Set the project support email. Save.
3. **Authentication → Settings → Authorized domains** — add `localhost` (dev) and `schola.reactbd.com` (prod). Without this, the popup will fail with `auth/unauthorized-domain`.
4. **Project settings (⚙) → General → Your apps → Add app → Web (`</>`)**. Register it as `schola-web`. Firebase shows you a config object that looks like:

   ```js
   const firebaseConfig = {
     apiKey: "AIza…",
     authDomain: "schola-xxxx.firebaseapp.com",
     projectId: "schola-xxxx",
     appId: "1:1234567890:web:abc123…",
     // messagingSenderId and storageBucket are not used by Schola.
   };
   ```

   Paste those four values into the matching `NEXT_PUBLIC_FIREBASE_*` keys in `test.env`.

5. **Project settings → Service accounts → Firebase Admin SDK → Generate new private key**. This downloads a JSON file — keep it safe, do not commit it.

   From that JSON, populate the three server keys in `test.env`:

   ```env
   FIREBASE_PROJECT_ID=<json.project_id>
   FIREBASE_CLIENT_EMAIL=<json.client_email>
   FIREBASE_PRIVATE_KEY="<json.private_key>"   # the whole PEM block, quoted
   ```

   The PEM in the JSON has `\n` escapes; you can paste it verbatim — the server loader normalizes `\n` to real newlines. Do **not** strip the `BEGIN/END PRIVATE KEY` lines.

## Local development alternative

If you don't want to set up Firebase for local development, leave **all** Firebase env keys blank. The Google sign-in button is hidden when `NEXT_PUBLIC_FIREBASE_API_KEY` is empty, and the API's `POST /auth/google` returns `503 OAUTH_DISABLED` so misconfigured clients fail fast.

There is no Firebase emulator path in v1 — the popup flow needs a real OAuth client, and the Auth emulator's ID tokens are not signed by Google. If you need to test the full flow locally, point a dev Firebase project at `localhost`.

## Troubleshooting

- **`auth/unauthorized-domain`** — Add the calling host to **Authentication → Settings → Authorized domains**.
- **`auth/popup-blocked`** — Browser blocked the popup. The web client retries with `signInWithRedirect` automatically.
- **API `OAUTH_TOKEN_INVALID`** — The ID token was either expired (>1h) or issued for a different project. Double-check that `FIREBASE_PROJECT_ID` matches `NEXT_PUBLIC_FIREBASE_PROJECT_ID`.
- **API boot error `Invalid PEM`** — `FIREBASE_PRIVATE_KEY` is missing its `BEGIN/END` lines, or quoting stripped the newlines. Re-paste from the JSON, surrounded by double quotes.
- **API `OAUTH_EMAIL_NOT_VERIFIED`** — Google says the user hasn't verified their email. Shouldn't happen for Google-issued emails, but is possible for federated identities Firebase aggregates.
