# Tour Cheetah London — 3-Week Launch Roadmap

**Project Goal:** Launch Tour Cheetah as a paid app (web + iOS + Android) with Stripe payments by June 17, 2026

**Start Date:** May 27, 2026 (Tuesday)  
**Target Launch:** June 16-17, 2026 (Tuesday-Wednesday, Week 3)  
**Current Status:** Web app functional, audio files ready, needs payment & mobile builds

---

## Timeline Overview

```
WEEK 1 (May 27 - Jun 2)
├─ Mon-Tue: Infrastructure setup (auth, database, Stripe)
├─ Wed-Fri: Auth flow implementation & testing
└─ Weekend: Backend payment endpoints ready

WEEK 2 (Jun 3 - Jun 9)
├─ Mon: Web payment flow complete
├─ Tue-Wed: iOS app Capacitor setup + build
├─ Thu-Fri: Android app Capacitor setup + build
└─ Marketing site + deploy web app

WEEK 3 (Jun 10 - Jun 16)
├─ Mon-Tue: Testing & bug fixes
├─ Wed-Thu: iOS/Android app store submissions
├─ Fri-Sat: Final polish, monitor reviews
└─ Weekend: Apps approved, go live

WEEK 4+ (Jun 17+)
└─ Monitor, iterate, improve based on feedback
```

---

## Phase-by-Phase Breakdown

### PHASE 0: CRITICAL PATH - Foundation (Days 1-5)
**Duration:** May 27 - May 31  
**Owner:** You (Backend development)

#### Accounts & Infrastructure (Start TODAY)
- [ ] **Apple Developer Account** — $99/year
  - URL: https://developer.apple.com/enroll/
  - Timeline: 24-48 hours approval
  - **START IMMEDIATELY** — this is your longest bottleneck
  
- [ ] **Google Play Developer Account** — $25 one-time
  - URL: https://play.google.com/apps/publish/
  - Timeline: Instant
  
- [ ] **Stripe Account** — Free to create, $0 until first transaction
  - URL: https://dashboard.stripe.com/
  - Create and verify account
  - Set up products (see below)
  - Timeline: 2-3 hours to verify
  
- [ ] **Domain Name**
  - Examples: `tourcheetah-london.com`, `tourcheetahapp.com`, `tourcheetah.app`
  - Cost: $10-15/year
  - Register at: Namecheap, Google Domains, or Cloudflare
  
- [ ] **Email Service** (for transactional emails)
  - Free tier: SendGrid or Mailgun
  - For: Payment confirmations, password resets, welcome emails
  
- [ ] **Hosting**
  - Frontend (Web app): Vercel (free tier)
  - Backend (API): Railway, Render, or Heroku (free tier)
  - Database: PostgreSQL via Railway/Render, or MongoDB Atlas free tier

#### Backend Architecture (Build This)

**Technology Stack:**
```
Frontend: React + Vite (you have this)
Backend: Node.js + Express + TypeScript
Database: PostgreSQL (recommended) or MongoDB
Auth: JWT tokens + httpOnly cookies
Payments: Stripe.js
Hosting: Railway or Render
```

**Database Schema:**
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  stripe_customer_id VARCHAR(255),
  subscription_status VARCHAR(50), -- active, cancelled, expired
  subscription_id VARCHAR(255),
  subscription_plan VARCHAR(50), -- lifetime, monthly, annual
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  stripe_charge_id VARCHAR(255) UNIQUE,
  amount_cents INTEGER, -- in cents (e.g., 1999 = $19.99)
  currency VARCHAR(3), -- USD
  status VARCHAR(50), -- succeeded, failed, refunded
  payment_method VARCHAR(50), -- card, etc.
  created_at TIMESTAMP
);

-- User Progress (optional, for future enhancement)
CREATE TABLE user_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  completed_stops JSONB, -- Array of stop IDs
  bookmarks JSONB,
  last_played_stop_id VARCHAR(50),
  updated_at TIMESTAMP
);
```

**API Endpoints to Build:**

Auth:
```
POST /api/auth/register       — Create new user account
POST /api/auth/login          — Login, return JWT token
POST /api/auth/logout         — Logout, invalidate token
POST /api/auth/refresh-token  — Refresh expired JWT
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

Payments:
```
GET  /api/products            — List pricing tiers
POST /api/payments/create-intent         — Create Stripe PaymentIntent
POST /api/payments/confirm    — Confirm payment
GET  /api/payments/status     — Check user's subscription status
POST /api/payments/cancel-subscription   — Cancel subscription
GET  /api/user/subscription   — Get current subscription
```

Webhooks:
```
POST /api/webhooks/stripe     — Stripe webhook receiver
  Events to handle:
  - payment_intent.succeeded
  - customer.subscription.created
  - customer.subscription.updated
  - customer.subscription.deleted
  - charge.refunded
```

**Stripe Products to Create** (in Stripe Dashboard):
```
1. One-time Purchase (Lifetime Access)
   - Product: "Tour Cheetah Lifetime"
   - Price: $19.99
   - Type: One-time payment

2. Subscription (Monthly)
   - Product: "Tour Cheetah Monthly"
   - Price: $4.99/month
   - Billing cycle: Monthly
   - Trial: Optional (3-7 days)

3. Subscription (Annual)
   - Product: "Tour Cheetah Annual"
   - Price: $39.99/year
   - Billing cycle: Yearly
   - Trial: Optional
```

