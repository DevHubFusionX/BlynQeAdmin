# BlynQe Admin Desktop Console

A cross-platform desktop administration console built with **React**, **Vite**, and **Electron**. Manage users, admins, reports, email campaigns, and matchmaking from a single desktop application.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Running in Development](#running-in-development)
- [Building Installers](#building-installers)
  - [Windows Installer (.exe)](#windows-installer-exe)
  - [Linux Installer (.AppImage / .deb)](#linux-installer-appimage--deb)
- [Installing the App](#installing-the-app)
  - [Windows](#windows)
  - [Linux](#linux)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Tech Stack](#tech-stack)

---

## Prerequisites

Make sure you have the following installed on your system:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | v18 or later | [nodejs.org](https://nodejs.org/) |
| **pnpm** | v8 or later | [pnpm.io](https://pnpm.io/installation) |
| **Git** | Any recent version | [git-scm.com](https://git-scm.com/) |

### Installing pnpm

After installing Node.js, install pnpm globally:

```bash
npm install -g pnpm
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/DevHubFusionX/BlynQeAdmin.git
cd BlynQeAdmin
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Copy the example environment file and update with your API URL:

```bash
# Linux / macOS
cp .env.example .env

# Windows (Command Prompt)
copy .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

Edit the `.env` file and set your API base URL:

```env
VITE_API_URL=https://your-api-host.com
```

---

## Running in Development

You have two options to run the app in development mode:

### Option A: Run Vite and Electron together (recommended)

This starts both the Vite dev server and Electron in one command:

```bash
pnpm dev:all
```

### Option B: Run separately (two terminals)

**Terminal 1** — Start the Vite dev server:

```bash
pnpm dev
```

**Terminal 2** — Once Vite is running on `http://localhost:5173`, launch Electron:

```bash
pnpm electron
```

> **Note:** The Electron window will open with DevTools enabled in development mode.

---

## Building Installers

To create distributable installers, run the build command. This will first build the Vite frontend, then package everything with Electron Builder.

```bash
pnpm build:electron
```

Installers are output to the `release/` directory.

### Windows Installer (.exe)

Build **on a Windows machine** (or via CI with a Windows runner):

```bash
pnpm build:electron
```

This produces an **NSIS installer** (`.exe`) in `release/`.

| Output | Location |
|--------|----------|
| `My App Setup x.x.x.exe` | `release/` |

### Linux Installer (.AppImage / .deb)

Build **on a Linux machine**:

```bash
pnpm build:electron
```

This produces both an **AppImage** and a **.deb** package in `release/`.

| Output | Location |
|--------|----------|
| `My App-x.x.x.AppImage` | `release/` |
| `my-app_x.x.x_amd64.deb` | `release/` |

---

## Installing the App

### Windows

1. Download or build the `.exe` installer (e.g., `My App Setup x.x.x.exe`).
2. Double-click the installer to run it.
3. Follow the on-screen installation wizard.
4. Once installed, launch **My App** from the Start Menu or Desktop shortcut.

To uninstall, go to **Settings → Apps → Installed Apps**, find **My App**, and click **Uninstall**.

### Linux

#### Option 1: AppImage (no installation needed)

1. Download or build the `.AppImage` file.
2. Make it executable and run:

```bash
chmod +x "My App-x.x.x.AppImage"
./"My App-x.x.x.AppImage"
```

> **Tip:** You can move the AppImage to `~/Applications/` or `/opt/` for convenient access.

#### Option 2: Debian package (.deb) — Ubuntu / Debian

1. Download or build the `.deb` file.
2. Install with `dpkg`:

```bash
sudo dpkg -i my-app_x.x.x_amd64.deb
```

3. If there are missing dependencies, fix them with:

```bash
sudo apt-get install -f
```

4. Launch from the application menu, or run from the terminal:

```bash
my-app
```

To uninstall:

```bash
sudo apt remove my-app
```

---

## Project Structure

```
BlynQeAdmin/
├── electron/              # Electron main & preload scripts
│   ├── main.js            # Main process entry point
│   └── preload.js         # Preload script (context bridge)
├── public/                # Static assets (icons, images)
├── src/
│   ├── api/               # API layer (auth, users, admins, etc.)
│   ├── assets/            # App assets (images, SVGs)
│   ├── components/        # Reusable UI components
│   │   ├── layout/        # Layout components (Sidebar, Header)
│   │   └── ui/            # UI primitives (Toast, etc.)
│   ├── hooks/             # React Query hooks (data fetching)
│   ├── lib/               # Utilities (query client, keys)
│   ├── pages/             # Page components
│   │   ├── Admins/        # Admin management
│   │   ├── Auth/          # Login page
│   │   ├── Dashboard/     # Dashboard overview
│   │   ├── Email/         # Email campaigns
│   │   ├── Match/         # Match management
│   │   ├── Reports/       # User reports
│   │   ├── Users/         # User management
│   │   └── ...
│   ├── store/             # Zustand state stores
│   ├── App.jsx            # Root app with routing
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles
├── .env.example           # Environment variable template
├── package.json           # Dependencies & scripts
├── vite.config.js         # Vite configuration
└── index.html             # HTML entry point
```

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `https://api.blynque.com` |

Create a `.env` file in the project root (see [Getting Started](#getting-started)).

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [React 19](https://react.dev/) | UI framework |
| [Vite 8](https://vite.dev/) | Build tool & dev server |
| [Electron 42](https://www.electronjs.org/) | Desktop app shell |
| [Electron Builder](https://www.electron.build/) | Packaging & distribution |
| [TanStack Query](https://tanstack.com/query) | Server state & data fetching |
| [Zustand](https://zustand.docs.pmnd.rs/) | Client state management |
| [React Router 7](https://reactrouter.com/) | Client-side routing |
| [Lucide React](https://lucide.dev/) | Icon library |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |

---

## Scripts Reference

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start Vite dev server only |
| `pnpm electron` | Launch Electron (dev mode) |
| `pnpm dev:all` | Start both Vite + Electron together |
| `pnpm build` | Build the Vite frontend to `dist/` |
| `pnpm build:electron` | Build frontend + package Electron installer |
| `pnpm lint` | Run ESLint |
| `pnpm preview` | Preview the production build locally |

---

## License

Private — © Blynque
