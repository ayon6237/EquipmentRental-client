Equipment Rental Platform

**Equipment Rental Platform** is a full-stack equipment rental marketplace connecting verified equipment owners with customers who need construction machinery, photography gear, vehicles, agricultural tools, electronics, and event equipment on demand. Built with Next.js (App Router), Express.js, MongoDB, BetterAuth, JWT, and Stripe Checkout, the platform provides role-based dashboards, real-time analytics, and an admin approval workflow.

---

## Live Links & Repositories

| Resource | URL |
| :--- | :--- |
| **Live Client Site** | [https://my-app-azure-gamma-33.vercel.app](https://my-app-azure-gamma-33.vercel.app) |
| **Live Server API** | [https://equipment-rental-server-ten.vercel.app](https://equipment-rental-server-ten.vercel.app) |
| **Client Repository** | `(https://github.com/ayon6237/EquipmentRental-client)` |
| **Server Repository** | `(https://github.com/ayon6237/EquimentRental-server)` |

---

## Key Features

### Public & Marketplace Features
* **Dynamic Landing Page:** Interactive hero section with Framer Motion animations, real-time **Popular Categories** with live database item counts, **Featured Equipment** (top 6 admin-approved items), **Browse by Category**, **Why Choose Us**, **How It Works**, **Customer Reviews**, and **Trusted Owners**.
* **Advanced Search, Filter & Pagination:** Search equipment by name, location, or category; filter by category, rental type (`Daily`, `Weekly`, `Monthly`), price range, and availability; sort by newest or price; navigate cleanly with server-side pagination.
* **Dark & Light Mode:** Persistent theme switcher (`night` and `corporate` themes) built with Tailwind CSS v4 and DaisyUI.
* **Fully Responsive Design:** Optimized for desktop, tablet, and mobile devices.

### Authentication & Security
* **Dual-Layer Authentication:** Email/Password and Google OAuth authentication powered by **BetterAuth**, paired with custom Express **JWT** authorization.
* **Cross-Domain & Incognito Support:** Supports both `HTTP-only` cookies (`secure`, `sameSite: none`) and `Authorization: Bearer` headers so protected routes work reliably across browsers and incognito sessions.
* **Role-Based Access Control (RBAC):** Dedicated backend middleware (`verifyToken`, `verifyRenter`, `verifyOwner`, `verifyAdmin`) protects all private and role-specific API endpoints.

### Role-Based Dashboards

#### Customer (Renter)
* View full equipment details, select rental dates and quantity, and calculate total rental costs automatically based on daily/weekly/monthly rates.
* Complete bookings via **Stripe Checkout** with automatic booking confirmation, inventory deduction, and payment receipts.
* Save and manage equipment in a personal **Favorites** list.
* Track rental history, booking statuses, and update profile information.

#### Equipment Owner
* Add new equipment listings (automatically queued as `Pending` for admin verification).
* Edit or delete owned equipment listings and manage available inventory.
* Review incoming customer bookings and update booking statuses (`Confirmed`, `Completed`, etc.).
* Monitor business performance with the **Owner Analytics** dashboard (total listed gear, completed rentals, total earnings, and monthly earnings charts).

#### Admin
* Moderate marketplace quality by **Approving** or **Rejecting** owner-submitted equipment listings.
* Manage all registered users, promote/demote roles (`Customer`, `Owner`, `Admin`), or remove accounts.
* Oversee all platform bookings and rental statuses.
* Track platform-wide metrics in the **Admin Analytics** dashboard (total users, total equipment, pending approvals, total revenue, and monthly booking/revenue trends).

---

## Tech Stack

### Frontend
* **Framework:** Next.js (App Router), React
* **Styling & UI:** Tailwind CSS v4, DaisyUI, Lucide React Icons
* **Animations & Notifications:** Framer Motion, React Hot Toast
* **Authentication & Networking:** BetterAuth, Axios

### Backend
* **Runtime & Framework:** Node.js, Express.js
* **Database & ODM:** MongoDB, Mongoose (with serverless-safe cached connection pooling)
* **Security & Auth:** JSON Web Token (`jsonwebtoken`), `cookie-parser`, `cors`
* **Payments:** Stripe Checkout API (with automatic Test Checkout fallback)

### Deployment
* **Hosting:** Vercel (Frontend & Serverless Express Backend)

---

## Core API Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/jwt` | Public | Issues JWT cookie & Bearer token |
| `GET` | `/equipment/featured` | Public | Fetches top 6 approved equipment items |
| `GET` | `/equipment` | Public | Search, filter, sort, and paginate approved items |
| `GET` | `/equipment/:id` | Authenticated | Fetches detailed view of a single item |
| `POST` | `/equipment` | Owner | Creates a new equipment listing (`Pending`) |
| `GET` | `/admin/equipment` | Admin | Lists all equipment across all statuses |
| `PATCH` | `/equipment/status/:id` | Admin | Approves or rejects a listing |
| `POST` | `/bookings/checkout` | Customer | Creates a booking and initiates Stripe checkout |
| `POST` | `/payments/confirm` | Authenticated | Confirms payment, updates stock, records transaction |
| `GET` | `/favorites` | Customer | Retrieves user's saved equipment |
| `GET` | `/users` | Admin | Fetches all registered users |
| `PATCH` | `/users/role/:id` | Admin | Updates a user's role |
| `GET` | `/analytics/owner` | Owner | Returns owner earnings & rental statistics |
| `GET` | `/analytics/admin` | Admin | Returns platform-wide revenue & booking analytics |

---

## Local Setup & Installation

### 1. Clone Repositories
```bash
# Clone Client
git clone https://github.com/ayon6237/EquipmentRental-client
cd https://github.com/ayon6237/EquipmentRental-client
npm install

# Clone Server
git clone https://github.com/ayon6237/EquimentRental-server
cd https://github.com/ayon6237/EquimentRental-server
npm install
```

### 2. Configure Environment Variables

**Client (`.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_better_auth_secret
MONGODB_URI=your_mongodb_connection_uri
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Server (`.env`):**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
STRIPE_SECRET_KEY=your_stripe_test_secret_key
NODE_ENV=development
```

### 3. Run Locally
```bash
# Start Backend Server (runs on http://localhost:5000)
npm run dev

# Start Frontend Client (runs on http://localhost:3000)
npm run dev
```
