# ImageKit

## What it is

ImageKit is a media-storage + CDN service tailored for images and video. It stores the original asset, serves it via a global CDN, and applies on-the-fly transformations (resize, crop, format conversion, watermarks) from URL parameters.

## Why we use it

- Image- and video-first: real-time transformations without re-encoding pipelines on our side.
- Direct-from-browser uploads via short-lived signed tokens — server never proxies bytes.
- Generous free tier sufficient for early-stage tenants.
- Single SDK (`imagekit` on npm) covers upload, listing, deletion, and URL signing.

## Free tier / pricing summary (verify at signup)

- **Free:** 20 GB media storage, 20 GB CDN bandwidth/month, unlimited transformations.
- **Paid:** Per-GB overage on storage and bandwidth; see https://imagekit.io/plans.

## Signup, step by step

1. Create an account at https://imagekit.io/registration.
2. Pick a unique **URL endpoint identifier** — this becomes part of `IMAGEKIT_URL_ENDPOINT` (e.g. `https://ik.imagekit.io/your_endpoint`).
3. **Dashboard → Developer → API Keys.** Copy:
   - **Public key** → `IMAGEKIT_PUBLIC_KEY`
   - **Private key** → `IMAGEKIT_PRIVATE_KEY`
   - **URL endpoint** → `IMAGEKIT_URL_ENDPOINT`
4. Paste into `.env` (template) or `test.env` (your local secrets):

   ```env
   IMAGEKIT_PUBLIC_KEY="public_..."
   IMAGEKIT_PRIVATE_KEY="private_..."
   IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_endpoint"
   ```

## How Schola uses it

- Server-side wrapper: [apps/api/src/services/imagekit.service.ts](../../apps/api/src/services/imagekit.service.ts) — lazy-init SDK, `isImageKitConfigured()`, `getUploadAuthParams()`.
- Upload pattern: the browser asks the API for short-lived `{token, expire, signature, publicKey}`, then POSTs the file directly to ImageKit. The API never streams bytes.
- Transformations: build delivery URLs with the SDK's `imagekit.url({ path, transformation })` helper.

## Local development

In dev, leaving `IMAGEKIT_*` blank is fine — `isImageKitConfigured()` returns `false` and image-upload endpoints will respond `503 Service Unavailable`. For end-to-end testing, create a free ImageKit account and use the same keys locally.

## Troubleshooting

- **`Missing public/private key`** at boot — one of the three env vars is blank; fill all three or all empty.
- **`Token expired`** in the browser — signed upload tokens are short-lived; the client must call the auth endpoint immediately before the upload.
- **CORS errors** during direct upload — configure allowed origins in **Dashboard → Settings → Security → Authorized origins**.
