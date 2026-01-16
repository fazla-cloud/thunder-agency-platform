---
name: Build Demo Marketing Agency Platform
overview: Build a functional demo of a subscription-based marketing agency platform using Next.js + TypeScript, Supabase backend, and shadcn/ui components. The demo will include authentication, role-based dashboards (client & admin), and task/project management workflows.
todos:
  - id: init-nextjs
    content: Initialize Next.js project with TypeScript and App Router
    status: completed
  - id: setup-dependencies
    content: "Install and configure dependencies (Supabase, shadcn/ui, forms, icons) Zod form validation, "
    status: completed
  - id: todo-1768456059911-mbzr4qkg2
    content: "Kep primary color as balck, use global style kit, "
    status: pending
  - id: todo-1768456084591-62oc2dpjf
    content: don't use emoji,dn't use blue color as gradient, don't create md file for work summry.
    status: pending
  - id: supabase-config
    content: Set up Supabase client utilities and environment configuration
    status: completed
  - id: database-schema
    content: Create database tables (profiles, projects, tasks) with proper types
    status: completed
  - id: rls-policies
    content: Implement Row Level Security policies for all tables
    status: completed
  - id: auth-pages
    content: Build authentication pages (login, signup) with Supabase Auth
    status: completed
  - id: auth-middleware
    content: Set up auth middleware and role-based route protection
    status: completed
  - id: shadcn-components
    content: Install and configure shadcn/ui base components
    status: completed
  - id: custom-components
    content: Create custom components (StatusBadge, DashboardCard, TaskCard, ProjectCard)
    status: completed
  - id: client-dashboard
    content: Build client dashboard layout with widgets and navigation
    status: completed
  - id: client-pages
    content: Implement client pages (projects list, tasks list, add project, add task)
    status: completed
  - id: admin-dashboard
    content: Build admin dashboard layout with widgets and navigation
    status: completed
  - id: admin-pages
    content: Implement admin pages (all projects, all tasks, assign task)
    status: completed
  - id: task-status
    content: Add task status update functionality for admins
    status: completed
  - id: styling-ux
    content: Apply clean SaaS UI styling and ensure responsive designCreate README and setup documentation Create an SQL file that can be paste on SQL editor of supabase
    status: completed
---

# Build Demo Marketing Agency Platform

## Project Setup

### 1. Initialize Next.js Project

- Create Next.js 14+ app with TypeScript and App Router
- Configure project structure with organized folders (components, lib, app, types)
- Set up environment variables template (.env.local.example)

### 2. Install Dependencies

- Core: `next`, `react`, `react-dom`, `typescript`
- Supabase: `@supabase/supabase-js`, `@supabase/ssr`
- UI: Install and configure shadcn/ui with Tailwind CSS
- Forms: `react-hook-form`, `zod` for validation
- Icons: `lucide-react`

### 3. Supabase Setup

- Create Supabase project setup guide/documentation
- Configure Supabase client utilities (`lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/middleware.ts`)
- Set up environment variables for Supabase URL and anon key

## Database Schema

### 4. Create Supabase Tables

Based on `demo-project-detailed.json` schema:

**profiles table:**

- `id` (uuid, references auth.users)
- `role` (text: 'client' | 'admin')
- `full_name` (text)
- `is_active` (boolean)
- Enable RLS

**projects table:**

- `id` (uuid, primary key)
- `client_id` (uuid, references profiles)
- `name` (text)
- `description` (text)
- `status` (text)
- `created_at` (timestamp)

**tasks table:**

- `id` (uuid, primary key)
- `project_id` (uuid, references projects)
- `client_id` (uuid, references profiles)
- `title` (text)
- `content_type` (text)
- `platform` (text)
- `duration_seconds` (integer, nullable)
- `dimensions` (text, nullable)
- `brief` (text)
- `status` (text: 'new' | 'accepted' | 'in_progress' | 'completed')
- `assigned_to` (uuid, nullable, references profiles)
- `created_at` (timestamp)

