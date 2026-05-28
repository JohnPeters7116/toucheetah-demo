# Tour Cheetah Launch Checklist - Quick Reference

## 🚀 START TODAY (Critical Path)

- [ ] **Apple Developer Account** — https://developer.apple.com/enroll/
  - Sign up with Apple ID
  - Complete enrollment (24-48 hours approval)
  - **Do NOT skip — this is your longest bottleneck**

- [ ] **Google Play Developer Account** — https://play.google.com/console/
  - Sign up with Google account ($25 charge)
  - Instant approval

- [ ] **Stripe Account** — https://dashboard.stripe.com/
  - Create account
  - Verify identity
  - Set up live mode (2-3 hours)

- [ ] **Domain Name** — Your choice of registrar
  - Examples: tourcheetah-london.com, tourcheetahapp.com
  - Cost: $10-15/year

- [ ] **Download Xcode** (START NOW — 12GB)
  - App Store on Mac
  - Long download, start immediately

- [ ] **Download Android Studio** (START NOW — 900MB)
  - https://developer.android.com/studio
  - Long download, start immediately

---

## Week 1: Backend Infrastructure (May 27 - Jun 2)

### Day 1-2: Foundation
- [ ] Node.js backend project created
- [ ] PostgreSQL/MongoDB database set up
- [ ] Environment variables configured
- [ ] Stripe products created (lifetime, monthly, annual)
- [ ] JWT auth structure planned

### Day 2-4: Auth System
- [ ] User registration endpoint (/api/auth/register)
- [ ] User login endpoint (/api/auth/login)
- [ ] Password hashing (bcrypt) implemented
- [ ] JWT token generation working
- [ ] Token refresh endpoint (/api/auth/refresh-token)

### Day 4-5: Payment Infrastructure
- [ ] Stripe payment intent creation (/api/payments/create-intent)
- [ ] Payment confirmation endpoint (/api/payments/confirm)
- [ ] Webhook receiver for Stripe events
- [ ] Subscription status tracking in database
- [ ] Email service configured (SendGrid/Mailgun)

### Day 5: Deploy Backend
- [ ] Backend deployed to Railway/Render/Heroku
- [ ] Environment variables set on hosting
- [ ] Database migrated to production
- [ ] API endpoints tested with Postman/curl

---

## Week 2: Frontend & Web Launch (Jun 3 - Jun 9)

### Day 1: Web App Payment Integration
- [ ] Login page created (src/pages/Login.tsx)
- [ ] Register page created (src/pages/Register.tsx)
- [ ] Pricing page created (src/pages/Pricing.tsx)
- [ ] Checkout page created (src/pages/Checkout.tsx)
- [ ] Auth context/state created
- [ ] ProtectedRoute component created

### Day 2: Gating & Access Control
- [ ] MapScreen locked behind authentication
- [ ] AudioPlayer locked behind subscription
- [ ] Free preview content (first 1-2 stops) showing to non-paying users
- [ ] "Unlock Full Tour" buttons placed
- [ ] Logout functionality working

### Day 3: Payment Flow Testing
- [ ] Login → Signup → Pricing → Payment flow works end-to-end
- [ ] Test card (4242 4242 4242 4242) processes successfully
- [ ] Failed card (4000 0000 0000 0002) shows error
- [ ] Payment confirmation email sent
- [ ] Subscription status updates in database

### Day 4-5: Deploy Web App
- [ ] Built web app (npm run build)
- [ ] Deployed to Vercel/Netlify
- [ ] Custom domain configured
- [ ] HTTPS/SSL verified
- [ ] Analytics (Google Analytics 4) configured
- [ ] Legal pages (Terms, Privacy) deployed

### Day 5: Marketing Site & Legal
- [ ] Landing page created (can be simple)
- [ ] Privacy policy page live
- [ ] Terms of service page live
- [ ] Refund policy page live
- [ ] Links to web app from marketing site working

---

## Week 2-3: Mobile Apps (Jun 4 - Jun 16)

### iOS App (Parallel with Android)

**Days 1-2: Setup**
- [ ] Capacitor installed (npm install @capacitor/core)
- [ ] iOS platform added (npx cap add ios)
- [ ] Xcode opened successfully
- [ ] App icon added (1024x1024 PNG)

**Days 2-3: Configuration**
- [ ] Bundle ID set to com.tourcheetah.london
- [ ] App name set to "Tour Cheetah"
- [ ] Geolocation permissions added to Info.plist
- [ ] Privacy descriptions added

**Days 3-4: Build & Test**
- [ ] Web app built (npm run build)
- [ ] Synced to iOS (npx cap sync ios)
- [ ] Built for simulator (Cmd+R in Xcode)
- [ ] All features tested on simulator
- [ ] Built for real iPhone via USB
- [ ] All features tested on real device

**Days 4-5: App Store Submission**
- [ ] App ID created in Apple Developer portal
- [ ] App Store Connect entry created
- [ ] Screenshots prepared (5 different screens)
- [ ] Description written
- [ ] Keywords added
- [ ] Build archived and uploaded
- [ ] Submitted for review

**Days 5-7: Review & Approval**
- [ ] Monitor App Store Connect status
- [ ] If rejected: Read feedback, fix, resubmit
- [ ] Wait for approval (24-48 hours typically)
- [ ] Once approved: Release to App Store

---

### Android App (Parallel with iOS)

**Days 1-2: Setup**
- [ ] Android Studio opened successfully
- [ ] Android platform added (npx cap add android)
- [ ] SDK/Build tools installed
- [ ] Emulator created

**Days 2-3: Configuration**
- [ ] Package name set to com.tourcheetah.london
- [ ] App name set to "Tour Cheetah"
- [ ] App icon added (512x512 PNG)
- [ ] Permissions added to AndroidManifest.xml

