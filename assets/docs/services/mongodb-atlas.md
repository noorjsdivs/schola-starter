# MongoDB Atlas

## What it is

Managed MongoDB hosting. Schola uses Atlas for staging and production. Locally, a plain `mongod` (or `docker run mongo:8`) works fine.

## Why we use it

- Daily snapshots, point-in-time restore.
- Network access controls + database users.
- Free M0 tier is enough for dev and demos.
- Built-in monitoring + slow-query insights.

## Free tier / pricing summary (verify at signup)

- **M0 (Free):** 512 MB storage, shared compute, one cluster per project. Great for dev and demos.
- **M10 ($0.08/h ≈ $57/mo):** dedicated, suitable for early production.
- See https://www.mongodb.com/pricing for the current rates.

## Signup, step by step

1. Go to https://www.mongodb.com/cloud/atlas/register and sign up.
2. Create a project named **Schola**.
3. Create a cluster:
   - Provider: AWS (or whichever matches your hosting region).
   - Tier: **M0** to start.
   - Region: closest to your API host.
4. **Database access** → add a database user `schola_app` with a strong password. Give it `readWrite` on the `schola` database.
5. **Network access** → add the IPs of your API hosts. For local dev, your home IP is fine; for managed hosting, use the host's NAT IP or `0.0.0.0/0` only during initial bring-up (then narrow it).
6. Click **Connect → Drivers** → copy the connection string. Substitute your user's password and append `/schola?retryWrites=true&w=majority`.
7. Paste into `.env`:

   ```env
   MONGODB_URI=mongodb+srv://schola_app:<password>@<cluster>.mongodb.net/schola?retryWrites=true&w=majority
   ```

## Local development alternative

```sh
brew install mongodb-community@8.0   # macOS
brew services start mongodb-community@8.0
# or:
docker run --name schola-mongo -p 27017:27017 -d mongo:8
```

`.env` value:

```env
MONGODB_URI=mongodb://localhost:27017/schola
```

## Troubleshooting

- **`MongoServerSelectionError: ... ECONNREFUSED`** — Mongo isn't running locally, or Atlas Network Access doesn't allow your IP.
- **Auth failed** — verify the password URL-encoded special characters, and that the user has access to the right database.
- **Slow queries** — open Atlas → Performance Advisor for index recommendations. All indexes Schola needs are declared in `packages/db/src/models/*.ts`.
