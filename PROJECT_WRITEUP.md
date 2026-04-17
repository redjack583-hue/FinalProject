# Project Write-Up

## Project Name
Thunder Bay Indigenous Support Hub

## Purpose
This project is a full-stack web application intended to help users in Thunder Bay discover:

- Indigenous support services
- Indigenous-owned businesses
- Community events

It also includes an admin area for managing the hub content and a chatbot interface for answering user questions.

## High-Level Architecture
The repository contains two main applications:

1. `client`
   React + TypeScript frontend built with Vite, Tailwind CSS, shadcn/ui, React Router, and React Query.
2. `TbayIndigenousSupportHub.API`
   ASP.NET Core Web API using Entity Framework Core with SQL Server, JWT auth, OTP verification, and Swagger.

There are also deployment artifacts committed into the API project, including a `publish` folder and publish profiles.

## What Is Already Done

### Public user-facing features
- Homepage with hero section, search input, and featured content sections.
- Services listing page with:
  - search
  - category filters
  - type filters
  - map view using Leaflet
- Businesses listing page with:
  - search
  - category filters
  - map view
- Events listing page with search.
- Shared details page for service, business, and event records.
- Public business registration page.
- Floating chatbot widget available across the public site.

### Admin features
- Admin login flow with password + OTP verification.
- Admin dashboard with counts for services, businesses, and events.
- CRUD screens for:
  - services
  - businesses
  - events
  - filters
- Business request review screen inside admin.

### Backend/API features
- REST controllers for:
  - auth
  - services
  - businesses
  - events
  - filters
  - search
  - chatbot
  - users
- SQL Server database access through Entity Framework Core.
- Repository and service layers for business logic and data access.
- JWT authentication and role-based authorization.
- OTP generation and verification for login/registration.
- SMTP email sending for OTPs.
- Startup database migration and data seeding.
- Swagger enabled for API exploration.

## How It Is Built

### Frontend structure
The frontend is centered around React Router in `client/src/App.tsx`.

Routes currently include:
- `/`
- `/services`
- `/businesses`
- `/events`
- `/register-business`
- `/:type/:id`
- `/admin/login`
- `/admin/*`

Data loading is done mostly through React Query and a shared helper in `client/src/lib/api.ts`.

The API helper:
- reads `VITE_API_BASE_URL`
- attaches `admin_token` from `localStorage` when present
- expects backend responses in a wrapped `ApiResponse<T>` format
- redirects to `/admin/login` on HTTP 401

The UI uses:
- Tailwind CSS custom tokens defined in `client/src/index.css`
- shadcn/ui component files under `client/src/components/ui`
- custom reusable components such as navbar, footer, cards, search bar, filter sidebar, maps, and chatbot

### Public page flow
- `HomePage.tsx` fetches services, businesses, and events, then shows featured slices of each.
- `ServicesPage.tsx` fetches service records plus dynamic filter options and filters results in the browser.
- `BusinessesPage.tsx` does the same for businesses.
- `EventsPage.tsx` fetches and filters events in the browser.
- `DetailsPage.tsx` chooses the correct endpoint based on the route type and renders fields dynamically.

### Map implementation
Maps are implemented with `react-leaflet` in `client/src/components/MapComponent.tsx`.

Current behavior:
- OpenStreetMap tiles
- marker rendering for items with latitude and longitude
- default center around Thunder Bay
- popup content with title, category, and description

### Admin implementation
The admin area is a token-gated frontend layout using `localStorage`.

Flow:
1. Admin enters email and password.
2. Frontend calls `/api/auth/login`.
3. Backend validates password and emails an OTP.
4. Frontend calls `/api/auth/verify-otp`.
5. JWT token is stored in `localStorage` as `admin_token`.
6. Admin pages use that token for protected API calls.

Admin CRUD pages use:
- `useQuery` to load records
- `useMutation` to create/update/delete
- modal forms with local component state
- `queryClient.invalidateQueries` to refresh data after mutation

### Business registration flow
This part is important because it is not yet fully backend-driven.

Current implementation:
- `RegisterBusiness.tsx` stores submitted requests in browser `localStorage` under `business_requests`.
- `AdminBusinesses.tsx` reads the same `localStorage` key to review and accept or reject requests.
- Accepting a request creates a real business record through the backend API.

This means the request system only works inside the same browser storage context. It is not persisted in the database and is not shared across devices or users.

### Backend structure
The API follows a layered pattern:

- Controllers receive HTTP requests
- Services contain business logic
- Repositories handle EF Core queries
- `ApplicationDbContext` defines the database sets

Main models:
- `User`
- `Business`
- `Service`
- `Event`
- `OTPRequest`
- `FilterOption`

### Authentication and OTP
`AuthService.cs` handles:
- login
- registration
- invalidating old OTP codes
- generating OTPs
- emailing OTPs
- verifying OTPs
- creating JWT tokens

Authorization rules in controllers are mixed:
- services and filters are mostly admin-only for writes
- business and event writes often allow any authenticated user
- business delete is admin-only

### Search implementation
`SearchService.cs` supports filtered searching for:
- businesses
- events
- services

Search uses repository predicates and simple `Contains(...)` checks on name/description fields.

