# DatesCrunch

Online store for dates, dry fruits and gift packs.
Built with Next.js, Supabase (database + admin login) and Cloudinary (images/videos).
Cash on Delivery only. One admin (the store owner).

---

## What is included

**Customer website**
- Home, Products (search + category filter), Product details
- Cart, COD Checkout, Order confirmation
- About, Contact
- Shipping, Return/Refund, Privacy, Terms pages
- Floating WhatsApp button, 404 page

**Admin panel (`/admin`)**
- Secure login (Supabase Auth)
- Dashboard (order counts, low-stock alert)
- Products: add / edit / delete, multiple images, video, price, discount, stock, featured, active
- Categories: add / edit / delete
- Orders: search, filter, view details, change status, WhatsApp the customer
- Settings: store name, WhatsApp number, phone, email, address, description

---

## Setup (step by step)

### Step 1 — Install Node.js
Download the LTS version from https://nodejs.org and install it.
Check it worked: open a terminal and type `node -v`

### Step 2 — Install the project
Open a terminal inside the `datescrunch` folder and run:

    npm install

### Step 3 — Set up the database (Supabase)
1. Open your Supabase project.
2. Go to **SQL Editor** > **New query**.
3. Open the file `supabase/schema.sql` from this project.
4. Copy ONLY the SQL text from that file, paste it, and click **Run**.
5. Go to **Authentication** > **Users** > **Add user**.
   Create your admin email and password. This is your admin login.

Note: for a new, empty Supabase project, run ONLY `schema.sql`.
Do NOT run the files in `supabase/migrations/` (they are only for
databases created from older versions).

### Step 4 — Add your keys
1. In the project folder, copy `.env.example` and name the copy `.env.local`
2. Open `.env.local` and fill in:

       NEXT_PUBLIC_SUPABASE_URL=         (Supabase > Project Settings > API > Project URL)
       NEXT_PUBLIC_SUPABASE_ANON_KEY=    (same page > anon / public key)
       CLOUDINARY_CLOUD_NAME=            (Cloudinary Dashboard)
       CLOUDINARY_API_KEY=               (Cloudinary Dashboard)
       CLOUDINARY_API_SECRET=            (Cloudinary Dashboard)
       NEXT_PUBLIC_SITE_URL=http://localhost:3000

Never share `.env.local` with anyone and never upload it to GitHub.

### Step 5 — Run the website

    npm run dev

Open in your browser:
- Customer site: http://localhost:3000
- Admin login:   http://localhost:3000/admin/login

### Step 6 — First-time admin setup
1. Log in at `/admin/login` with the admin email/password from Step 3.
2. Go to **Settings** and enter your WhatsApp number
   (country code + number, no + or spaces, e.g. 919876543210).
3. Go to **Products** > **Add product** to add your first product.
4. Visit the home page to see it live.

---

## Checking your build

Before putting the site online, run:

    npm run build

If it finishes without errors, the project is ready to deploy.

---

## Folder guide

    app/(customer)/      customer website pages
    app/admin/           admin panel pages
    app/api/admin/       secure image/video upload route
    components/          reusable UI parts
    lib/                 helpers (Supabase, Cloudinary, cart, WhatsApp, etc.)
    supabase/schema.sql  full database setup (run this on a new project)
    supabase/migrations/ upgrade scripts for older databases only
    .env.example         list of required keys (no real values)

---

## Upgrading an OLD database (only if you created it from an earlier version)

Run these in the Supabase SQL Editor, in this order, only if needed:
1. `supabase/migrations/002_add_product_featured.sql`
2. `supabase/migrations/003_place_order_function.sql`
3. `supabase/migrations/004_order_number_and_settings.sql`

---

## Going live later

The project works on Vercel or any Node.js host.
Add the same environment variables there, and set
`NEXT_PUBLIC_SITE_URL=https://datescrunch.com`.

## Security notes
- No service-role key is used anywhere.
- Cloudinary secret stays on the server only.
- Orders can only be created through the secure `place_order()` database function.
- Admin pages are protected and hidden from search engines.