**Key Security Considerations:**
- Never log or store raw credit card data (Stripe handles this)
- Use HTTPS only (all hosting providers support this)
- Validate JWT tokens on every protected endpoint
- Hash passwords with bcrypt (cost: 12)
- Use environment variables for secrets (API keys, database credentials)
- Enable CORS only for your frontend domain(s)
- Rate limit auth endpoints (prevent brute force)

**Development Timeline:**
- Day 1: Set up Node.js project, database, environment
- Day 2-3: Build auth endpoints (register, login, JWT)
- Day 4: Build payment intent & webhook handlers
- Day 5: Test auth & payment flows, document API

**Test Scenarios:**
- User registers → receives welcome email → can login
- User initiates payment → Stripe modal → payment confirmed → subscription created
- Webhook received → user subscription updated in database
- User tries to access protected route without token → 401 error

**Deliverable:** REST API ready for frontend integration

---

### PHASE 1: Payment Flow & Paywall (Days 5-10)
**Duration:** June 1 - June 6  
**Owner:** You (Frontend development)  
**Dependency:** PHASE 0 backend must be complete

#### Frontend Changes

**1. Install Stripe Libraries**
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

**2. Create New Pages/Components**

`src/pages/Login.tsx`
- Email & password login form
- Forgot password link
- Sign up link to register page

`src/pages/Register.tsx`
- Create account form (email, password, confirm password)
- Email validation
- Password strength indicator
- Terms & privacy policy checkboxes

`src/pages/Pricing.tsx`
- Show 3 pricing options (One-time, Monthly, Annual)
- Feature comparison table
- CTA buttons for each option
- FAQ section

`src/pages/Checkout.tsx`
- Stripe Payment Element or embedded form
- Show summary of what user is buying
- Loading state during payment
- Success/error handling

`src/components/ProtectedRoute.tsx`
- Check if user is authenticated
- Check if user has active subscription
- Redirect to login/pricing if not authorized

**3. Modify Existing Components**

`src/App.tsx`
- Add Login and Register routes
- Add Pricing route (publicly accessible)
- Add Checkout route (protected)
- Update MapScreen to be protected
- Update AudioPlayer to check subscription

`src/pages/MapScreen.tsx`
- Add lock icon overlay if user not logged in
- Show "Unlock Full Tour" button
- Allow free preview (first 1-2 stops only)
- Access full tour if subscribed

`src/pages/AudioPlayer.tsx`
- Check subscription status
- Lock audio if user not subscribed
- Show "Upgrade" button for free users

**4. Create Auth Context/State**
```typescript
// src/context/AuthContext.tsx
type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  subscription: Subscription | null;
};
```

**5. Create Payment Service**
```typescript
// src/services/paymentService.ts
export class PaymentService {
  async createPaymentIntent(productId: string): Promise<string> {
    // Calls /api/payments/create-intent
  }
  
  async getSubscriptionStatus(): Promise<Subscription> {
    // Calls /api/user/subscription
  }
  
  async cancelSubscription(): Promise<void> {
    // Calls /api/payments/cancel-subscription
  }
}
```

**6. Handle JWT Token Storage**
```typescript
// Secure token storage
const token = localStorage.getItem('tourcheetah:auth-token');

// Refresh token on page load
useEffect(() => {
  const refreshToken = async () => {
    const response = await fetch('/api/auth/refresh-token', {
      method: 'POST',
      credentials: 'include' // for httpOnly cookies if using those
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('tourcheetah:auth-token', data.token);
    }
  };
  refreshToken();
}, []);
```

**7. Error Handling**
- Show user-friendly error messages on payment failure
- Distinguish between:
  - Network errors
  - Stripe validation errors
  - Server errors
  - Payment declined errors
- Provide clear next steps (retry, contact support, etc.)

**8. Email Configuration**
```typescript
// src/services/emailService.ts
// Sends emails via SendGrid API or backend endpoint

// Trigger emails on:
// - Successful payment
// - Subscription renewal
// - Failed payment (with retry link)
// - Subscription cancelled (with "come back" offer)
```

**Development Timeline:**
- Day 1: Set up auth pages (login, register)
- Day 2: Create pricing & checkout pages
- Day 3: Integrate Stripe Payment Element
- Day 4: Build ProtectedRoute & gating logic
- Day 5: Test end-to-end payment flow

**Test Checklist:**
- [ ] User can register & receive welcome email
- [ ] User can login with correct credentials
- [ ] User cannot login with wrong password
- [ ] User sees pricing page and can select option
- [ ] Payment form loads (Stripe)
- [ ] Test card (4242 4242 4242 4242) processes successfully
- [ ] Failed card (4000 0000 0000 0002) shows error
- [ ] User subscription status updates in database
- [ ] MapScreen locks for unpaid users
- [ ] AudioPlayer plays full content for paid users
- [ ] Subscription cancellation works
- [ ] User receives payment confirmation email

**Deliverable:** Web app with working Stripe payments & access gating

---

### PHASE 2: Deploy Web App (Days 6-10)
**Duration:** June 2 - June 6  
**Parallel with:** PHASE 1  
**Owner:** You (DevOps)

