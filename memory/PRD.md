# Fruitee - Product Requirements Document

## Original Problem Statement
A social media campaign management platform called "Fruitee" where:
1. **Influencers** register, onboard with preferences, subscribe/pay, create digital twins, and generate intro videos.
2. **Businesses** register, onboard, create brands, setup campaigns, select influencers, pay, and view a content calendar/dashboard.

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn UI + React Router
- **Backend**: FastAPI + MongoDB (not yet connected to frontend)
- **State**: localStorage mocking (to be replaced with real API)

## What's Been Implemented

### Authentication
- Sign in / Sign up with role selection (Business / Influencer)
- Forgot / Reset Password flow (modal with email → token → new password → success)

### Business Flow (Hub-and-Spoke)
1. **Business Profile** - Logo upload, Your Name (pre-populated from sign-up), Business Name, Website, Country, City, Phone, Social Media (Instagram, TikTok Shop, TikTok, YouTube)
2. **Business Preferences** - Consent checkboxes, Category (multi-select checkboxes), Preferred Content Tone (multi-select), Primary Content Pillars (multi-select), Target Audience Type (multi-select), Participation consent, Regions (UK, US, EU, India, Global - multi-select), Campaign Matching
3. **Brands Hub** - List/create/delete brands
4. **Brand Setup** - Website, Colors, Fonts, Tone of Voice
5. **Brand Bio** - Description, Visual Identity, Customer Experience
6. **Campaign Creation** - Name, Start Date
7. **Campaign Type** - Product Launch, Event Promo, Brand Awareness, Promotion
8. **Business Plan** - Market analysis, competitors, growth targets
9. **Influencer Selection** - Browse and select influencers
10. **Payment** - Campaign payment (Stripe placeholder)
11. **Content Plan** - Pre-content plan, content calendar, Generate All Content, Start Campaign
12. **Dashboard** - Metrics charts, campaign overview

### Influencer Flow (Linear, Locked Steps)
1. **Influencer Profile** - Photo upload, Display Name, Full Name, DOB (age 16+), Gender, Language, Country, City, Social handles
2. **Influencer Preferences** - Consent checkboxes, Category (multi-select), Tone, Pillars, Audience, Region
3. **Payment/Subscription** - 3 plans (Basic $9/mo, Creator $29/mo, Pro $79/mo), Stripe-style payment form, Success popup
4. **Create Digital Twin** - Photo upload, voice recording
5. **Twin Generation** - Animated progress (static for returning users)
6. **Intro Video** - Preview and publish

### Global
- Dynamic sidebar (role-aware, state-aware)
- Back buttons on all applicable screens
- Field validations (email, phone, URL, handles, dates, numeric fields)
- Settings pages (Business & Influencer)

## Prioritized Backlog

### P0 - Critical
- Connect frontend to backend REST API (replace all localStorage mocking)
- Implement real JWT authentication flow

### P1 - High
- Implement real file upload (images) and Web Audio API (voice recording)
- Connect social media OAuth flows

### P2 - Medium  
- Stripe payment integration (real)
- Influencer subscription management
- Virtual influencer browsing
- Post/Reel individual CRUD screens

### P3 - Low
- Dark mode
- Mobile responsiveness
- Exportable reports
- Campaign metrics over time charts (real data)

## Reference Documents
- `/app/frontend/public/Fruitee_API_Endpoints_Reference.md` - Complete API endpoint reference
- `/app/frontend/public/Fruitee_UI_vs_API_Gap_Analysis.md` - UI vs API gap analysis (50 issues)
- Swagger Docs: `http://18.135.75.87:8000/docs`

## Test Reports
- `/app/test_reports/iteration_1.json`
- `/app/test_reports/iteration_2.json`
- `/app/test_reports/iteration_3.json` (latest - 100% pass rate)
