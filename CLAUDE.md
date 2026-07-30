# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

CourseHub — a course/learning-platform full-stack app built on Next.js (App Router), Prisma/PostgreSQL, and Auth.js (NextAuth v5). This is an early-stage scaffold: only auth plumbing and the data model exist so far, no course/lesson UI yet.

## Commands

```bash
npm run dev      # start dev server (Turbopack) at localhost:3000
npm run build    # production build (also runs the TypeScript check)
npm run start    # run the production build
npm run lint     # ESLint (flat config, eslint.config.mjs)
```

Prisma:

```bash
npx prisma generate      # regenerate the client — run after every schema.prisma change
npx prisma migrate dev   # create + apply a migration against DATABASE_URL
npx prisma studio        # browse the database
```

There is no test runner configured yet.

## Environment

Copy `.env.example` to `.env` and fill in:
- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_SECRET` — generate with `npx auth secret`

## Architecture

### Next.js 16 specifics

This project is on **Next.js 16**, which has real breaking changes vs. older training data — when in doubt, check `node_modules/next/dist/docs/` (mirrored from the official docs) rather than assuming v14/v15 behavior. Two that matter most here:
- `params` and `searchParams` in pages/layouts are `Promise`s and must be `await`ed.
- The `middleware.ts` convention is renamed to `proxy.ts` (defaults to the Node.js runtime, not Edge). See `src/proxy.ts`.

### Auth.js (NextAuth v5) — split config

Auth config is deliberately split across two files:
- `src/auth.config.ts` — providers/callbacks only, **no Prisma adapter**. Used by `src/proxy.ts` for route protection.
- `src/auth.ts` — imports `auth.config.ts` and adds the `PrismaAdapter`, for use in server components, route handlers, and server actions.

Keep the adapter out of `auth.config.ts`/`proxy.ts`: the Prisma Postgres driver adapter (`@prisma/adapter-pg` → `pg`) is a Node-only TCP driver, and pulling it into the proxy bundle is what this split avoids. Session strategy is `jwt`, so proxy-level auth checks never need to hit the database anyway.

Route protection is matcher-based in `src/proxy.ts` (`config.matcher`) — add new protected paths there.

Session/JWT types (`role`, `id`) are augmented in `src/types/next-auth.d.ts`. Note the JWT augmentation targets `"@auth/core/jwt"`, not `"next-auth/jwt"` — the latter is a re-export and module augmentation doesn't merge through it.

### Prisma client generation

This uses the Prisma 7 `prisma-client` generator (not the older `prisma-client-js`), configured in `prisma/schema.prisma` to output to `src/generated/prisma`. Consequences:
- The generated output has **no `index.ts` barrel** — import from `@/generated/prisma/client`, not `@/generated/prisma`.
- The generated folder is gitignored; run `npx prisma generate` after cloning or after any schema change.
- Prisma Client is instantiated with an explicit driver adapter (`@prisma/adapter-pg`) rather than a bare connection string — see `src/lib/prisma.ts`. Do not revert to the old `new PrismaClient()` (no adapter) pattern.
- `prisma.config.ts` (not just `schema.prisma`) is where the datasource URL and migrations path are wired up for the CLI.

### Data model (`prisma/schema.prisma`)

- `User` has a `role` enum (`STUDENT` / `INSTRUCTOR` / `ADMIN`) and an optional `password` (only set for credentials sign-in; OAuth-only users have none).
- `Account`, `Session`, `VerificationToken` exist solely for the Auth.js Prisma adapter — don't repurpose them.
- `Course` belongs to one `User` via the `instructor` relation (`InstructorCourses`); a `User` can be both an instructor of some courses and enrolled in others.
- `Lesson` belongs to a `Course` and is ordered via the `(courseId, order)` unique constraint — preserve that constraint if reordering logic is added.
- `Enrollment` is the join model between `User` and `Course` (`(userId, courseId)` unique).

### Path alias

`@/*` maps to `./src/*` (see `tsconfig.json`).

### Agent-facing docs bundled by dependencies

Two dependencies ship their own agent-facing docs in this repo — read them before assuming API shapes from training data:
- `node_modules/next/dist/docs/` — full Next.js 16 docs mirror.
- `.agents/skills/prisma-*/SKILL.md` (symlinked from `.claude/skills/`) — Prisma CLI, client API, and database-setup references installed by `prisma init`.
