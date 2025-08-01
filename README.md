````markdown
# Tiered Events

A Next.js 14 app with Clerk authentication and Supabase for a tier-based event showcase.  
Users can sign up, see events available to their tier (Free, Silver, Gold, Platinum), and upgrade their tier.

---

## 📦 Setup

1. **Clone the repo**  
   ```bash
   git clone https://github.com/<your-username>/tiered-events.git
   cd tiered-events
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Copy `.env.example` to `.env.local` and fill in your keys:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
   CLERK_API_KEY=your-clerk-secret-key
   CLERK_FRONTEND_API=your-clerk-frontend-api
   ```

4. **Initialize your database**
   In the Supabase dashboard:

   * Create a table `events` with columns:

     * `id` UUID (PK)
     * `title` text
     * `description` text
     * `event_date` timestamp
     * `image_url` text
     * `tier` enum('free','silver','gold','platinum')
   * Seed it with at least 2 events per tier. (Placeholder images are fine.)

5. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Demo Accounts

Use these test users to explore each tier:

| Tier       | Email                                                     | Password    |
| ---------- | --------------------------------------------------------- | ----------- |
| **Free**   | [harshad@yopmail.com](mailto:harshad@yopmail.com)         | Pin\@123Pas |
| **Silver** | [harshadatta@yopmail.com](mailto:harshadatta@yopmail.com) | Pin\@123Pas |
| **Gold**   | [harshaa@yopmail.com](mailto:harshaa@yopmail.com)         | Pin\@123Pas |

> **Note:** New sign-ups default to **Free**. To test higher tiers, either upgrade via the in-app flow or manually set `public_metadata.tier` in the Clerk Dashboard.

---

## 🚀 Deployment

1. Push to GitHub.
2. Import the repo into Vercel.
3. Add the same environment variables in your Vercel project settings.
4. Deploy!

Your app will be live at ``.