#### Deploy Backend to Production

**Using Railway.app (Recommended — free tier sufficient):**
1. Sign up at railway.app
2. Connect GitHub repo (or create new project)
3. Add PostgreSQL plugin
4. Set environment variables:
   ```
   DATABASE_URL=...
   STRIPE_SECRET_KEY=sk_live_...
   JWT_SECRET=...
   CORS_ORIGIN=https://yourdomain.com
   NODE_ENV=production
   ```
5. Deploy (automatic on git push or manual)
6. Note API URL: `https://your-app.up.railway.app`

**Using Heroku (Alternative):**
1. Sign up at heroku.com
2. Create new app
3. Add PostgreSQL add-on
4. Set config vars (same as above)
5. Deploy via `git push heroku main`

#### Deploy Frontend to Production

**Using Vercel (Recommended — free tier):**
1. Sign up at vercel.com with GitHub
2. Import your repo
3. Configure:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-api.up.railway.app
   VITE_STRIPE_KEY=pk_live_...
   ```
5. Deploy (automatic on git push)
6. Note URL: `https://tourcheetah.vercel.app` or custom domain

**Configure Custom Domain:**
1. Buy domain (e.g., tourcheetah-london.com)
2. In Vercel project settings → Domains
3. Add domain
4. Update DNS records per Vercel instructions
5. Wait 24-48 hours for DNS propagation

#### Create Marketing Landing Page

**Option 1: Use Template** (1-2 hours)
- Webflow, Wix, or Squarespace
- Template: "App landing page"
- Customize with your copy and screenshots
- Deploy to marketing domain

**Option 2: Simple HTML** (2-3 hours)
```html
<!-- index.html -->
<html>
<head>
  <title>Tour Cheetah London - Self-Guided Audio Bike Tour</title>
  <meta name="description" content="Explore London on a Santander Cycles with audio narration">
</head>
<body>
  <nav>Home | Features | Pricing | FAQ | Download App</nav>
  
  <section class="hero">
    <h1>Tour Cheetah London</h1>
    <p>Your guide to London on two wheels</p>
    <button>Download on App Store</button>
    <button>Get on Google Play</button>
    <button>Try Web Version</button>
  </section>
  
  <section class="features">
    <h2>10 Iconic Stops</h2>
    <h2>Offline Audio</h2>
    <h2>Real-Time Bike Availability</h2>
  </section>
  
  <section class="pricing">
    <!-- Pricing table -->
  </section>
  
  <section class="faq">
    <!-- FAQ -->
  </section>
  
  <footer>
    Contact | Privacy | Terms
  </footer>
</body>
</html>
```

#### Create Legal Pages

Use these templates (minimal customization needed):
1. **Terms of Service** — Termly.io free template
2. **Privacy Policy** — GDPR-compliant template
3. **Refund Policy** — Stripe's standard terms
4. Deploy to `/terms`, `/privacy`, `/refund`

#### Set Up Analytics

1. **Google Analytics 4** (free)
   - Create GA4 property
   - Add tracking code to web app
   - Add tracking code to landing page
   - Set up conversion goals (signups, payments)

2. **Stripe Dashboard** (built-in)
   - Monitor payment volume
   - Track disputes/refunds
   - Check customer distribution

**Development Timeline:**
- Day 1-2: Deploy backend + frontend
- Day 2-3: Configure custom domain
- Day 3-4: Create marketing landing page
- Day 4-5: Add legal pages, analytics

**Test Checklist:**
- [ ] API deployed and responding
- [ ] Frontend loads from custom domain
- [ ] Payment flow works end-to-end
- [ ] Analytics tracking events
- [ ] Emails sending successfully
- [ ] No console errors on production

**Deliverable:** Web app live at custom domain with payments working

---

### PHASE 3: iOS App with Capacitor (Days 8-16)
**Duration:** June 4 - June 13  
**Owner:** You (Mobile development)

#### Prerequisites
- [ ] Xcode installed (12GB, download started)
- [ ] Node.js & npm
- [ ] Apple Developer account created (should be approved by now)

#### Setup Capacitor

```bash
# In your WebClaude project root
npm install @capacitor/core @capacitor/cli
npx cap init

# Answer prompts:
# App name: Tour Cheetah London
# App package: com.tourcheetah.london
# Webapp directory: dist
# Repo URL: (your GitHub URL)

npm install @capacitor/ios
npx cap add ios

# This creates:
# ios/                    — Xcode project
# capacitor.config.ts     — Capacitor config
```

#### Configure App Metadata

**1. Update `capacitor.config.ts`:**
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tourcheetah.london',
  appName: 'Tour Cheetah',
  webDir: 'dist',
  server: {
    // For dev: point to localhost
    // For production: point to your deployed domain
    url: process.env.NODE_ENV === 'production' 
      ? 'https://tourcheetah.vercel.app'
      : 'http://localhost:5173',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: '#ffffff',
    },
  },
};

