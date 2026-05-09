# Deployment

AckLab is a static-friendly Next.js App Router application with no backend, database, auth, payment, or external API dependency in the MVP.

## Environment Variables

Copy `.env.example` to `.env.local` for local development:

```bash
cp .env.example .env.local
```

Public variables:

- `NEXT_PUBLIC_APP_URL`: safe browser-visible site URL.

Private placeholders:

- `AUTH_SECRET`
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `ANALYTICS_WRITE_KEY`

Do not prefix secrets with `NEXT_PUBLIC_`. Values with that prefix are bundled into browser JavaScript.

## Local Development

```bash
corepack enable
corepack prepare pnpm@11.0.9 --activate
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Production Build Test

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm start
```

## Docker

Build and run the production image:

```bash
pnpm docker:build
pnpm docker:run
```

Or use Compose for local container testing:

```bash
pnpm docker:compose
```

The Dockerfile uses Next.js standalone output, a multi-stage build, and a non-root runtime user.

## Vercel

1. Import the repository into Vercel.
2. Set the package manager to pnpm.
3. Use the default build command: `pnpm build`.
4. Add `NEXT_PUBLIC_APP_URL` in Project Settings > Environment Variables.
5. Keep future secrets server-only. Do not use `NEXT_PUBLIC_` for auth, database, payment, or analytics write secrets.

## GitHub Actions

`.github/workflows/ci.yml` runs on pushes and pull requests:

- install with `pnpm install --frozen-lockfile`
- lint
- typecheck
- build

## Security Roadmap

- TODO(auth): secure authentication, session rotation, MFA, and CSRF strategy.
- TODO(rbac): role and permission model for admin and learning operations.
- TODO(rate-limit): edge/API rate limiting before public write endpoints.
- TODO(audit): immutable audit logging for sensitive changes.
