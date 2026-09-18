# نیکا مبل (Nika Mobl) — فروشگاه اینترنتی مبلمان

A full-stack Persian/RTL furniture showroom built with Next.js 14 (App Router),
TypeScript, Tailwind CSS, and a Prisma/PostgreSQL schema.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000. Admin panel: http://localhost:3000/admin/login

```
email:    admin@nikamobl.ir
password: NikaAdmin@123
```

No database setup is required to run the app as shipped — see **"How data
persistence works in this build"** below.

## What's implemented

- **Storefront**: homepage (hero with glass stat cards, animated trust marquee, categories, featured products), a full product catalog of **24 items** across all 8 categories with search/category/price/color/material/availability filters and sorting — all driven by shareable URL query params — product detail pages with an image gallery, specifications, related products, cart, checkout with a mocked payment step, and an order-success page.
- **Content**: About, Contact (with a working message form that persists to
  the backend), Showroom, and a Blog with listing + article pages.
- **Account**: wishlist (persisted client-side) and order tracking by order
  number. See the note on accounts below.
- **Admin dashboard** (`/admin`, auth-protected): overview stats, full
  product CRUD (create/edit/delete, images, pricing, discounts, stock,
  featured/popular flags), order list with status updates, contact message
  inbox with read/unread state, blog post creation/deletion, a read-only
  categories view, and account settings.
- **Auth**: bcrypt-hashed admin password, JWT session in an httpOnly cookie,
  server-side route protection (the `/admin` layout redirects to
  `/admin/login` if there's no valid session; every admin API route checks
  the session independently, never trusting the client).
- **API**: REST-ish route handlers for products, categories, orders, contact
  messages, blog, and auth, all with zod validation and admin-gated
  mutations.
- **SEO**: per-page metadata and Open Graph tags for the homepage, product
  pages, and blog posts.
- Responsive from 360px to desktop, `prefers-reduced-motion` respected,
  subtle CSS-only entrance/hover animations, no animation libraries.

## How data persistence works in this build

The brief asked for Prisma + PostgreSQL, and `prisma/schema.prisma` is the
real production schema — every model described in the spec (`User`,
`Address`, `Category`, `Product`, `ProductImage`, `Cart`, `CartItem`,
`Wishlist`, `WishlistItem`, `Order`, `OrderItem`, `BlogPost`,
`ContactMessage`) with proper relations and indexes.

However, the environment this app was built in could not reach Prisma's
binary CDN (`binaries.prisma.sh`) to download the query engine, so Prisma
Client could not be generated or executed there. To keep the app **actually
runnable and verified** rather than just described, all reads/writes go
through a single repository module, `lib/db.ts`, which is currently backed
by flat JSON files in `/data`. Every server component and API route imports
*only* from `lib/db.ts` — nothing else touches `/data` or Prisma directly —
so this is a one-file swap.

### Switching to real PostgreSQL + Prisma

1. Set `DATABASE_URL` in `.env` (copy `.env.example`).
2. `npx prisma migrate dev --name init`
3. Write `prisma/seed.ts` (the shape to copy is already in `data/*.json` —
   categories, products, blog posts, and the admin user) and run
   `npm run db:seed`.
4. Rewrite the functions in `lib/db.ts` to call `prisma.<model>.findMany()`
   etc. instead of reading/writing JSON. The function signatures are already
   the app's real data contract, so no page or API route needs to change.
5. Remove the `/data` directory.

## Image sourcing

Product and category imagery is a set of lightweight SVG illustrations
bundled locally under `/public/images`, mapped in `lib/images.ts`. Earlier
builds hotlinked photography from Wikimedia Commons, but that CDN is
unreliable to reach from Iran — images loaded slowly or not at all for
visitors there — so imagery was moved in-repo: zero external requests, loads
instantly regardless of the visitor's network. For a real launch, replace
these with your own studio photography or a DAM/Cloudinary feed — the admin
product form's image picker is already structured as a small library-select
UI, so swapping the image source is localized to `lib/images.ts`, the files
in `/public/images`, and that one form component.

## Scope notes / what's intentionally lighter than the full spec

- **Customer accounts**: registration/login/order history for *customers*
  (as opposed to the admin) is modeled fully in `prisma/schema.prisma`
  (`User`, `Address`, `Cart`, `Wishlist` all support a `userId`), but the
  shipped UI uses a lighter, no-login pattern: wishlist lives in
  `localStorage`, and customers track an order by its order number on
  `/account`. Wiring up real customer auth is a matter of adding
  register/login routes mirroring `lib/auth.ts` (same bcrypt+JWT pattern,
  different cookie) and switching the account page to read from the
  database instead of localStorage.
- **Category CRUD**: the admin categories page is currently read-only
  (it lists categories and product counts). Adding create/edit/delete
  follows the exact same pattern as `components/admin/ProductForm.tsx` and
  `app/api/products/route.ts`.
- **Image uploads**: there's no file-upload endpoint; the admin product form
  lets you pick from the curated image library in `lib/images.ts`. A real
  deployment would add an upload route to S3/Cloudinary and store the
  returned URL in `ProductImage.url` instead.
- **Payment gateway**: checkout collects the same fields a real Iranian
  gateway (like ZarinPal) would need and simulates the "success" step by
  creating the order directly; no real gateway is wired up, per the brief's
  instruction not to connect one without credentials.

## Tech stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Prisma (schema only in
this build) · bcryptjs + jsonwebtoken for auth · zod for validation ·
lucide-react for icons. No UI/animation libraries beyond that, per the brief.

## Project structure

```
app/                  Routes (App Router) — pages + API route handlers
  admin/(dashboard)/  Auth-protected admin screens (route group keeps
                      /admin/login outside the auth guard)
  api/                Route handlers: products, categories, orders,
                      contact, blog, messages, auth
components/           Shared UI (Navbar, ProductCard, ProductFilters, ...)
components/admin/     Admin-only interactive widgets (forms, action buttons)
lib/                  db.ts (data layer), auth.ts, images.ts, format.ts,
                      types.ts, require-admin.ts
data/                 JSON "database" for this build (see note above)
prisma/schema.prisma  Production database schema
```