export default config;
```

**2. Build web app for iOS:**
```bash
npm run build
npx cap sync ios
```

**3. Open Xcode:**
```bash
npx cap open ios
# Opens XCode with your iOS project
```

#### Configure in Xcode

**1. Update App Icon:**
- Get 1024x1024 PNG app icon
- In Xcode: Select project → Assets → AppIcon
- Drag icon into "App Icon" slot
- Xcode generates all sizes automatically

**2. Update Display Name:**
- Project → General → Display Name: "Tour Cheetah"

**3. Configure Permissions (Info.plist):**
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Tour Cheetah needs your location to show your position on the map</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Tour Cheetah needs your location for accurate navigation</string>

<key>NSUserTrackingUsageDescription</key>
<string>Tour Cheetah uses analytics to improve your experience</string>

<key>NSMicrophoneUsageDescription</key>
<string>Tour Cheetah uses your microphone for audio features</string>
```

**4. Team & Signing:**
- Select project → Signing & Capabilities
- Team: Select your Apple Developer account
- Bundle ID: Must match your App ID in Apple Developer portal
- Signing certificate: Automatic

#### Build and Test Locally

**On iOS Simulator:**
```bash
# In Xcode, press Cmd+R or select a simulator and click Play
```

**On Real iPhone:**
1. Connect iPhone via USB
2. Select iPhone from device dropdown in Xcode
3. Click Play (Cmd+R)
4. Trust app on device (Settings → Developer)
5. Test all features:
   - App launches without crash
   - Geolocation works
   - Audio plays
   - Map renders
   - Offline mode (enable Flight Mode)
   - Payment flow (test with Stripe test card)

#### Prepare for App Store Submission

**1. Create App ID in Apple Developer Portal:**
- https://developer.apple.com/account/resources/
- Create new App ID
- Bundle ID: `com.tourcheetah.london`
- Save

**2. Create App Store Connect entry:**
- https://appstoreconnect.apple.com/
- Create new app (iOS)
- Bundle ID: Select the one you just created
- SKU: Can be anything unique (e.g., `tourcheetah-london-001`)
- Name: "Tour Cheetah"

**3. Fill in App Information:**
- Primary Language: English
- Category: Travel
- Subcategory: Travel (or Lifestyle)
- Content Rights: Owned/Licensed
- App Type: Single Platform App

**4. Prepare App Description & Keywords:**
```
Name: Tour Cheetah
Subtitle: London's Self-Guided Audio Bike Tour
Description:
"Explore London's most iconic landmarks on a Santander Cycles 
bike with professional audio narration. Tour Cheetah guides you 
through 10 stops across three loops—Royal London, Entertainment 
District, and Old London. Features offline playback, real-time 
bike availability, and beautiful maps."

Keywords: London, tours, bike, audio, travel, landmarks, cycling, 
Santander Cycles, self-guided

Support URL: https://tourcheetah-london.com/support
Privacy Policy URL: https://tourcheetah-london.com/privacy
```

**5. Prepare Screenshots:**
- Minimum 2, maximum 5 screenshots per device size
- Device sizes: iPhone 6.7" (Pro Max) and 5.5" (regular iPhone)
- Recommended: Prepare for multiple screen sizes
- Examples:
  - Onboarding screen
  - Map view with bike toggle
  - Audio player playing a stop
  - Pricing/subscription screen
  - How It Works screen

**6. Prepare Preview Video** (Optional but recommended):
- 15-30 second video showing app in action
- Must be .mp4, 1920x1080, less than 500MB
- Shows user launching app → viewing map → playing audio

**7. Version & Build Numbers:**
- Version: 1.0.0
- Build: 1

#### Archive and Submit

**1. Increment build number in Xcode:**
```
Project → Build Settings → Versioning → Agvtool commands
Product → Scheme → Edit Scheme → Pre-actions → Run script:
agvtool next-version -all
```

**2. Archive app:**
- Xcode → Product → Archive
- Wait for completion (2-5 min)

**3. Upload to App Store:**
- Archives window opens automatically
- Click "Distribute App"
- Select "App Store Connect"
- Follow upload wizard
- Xcode signs with your certificate and uploads

**4. In App Store Connect:**
- Build becomes available in "TestFlight" section (wait 5 min)
- Scroll down to "Build"
- Select your build
- Fill in any missing info (privacy manifest, etc.)
- Click "Submit for Review"

**5. Wait for Review:**
- Apple typically reviews in 24-48 hours
- Can check status in App Store Connect
- Common rejection reasons:
  - Crashes on device
  - Misleading screenshots
  - Promised features don't work
  - Privacy violations
  - Can resubmit within 24 hours of rejection

#### Post-Submission

**If Rejected:**
1. Read Apple's feedback carefully
2. Make necessary fixes
3. Increment build number
4. Archive and resubmit
5. Usually approved on second try within 24 hours

**If Approved:**
1. Click "Release to App Store"
2. Takes 1-2 hours to appear in App Store
3. Monitor reviews and ratings
4. Respond to negative reviews promptly

**Development Timeline:**
- Day 1-2: Setup Capacitor & Xcode
- Day 2-3: Configure app metadata
- Day 3-4: Build and test on device
- Day 4: Prepare screenshots & description
- Day 5: Archive and submit
- Day 5-8: Wait for Apple review + potential resubmit
- Day 9+: Monitor App Store performance

