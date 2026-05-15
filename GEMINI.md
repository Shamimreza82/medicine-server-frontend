# Project: Medicine Frontend

This document provides essential information about the `medicine-hub-frontend` project, the client-side companion to the `medicine-backen` API.

## 1. Project Overview

`medicine-hub-frontend` is a modern, responsive web application built with **Next.js 15** and **React 19**. It provides a clinical interface for searching medicines, analyzing lab tests, and checking drug interactions.

### Core Capabilities:
- **Global Medical Search**: Unified search for brands, generics, and lab tests.
- **Clinical Decision Support**: Interactive drug interaction checker and disease-wise suggestions.
- **Admin Dashboard**: Management interface for medical data and user activities.
- **Responsive Design**: Optimized for both desktop and mobile clinical environments.

## 2. Tech Stack

*   **Framework**: Next.js 15 (App Router)
*   **Library**: React 19
*   **State Management**: TanStack Query v5 (Server State)
*   **Styling**: Tailwind CSS + shadcn/ui (Radix UI)
*   **HTTP Client**: Axios
*   **Form Management**: React Hook Form + Zod
*   **Icons**: Lucide React

## 3. Architecture & Conventions

### 3.1. Modular Structure (`src/modules`)
The project follows a feature-based modular architecture. Each module typically contains:
- `api.ts`: Feature-specific API definitions.
- `hooks.ts`: Custom React hooks and TanStack Query logic.
- `types.ts`: TypeScript interfaces for the domain.
- `components/`: Feature-specific UI components.

**Key Modules**:
- `medicines`: Search, brands, generics, and interactions.
- `lab-tests`: Directory and filtering for lab tests.
- `admin`: Internal management and monitoring dashboard.

### 3.2. App Router Layout (`src/app`)
- `/medicines`: Medicine search and navigation hub.
- `/lab-tests`: Lab test listing and search.
- `/diseases`: Clinical suggestions based on diagnosis.
- `/admin`: Management protected routes.
- `/login`: Authentication for administrative access.

### 3.3. Shared Resources (`src/shared`)
- `api/`: Global Axios instance and interceptors.
- `components/`: Layout components (AppShell, PageHeader) and common UI.
- `lib/`: Utilities, constants, and third-party initializations.
- `providers/`: Context providers (QueryClient, Auth).

## 4. Development Setup

### 4.1. Prerequisites
- Node.js 20+
- Running `medicine-backen` API (check `.env.local` for `NEXT_PUBLIC_API_URL`)

### 4.2. Common Commands
| Command | Description |
| :--- | :--- |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production build locally |
| `npm run lint` | Run ESLint checks |

## 5. Developer Guidelines

- **Server State**: Always use TanStack Query for data fetching. Do not use `useEffect` for API calls.
- **UI Components**: Check `src/components/ui` for existing shadcn components before building new ones.
- **Strict Typing**: Maintain 1:1 mapping between backend response shapes and frontend `types.ts`.
- **Styling**: Prefer Tailwind utility classes. Use `cn()` utility for conditional classes.
- **Auth**: Use the shared Auth provider for protecting `/admin` routes.