# ⚡ AETHER PM — Production-Ready Specular Glassmorphism SaaS Platform

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_Backend-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime_Sync-010101?style=for-the-badge&logo=socketdotio)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Vanilla_CSS_Mesh-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

> A premium, intelligent SaaS Project Management & Collaboration Platform built with GPU-accelerated specular glassmorphism, Framer Motion micro-interactions, drag-and-drop Kanban, Web Audio API sound FX, Socket.io real-time collaboration, Recharts velocity analytics, and an integrated AI Copilot engine.

---

## 🌟 Key Highlights & Design Philosophy

**Aether PM** is designed to feel like a high-end, production-grade subscription SaaS product (*inspired by the best ideas from Linear, ClickUp, Notion, Asana, and Jira*):

- 💎 **Specular Glassmorphism Design System**: Dynamic GPU-accelerated backdrop blur, sub-pixel border highlights, soft ambient mesh gradients, floating cards, and 7 live customizable theme presets (*Glass Aurora*, *Ocean Blue*, *Sunset Orange*, *Emerald Mint*, *Royal Purple*, *Midnight Dark*, *Cyber Neon*).
- 📋 **Interactive Sprint Kanban & Custom Columns**: Drag-and-drop task reordering powered by `@hello-pangea/dnd`, custom column CRUD (Add, Inline Rename, Delete, Collapse), WIP limits, cover gradients, and checklist progress bars.
- ⚡ **Socket.io Real-Time Synchronization**: Live task column moves, live typing indicators ("*Alex Rivera is typing...*"), live project room activity, and active user presence avatars.
- 🤖 **Autonomous AI Copilot Engine**: 1-click task decomposition into subtask checklists, priority recommendations, dev completion hour estimates, sprint velocity audits, and meeting notes generator.
- 📊 **Advanced Recharts Analytics**: Interactive velocity trend area charts, priority distribution pie charts, developer time tracking bar charts, and team workload balance meters.
- 🎵 **Web Audio API Micro-Interactions**: Synthesized audio chimes for task completions, soft card drop thumps, and command palette pop alerts.
- 🔍 **Cmd + K Global Command Palette**: Instant fuzzy search across projects, tasks, members, commands, and workspace shortcuts with keyboard index navigation.

---

## 🏗️ System Architecture

```
                               ┌─────────────────────────────────────────┐
                               │           AETHER PM FRONTEND            │
                               │        (React 19 + Vite + TS)           │
                               └────────────────────┬────────────────────┘
                                                    │
                                      ┌─────────────┴─────────────┐
                                      ▼                           ▼
                        ┌───────────────────────────┐   ┌───────────────────────────┐
                        │   REST API Requests (HTTP)│   │  Socket.io Realtime (WS)  │
                        └─────────────┬─────────────┘   └─────────────┬─────────────┘
                                      │                           │
                                      ▼                           ▼
                               ┌─────────────────────────────────────────┐
                               │            EXPRESS BACKEND              │
                               │         (Node.js + Express.js)          │
                               └────────────────────┬────────────────────┘
                                                    │
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │            DATABASE LAYER               │
                               │           (MongoDB / Mongoose)          │
                               └─────────────────────────────────────────┘
```

---

## 🚀 Feature Matrix (Sprints 1 – 6)

