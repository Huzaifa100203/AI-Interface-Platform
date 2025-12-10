# Authentication Setup Guide

This project uses NextAuth.js for authentication with support for OAuth providers (Google, GitHub) and email/password credentials.

## Environment Variables Setup

1. Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

2. Configure the required environment variables in `.env.local`:

### Required Variables

#### NextAuth Configuration

- `NEXTAUTH_SECRET`: A random secret string for encrypting tokens. Generate one using:
   ```bash
   openssl rand -base64 32
   ```
- `NEXTAUTH_URL`: Your application URL (e.g., `http://localhost:3000` for development)

#### OAuth Providers (Optional but Recommended)

**Google OAuth:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Set application type to "Web application"
6. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copy the Client ID and Client Secret to your `.env.local`

**GitHub OAuth:**

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: Your app name
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret to your `.env.local`

## Features Implemented

✅ **Authentication Methods:**

- Google OAuth login
- GitHub OAuth login
- Email/Password credentials (demo mode - accepts any email/password)

✅ **User Experience:**

- Login modal with blurred overlay (shown when not authenticated)
- Protected routes (API endpoints require authentication)
- Header displays "Hello, [User Name]" after login
- Greeting message shown on new chat sessions (hidden after first message)
- Profile button in sidebar with profile modal
- Logout functionality

✅ **Security:**

- JWT-based sessions
- Protected API routes
- Secure cookie handling

## Usage

1. **Development:**

   ```bash
   npm run dev
   ```

2. **User Flow:**
   - When not logged in, users see an authentication modal
   - Users can sign in using Google, GitHub, or email/password
   - After login, the main interface is accessible
   - Header shows personalized greeting
   - Profile can be accessed via sidebar button

3. **Adding More OAuth Providers:**

   Edit `app/api/auth/[...nextauth]/route.ts` and add additional providers:

   ```typescript
   import DiscordProvider from "next-auth/providers/discord";

   providers: [
      // ... existing providers
      DiscordProvider({
         clientId: process.env.DISCORD_CLIENT_ID || "",
         clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      }),
   ];
   ```

## Production Considerations

1. **Update NEXTAUTH_URL** to your production domain
2. **Use strong NEXTAUTH_SECRET** (generate with `openssl rand -base64 32`)
3. **Configure OAuth redirect URIs** for production domains
4. **Implement proper email/password authentication** (replace demo credentials)
5. **Add database** for persistent user sessions and chat history
6. **Set up HTTPS** for secure cookie transmission
7. **Configure CORS** appropriately for your domain

## Database Integration (Future)

To persist chat sessions per user, consider adding:

- PostgreSQL with Prisma
- MongoDB with Mongoose
- Supabase for a full-stack solution

This would enable:

- Chat history synced across devices
- User preferences storage
- Usage analytics
- Multi-device support
