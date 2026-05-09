# AckLab

AckLab is a production-oriented Next.js MVP for interactive networking fundamentals. It includes subnet visualization, binary conversion, TCP handshake animation, OSI exploration, DNS flow simulation, and graph-based routing.

The current product is intentionally local-mock only. It does not implement a backend, database, authentication, payments, subscriptions, or external APIs.

## Tech Stack

- Next.js App Router with standalone production output
- TypeScript strict mode
- TailwindCSS v4
- shadcn-compatible UI primitives
- Framer Motion
- Lucide React
- React Hook Form and Zod
- Zustand
- pnpm
- ESLint, Prettier, Husky, lint-staged
- Docker multi-stage production build
- GitHub Actions CI

## Architecture

```text
app/                  App Router pages and global layout
src/components/ui/    shadcn-compatible primitives
src/components/layout/ shell, nav, command menu, theme provider
src/components/shared/ reusable product UI
src/components/visualizations/
src/features/         domain-owned interactive tools and visualizers
src/services/         future auth/API/payment/progress contracts only
src/data/             local mock data
src/types/            shared TypeScript contracts
src/config/           app and environment configuration
src/constants/        navigation and constants
docs/                 architecture and deployment documentation
```

Future infrastructure concerns are represented by interface contracts in `src/services/`, but no network calls or server-side integrations are active.

## Local Setup

Use pnpm through Corepack:

```bash
corepack enable
corepack prepare pnpm@11.0.9 --activate
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`.

## Scripts

```bash
pnpm dev              # start local Next.js dev server
pnpm build            # create production build
pnpm start            # run production server after build
pnpm lint             # run ESLint
pnpm typecheck        # run TypeScript checks
pnpm format           # write Prettier formatting
pnpm format:check     # verify Prettier formatting
pnpm docker:build     # build local production Docker image
pnpm docker:run       # run local production Docker image
pnpm docker:compose   # run Compose-based local container test
pnpm clean            # remove generated build artifacts
```

## Environment Variables

Environment validation lives in `src/config/env.ts`.

Copy `.env.example` to `.env.local` for local development:

```bash
cp .env.example .env.local
```

Public variables:

- `NEXT_PUBLIC_APP_URL`: browser-visible app URL.

Private placeholders for future integrations:

- `AUTH_SECRET`
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `ANALYTICS_WRITE_KEY`

Do not expose secrets through `NEXT_PUBLIC_`. Any value with that prefix can be bundled into client-side JavaScript.

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

The Dockerfile uses:

- pnpm with frozen lockfile
- multi-stage builds
- Next.js `output: "standalone"`
- non-root runtime user
- port `3000`

No PostgreSQL, Redis, Nginx, Kubernetes, Terraform, or cloud-specific infrastructure is included.

## CI/CD

GitHub Actions workflow: `.github/workflows/ci.yml`

CI runs on `push` and `pull_request`:

- checkout
- setup pnpm
- setup Node.js
- install with frozen lockfile
- lint
- typecheck
- build

## Deployment

### Vercel

1. Import the repository into Vercel.
2. Use pnpm as the package manager.
3. Build command: `pnpm build`.
4. Add `NEXT_PUBLIC_APP_URL` for each environment.
5. Keep future secrets server-only and never prefix private values with `NEXT_PUBLIC_`.

### Docker

Use the included Dockerfile for production-style container builds:

```bash
docker build -t acklab:local .
docker run --rm -p 3000:3000 acklab:local
```

## Security Defaults

- Security headers are configured in `next.config.ts`.
- A report-only Content Security Policy placeholder is included for tightening before production enforcement.
- No secrets are required for the MVP.
- `.env.local` and other local environment files are ignored by Git.
- Runtime Docker container runs as a non-root user.

Dependency audit:

```bash
pnpm audit
```

## Contribution Workflow

1. Create a branch.
2. Run `pnpm install`.
3. Make scoped changes.
4. Run `pnpm lint`, `pnpm typecheck`, and `pnpm build`.
5. Commit with the Husky pre-commit hook enabled.
6. Open a pull request and wait for CI.

## Roadmap

- Course paths and guided lessons
- Quiz engine with review mode
- User progress persistence
- Packet analyzer and HTTP inspector
- Port reference and latency visualizer
- Secure auth, RBAC, subscriptions, and billing
- Rate limiting, analytics, secure sessions, and audit logs
- Admin dashboard

See `docs/architecture.md` and `docs/deployment.md` for more detail.