**Test Checklist (Before Submission):**
- [ ] App launches without crash
- [ ] All pages load correctly
- [ ] Geolocation works (ask for permission)
- [ ] Audio plays for all stops
- [ ] Map renders and pans smoothly
- [ ] Audio doesn't stutter on fast map panning
- [ ] Login/signup works
- [ ] Payment test card works
- [ ] Lock screen controls work (play/pause from lock screen)
- [ ] App works in offline mode (Flight Mode enabled)
- [ ] Subscription status displays correctly
- [ ] Memory doesn't leak on sustained use (kill app multiple times, check Settings → General → iPhone Storage → App Size)
- [ ] Orientation changes work (portrait/landscape)
- [ ] Home button gestures work correctly

**Deliverable:** iOS app submitted to App Store (under review)

---

### PHASE 4: Android App with Capacitor (Days 8-16)
**Duration:** June 4 - June 13  
**Parallel with:** PHASE 3 (iOS)  
**Owner:** You (Mobile development)

#### Prerequisites
- [ ] Android Studio installed (900MB, download started)
- [ ] Google Play Developer account created
- [ ] JDK 11+ (usually installed with Android Studio)

#### Setup Capacitor for Android

```bash
# Android platform already exists if you ran "npx cap add ios"
# If not:
npm install @capacitor/android
npx cap add android

# Sync your web app to Android
npm run build
npx cap sync android
```

#### Configure App Metadata

**1. Update `android/app/build.gradle`:**
```gradle
android {
    namespace 'com.tourcheetah.london'
    compileSdk 34

    defaultConfig {
        applicationId 'com.tourcheetah.london'
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName '1.0.0'
    }
}
```

**2. Update `android/app/src/main/AndroidManifest.xml`:**
```xml
<manifest>
    <!-- Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    
    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round">
        
        <!-- Activities, services, etc. auto-generated by Capacitor -->
    </application>
</manifest>
```

**3. Update App Name:**
- File: `android/app/src/main/res/values/strings.xml`
```xml
<string name="app_name">Tour Cheetah</string>
```

**4. Add App Icon:**
- Get 512x512 PNG app icon
- In Android Studio: res → New → Image Asset
- Choose the PNG
- Android Studio generates all required sizes (ldpi, mdpi, hdpi, xhdpi, etc.)

#### Configure Permissions at Runtime

Android 6+ requires runtime permissions. Capacitor handles most of this, but you may need to update your React code:

```typescript
// src/hooks/useGeolocation.tsx
import { Geolocation } from '@capacitor/geolocation';

export function useGeolocation() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  useEffect(() => {
    const getLocation = async () => {
      try {
        // Capacitor automatically requests permission on Android
        const position = await Geolocation.getCurrentPosition();
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      } catch (error) {
        console.error('Geolocation error:', error);
      }
    };
    
    getLocation();
  }, []);
  
  return location;
}
```

#### Open in Android Studio

```bash
npx cap open android
```

This opens Android Studio with your Android project.

#### Build and Test Locally

**On Android Emulator:**
1. In Android Studio: Device Manager → Create Virtual Device
2. Choose device (e.g., Pixel 5)
3. Choose Android version (12, 13, or 14)
4. Create
5. Click Play to launch emulator
6. In Android Studio, click Play (or Shift+F10) to build and deploy

**On Real Android Phone:**
1. Enable USB debugging on phone:
   - Settings → About → Build number (tap 7 times)
   - Back → Developer options → USB debugging
2. Connect via USB cable
3. In Android Studio, select device from dropdown
4. Click Play to build and deploy
5. App launches on device
6. Test all features:
   - App launches without crash
   - Geolocation works
   - Audio plays
   - Map renders
   - Payment flow
   - Back button behavior

#### Prepare for Google Play Submission

**1. Create App Signing Key:**
```bash
cd android
# Generate keystore file (enter password, store it securely!)
keytool -genkey -v -keystore release.keystore -keyalias tourcheetah-london \
  -keyalg RSA -keysize 2048 -validity 10000
```

This creates `android/release.keystore`. **Backup this file securely** — you'll need it for future updates.

**2. Configure Signing in Android Studio:**
- Build → Generate Signed Bundle/APK
- Choose "AAB" (Android App Bundle — required for Play Store)
- Select key store: browse to `android/release.keystore`
- Enter password
- Select alias: `tourcheetah-london`
- Build (Release variant)
- Generates `android/app/release/app-release.aab` (~15MB)

**3. Create App in Google Play Console:**
- https://play.google.com/console/
- Create new app
- Name: "Tour Cheetah"
- Category: Travel
- Content rating: Fill questionnaire (usually "4+")

**4. Fill in App Information:**
```
Title: Tour Cheetah
Short description: Self-guided London bike tour with audio

Full description:
"Explore London's most iconic landmarks on a Santander Cycles bike 
with professional audio narration. Tour Cheetah guides you through 
10 stops across three loops—Royal London, Entertainment District, 
and Old London. Offline playback, real-time bike availability, 
beautiful maps."

App icon: 512x512 PNG
Feature graphic: 1024x500 PNG (banner, will be displayed on store)
Screenshots: 4-8 screenshots (phone & tablet, portrait)
```

**5. Prepare Screenshots:**
- Same 10 as iOS (app looks the same)
- Minimum 2 for phone, recommended 4-8
- Minimum 1 for tablet (optional)
- Test on both Portrait and Landscape