### 5. Row Level Security (RLS) Policies

- **profiles**: Users can read their own profile; admins can read all
- **projects**: Clients can read/write their own projects; admins can read/write all
- **tasks**: Clients can read/write tasks for their projects; admins can read/write all

## Authentication

### 6. Auth Implementation

- Create auth pages: `/login`, `/signup`
- Implement email/password authentication with Supabase Auth
- Create auth context/provider for client-side auth state
- Set up middleware for protected routes
- Create role-based route protection utilities

### 7. Profile Management

- Auto-create profile on user signup (database trigger or API route)
- Default role assignment (manual via Supabase dashboard for admin)
- Profile fetching utilities

## UI Components (shadcn/ui)

### 8. Install Base Components

- Button, Input, Label, Card, Badge, Table, Select, Textarea
- Dialog, Dropdown Menu, Tabs
- Form components (with react-hook-form integration)

### 9. Custom Components

- StatusBadge component (for task/project statuses)
- DashboardCard widget component
- TaskCard component
- ProjectCard component
- Loading states and error boundaries

## Client Dashboard

### 10. Client Dashboard Layout

- Route: `/dashboard/client`
- Dashboard page with widgets:
  - Total Tasks count
  - In Progress Tasks count
  - Completed Tasks count
- Navigation sidebar with pages: Projects, Tasks, Add Project, Add Task

### 11. Client Pages

- **Project List** (`/dashboard/client/projects`): Table/list view of user's projects
- **Task List** (`/dashboard/client/tasks`): Filterable list of user's tasks with status
- **Add Project** (`/dashboard/client/projects/new`): Form to create new project
- **Add Task** (`/dashboard/client/tasks/new`): Form to create new task with all required fields

## Admin Dashboard

### 12. Admin Dashboard Layout

- Route: `/dashboard/admin`
- Dashboard page with widgets:
  - All Tasks count
  - Active Projects count
  - Pending Tasks count
- Navigation sidebar with pages: All Projects, All Tasks, Assign Task

### 13. Admin Pages

- **All Projects** (`/dashboard/admin/projects`): View all projects from all clients
- **All Tasks** (`/dashboard/admin/tasks`): View all tasks with filtering
- **Assign Task** (`/dashboard/admin/tasks/assign`): Interface to assign tasks to designers (using mock designer IDs for demo)

## Task Management Features

### 14. Task Status Updates

- Admin can change task status (new → accepted → in_progress → completed)
- Status badges with appropriate colors
- Status change UI in admin task views

### 15. Task Assignment

- Admin interface to assign tasks to designer IDs (mock for demo)
- Display assigned_to information in task views

## Styling & UX

### 16. Design Implementation

- Apply clean SaaS UI styling (no AI illustrations)
- Minimal color palette
- Use shadcn default components
- Consistent spacing and typography
- Responsive design for mobile/tablet

### 17. Navigation & Layout

- Sidebar navigation for dashboards
- Header with user info and logout
- Role-based menu items
- Protected route redirects

## Testing & Documentation

### 18. Setup Instructions

- Create README with setup steps
- Supabase setup guide
- Environment variables documentation
- How to create admin user (manual profile update in Supabase)

### 19. Demo Data (Optional)

- SQL seed script for sample projects and tasks
- Test user accounts documentation

## File Structure

```
SBMap/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   ├── client/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── projects/
│   │   │   │   ├── tasks/
│   │   │   │   └── layout.tsx
│   │   │   └── admin/
│   │   │       ├── page.tsx
│   │   │       ├── projects/
│   │   │       ├── tasks/
│   │   │       └── layout.tsx
│   │   └── layout.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/ (shadcn components)
│   ├── dashboard/
│   ├── tasks/
│   └── projects/
├── lib/
│   ├── supabase/
│   ├── utils.ts
│   └── validations.ts
├── types/
│   └── database.ts
└── supabase/
    └── migrations/ (SQL files)
```