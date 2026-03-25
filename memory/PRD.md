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

### P0 - CORS Whitelisting
- User's backend engineer is whitelisting `*.preview.emergentagent.com`
- Currently works via proxy; direct browser access needs CORS

### P1 - File Uploads
- Profile picture upload (influencer)
- Brand logo upload
- Campaign image upload
- Uses /media endpoints

### P1 - Social Media OAuth
- Instagram, TikTok, YouTube connect buttons exist in UI
- Need OAuth 2.0 flow via /auth/url and /auth/callback endpoints

### P2 - Stripe Payment
- PaymentPage and InfluencerPaymentPage exist
- Need Stripe integration

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
- `/app/frontend/public/Fruitee_UI_vs_API_Gap_Analysis.md` - Gap analysis
- `/app/frontend/public/Fruitee_API_Endpoints_Reference.md` - API reference
