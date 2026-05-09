# AckLab Architecture

AckLab is organized as a feature-oriented Next.js App Router project. The current product is intentionally local-mock only: no backend, database, authentication, payments, subscriptions, or API calls are implemented.

## Current Runtime

- `app/` contains route segments and page composition.
- `features/networking/` owns domain logic and interactive visualization components.
- `components/ui/` contains shadcn-compatible primitives.
- `components/layout/` contains navigation, app shell, command menu, and theme providers.
- `data/` contains local mock data.
- `services/` contains future service contracts only.

## Future Expansion Boundaries

- Auth: `services/auth`
- RBAC: `services/rbac`
- API client: `services/api`
- Database: `services/database`
- Payments and subscriptions: `services/payments`
- Progress tracking: `services/progress`
- Quiz engine: `services/quiz`
- Analytics: `services/analytics`
- Rate limiting and secure sessions: `services/security`
- Audit logging: `services/audit`
- Admin surfaces: `features/admin`
- Course content: `features/courses`

These placeholders are intentionally minimal. Add real adapters behind these contracts only when the product introduces server-side infrastructure.
