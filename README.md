# StudyStack 📚

A premium, modern web application for students to find, preview, upload, and download previous year question papers, notes, and study materials. Built with React, Vite, TypeScript, Tailwind CSS, and Supabase.

## Features ✨

- **Modern Apple-inspired UI**: Clean typography, glassmorphism, soft shadows, and smooth Framer Motion animations.
- **Dark/Light Mode**: Full theme support with system preference detection.
- **Advanced Search & Filtering**: Find papers easily by subject, semester, university, year, and course.
- **Demo Mode**: Try out the application without creating an account using the built-in mock data mode.
- **Role-Based Auth**: Distinct features and views for students and admins.
- **Interactive Papers**: Like, bookmark, download, preview, and comment on study materials.
- **Comprehensive Dashboards**: 
  - *Student*: Track uploads, saved papers, and manage profile.
  - *Admin*: View platform statistics, manage users, approve uploads, and resolve reports.
- **Optimized Performance**: Code-splitting, debounced search, infinite scrolling, and lazy loading.

## Tech Stack 🛠️

- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion
- **State Management**: Zustand
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Backend/BaaS**: Supabase (Auth, PostgreSQL, Storage)
- **Deployment Ready**: Vercel configuration included

## Getting Started 🚀

### Prerequisites
- Node.js (v24+ recommended)
- npm or yarn

### Installation

1. **Clone/Setup the repository**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Rename `.env.example` to `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   *Note: If these are left as placeholders, the app gracefully falls back to a fully functional "Demo Mode" with mock data.*

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

### Supabase Setup (Optional for Demo Mode)
To connect the actual backend:
1. Create a project on [Supabase](https://supabase.com/).
2. Run the SQL files located in the `/supabase` folder in your Supabase SQL Editor in this order:
   - `schema.sql`
   - `rls.sql`
   - `storage.sql`
3. Configure Google OAuth in the Supabase Authentication providers settings.

## Project Structure 📁

- `/src/components` - Reusable UI, Layout, and Feature-specific components
- `/src/pages` - Main application views (Landing, Browse, Details, Dashboards, Auth)
- `/src/stores` - Zustand global state stores (Auth, Papers, UI)
- `/src/hooks` - Custom React hooks (useInfiniteScroll, useDebounce, etc.)
- `/src/lib` - Utility functions, constants, and Supabase client
- `/src/types` - TypeScript interfaces for domain models
- `/supabase` - Database schema, Row Level Security, and Storage setup scripts
- `index.css` - Global Tailwind setup and premium design tokens

## Building for Production 🏗️

```bash
npm run build
```
This command compiles TypeScript and bundles the app into the `dist/` folder for deployment. The included `vercel.json` ensures SPA routing works correctly on Vercel.
