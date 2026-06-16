# Convex + Clerk setup

This app talks to a **Convex cloud** deployment for its database and realtime
queries, and uses **Clerk** for authentication. The code is already wired up —
you only need to create the two cloud accounts and paste in the keys.

## What's already in the repo

| File | Purpose |
| --- | --- |
| `convex/schema.ts` | Database tables (`messages`). |
| `convex/messages.ts` | Sample authenticated query (`list`) + mutation (`send`). |
| `convex/auth.config.ts` | Tells Convex to trust your Clerk JWTs. |
| `src/app/convex.service.ts` | Angular wrapper around `ConvexClient` (queries as signals). |
| `src/app/clerk.service.ts` | Angular wrapper around Clerk JS; hands Convex a JWT. |
| `src/app/app.config.ts` | App initializer: loads Clerk, then attaches auth to Convex. |
| `src/environments/environment*.ts` | Where you paste the Convex URL + Clerk key. |

---

## Step 1 — Connect to Convex cloud (interactive, you run this)

```bash
npx convex dev
```

The first run will:

1. Open a browser to **log in with your Convex account** (GitHub/Google). Sign up
   if you don't have one — it's free.
2. Ask you to **create a new project** (or pick an existing one). Choose "create".
3. Write `.env.local` with `CONVEX_DEPLOYMENT` and `CONVEX_URL`.
4. Generate `convex/_generated/` (the typed `api` the Angular code imports).
5. Push `schema.ts` + `messages.ts` and keep watching for changes.

Leave this process **running** in its own terminal — it is your live backend
connection during development.

Copy the printed `CONVEX_URL` (looks like `https://xxxx-123.convex.cloud`) into
**both** `src/environments/environment.ts` and `environment.development.ts` as
`convexUrl`.

## Step 2 — Create the Clerk app (auth)

1. Go to https://dashboard.clerk.com → **Create application**. Enable Email +
   any social providers you want. Pick **Angular/JavaScript** if asked.
2. Copy the **Publishable key** (`pk_test_...`) into `clerkPublishableKey` in
   both `environment*.ts` files.
3. In the Clerk dashboard go to **JWT Templates → New template → Convex**.
   - Name it **exactly** `convex` (the code requests this template).
   - Copy the **Issuer** URL (e.g. `https://your-app.clerk.accounts.dev`).

## Step 3 — Tell Convex about Clerk

Point your Convex deployment at the Clerk issuer (uses the value from Step 2.3):

```bash
npx convex env set CLERK_JWT_ISSUER_DOMAIN https://your-app.clerk.accounts.dev
```

`convex/auth.config.ts` reads this on the next deploy (the running `convex dev`
picks it up automatically).

## Step 4 — Run the app

```bash
npm start        # ng serve, http://localhost:4200
```

You should see a **Sign in** button. After signing in via Clerk, type a message
and hit Send — it persists to Convex and the list updates live (realtime
subscription). Sign-out clears the authenticated view.

---

## How auth flows through

```
Clerk session ──getToken({template:'convex'})──▶ ClerkService
        │                                              │
        ▼                                              ▼
   app.config initializer  ──setupAuth()──▶  ConvexClient.setAuth(fetchToken)
                                                       │
                          every query/mutation carries the JWT ──▶ Convex
                                                       │
                                  ctx.auth.getUserIdentity().subject  (= Clerk user id)
```

## Adding more data

- New table: edit `convex/schema.ts` — `convex dev` pushes it instantly.
- New backend function: add a `query`/`mutation` in a `convex/*.ts` file.
- Call it from Angular: `convex.query(api.<file>.<fn>, args)` (returns a signal)
  or `convex.mutation(api.<file>.<fn>, args)`.
