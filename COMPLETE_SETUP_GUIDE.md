# 🚀 Complete Prince Enterprises Setup Guide

## 📋 SETUP CHECKLIST

### ✅ 1. DEPENDENCIES & SECURITY
- [x] All dependencies installed
- [x] Security vulnerabilities fixed (Next.js updated to 14.2.30)
- [x] ESLint configuration created
- [x] Code quality issues resolved

### 🗄️ 2. DATABASE SETUP

#### Option A: MongoDB Atlas (Recommended)
1. **Create Account**: Go to https://www.mongodb.com/atlas
2. **Create Cluster**: Choose free tier (512MB)
3. **Create Database User**: 
   - Username: `princeent-admin`
   - Password: Generate strong password
4. **Whitelist IP**: Add your current IP or 0.0.0.0/0 for development
5. **Get Connection String**: 
   ```
   mongodb+srv://username:password@cluster.mongodb.net/prince-ent
   ```
6. **Update .env.local**:
   ```bash
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prince-ent
   ```

#### Option B: Local MongoDB
1. **Download**: https://www.mongodb.com/try/download/community
2. **Install**: Follow Windows installer
3. **Start Service**: `net start MongoDB` (as Admin)
4. **Connection String**: Already set in .env.local

### 🗺️ 3. GOOGLE MAPS API SETUP

#### Step 1: Create Google Cloud Project
1. Go to https://console.cloud.google.com/
2. Create new project: "Prince Enterprises Logistics"
3. Enable billing (required, but $200 free monthly credit)

#### Step 2: Enable APIs
1. Go to "APIs & Services" > "Library"
2. Enable:
   - **Maps JavaScript API** (required)
   - **Places API** (optional)
   - **Geocoding API** (optional)

#### Step 3: Create API Key
1. "APIs & Services" > "Credentials"
2. "Create Credentials" > "API Key"
3. Copy the key

#### Step 4: Secure API Key
1. Click on your API key name
2. **Application restrictions**:
   - Choose "HTTP referrers (web sites)"
   - Add: `http://localhost:3001/*`, `https://yourdomain.com/*`
3. **API restrictions**:
   - Select "Restrict key"
   - Choose the APIs you enabled

#### Step 5: Update Environment
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 🔐 4. AUTHENTICATION SETUP

#### NextAuth Secret (Already Generated)
- Secure random string generated for JWT signing
- Different secret needed for production

#### Production Deployment
For production, generate new secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 🎯 5. ENVIRONMENT VARIABLES SUMMARY

Your `.env.local` should look like:
```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prince-ent

# NextAuth Configuration  
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=efc8654d71ab9e8d194623b66f4012e2db3a23d3253bae126399de8d26f5fae1

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here

# Environment
NODE_ENV=development
```

### 🔧 6. DEVELOPMENT WORKFLOW

#### Daily Development:
```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Build for production testing
npm run build
```

#### Database Operations:
```bash
# Create super admin (run once)
npm run create-superadmin

# Reset database (if needed)
npm run reset-db
```

### 🚨 7. TROUBLESHOOTING

#### Common Issues:
1. **Build Errors**: Usually missing environment variables
2. **Database Connection**: Check MongoDB URI and network access
3. **Maps Not Loading**: Verify API key and billing enabled
4. **Authentication Issues**: Check NextAuth URL matches your local port

#### Debug Steps:
1. Check browser console for errors
2. Verify all environment variables are set
3. Check network tab for failed API calls
4. Ensure MongoDB service is running

### 🎉 8. NEXT STEPS

Once setup is complete:
1. **Test all features**: Login, booking, tracking, admin panel
2. **Customize branding**: Update logos, colors, company info
3. **Configure production**: Set up hosting, production database
4. **Set up monitoring**: Error tracking, analytics

## 📞 SUPPORT
If you encounter issues:
1. Check this guide first
2. Review error messages carefully
3. Ensure all environment variables are correctly set
4. Test one feature at a time
