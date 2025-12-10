# Custom Authentication Setup Guide

## ✅ Implementation Complete

All OAuth providers have been removed and replaced with a custom MongoDB-based authentication system.

## 📋 What's Been Changed

### ✅ Removed:

- NextAuth.js and all OAuth providers (Google, GitHub)
- NextAuth configuration files
- OAuth-related environment variables

### ✅ Added:

- Custom MongoDB-based authentication
- JWT token-based sessions
- User registration with email, username, password
- Profile image upload (multer)
- Password confirmation (client-side)
- Improved AuthModal UI with better blur effects

## 🗂️ File Structure

```
├── models/
│   └── User.ts              # MongoDB User model
├── lib/
│   ├── mongodb.ts           # MongoDB connection
│   ├── auth.ts              # JWT auth middleware
│   └── api-client.ts        # Authenticated fetch helper
├── app/api/auth/
│   ├── register/route.ts    # User registration
│   ├── login/route.ts       # User login
│   ├── verify/route.ts      # Token verification
│   └── upload-image/route.ts # Profile image upload
├── context/
│   └── AuthContext.tsx      # Custom auth context
└── components/
    └── AuthModal.tsx        # Improved login/register modal
```

## 🔧 Environment Variables

Add these to your `.env.local` file:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://your-connection-string

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-jwt-secret-here

# Existing API Keys
GROQ_API_KEY=your-groq-key
TOGETHER_API_KEY=your-together-key
```

## 📝 User Model

The User model includes:

- `email` (unique, required)
- `username` (unique, required, 3-30 chars)
- `password` (hashed with bcrypt, required, min 6 chars)
- `image` (optional profile picture URL)
- `confirmed` (boolean, default: false)
- `createdAt` & `updatedAt` (timestamps)

## 🚀 Authentication Flow

1. **Registration:**
   - User fills email, username, password, confirm password
   - Optional: Upload profile image
   - Client validates password match
   - Server creates user, hashes password
   - Returns JWT token and user data

2. **Login:**
   - User enters email and password
   - Server validates credentials
   - Returns JWT token and user data

3. **Session Management:**
   - Token stored in `localStorage` as `auth_token`
   - User data stored in `localStorage` as `user_data`
   - Token sent in `Authorization: Bearer <token>` header

4. **Protected Routes:**
   - API routes check for valid JWT token
   - Returns 401 if unauthorized

## 🎨 UI Improvements

- **Enhanced Blur Effect:** Modal backdrop uses `backdrop-blur-xl` with saturation
- **Better Form Design:** Clean, modern login/register form
- **Password Visibility Toggle:** Show/hide password buttons
- **Image Upload Preview:** See image before upload
- **Smooth Transitions:** All interactions are animated

## 📦 Dependencies Added

```json
{
   "mongodb": "^latest",
   "mongoose": "^latest",
   "bcryptjs": "^latest",
   "jsonwebtoken": "^latest"
}
```

## 🔐 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT token authentication
- ✅ Token expiration (7 days)
- ✅ Protected API routes
- ✅ Input validation
- ✅ Email uniqueness check
- ✅ Username uniqueness check

## 🧪 Testing

1. Start your dev server:

   ```bash
   npm run dev
   ```

2. Try registration:
   - Enter email, username, password
   - Confirm password
   - Optionally upload profile image
   - Submit

3. Try login:
   - Use registered email and password
   - Should authenticate successfully

4. Check protected routes:
   - Try accessing API routes without token → Should get 401
   - With valid token → Should work

## 🐛 Troubleshooting

### MongoDB Connection Error

- Check `MONGO_URI` in `.env.local`
- Ensure MongoDB cluster allows your IP
- Verify connection string format

### JWT Errors

- Generate a new `JWT_SECRET`: `openssl rand -base64 32`
- Ensure it's set in `.env.local`

### Image Upload Issues

- Check `public/uploads/avatars/` directory exists
- Verify file size < 5MB
- Check file type (JPEG, PNG, WebP only)

## 🎯 Next Steps (Optional)

- [ ] Add email verification flow
- [ ] Add password reset functionality
- [ ] Add profile editing
- [ ] Add account deletion
- [ ] Implement refresh tokens
- [ ] Add rate limiting

---

**Status:** ✅ Custom authentication system fully implemented and ready to use!
