# AckLab Architecture

AckLab is organized as a feature-oriented Next.js App Router project. The current product is intentionally local-mock only: no backend, database, authentication, payments, subscriptions, or API calls are implemented.

## Current Runtime

- `app/` contains route segments and page composition.
- `src/features/subnet/` owns subnet visualization and subnet calculation logic.
- `src/features/binary/` owns binary conversion UI and conversion logic.
- `src/features/tcp-handshake/` owns TCP handshake visualization.
- `src/features/osi/` owns OSI layer visualization.
- `src/features/dns/` owns DNS flow visualization.
- `src/features/routing/` owns routing visualization and path calculation logic.
- `src/components/ui/` contains shadcn-compatible primitives.
- `src/components/layout/` contains navigation, app shell, command menu, and theme providers.
- `src/components/shared/` contains reusable product-level components.
- `src/components/visualizations/` contains shared visual building blocks.
- `src/data/` contains local mock data.
- `src/lib/` contains shared utilities and networking primitives.
- `src/services/` contains future service contracts only.

## Future Expansion Boundaries

- Auth: `src/services/auth`
- RBAC: `src/services/rbac`
- API client: `src/services/api`
- Database: `src/services/database`
- Payments and subscriptions: `src/services/payments`
- Progress tracking: `src/services/progress`
- Quiz engine: `src/services/quiz`
- Analytics: `src/services/analytics`
- Rate limiting and secure sessions: `src/services/security`
- Audit logging: `src/services/audit`

These placeholders are intentionally minimal. Add real adapters behind these contracts only when the product introduces server-side infrastructure.
