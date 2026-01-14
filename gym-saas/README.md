# Gym SaaS Platform

A comprehensive multi-tenant SaaS platform for gym and studio owners to manage memberships, recurring bookings, and payments.

## Features

- **Multi-Tenancy**: Support for multiple gym owners (Tenants) on a single platform.
- **Role-Based Access**:
  - **Owner**: Manage gym settings, classes, and members.
  - **Assistant**: Staff access for check-ins and basic management.
  - **Member**: Book classes, manage subscriptions, view profile.
- **Recurring Bookings**: Members can book a slot (e.g., "Mondays at 9 AM") which automatically recurs weekly as long as their subscription is active.
- **Payments**: Integrated with Stripe Connect for handling subscriptions and splitting payments to tenants.
- **Authentication**: Secure login/registration using NextAuth.js v5.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database**: PostgreSQL
- **ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: [NextAuth.js](https://authjs.dev/)
- **Styling**: Tailwind CSS + Shadcn UI
- **Payments**: Stripe

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe Account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sanjaykumarkhadka/gym.git
   cd gym/gym-saas
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/gym_saas"
   AUTH_SECRET="your-super-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Stripe
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```

4. **Database Setup:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run Development Server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

- `/src/app`: App Router pages and API routes.
- `/src/components`: Reusable UI components.
- `/src/lib`: Utility functions and Prisma client.
- `/prisma`: Database schema and migrations.