**6. Pricing:**
- Set same pricing as iOS ($19.99 lifetime, $4.99/month, $39.99/year)
- Set in Google Play Console
- Available countries: All (or select specific)

**7. Content Rating:**
- Fill questionnaire (all questions are "No" for travel app)
- Get instant rating

#### Upload and Submit

**1. Upload AAB File:**
- Google Play Console → Your app → Production release
- Upload AAB file (`app-release.aab`)
- System validates (takes 1-2 min)
- If any errors, fix and re-upload

**2. Fill Release Notes:**
```
Tour Cheetah - Version 1.0.0

🎉 Initial Release

Explore London's iconic landmarks with professional audio narration:
• 10 audio stops across 3 loops
• Offline playback
• Real-time bike availability
• Beautiful interactive maps
```

**3. Submit for Review:**
- Click "Review release" → "Start rollout to Production"
- Google reviews (usually 2-24 hours, often much faster)

**4. Monitor Review Status:**
- Check daily in Google Play Console
- If rejected, you'll see reason and can resubmit within 24 hours

#### Post-Submission

**If Approved:**
- App appears in Google Play Store within 1 hour
- Monitor reviews and ratings
- Respond to feedback
- Monitor crash reports in Google Play Console

**Common Issues:**
- Crashes on startup (check logcat output in Android Studio)
- Memory leaks (use Android Profiler in Android Studio)
- Battery drain (check WakeLock usage)
- Audio not playing (check permissions)

**Development Timeline:**
- Day 1-2: Setup Android Studio & Capacitor
- Day 2-3: Configure app metadata
- Day 3-4: Build and test on device
- Day 4: Create signing key
- Day 4: Build signed AAB
- Day 5: Prepare screenshots & description in Play Console
- Day 5: Upload and submit
- Day 5-6: Wait for Google Play review (usually <24 hours)

**Test Checklist (Before Submission):**
- [ ] App launches on phone without crash
- [ ] App launches on tablet without crash
- [ ] Geolocation permission request appears
- [ ] Geolocation works after permission granted
- [ ] Audio plays clearly
- [ ] Map renders and is interactive
- [ ] Audio doesn't stutter
- [ ] Login/signup works
- [ ] Payment works with test card
- [ ] Lock screen controls work (media buttons in notification center)
- [ ] Back button closes app/pages correctly
- [ ] Works on Android 11, 12, 13, 14
- [ ] Offline mode works (disable WiFi/mobile data)
- [ ] Subscription status displays correctly
- [ ] No memory leaks on sustained use (Android Profiler)
- [ ] No ANR (Application Not Responding) errors

**Deliverable:** Android app submitted to Google Play Store (under review)

---

### PHASE 5: Testing & Quality Assurance (Days 13-19)
**Duration:** June 9 - June 15  
**Owner:** You (QA)  
**Parallel with:** Waiting for app reviews

#### Web App Testing

**Browser Compatibility:**
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)

**Mobile Browsers:**
- [ ] iOS Safari (on iPhone)
- [ ] Android Chrome (on Android)
- [ ] Samsung Internet (on Samsung)

**Feature Testing:**
- [ ] All pages load without errors
- [ ] Audio plays for all 10 stops
- [ ] Map initializes and renders correctly
- [ ] Geolocation works
- [ ] Bike availability loads
- [ ] Login/signup flow works end-to-end
- [ ] Payment succeeds with test card
- [ ] Payment fails gracefully with bad card
- [ ] Subscription status shows correctly
- [ ] Cancelled subscriptions prevent access
- [ ] Offline mode works (disable WiFi)
- [ ] PWA installation works (iOS: Add to Home Screen, Android: Install app)

**Performance:**
- [ ] Page loads in <3 seconds
- [ ] Audio plays without stuttering
- [ ] Map pans smoothly
- [ ] No memory leaks (open Chrome DevTools → Memory → Take snapshot × 5, watch heap size)

#### iOS App Testing

**Devices:**
- [ ] iPhone 12 mini (smallest)
- [ ] iPhone 14 Pro Max (largest)
- [ ] Test on at least 2 actual devices

**iOS Versions:**
- [ ] iOS 15 (if possible)
- [ ] iOS 16
- [ ] iOS 17 (latest)

**Features:**
- [ ] App launches without crash
- [ ] Geolocation permission request appears
- [ ] Geolocation works after permission
- [ ] Audio plays clearly
- [ ] Lock screen controls work (play/pause from lock screen)
- [ ] Background audio continues when app is backgrounded
- [ ] Map renders and is responsive
- [ ] All stops accessible
- [ ] Payment flow works
- [ ] Offline mode works
- [ ] Subscription prevents access when expired

**Performance:**
- [ ] No crashes on launch
- [ ] No memory leaks (use Xcode Memory Debugger)
- [ ] Battery usage acceptable
- [ ] App responds quickly to touches

#### Android App Testing

**Devices:**
- [ ] Pixel 5 (2020)
- [ ] Samsung Galaxy S22 (2022)
- [ ] OnePlus (if available)
- [ ] Test on at least 2 actual devices

**Android Versions:**
- [ ] Android 11
- [ ] Android 12
- [ ] Android 13
- [ ] Android 14 (latest)