**Days 3-4: Build & Test**
- [ ] Web app built (npm run build)
- [ ] Synced to Android (npx cap sync android)
- [ ] Built for emulator (green Play in Android Studio)
- [ ] All features tested on emulator
- [ ] Built for real Android phone
- [ ] All features tested on real device (2+ devices ideally)

**Days 4-5: Google Play Submission**
- [ ] Signing key created (keytool command)
- [ ] Signed AAB built (Build → Generate Signed Bundle/APK)
- [ ] Google Play Console entry created
- [ ] Screenshots prepared (same as iOS)
- [ ] Description written
- [ ] Build uploaded to Play Console
- [ ] Submitted for review

**Days 5-6: Review & Approval**
- [ ] Monitor Google Play Console status
- [ ] Usually approved faster than iOS (2-24 hours)
- [ ] If rejected: Fix, resubmit
- [ ] Once approved: Release to Play Store

---

## Week 3: Testing & Final Polish (Jun 10 - Jun 16)

### Testing Checklist

**Web App:**
- [ ] Login/signup works
- [ ] Payment flow works (test card 4242)
- [ ] Subscription blocks unpaid content
- [ ] Audio plays for all stops
- [ ] Map renders correctly
- [ ] Geolocation works
- [ ] Offline mode works (disable WiFi)
- [ ] No console errors
- [ ] Loads in <3 seconds

**iOS App:**
- [ ] Launches without crash
- [ ] Geolocation permission works
- [ ] Audio plays clearly
- [ ] Lock screen controls work
- [ ] Works offline
- [ ] Payment works
- [ ] No memory leaks

**Android App:**
- [ ] Launches without crash
- [ ] Geolocation permission works
- [ ] Audio plays clearly
- [ ] Back button works correctly
- [ ] Works offline
- [ ] Payment works
- [ ] No ANR errors

### Bug Fixes
- [ ] All critical bugs fixed (crashes)
- [ ] All high-priority bugs fixed (broken features)
- [ ] Medium-priority bugs documented for v1.1
- [ ] Low-priority bugs deferred to v1.1

### Final Checks
- [ ] Stripe test mode → live mode (ready to switch)
- [ ] All environment variables correct
- [ ] Database backups configured
- [ ] Error monitoring (Sentry) set up
- [ ] Support email ready
- [ ] FAQ document prepared

---

## Week 4: Launch (Jun 17+)

### Pre-Launch (Day Before)
- [ ] All apps approved by stores (or submitted & waiting)
- [ ] Web app deployed and tested
- [ ] Payment system tested end-to-end
- [ ] Stripe live mode ready
- [ ] Legal pages live
- [ ] Monitoring/analytics ready

### Launch Day
- [ ] Switch Stripe to live mode
- [ ] Release iOS app to App Store (if approved)
- [ ] Release Android app to Google Play (if approved)
- [ ] Announce launch (Twitter, Reddit, etc.)
- [ ] Monitor error logs continuously
- [ ] Check app store reviews hourly
- [ ] Have support email ready

### First Week
- [ ] Respond to all support emails within 24 hours
- [ ] Fix any critical bugs immediately
- [ ] Monitor payment success rate
- [ ] Track sign-ups and conversion rate
- [ ] Respond to negative reviews
- [ ] Plan v1.1 improvements based on feedback

---

## 📊 Key Metrics to Track

**Ongoing:**
- [ ] Total sign-ups
- [ ] Paid conversion rate (target: 30-40%)
- [ ] Payment failure rate (target: <1%)
- [ ] Subscription churn (target: <5% monthly)
- [ ] Daily active users
- [ ] Average revenue per user
- [ ] App crash rate
- [ ] Support ticket volume

---

## ⚠️ Common Pitfalls (Avoid These!)

❌ Don't submit to app stores without testing on real devices  
❌ Don't skip the backend — you need auth & payments first  
❌ Don't launch with broken payment processing  
❌ Don't ignore app store rejections  
❌ Don't try to ship 100% of features in v1.0  
❌ Don't launch without monitoring/error logging  
❌ Don't delay post-launch iteration  
❌ Don't update code without testing first  

---

## 🎯 Success Criteria

**Week 3 Launch (Realistic):**
- ✅ Apps submitted to stores
- ✅ Web app live with payments working
- ✅ First test payments processed

**Week 4 Full Launch:**
- ✅ Both apps approved & live
- ✅ 100+ users signed up
- ✅ 30%+ converting to paid
- ✅ <1% payment failure rate
- ✅ Zero critical crashes

**First Month:**
- ✅ 500+ users
- ✅ $1,000+ MRR
- ✅ 4.0+ star rating

---

## 📞 Support Contacts & Resources

**Apple:**
- Developer Support: https://developer.apple.com/support/
- App Store Guidelines: https://developer.apple.com/app-store/review/guidelines/

**Google:**
- Google Play Support: https://support.google.com/googleplay/android-developer/
- Play Policies: https://play.google.com/about/developer-content-policy/

**Stripe:**
- Support: https://support.stripe.com/
- Docs: https://stripe.com/docs/

**Capacitor:**
- Docs: https://capacitorjs.com/docs
- GitHub: https://github.com/ionic-team/capacitor

---

## 📝 Notes Section

Use this space to track blockers, questions, decisions:

```
BLOCKERS:
- [Your blockers here]

QUESTIONS:
- [Your questions here]

DECISIONS MADE:
- [Your decisions here]

NOTES:
- [Your notes here]
```

---

**Last Updated:** May 27, 2026  
**Target Launch:** June 16-17, 2026  
**Print this and check off as you go! 🎉**
