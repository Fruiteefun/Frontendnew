# Fruitee - Social Media Campaign Management Platform

## Overview
Fruitee is a social media campaign management platform connecting influencers with businesses for marketing campaigns.

## Original Problem Statement
Build a web app called Fruitee - a social media campaign management platform with:
1. Influencers register, update details, create digital twins, generate intro videos
2. Businesses register, create brands, enter brand details, create campaigns, get matched with influencers, pay for campaigns, view content calendar and progress dashboard

## User Personas

### Influencers
- Content creators looking to monetize through brand partnerships
- Need to create digital twin avatars for AI-powered content
- Track their campaign performance and earnings

### Businesses
- Small to medium businesses wanting influencer marketing campaigns
- Need to create/manage brands and campaigns
- Match with relevant influencers and track ROI

## Core Requirements (Static)

### Authentication
- Email-based sign up/sign in
- Role selection: Influencer or Business

### Influencer Flow
1. Profile Setup - Personal details, location, language
2. Digital Twin Creation - Photo upload, voice recording
3. Twin Generation - Progress indicator
4. Intro Video - Share generated video
5. Dashboard - Analytics and performance tracking

### Business Flow
1. Business Profile - Company details, logo, social handles
2. Preferences - Campaign goals, target audiences (multiselect chips), content types
3. Brand Management - Create/manage multiple brands
4. Brand Setup - Assets, colors, voice/tone
5. Campaign Type - Select objective (awareness, launch, event, promotion)
6. Campaign Plan - Target market, customer profile, competitors, growth targets
7. Influencer Selection - Filter and select creators
8. Payment - Choose plan (Starter/Pro/Enterprise)
9. Content Plan - Calendar with posts/reels scheduling
10. Dashboard - Analytics and performance tracking

## What's Been Implemented

### Pages Built (15+) - Completed March 19-20, 2026
- Landing page with navigation cards
- Sign In / Sign Up with email authentication
- Influencer Profile setup
- Create Digital Twin (photo upload + voice recording UI)
- Digital Twin Progress (animated loading)
- Digital Twin Intro (video player placeholder)
- Business Profile (logo upload, forms)
- Business Preferences (multiselect chips for target audiences, campaign goals, content types)
- Brands management (add/delete brands)
- Brand Setup (asset upload, color picker)
- Campaign Type selection
- Campaign Plan (multi-competitor forms, growth targets)
- Influencer Selection (filters, search, card selection)
- Payment (pricing plans, card form)
- Content Plan (calendar with posts/reels, status indicators)
- Dashboard (4 analytics charts: Area, Line, Pie, Bar)

### Design Implementation
- Warm cream background (#FFF8F0)
- Orange-pink gradient buttons
- Outfit font for headings, DM Sans for body
- Shadcn/UI components
- Recharts for analytics
- react-dropzone for file uploads
- Framer Motion installed for animations

### Tech Stack
- Frontend: React, Tailwind CSS, Shadcn/UI
- Charts: Recharts
- Icons: Lucide React
- File Upload: react-dropzone
- Animations: Framer Motion (available)

### Verified (March 20, 2026)
- BusinessPreferencesPage multiselect chips for Target Audiences working correctly
- Removed Preferred Platforms, Monthly Budget, Campaign Frequency frames as requested

## Prioritized Backlog

### P0 - Critical (Backend Integration)
- Connect all pages to backend API endpoints (Swagger: http://18.135.75.87:8000/docs)
- User authentication with JWT tokens
- Database integration for user data

### P1 - High Priority
- Real file upload functionality
- Voice recording implementation
- AI digital twin generation integration
- Form validations across all onboarding steps

### P2 - Medium Priority
- Payment gateway integration (Stripe)
- Real-time content generation
- Social media posting automation
- Campaign analytics from real data
- Notification system

### P3 - Nice to Have
- Dark mode support
- Mobile responsive improvements
- Export analytics reports
- Team collaboration features

## Next Tasks
1. Connect to backend API at http://18.135.75.87:8000/docs
2. Implement actual authentication flow
3. Add real data fetching and state management
4. Implement file upload to storage
5. Add voice recording with Web Audio API
