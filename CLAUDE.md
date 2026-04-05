# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: UIGen

AI-powered React component generator with live preview. Users describe components in chat, Claude generates code using tool calls, and the result renders live in a virtual file system (no disk writes).

## Commands

```bash
npm run setup        # First-time setup: install deps + prisma generate + migrations
npm run dev          # Dev server with Turbopack at localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest (all tests)
npm run db:reset     # Reset SQLite database
```

**Run a single test file:**
```bash
npx vitest run src/components/chat/__tests__/ChatInterface.test.tsx
```

**Environment:** Add `ANTHROPIC_API_KEY` to `.env` — if absent, a `MockLanguageModel` is used as fallback (`src/lib/provider.ts`).

## Architecture

### Key Data Flow

1. User messages → `/api/chat` route → `streamText` with Claude
2. Claude calls tools (`str_replace_editor`, `file_manager`) to create/modify files
3. Tool results update the `VirtualFileSystem` (in-memory, no disk writes)
4. `PreviewFrame` renders components in an iframe by transforming JSX at runtime
5. Authenticated users persist projects (chat history + file data) to SQLite via Prisma

### Core Modules

- **`src/lib/file-system.ts`** — `VirtualFileSystem` class: the central in-memory file tree
- **`src/lib/contexts/`** — React contexts for chat state (`chat-context.tsx`) and file system state (`file-system-context.tsx`)
- **`src/app/api/chat/route.ts`** — Streaming chat API; orchestrates tool calls
- **`src/lib/tools/`** — AI tool implementations: `str-replace.ts` (code edits), `file-manager.ts` (file ops)
- **`src/lib/transform/jsx-transformer.ts`** — Transforms JSX for runtime rendering in the preview iframe
- **`src/lib/provider.ts`** — Returns Claude model or MockLanguageModel if no API key
- **`src/actions/`** — Server actions for auth (`index.ts`) and project CRUD

### Auth & Persistence

- Auth uses JWT (jose) with bcrypt passwords; middleware (`src/middleware.ts`) protects `/api/projects` and `/api/filesystem`
- Anonymous usage is supported; projects persist only for authenticated users
- Database: SQLite via Prisma, models are `User` and `Project` (schema at `prisma/schema.prisma`, generated client at `src/generated/prisma/`)

### Testing

Tests are colocated in `__tests__/` directories alongside source files. Vitest runs in jsdom with `@testing-library/react`. Setup file: `src/setupTests.js`.

### Path Alias

`@/*` maps to `./src/*` throughout the codebase.
