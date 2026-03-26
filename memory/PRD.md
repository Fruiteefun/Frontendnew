# Fruitee - Product Requirements Document

## Original Problem Statement
Build "Fruitee," a social media campaign management platform with:
- **Business flow**: Register → Business Profile → Preferences → Brand Setup → Brand Bio → Campaigns → Campaign Type → Business Plan → Influencer Browsing
- **Influencer flow**: Register → Influencer Profile → Preferences → Payment Setup → Dashboard
- Backend API is external (FastAPI at http://18.135.75.87:8000), frontend is React.

## Architecture
- **Frontend**: React + React Router + Tailwind CSS + Shadcn UI
- **Backend**: Local FastAPI acts as a HTTPS→HTTP reverse proxy to external API
- **External API**: FastAPI at http://18.135.75.87:8000 (Swagger docs at /docs)
- **Auth**: JWT tokens stored in localStorage, managed via AuthContext
- **API Layer**: Centralized `api.js` → proxy at same domain → external backend

## What's Been Implemented

### Phase 1: UI Build (Complete)
- All pages built with mock data: SignIn/SignUp, Business Profile, Influencer Profile, Business/Influencer Preferences, Brands, Brand Setup, Brand Bio, Brand Campaigns, Campaign, Campaign Type, Business Plan, Dashboard, Influencer Payment
- Shadcn UI components, form validation, responsive layouts

### Phase 2: Backend Integration (Complete - March 25, 2026)
- **Reverse Proxy**: Local FastAPI proxies `/api/v1/*` to external backend, solving HTTPS→HTTP mixed content
- **Auth Flow**: SignIn/SignUp connected to `/auth/register/{type}` and `/auth/login`
- **AuthContext**: Global state for user, tokens, login/register/logout/refreshUser
- **Pages connected to live API**:
  - InfluencerProfilePage → GET/PUT /users/me, PUT /users/me/influencer-profile
  - BusinessProfilePage → GET/PUT /users/me, PUT /users/me/business-profile  
  - BusinessPreferencesPage → POST /businesses/onboard
  - InfluencerPreferencesPage → POST /influencers/onboard
  - BrandsPage → GET/POST /brands, DELETE /brand/{id}
  - BrandSetupPage → GET/PUT /brand/{id}, POST /brand/{id}/logo
  - BrandBioPage → GET/PUT /brand/{id}/brand-bio
  - BrandCampaignsPage → GET /brands, GET /brand/{id}/campaigns
  - CampaignPage → POST /brand/{id}/campaigns
  - CampaignTypePage → PUT /campaign/{id} (with focus enum mapping)
  - BusinessPlanPage → PUT /campaign/{id}/plan (12+ UI fields → 4 API strings serialization)
- **Validation**: Required field validation on preferences pages
- **Gap Analysis fixes**: Gender enum mapping, bio field added, BrandBio 3→2 field concatenation, BusinessPlan serialization

### Testing
- Backend: 23/23 API tests passed (100%)
- Frontend: 90% functional
- Test file: /app/backend/tests/test_fruitee_api.py

## Pending/Upcoming (P0-P2)

### P0 - CORS Whitelisting (Complete - March 25, 2026)
- Backend engineer whitelisted `*.preview.emergentagent.com`
- Direct browser access and proxy both work

### P1 - File Uploads (Complete - March 25, 2026)
- All 4 upload endpoints verified working through proxy:
  - Influencer profile image: POST /users/me/influencer-profile/profile-image
  - Business logo: POST /users/me/business-profile/logo
  - Brand logo: POST /brand/{id}/logo
  - Campaign images: POST /campaign/{id}/images/upload
- Fixed image_url field name bug on InfluencerProfilePage
- All pages store File objects and pass to FormData correctly

### Remaining Mock Pages Connected to Backend (Complete - March 26, 2026)
- DashboardPage: Loads real metrics from `influencerMetricsApi.get()` and campaigns from `getCampaigns()`. Shows proper empty states.
- ContentPlanPage: Loads from `campaignsApi.getContentPlan()`, has Generate button calling `generateContentPlan()` and Start Campaign button.
- InfluencersPage: Loads from `campaignsApi.recommendInfluencers()` with filter UI and selection/API submission.
- CampaignPage: Loads existing campaign via `campaignsApi.get()` for edit mode, supports both create and update.
- PaymentPage: Uses `campaignsApi.selectDuration()` before Stripe checkout, with proper price display.

### Page Data Fetching Audit & Fixes (Complete - March 26, 2026)
- InfluencerSettingsPage: Loads real email from `/users/me`, removed mock payments/invoices, fixed quick links
- BusinessSettingsPage: Loads real email from `/users/me`, removed mock invoices
- BusinessPreferencesPage: Loads saved preferences from `/businesses/onboard/questions` on revisit
- CreateDigitalTwinPage: Connected to `influencerCloneApi.createClone()` + `createVoice()` + `generateAvatarVideo()`
- DigitalTwinProgressPage: Polls `userApi.getMe()` for real `clone_job_status`, `voice_job_status`, `avatar_video_job_status`
- DigitalTwinIntroPage: Loads `avatar_video_url` from profile, uses `publishAvatarVideo()` API

### Error Handling Improvements (Complete - March 26, 2026)
- Fixed auth error messages: registration and login now show user-friendly errors instead of raw API/network errors
- Status-code-based fallback in api.js for when response body can't be parsed
- friendlyError helper in SignInPage.jsx maps common patterns to plain English

### Earnings Preview Page (Complete - March 26, 2026)
- New page `/earnings-preview` inserted between Influencer Preferences and Payment
- Fetches tiered pricing from `GET /campaigns/pricing-list` API
- Shows 6 tiers (Nano → Celebrity) with per-platform (Instagram/TikTok/YouTube) pricing
- Highlights user's current tier based on follower count
- Flow: Preferences → Earnings Preview → Payment

### P1 - Social Media OAuth
- Instagram, TikTok, YouTube connect buttons exist in UI
- Need OAuth 2.0 flow via /auth/url and /auth/callback endpoints

### Stripe Payment Integration (Complete - March 25, 2026)
- **Influencer subscription**: £2.99 + £0.60 VAT = £3.59/mo via Stripe Checkout
- **Business campaign payment**: 3 durations (1 Week £59.99, 1 Month £179.99, 3 Months £419.99 inc. VAT)
- Backend endpoints: checkout creation, status polling, webhook handler, campaign prices API
- Using Stripe test key (sandbox mode)

### Email OTP Verification (Partial - March 25, 2026)
- OTP screen added to sign-up flow for both business and influencer roles
- Currently MOCKED with hardcoded OTP: 123456
- Full Resend email integration planned for later

### P2 - Additional Features  
- Virtual Influencer Browsing page
- Dark mode
- Mobile responsiveness improvements
- Exportable reports

## Refactoring Needed
- Remove obsolete localStorage items (fruitee_influencer_progress, fruitee_brands, fruitee_campaigns_*)
- Use is_profile_complete / is_clone_complete flags from user object for progress tracking

## Key Files
- `/app/frontend/src/lib/api.js` - Central API service layer
- `/app/frontend/src/contexts/AuthContext.jsx` - Auth state management
- `/app/backend/server.py` - Reverse proxy + local API
- `/app/frontend/src/pages/EarningsPreviewPage.jsx` - Tiered earnings display
- `/app/frontend/public/Fruitee_UI_vs_API_Gap_Analysis.md` - Gap analysis
- `/app/frontend/public/Fruitee_API_Endpoints_Reference.md` - API reference
