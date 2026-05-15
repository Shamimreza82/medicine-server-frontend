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

## Important Project Info

### Current Routing & Pages
- `/diseases`: Disease-wise suggestions (requires `diseaseId`).
- `/lab-tests`: Search and filter lab tests.
- `/medicines`: Main medicine search hub.
    - `/medicines/brands/[brandId]`: Detailed view for specific medicine brands.
    - `/medicines/generics/[genericId]`: Detailed view for generic medicines.
    - `/medicines/companies/[companyId]`: Medicines by manufacturer.
    - `/medicines/classifications`: Therapeutic classification tree.
    - `/medicines/indications/[indicationId]`: Medicines by clinical indication.
    - `/medicines/herbal`: Herbal medicine search and details.
    - `/medicines/dosage-forms`: Filter by form (tablet, syrup, etc.).
    - `/medicines/warnings`: Drug interaction and safety checker.

### Key Components
- `HeroSearch`: Global search component used on the landing page.
- `AppShell`: Main layout wrapper with navigation and global UI elements.
- `WarningChecker`: Specialized tool for interaction checking.

## Useful Commands
- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run lint`: Run ESLint checks.
- `npm run start`: Start the production server after building.

## Future Considerations
- **Global Disease Search:** Implementation of a global search for diseases to populate `/diseases` more effectively.
- **Enhanced Filtering:** Improved filtering for lab tests and medicine results.
- **Offline Support:** Potential PWA features for clinical use in low-connectivity areas.
- **Auth Integration:** Future implementation of user accounts for favorites and history.