### Chatbot implementation
The chatbot flow is:
1. Frontend sends the user message to `/api/chatbot/ask`.
2. `ChatbotService` loads all services, businesses, and events.
3. It builds a system prompt from the hub data.
4. It sends the prompt plus the user message to an external chat-completions API.
5. The returned text is shown in the chatbot widget.

Even though configuration is named `GeminiSettings`, the actual request payload targets a Mistral-style chat completions endpoint.

### Startup and seeding
`Program.cs` does several startup tasks:

- configures JWT auth
- configures SQL Server
- registers repositories and services
- enables CORS for any origin/header/method
- enables Swagger
- applies EF migrations automatically
- seeds filter options if missing
- seeds a list of services if missing
- normalizes service address/location values
- creates or resets a default admin user

## Database and Seeded Content
The application is not starting from an empty state.

On startup, the backend can seed:
- service categories
- service types
- business categories
- several real Thunder Bay service entries
- a default admin account

This allows the frontend to show useful content immediately after the API starts and the database migrates.

## Configuration

### Frontend
Expected main frontend environment value:
- `VITE_API_BASE_URL`

### Backend
The backend uses configuration for:
- SQL Server connection string
- JWT settings
- SMTP settings
- chatbot API settings

## Key Technical Findings

### 1. Business request review is only local-storage based
The public "register business" flow does not save submissions in the backend database. It saves them in browser `localStorage`, and the admin review page reads them from the same storage key.

Impact:
- requests are not shared across devices
- requests are lost if storage is cleared
- real admin review is not centralized

### 2. Search endpoint mismatch exists
Frontend helper:
- `api.search.query` calls `/search?q=...`

Backend routes:
- `/api/search/services`
- `/api/search/businesses`
- `/api/search/events`

Impact:
- the generic search helper does not match the current backend routes
- if used, it will fail unless the backend adds a matching route or the frontend is updated

### 3. Service "type" appears in frontend but not in the backend model
The services admin UI and filters use a `type` field, but `Service.cs` does not define a `Type` property.

Impact:
- the UI can collect a value that the backend model does not persist
- service type filtering is not backed by stored service data

### 4. Sensitive secrets are committed in config
`appsettings.json` currently contains live-looking credentials and secrets for:
- database
- JWT signing
- SMTP
- chatbot provider

Impact:
- high security risk
- secrets should be removed from source control and moved to environment variables, secret manager, or deployment configuration

### 5. Default admin credentials are created/reset on startup
`Program.cs` seeds a specific admin email and resets the password hash during startup.

Impact:
- convenient for development
- dangerous for production if left unchanged

### 6. Some generated/build artifacts are committed
The repo includes:
- `node_modules`
- API `publish` output
- deployment artifacts

Impact:
- larger repository
- harder code review
- risk of stale generated output being mistaken for source

### 7. No meaningful automated tests were found
The client has test tooling configured (`Vitest`, `Playwright`), but I did not find actual project test files during the scan.

Impact:
- the project appears to rely mostly on manual verification

### 8. Some text encoding artifacts are present in the frontend
Examples include strings rendering as `Â·` or malformed arrow/bullet characters in a few components/pages.

Impact:
- small display quality issue
- likely caused by encoding/copy-paste problems

## Development Pattern Summary
This project was built with a pragmatic full-stack CRUD approach:

- frontend pages call backend endpoints directly through a small fetch wrapper
- React Query is used for caching and mutation refresh
- backend logic is split into controller/service/repository layers
- EF Core handles persistence
- app startup seeds enough data to make the system immediately usable
- the admin area is implemented quickly with local component state and modal forms

This is enough to make the platform functional, especially for a prototype, student project, or early deployment, but several parts still need hardening for production.

## What Works Well
- Clear separation between client and API
- Reasonable backend layering
- Good feature coverage for services, businesses, events, filters, admin, auth, and chatbot
- Dynamic filter system rather than hardcoded frontend-only options
- Mapping support with geographic coordinates
- Immediate seed data for demo/usefulness
- Swagger for backend inspection

## What Should Be Improved Next

### High priority
- Move all secrets out of source control immediately.
- Replace local-storage business request handling with a real backend table and endpoints.
- Remove hardcoded default admin reset behavior from production startup.
- Align frontend search calls with backend routes.
- Decide whether service `type` is a real field and implement it consistently front to back.

### Medium priority
- Add validation to DTOs and request models.
- Tighten authorization rules for create/update/delete endpoints.
- Add automated tests for critical frontend pages and backend services/controllers.
- Remove committed build artifacts from source control.
- Improve chatbot provider naming/config clarity.

### Lower priority
- Clean up text encoding issues.
- Add a proper README for local setup and deployment.
- Add pagination or server-side filtering if datasets grow.

## Suggested Mental Model For This Project
If someone new joins the project, the easiest way to understand it is:

1. The frontend is a content browser plus admin dashboard.
2. The backend is a CRUD API with auth, OTP, and seed data.
3. Services, businesses, events, and filters are the core content entities.
4. The chatbot is an overlay feature that uses hub data as prompt context.
5. The business request workflow is only partially implemented because it still depends on browser storage instead of the database.

## Final Assessment
This project is already beyond a simple UI mockup. It includes a working frontend, a working backend, database migrations, authentication, admin CRUD flows, maps, seeded content, and chatbot integration.

The main gap is not missing features but production readiness. The biggest concerns are secret handling, the temporary local-storage request workflow, and a few frontend/backend mismatches.
