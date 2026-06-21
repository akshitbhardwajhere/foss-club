# FOSS Club NIT Srinagar - Official Website

Official monorepo for the FOSS Club NIT Srinagar platform.

This codebase contains:

- A Next.js frontend for the public website.
- An Express + Prisma backend API for content management, registrations, and integrations.

## What This App Includes

### Public experience

- Home page with dynamic next-event countdown.
- Events listing and event detail pages.
- Event registration flow.
- Blogs listing and detail pages.
- Team and alumni pages.
- Gallery listing and event-wise gallery detail pages.
- About and contact/community request pages.

### Integrations

- PostgreSQL via Prisma.
- Cloudinary for media/document storage.
- Mailjet/Nodemailer for outgoing emails.
- Google Sheets API for community/registration workflows.

## Current Tech Stack

### Frontend (`client`)

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Redux Toolkit + React Redux
- React Hook Form + Zod
- Radix UI primitives + shadcn-style components
- Tiptap editor

### Backend (`server`)

- Express 5
- TypeScript
- Prisma ORM
- PostgreSQL
- Multer for document upload handling
- apicache response caching middleware

## Architecture

The repository uses a two-app monorepo architecture:

1. `client/` serves UI pages and calls backend APIs.
2. `server/` exposes REST endpoints and handles all data/integration workflows.

### High-level request flow

1. Browser renders route in the Next.js app.
2. Client calls backend via Axios (`NEXT_PUBLIC_API_URL`).
3. Express routes dispatch to domain controllers.
4. Controllers use Prisma and external integrations.
5. Response is sent as JSON (public routes are cache-aware).

### Backend layers

- `server/src/index.ts`: app bootstrap, CORS, compression, route mounts, health endpoint.
- `server/src/routes`: endpoint grouping by domain.
- `server/src/controllers`: business logic and response handling.
- `server/src/middleware`: cache policies.
- `server/src/config`: Prisma, DB connection, Google auth setup.
- `server/src/utils`: Cloudinary and mail helpers.
- `server/prisma/schema.prisma`: authoritative data model.

### Frontend layers

- `client/app`: App Router pages/layouts.
- `client/components`: shared/ui/cards/skeleton components.
- `client/lib`: Axios client, Redux store/slices, validators/helpers.
- `client/data`: app data (navigation and constants).

## Repository Structure

```text
foss-club/
├── client/
│   ├── app/
│   │   ├── events/                 # Events + registration pages
│   │   ├── blogs/                  # Blog listing + detail pages
│   │   ├── gallery/                # Gallery listing + event gallery pages
│   │   ├── team/ about/ contact/ alumni/
│   │   └── layout.tsx              # Root app layout
│   ├── components/
│   │   ├── cards/
│   │   ├── shared/
│   │   ├── skeletons/
│   │   └── ui/
│   ├── lib/
│   │   ├── axios.ts
│   │   ├── store.ts
│   │   └── features/
│   └── public/
├── server/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── utils/
│       └── index.ts
├── CONTRIBUTION.md
└── README.md
```

## Frontend Route Map

- `/`
- `/about`
- `/events`
- `/events/[id]`
- `/events/registration/[eventName]`
- `/blogs`
- `/blogs/[id]`
- `/gallery`
- `/gallery/[id]`
- `/team`
- `/alumni`
- `/contact`

## API Surface

All routes are mounted in `server/src/index.ts`.

### Health and root

- `GET /health` - Server + database health check.
- `GET /` - Basic API service status text.

### Events (`/api/events`)

- `GET /api/events/`
- `GET /api/events/next`
- `GET /api/events/:id`
- `GET /api/events/:id/document`

### Blogs (`/api/blogs`)

- `GET /api/blogs/`
- `GET /api/blogs/:id`

### Team (`/api/team`)

- `GET /api/team/`
- `GET /api/team/:id`

### Alumni (`/api/alumni`)

- `GET /api/alumni/`

### Registration (`/api/registration`)

- `GET /api/registration/config/:eventId`
- `POST /api/registration/submit`

### Contact/community (`/api/contact`)

- `POST /api/contact/`

### Gallery (`/api/gallery`)

- `GET /api/gallery/:eventId`

## Data Model (Prisma)

Core models defined in `server/prisma/schema.prisma`:

- `Event`
- `EventGalleryImage`
- `Blog`
- `TeamMember`
- `EventRegistrationConfig`
- `EventRegistration`

## Environment Variables

No committed `.env.example` files were found in this repository. Create these manually.

### Server env (`server/.env`)

Required/expected variables:

- `DATABASE_URL` (used by Prisma/PostgreSQL)
- `PORT` (optional, default `5000`)
- `NODE_ENV` (`development` or `production`)
- `CLIENT_URL` (CORS allowlist + email links)
- `FRONTEND_URL` (additional CORS allowlist origin)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `MAILJET_API_KEY`
- `MAILJET_API_SECRET`
- `MAILJET_FROM_EMAIL`
- `GOOGLE_SHEET_ID`
- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_PRIVATE_KEY` (supports escaped newline format)

### Client env (`client/.env.local`)

- `NEXT_PUBLIC_API_URL` (default fallback is mostly `http://localhost:5000`; metadata layouts currently fallback to `http://localhost:5001` if unset)
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

## Local Development Setup

### 1. Clone

```bash
git clone <your-fork-or-repo-url>
cd foss-club
```

### 2. Backend setup

```bash
cd server
npm install
```

Create `server/.env` and set all required variables listed above.

Then run:

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

Backend runs on `http://localhost:5000` by default.

### 3. Frontend setup

```bash
cd ../client
npm install
```

Create `client/.env.local` and set:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
```

Then run:

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Available Scripts

### Client (`client/package.json`)

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

### Server (`server/package.json`)

- `npm run dev` (nodemon + tsx)
- `npm run build` (installs deps, generates Prisma client, compiles TS)
- `npm run start` (runs compiled output)

## Deployment/Operations Notes

- API CORS allowlist includes local origins and production domains configured in server bootstrap.
- Public GET endpoints use cache middleware where applicable.
- Workflow `.github/workflows/cron.yml` pings the deployed Render backend on a schedule.

## Contributing

See `CONTRIBUTION.md` for contribution workflow and coding conventions.

## License

This project is licensed under the terms in `LICENSE`.
