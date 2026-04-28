# Frontend

Separate Next.js frontend for the backend in this repository.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style UI components
- Axios
- Sonner
- TanStack Query
- Modular feature structure

## Run

1. Install frontend dependencies:

```bash
cd frontend
npm install
```

2. Configure environment:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
```

3. Start the app:

```bash
npm run dev
```

## Structure

```text
src/
  app/
  components/ui/
  modules/
    lab-tests/
    medicines/
  shared/
    api/
    components/
    config/
    lib/
    providers/
```

## Notes

- `lab-tests` is PostgreSQL-backed and does not depend on Meilisearch.
- Disease suggestions require a known `diseaseId` because the backend currently has no disease search endpoint.
- Warning checking uses generic medicine search to build the request payload.
