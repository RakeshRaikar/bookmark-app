# 🔖 Bookmark App

This is a full-stack Bookmark Manager built using Next.js, Supabase, and deployed on Vercel. The application allows users to authenticate using Google OAuth and manage their personal bookmarks securely.

The main goal of this project was to implement authentication, protected routes, realtime database updates, and production deployment.

---

## 🚀 Live Demo

https://bookmark-app-coral-nine.vercel.app/

---

## 🛠️ Tech Stack

- Next.js (App Router)
- Supabase (Authentication + PostgreSQL + Realtime)
- Google OAuth
- Tailwind CSS
- Vercel (Deployment)

---

## ✨ Features

- Google Login using OAuth
- Protected dashboard route
- Add and delete bookmarks
- Realtime updates using Supabase subscriptions
- Session persistence across refresh
- Logout functionality
- Production deployment on Vercel

---

## ⚠️ Challenges Faced and How I Solved Them

### 1. GitHub Push Permission Error (403)

While pushing the repository to GitHub, I encountered a 403 permission error. The issue was caused by incorrect stored credentials in Windows Credential Manager linked to another GitHub account. I resolved this by removing the stored GitHub credentials and logging in again with the correct account.

---

### 2. OAuth Redirecting to localhost After Deployment

After deploying to Vercel, Google login redirected to `http://localhost:3000/dashboard`, causing a connection refused error.

The issue was caused by a hardcoded redirect URL inside the Supabase OAuth configuration:

redirectTo: 'http://localhost:3000/dashboard'

I fixed this by updating the redirect URL to the production Vercel domain and also configuring the correct Site URL and Redirect URLs inside Supabase Authentication settings.

---

### 3. Dashboard Accessible Without Re-login

After logging in once, the app automatically redirected to the dashboard even after redeployment. Initially, this seemed like a bug.

However, I discovered that Supabase stores authentication sessions in localStorage. This behavior is expected in production apps to keep users logged in across refreshes.

To properly protect routes, I implemented session validation using:

- supabase.auth.getSession()
- supabase.auth.onAuthStateChange()

If no valid session exists, users are redirected to the login page.

---

### 4. Session Handling and Logout

Initially, there was no logout functionality and session handling was inconsistent.

I implemented proper logout using:

await supabase.auth.signOut()

I also added an authentication state listener to ensure users are redirected to the homepage if their session expires.

---

### 5. Realtime Bookmark Updates

To provide realtime updates when bookmarks are added or deleted, I used Supabase Realtime subscriptions. The app listens to database changes filtered by the logged-in user's ID to ensure data isolation and security.

---

## 📦 Local Setup Instructions

1. Clone the repository:

git clone <your-repo-url>

2. Install dependencies:

npm install

3. Create a `.env.local` file with:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url  
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key  

4. Run locally:

npm run dev

---

## 🔐 Security Considerations

- Bookmarks are filtered by authenticated user ID.
- Dashboard route checks for a valid session before rendering.
- OAuth authentication ensures secure login.
- Logout properly clears session.

---

## 📈 Future Improvements

- Middleware-based route protection
- Edit bookmark functionality
- Improved UI/UX enhancements
- Custom domain setup
- Loading and error states

---

## 👨‍💻 Author

Rakesh Raikar

Thank you for reviewing this project.