**Features:**
- [ ] App launches without crash
- [ ] Geolocation permission dialog appears
- [ ] Geolocation works after permission
- [ ] Audio plays clearly
- [ ] Notification center shows media controls
- [ ] Back button behaves correctly (closes dialogs, then pages)
- [ ] Map renders and is responsive
- [ ] Offline mode works
- [ ] Payment flow works
- [ ] Subscription prevents access when expired

**Performance:**
- [ ] No ANR (Application Not Responding) errors
- [ ] No memory leaks
- [ ] Battery usage acceptable
- [ ] App is responsive

#### Payment Testing

**Stripe Test Cards:**
```
Successful payment:   4242 4242 4242 4242, any future date, any CVC
Declined payment:     4000 0000 0000 0002
Expired card:         4000 0000 0000 0069
Require auth (3D):    4000 0027 6000 3184

All have CVC: Any number
All have Zip: Any number
```

**Test Scenarios:**
- [ ] One-time purchase succeeds
- [ ] Monthly subscription succeeds
- [ ] Annual subscription succeeds
- [ ] Declining card shows error
- [ ] Failed payment can be retried
- [ ] Subscription renewal works (can't fully test without waiting, but verify endpoint)
- [ ] Subscription cancellation works
- [ ] Payment confirmation email received
- [ ] Refund works (if applicable)

#### Bug Tracking

Create a simple bug log (spreadsheet or doc):
```
| Date | Device | Issue | Severity | Status |
|------|--------|-------|----------|--------|
| 6/10 | iPhone 12 | Audio stutters on map pan | High | Open |
| 6/10 | Android | Back button doesn't close overlay | Critical | Fixed |
```

**Severity:**
- Critical: App crashes or payment fails
- High: Feature doesn't work but app doesn't crash
- Medium: UI doesn't look right but functionality works
- Low: Minor visual issue

**Fix all Critical & High before launch. Low can wait for v1.1.**

#### Sign-Off Checklist

Before launching, verify:
- [ ] All critical bugs fixed
- [ ] All high-priority bugs fixed
- [ ] Performance acceptable
- [ ] Payment tested thoroughly
- [ ] Apps approved by stores (or submitted and waiting)
- [ ] Web app deployed and working
- [ ] Legal pages live
- [ ] Analytics configured
- [ ] Email notifications working
- [ ] Support email monitored

**Deliverable:** All apps ready for public launch

---

### PHASE 6: Launch (Days 19-21)
**Duration:** June 16-17  
**Owner:** You (Launch coordination)

#### Pre-Launch (Day 18)

**Final Verification:**
- [ ] Web app works (test login → payment → access tour)
- [ ] iOS app approved (check App Store Connect)
- [ ] Android app approved (check Google Play Console)
- [ ] Stripe live mode enabled
- [ ] All environment variables correct
- [ ] Backups configured
- [ ] Monitoring (Sentry, error logs) set up
- [ ] Support email ready
- [ ] FAQ prepared for support

**Deployment Checklist:**
- [ ] No uncommitted code changes
- [ ] Database migrations run
- [ ] Environment variables updated for production
- [ ] Cache cleared (if applicable)
- [ ] CDN configured (if using)
- [ ] DNS records correct

#### Launch Day (Day 19)

**Morning Preparation:**
1. Final test of each platform
2. Check app stores for any issues
3. Monitor error logs

**Stripe Live Mode Activation:**
1. Go to Stripe Dashboard
2. Toggle from Test Mode to Live Mode
3. Verify live API keys in code
4. Test with real card (or first customer's real card)

**Release Apps to Stores:**

**iOS App Store:**
1. Check App Store Connect
2. If approved: Click "Release to App Store"
3. Wait 1-2 hours for propagation
4. Verify app appears in App Store

**Android Google Play:**
1. Check Google Play Console
2. If approved: Confirm release
3. Monitor for deployment (usually instant)
4. Verify app appears in Play Store

**Web App:**
1. Ensure deployed to production
2. Test payment end-to-end
3. Monitor for errors

**Announcement (Optional):**
- Tweet announcement
- Email newsletter (if you have subscribers)
- Reddit post (r/london, r/cycling, r/travel)
- Personal network (friends, colleagues)

**Keep Messages Modest:**
```
"Tour Cheetah is live! 🎉

Explore London's landmarks on a bike with audio narration. 
10 stops, offline playback, real-time bike availability.

Available on: iOS, Android, Web

Get it now: [App Store link] [Play Store link]"
```

#### First Week Post-Launch

**Daily Tasks:**
- [ ] Check error logs hourly (Sentry)
- [ ] Monitor app store reviews (respond to any negative reviews)
- [ ] Monitor payment success rate (Stripe Dashboard)
- [ ] Check support email (respond within 24 hours)
- [ ] Track sign-ups and payments (Google Analytics)

**Metrics to Monitor:**
- Daily Active Users (DAU)
- Payment conversion rate (% of signups that pay)
- Average Revenue Per User (ARPU)
- Subscription churn rate (% of subscribers who cancel)
- App crash rate
- Support tickets

**Common Post-Launch Issues (Have Responses Ready):**
- Payment declined: "Check your card details and try again. Contact support if issues persist."
- Geolocation not working: "Grant location permission in Settings."
- Audio not playing: "Check volume. Ensure you have an active subscription."
- App crashes: "Update to latest version. Clear cache if needed."

#### First Month

**Weekly Review:**
- Revenue
- User growth
- Churn rate
- Top issues from support
- Feature requests

**Iterate on v1.1:**
- Fix any bugs discovered post-launch
- Improve audio quality (LumenVox if budget allows)
- Add social sharing
- Improve onboarding based on user feedback

**Deliverable:** Tour Cheetah live on iOS, Android, and web with paying customers

---

## What NOT to Do (Common Pitfalls)

❌ **Don't skip the backend.** You need auth and payments infrastructure first.

❌ **Don't launch with broken payments.** Test thoroughly with real cards (in test mode first).

❌ **Don't submit to app stores without testing on real devices.** Simulators hide many issues.

❌ **Don't ignore app store rejections.** They usually have valid reasons. Fix and resubmit.

❌ **Don't over-engineer.** v1.0 doesn't need 100 features. Ship v1.0 with 80% features, iterate with users.

❌ **Don't launch without monitoring.** Set up error logging and analytics before go-live.

❌ **Don't delay post-launch.** If Apple/Google take time reviewing, start Android while waiting for iOS.

---

## Success Metrics

### Week 1
- ✅ 100+ sign-ups
- ✅ 30%+ of sign-ups convert to paying customers
- ✅ <1% payment failure rate
- ✅ Zero critical crashes

### Week 2-4
- ✅ 500+ total users
- ✅ 40%+ paying customer ratio
- ✅ 4.0+ star rating on both app stores
- ✅ <2% churn rate

### Month 1
- ✅ $2,000+ MRR (monthly recurring revenue)
- ✅ 1,000+ monthly active users
- ✅ <3% bug-related support tickets

---

## Post-Launch Roadmap (Weeks 5+)

**v1.1 Features:**
- [ ] LumenVox professional voice-overs
- [ ] User profiles & progress tracking
- [ ] Favorite stops
- [ ] Social sharing (Twitter, Facebook)
- [ ] Apple Watch app
- [ ] Widget (home screen/lock screen)
- [ ] Notifications (new tours, special offers)

**Marketing:**
- [ ] Blog posts about London landmarks
- [ ] YouTube video walkthrough
- [ ] Paid ads (Google, Instagram)
- [ ] Partnership with Santander Cycles
- [ ] Press outreach to travel magazines

**Monetization:**
- [ ] Add second tour (South London, Westminster Extension, etc.)
- [ ] Guided tour version (live guide option)
- [ ] Corporate gifts/team building
- [ ] API for other tour companies

---

## Budget Breakdown

**One-Time Costs:**
- Apple Developer Account: $99
- Google Play Developer Account: $25
- Domain name: $10-15 (first year)
- **Total: ~$140**

**Monthly Costs (estimated):**
- Hosting (Railway/Heroku): $5-20/month
- Database (if not included): $0 (free tier)
- Stripe payment processing: 2.2% + $0.30 per transaction
- SendGrid/email: $0 (free tier for <5k/month)
- Sentry error monitoring: $0 (free tier)
- Google Analytics: $0 (free)
- **Total: ~$10-30/month**

**Total cost to launch: ~$150-200** (just infrastructure)
**Total cost with professional services: $1,000-5,000+** (if you hire help)

---

## Timeline Summary

```
Week 1 (May 27-Jun 2)   → Backend + Auth + Payment Infrastructure
Week 2 (Jun 3-Jun 9)    → iOS + Android apps building in parallel
Week 3 (Jun 10-Jun 16)  → Testing + Submission to App Stores
Week 4 (Jun 17+)        → Launch + Monitor

Target Launch: June 16-17 (end of Week 3, but apps may not be approved yet)
Realistic Launch: June 19-24 (early Week 4, after app store reviews)
```

---

## Resources & Links

**Development:**
- Capacitor docs: https://capacitorjs.com/docs
- Stripe integration: https://stripe.com/docs/payments
- React Router: https://reactrouter.com/

**App Store:**
- Apple App Store guidelines: https://developer.apple.com/app-store/review/guidelines/
- Google Play policies: https://play.google.com/about/developer-content-policy/
- Apple Developer program: https://developer.apple.com/enroll/
- Google Play Console: https://play.google.com/console/

**Hosting & Services:**
- Vercel: https://vercel.com/
- Railway: https://railway.app/
- Stripe: https://stripe.com/
- SendGrid: https://sendgrid.com/

**Support:**
- Capacitor community: https://github.com/ionic-team/capacitor
- Stack Overflow: [tag:capacitor]
- App store support: Apple Developer Forums, Google Play Console Help

---

## Final Notes

This is an aggressive timeline. You'll likely encounter:
- App store rejections (normal, resubmit within 24 hours)
- Payment processing bugs (test early, test often)
- Device-specific issues (test on real devices)
- Unexpected blockers (plan for 1-2 week buffer)

**Key to success:**
1. **Start with infrastructure first** (don't build frontend before backend exists)
2. **Test payments early** (on test mode, then live mode)
3. **Test on real devices** (simulators hide issues)
4. **Ship v1.0 with 80% features** (iterate post-launch)
5. **Monitor and respond quickly** (first 48 hours are critical)

Good luck! You've got this. 🚀

---

**Document Version:** 1.0  
**Created:** May 27, 2026  
**Target Launch:** June 16-17, 2026
