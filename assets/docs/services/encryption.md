# Field-level PII Encryption

## What it is

Schola encrypts sensitive PII fields at rest using **envelope encryption**: a
single `ENCRYPTION_MASTER_KEY` decrypts per-record data keys, which in turn
decrypt the actual values. The result: even a leaked database dump leaves
phone numbers, dates of birth, and addresses opaque.

Per the original spec, the user opted into v1 PII encryption.

## Why we use it

- Compliance posture: any DB snapshot, replica leak, or backup theft does not
  expose PII without the master key.
- Defence-in-depth: combined with audit logging, network ACLs, and least-
  privilege DB users, it raises the cost of an exfiltration significantly.
- Future-proofs the schema for stricter regulatory regimes (DPDP, GDPR).

## Fields encrypted in v1

- `User.phone`, `User.dateOfBirth`, `User.address`
- `Student.phone`, `Student.dateOfBirth`, `Student.address`
- `Parent.phone`, `Parent.address`

## Algorithm

- Per-record `dataKey` is 32 random bytes.
- Field value is encrypted with **AES-256-GCM** using the `dataKey`; the
  ciphertext is stored as `{ iv, tag, ciphertext, keyId }` (all base64).
- The `dataKey` itself is encrypted with **AES-256-GCM** using the master key
  (`ENCRYPTION_MASTER_KEY`), stored alongside the ciphertext.
- `keyId` identifies which master key was used, so rotation is possible
  without a full re-encrypt.

## Setup

```sh
# Generate the master key (run once; store securely).
openssl rand -base64 32
```

Paste the result into `.env`:

```env
ENCRYPTION_MASTER_KEY=<the base64 string from above>
```

In production this lives in the host's secret manager (Vercel / Render env,
AWS Secrets Manager, etc.). **Never** commit it. **Never** log it.

## Rotation

1. Generate `ENCRYPTION_MASTER_KEY_v2` and add it to env as a secondary key.
2. Run `pnpm --filter @schola/api run rotate:keys` (Phase 5+). It re-encrypts
   the per-record data keys under the new master, updating `keyId`.
3. Once all rows are rotated, retire the old key.

## Troubleshooting

- **`EncryptionError: missing ENCRYPTION_MASTER_KEY`** — set the env var.
- **`EncryptionError: invalid auth tag`** — wrong master key for the
  ciphertext; you've likely swapped `.env` files between environments.
- **PII not visible in API responses** — verify the field is in the response
  serialiser's whitelist; encrypted fields are decrypted at the repository
  boundary.
