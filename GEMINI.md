# Project: Medicine Frontend

## Architecture & Conventions

### Modular Structure
The project follows a modular architecture located in `src/modules`. Each module should contain:
- `api.ts`: Axios-based API calls.
- `hooks.ts`: TanStack Query hooks (useQuery, useMutation).
- `types.ts`: TypeScript interfaces and types for the module.
- `components/`: Module-specific UI components.

### Shared Directory
Common logic and reusable components live in `src/shared`:
- `api/`: Global HTTP client (Axios) and shared types.
- `components/`: Layout and cross-feature components (AppShell, PageHeader, etc.).
- `config/`: Environment variable configurations.
- `lib/`: Utility functions and third-party client initializations (QueryClient).
- `providers/`: React Context providers.

### Tech Stack Rules
- **Framework:** Next.js 15 (App Router).
- **State Management:** TanStack Query (v5) for server state.
- **Styling:** Tailwind CSS. Use Vanilla CSS only for complex animations or overrides that Tailwind cannot easily handle.
- **UI Components:** shadcn/ui patterns (Radix UI + Tailwind). Reusable components live in `src/components/ui`.
- **HTTP Client:** Axios via `shared/api/http.ts`.

### Feature-Specific Rules
- **Lab Tests:** PostgreSQL-backed, does not require Meilisearch.
- **Disease Suggestions:** Requires a `diseaseId`. Note: No global disease search endpoint exists yet.
- **Warning Checker:** Uses generic medicine search to build the request payload.

### Coding Standards
- Use functional components and hooks.
- Prefer `interface` for data structures and `type` for unions/aliases.
- Maintain strict typing for all API responses in the respective `types.ts` of the module.
- Follow the existing folder structure for new features.