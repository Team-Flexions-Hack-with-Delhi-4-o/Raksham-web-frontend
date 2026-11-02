# Raksham

### Legal help, made easier to understand.

Raksham is a legal-assistance platform designed to help people in India find clear, accessible information and the right next steps. This repository contains the **Raksham web frontend**. The frontend connects to the Raksham API when its base URL is configured.

| | |
| --- | --- |
| **Live backend** | [raksham.onrender.com](https://raksham.onrender.com/) |
| **API base URL** | `https://raksham.onrender.com/api/v1` |
| **Frontend** | React 19 · Vite 8 |

> **Note:** The deployment link above is the backend service, not the frontend website.

## What’s inside

- Public landing page, sign-in and account creation screens
- Signed-in application routes for the dashboard, Sachi assistant, legal resources, drafts, checklists and advocate discovery
- English and Hindi localization
- Shared API client for communicating with the Raksham backend
- Responsive interface built with React, Tailwind CSS and project design tokens

Some product areas are still in development. Screens or flows that are not implemented use placeholders; backend-dependent experiences require a reachable API.

## Tech stack

- **React 19** with JavaScript and JSX
- **Vite 8** for development and production builds
- **Tailwind CSS 4** and plain CSS
- **React Router 7** for navigation
- **i18next** and `react-i18next` for localization
- **Lucide React** icons and Inter variable font
- **ESLint 10** for linting

## Getting started

### Requirements

- Node.js 20.19 or later
- npm

### Install and run

```bash
npm install
cp .env.example .env
npm run dev
```

The development server is available at [http://localhost:5173](http://localhost:5173).

On Windows PowerShell, copy the example environment file with:

```powershell
Copy-Item .env.example .env
```

## Configuration

Set the API base URL in `.env` to connect the frontend to the deployed backend:

```dotenv
VITE_API_BASE_URL=https://raksham.onrender.com/api/v1
```

The value should include `/api/v1` and should not have a trailing slash. Leave it empty to run without an API connection. Keep secrets out of frontend environment variables: values prefixed with `VITE_` are included in the browser build.

See [.env.example](.env.example) for the available settings, including the quick-exit destination and optional test login.

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create the production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Project structure

```text
src/
├── app/          Application entry and route configuration
├── assets/       Imported images and visual assets
├── components/   Shared UI, layout, authentication and app components
├── data/         Static content and sample data
├── i18n/         Localization setup and English/Hindi translations
├── pages/        Public, authentication and signed-in app pages
├── services/     API client and feature service modules
├── styles/       Global styles, design tokens and page styles
└── utils/        Shared utility functions
```

## Backend deployment

The backend is hosted on Render:

**[Open the Raksham backend deployment](https://raksham.onrender.com/)**

Configure the frontend with `https://raksham.onrender.com/api/v1` as shown above to use the API.

## Legal information

Raksham is intended to provide legal information and help users navigate resources. It is not a substitute for advice from a qualified legal professional. Always verify emergency contact details and legal information with official sources.
