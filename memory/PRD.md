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

### Business Flow (Complete - matches reference design)
1. **Business Profile** - Logo upload, Business Name, Industry, Website, Team Size, Location, Phone, Description, Social Media (Instagram, Twitter/X, TikTok, LinkedIn)
2. **Business Preferences** - 8 numbered sections: AI Consent, Categories, Restricted Categories, Content Tone, Content Pillars, Audience Type, Participation Control, Campaign Matching
3. **Brands** - Add/remove brands, brand list
4. **Brand Setup** - Website URL, Brand Logo upload, Product Images (0/3), Brand Colours (picker + hex)
5. **Campaign Type** - 4 types with expandable fields (Campaign Website, Images, Details)
6. **Campaign Plan** - Target Market (3 cols), Customer Profile, Competitors (up to 5), Growth Targets
7. **Influencer Selection** - Horizontal filter bar + 3 influencer cards with heart/stats
8. **Payment** - 3 pricing plans (Starter/Pro/Enterprise) + secure payment form
9. **Content Plan** - Calendar with posts/reels scheduling
10. **Dashboard** - 4 stat cards + 4 charts (Area, Line, Pie, Bar)
11. **Settings** - Email, password, quick links, payments, account actions

### Influencer Flow
1. Profile Setup - Personal details, location, language
2. Digital Twin Creation - Photo upload, voice recording
3. Twin Generation - Progress indicator
4. Intro Video - Share generated video
5. Dashboard - Analytics and performance tracking

## What's Been Implemented

### Pages Built (15+) - Completed March 19-21, 2026
- Landing page with navigation cards
- Sign In / Sign Up with email authentication
- All 11 Business flow pages (updated to match reference design March 21)
- All Influencer flow pages (5 pages)
- Settings pages for both personas

### Design Implementation
- Warm cream background (#FFF8F0)
- Orange-to-purple gradient buttons (Save & Continue)
- Outfit font for headings, DM Sans for body
- Shadcn/UI components with Lucide React icons
- Recharts for analytics
- Numbered section headers with orange icons
- Cancel + Save & Continue button pattern
- Sidebar navigation with active states

### Tech Stack
- Frontend: React, Tailwind CSS, Shadcn/UI
- Charts: Recharts
- Icons: Lucide React
- Animations: Framer Motion (available)

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
