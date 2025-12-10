# OAuth Credentials Setup Guide

This guide walks you through getting Google and GitHub OAuth credentials for your authentication.

## 📋 Quick Overview

You need to create OAuth apps in:
1. **Google Cloud Console** → Get `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
2. **GitHub** → Get `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`

Then add them to your `.env.local` file.

---

## 🔵 Google OAuth Setup

### Step 1: Go to Google Cloud Console
👉 Visit: [Google Cloud Console](https://console.cloud.google.com/)

### Step 2: Create or Select a Project
1. Click the project dropdown at the top
2. Click **"New Project"** (or select an existing one)
3. Enter project name (e.g., "AI Interface Platform")
4. Click **"Create"**

### Step 3: Configure OAuth Consent Screen
1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** (unless you have Google Workspace)
3. Fill in required fields:
   - **App name**: Your app name
   - **User support email**: Your email
   - **Developer contact email**: Your email
4. Click **"Save and Continue"**
5. Skip scopes (click **"Save and Continue"**)
6. Add test users if needed (click **"Save and Continue"**)
7. Review and **"Back to Dashboard"**

### Step 4: Create OAuth Credentials
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Select **"Web application"** as the application type
4. Name it (e.g., "AI Platform Web Client")
5. Under **"Authorized redirect URIs"**, click **"ADD URI"**
6. Add: `http://localhost:3000/api/auth/callback/google`
   - For production, also add: `https://yourdomain.com/api/auth/callback/google`
7. Click **"CREATE"**

### Step 5: Copy Your Credentials
After creation, you'll see a popup with:
- **Your Client ID** → Copy this (starts with something like `123456789-abc...`)
- **Your Client Secret** → Click "Show" and copy this

**Add to `.env.local`:**
```env
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

---

## 🐙 GitHub OAuth Setup

### Step 1: Go to GitHub Developer Settings
👉 Visit: [GitHub Developer Settings](https://github.com/settings/developers)

Or navigate manually:
1. Go to GitHub.com
2. Click your profile picture (top right)
3. Click **"Settings"**
4. Scroll down to **"Developer settings"** (bottom left)
5. Click **"OAuth Apps"** (in left sidebar)

### Step 2: Create a New OAuth App
1. Click **"New OAuth App"** button
2. Fill in the form:

   **Application name:**
   ```
   AI Interface Platform
   ```
   
   **Homepage URL:**
   ```
   http://localhost:3000
   ```
   (For production: `https://yourdomain.com`)

   **Authorization callback URL:**
   ```
   http://localhost:3000/api/auth/callback/github
   ```
   (For production: `https://yourdomain.com/api/auth/callback/github`)

3. Click **"Register application"**

### Step 3: Generate Client Secret
1. On the next page, you'll see your **Client ID** (already visible)
2. Click **"Generate a new client secret"** button
3. Confirm by clicking **"Generate client secret"**
4. **IMPORTANT**: Copy the client secret NOW - you can only see it once!

### Step 4: Copy Your Credentials
- **Client ID**: Visible on the page (copy it)
- **Client Secret**: From step 3 (copy immediately)

**Add to `.env.local`:**
```env
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here
```

---

## 📝 Setting Up Your `.env.local` File

1. **Create the file** in your project root:
   ```bash
   # In your project root directory
   touch .env.local
   ```
   Or create it manually in your editor.

2. **Add all environment variables:**

   ```env
   # NextAuth Configuration
   NEXTAUTH_SECRET=generate-this-with-openssl-rand-base64-32
   NEXTAUTH_URL=http://localhost:3000

   # Google OAuth
   GOOGLE_CLIENT_ID=paste-your-google-client-id-here
   GOOGLE_CLIENT_SECRET=paste-your-google-client-secret-here

   # GitHub OAuth
   GITHUB_CLIENT_ID=paste-your-github-client-id-here
   GITHUB_CLIENT_SECRET=paste-your-github-client-secret-here

   # Your existing API keys
   GROQ_API_KEY=your-groq-key
   TOGETHER_API_KEY=your-together-key
   ```

3. **Generate NEXTAUTH_SECRET** (if you haven't already):
   ```bash
   # On Windows PowerShell:
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

   # On Mac/Linux:
   openssl rand -base64 32
   ```

4. **Save the file** - It's automatically ignored by git (in `.gitignore`)

---

## ✅ Testing Your Setup

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Visit:** http://localhost:3000

3. **Try logging in:**
   - Click "Continue with Google" → Should redirect to Google login
   - Click "Continue with GitHub" → Should redirect to GitHub login
   - Or use Email/Password (works without OAuth setup)

---

## 🔒 Important Security Notes

1. **Never commit `.env.local`** to Git (it's already in `.gitignore`)
2. **Never share your Client Secrets** publicly
3. **For production**, update redirect URIs to your actual domain
4. **Regenerate secrets** if they're ever exposed

---

## 🚀 Production Setup

When deploying to production (Vercel, Netlify, etc.):

1. **Update redirect URIs:**
   - Google: Add `https://yourdomain.com/api/auth/callback/google`
   - GitHub: Update callback URL to `https://yourdomain.com/api/auth/callback/github`

2. **Add environment variables in your hosting platform:**
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables

3. **Update `NEXTAUTH_URL`** in production:
   ```env
   NEXTAUTH_URL=https://yourdomain.com
   ```

---

## 🆘 Troubleshooting

### "Redirect URI mismatch" error
- Double-check the callback URLs match exactly (including `http://` vs `https://`)
- For localhost: Must be `http://localhost:3000/api/auth/callback/google`

### "Invalid client secret"
- Make sure you copied the entire secret (they're long strings)
- Check for extra spaces before/after
- For GitHub: If you lost the secret, generate a new one

### OAuth buttons not working
- Check browser console for errors
- Verify environment variables are loaded: Add `console.log(process.env.GOOGLE_CLIENT_ID)` temporarily
- Restart your dev server after changing `.env.local`

---

## 📚 Useful Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [GitHub OAuth Apps](https://github.com/settings/developers)
- [NextAuth.js Documentation](https://next-auth.js.org/)

---

**Need help?** Check the `AUTH_SETUP.md` file for more details!