| Sprint | Domain | Deliverables |
| :--- | :--- | :--- |
| **Sprint 1** | Foundation & Auth | JWT Authentication, Express Server, CSS Glass Token System, Nav Architecture, Reusable Buttons/Inputs/Badges. |
| **Sprint 2** | Dashboard & Projects | Project Grid Directory, Project CRUD, Category Filters, Search, Favorite/Archive Toggles, Project Workspace Page. |
| **Sprint 3** | Kanban & Tasks | Drag-and-Drop Kanban Board (`@hello-pangea/dnd`), Custom Column CRUD, Task Detail Glass Modal, Subtasks Engine, Checklists, Attachments Grid, Discussion Comments with Emoji Reactions. |
| **Sprint 4** | Real-time & Team | Socket.io Real-Time Event Engine, Teammate Email Invitations, Role Permissions (*Owner*, *Admin*, *Member*), Member Workload Meters, Glass Notification Center, Calendar View, Gantt Roadmap Timeline, Project Discussions Hub, Files Hub. |
| **Sprint 5** | AI Copilot & Analytics | Integrated Aether AI Assistant, Smart AI Task Decomposition, Recharts Analytics Suite, Live 7-Theme Switcher, Time Tracking Stopwatch Widget, User Achievements Badges, Onboarding Tour, Help Center & Documentation. |
| **Sprint 6** | Launch Readiness | Error Boundary, 404 Route Fallback Page, 6 Portfolio Demo Workspaces (*TaskFlow Launch*, *Banking*, *E-Commerce*, *AI Social*, *University ERP*, *Startup Website*), GitHub README, and Clean Build Verification (`npm run build`). |

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + Vite + TypeScript
- **Styling**: Vanilla CSS3 Custom Tokens + TailwindCSS Utility Classes
- **Animations**: Framer Motion
- **Drag & Drop**: `@hello-pangea/dnd`
- **Charts**: Recharts
- **Icons**: Lucide React
- **Sound**: Web Audio API Synthesizer Engine

### Backend
- **Server**: Node.js + Express.js
- **Real-Time Engine**: Socket.io Server
- **Database**: MongoDB + Mongoose ODM
- **Security**: JWT Authentication + Password Hashing

---

## 📡 REST API Reference

The Express backend listens on `http://localhost:5000`:

### Authentication APIs
- `POST /api/auth/register` — Create user account
- `POST /api/auth/login` — Login & receive JWT token
- `GET /api/auth/me` — Get authenticated user details

### Project APIs
- `GET /api/projects` — Fetch all projects (filterable by category, search, priority)
- `POST /api/projects` — Create a new project workspace
- `GET /api/projects/:id` — Get project details & column lanes
- `PUT /api/projects/:id` — Update project metadata
- `DELETE /api/projects/:id` — Delete project

### Task APIs
- `GET /api/tasks` — Fetch tasks by project ID
- `POST /api/tasks` — Create task
- `PUT /api/tasks/:id` — Update task details
- `POST /api/tasks/:id/move` — Move task status column
- `POST /api/tasks/:id/duplicate` — Clone task
- `DELETE /api/tasks/:id` — Delete task

### Team & Invitation APIs
- `GET /api/team/members` — List project team members
- `POST /api/team/invite` — Dispatch email invitation
- `POST /api/team/role` — Update member role (*Owner*, *Admin*, *Member*)
- `DELETE /api/team/member/:id` — Remove member

### Notification APIs
- `GET /api/notifications` — Fetch user notifications
- `POST /api/notifications/:id/read` — Mark notification read
- `DELETE /api/notifications` — Clear all notifications

---

## 💻 Local Quickstart Guide

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/your-username/aether-pm.git
cd aether-pm
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=aether_super_secret_jwt_key_2026
MONGO_URI=mongodb://localhost:27017/aether_pm
```

### 3. Launch Backend API & Socket Server
```bash
node server/server.js
```
*Server listening on `http://localhost:5000`*

### 4. Launch Vite Frontend Development Server
In a separate terminal:
```bash
npm run dev
```
*Vite client app running on `http://localhost:5174`*

### 5. Build for Production
```bash
npm run build
```

---

## 🌐 Production Deployment Guide

### Deploying Frontend to Vercel
1. Push project to GitHub.
2. Import project into Vercel dashboard.
3. Set build command: `npm run build` and output directory: `dist`.
4. Deploy!

### Deploying Backend to Render / Railway
1. Create a Web Service on Render/Railway pointing to the `server/` directory.
2. Set build command: `npm install` and start command: `node server/server.js`.
3. Add environment variables (`PORT`, `JWT_SECRET`, `MONGO_URI`).

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
