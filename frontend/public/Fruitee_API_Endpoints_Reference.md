# Fruitee - API Endpoints Reference

**Backend Base URL:** `http://18.135.75.87:8000`
**Swagger Docs:** `http://18.135.75.87:8000/docs`
**Auth:** OAuth2 Bearer Token (all endpoints except Auth require `Authorization: Bearer <access_token>`)
**Response Format:** `{ "success": true/false, "data": {...} }` or `{ "success": false, "error": "..." }`

---

## 1. AUTHENTICATION

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| POST | `/api/v1/auth/register/business` | SignInPage (Sign Up - Business) | Register a business user |
| POST | `/api/v1/auth/register/influencer` | SignInPage (Sign Up - Influencer) | Register an influencer user |
| POST | `/api/v1/auth/login` | SignInPage (Sign In) | Login with email/password |
| POST | `/api/v1/auth/login/oauth2` | SignInPage (OAuth2) | OAuth2 login flow |
| POST | `/api/v1/auth/refresh` | Global (token refresh) | Refresh access token |
| POST | `/api/v1/auth/logout` | Layout (Log Out button) | Logout and invalidate token |
| POST | `/api/v1/auth/password/forgot` | Settings / Future | Request password reset email |
| POST | `/api/v1/auth/password/reset` | Settings / Future | Reset password with token |

### Schemas

**RegisterSchema (Request)**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**LoginSchema (Request)**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**TokenSchema (Response)**
```json
{
  "id": "integer",
  "email": "string",
  "role": "business | influencer",
  "is_active": "boolean",
  "is_profile_complete": "boolean",
  "is_clone_complete": "boolean",
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "bearer"
}
```

---

## 2. USER MANAGEMENT

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| GET | `/api/v1/users/me` | Global (load user state) | Get current user profile |
| PUT | `/api/v1/users/me` | Settings pages | Update current user name |
| DELETE | `/api/v1/users/me` | BusinessSettingsPage / InfluencerSettingsPage | Delete account |
| POST | `/api/v1/users/password/change` | Settings pages | Change password |

### Schemas

**UserResponse**
```json
{
  "id": "integer",
  "email": "string",
  "name": "string | null",
  "role": "business | influencer",
  "is_active": "boolean",
  "is_profile_complete": "boolean",
  "is_clone_complete": "boolean",
  "created_at": "datetime",
  "business_profile": "BusinessProfileResponse | null",
  "influencer_profile": "InfluencerProfileResponse | null"
}
```

**ChangePasswordRequest**
```json
{
  "old_password": "string (required)",
  "new_password": "string (required)"
}
```

---

## 3. BUSINESS PROFILE

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| PUT | `/api/v1/users/me/business-profile` | BusinessProfilePage | Update business profile |
| POST | `/api/v1/users/me/business-profile/logo` | BusinessProfilePage (logo upload) | Upload business logo (multipart) |

### Schemas

**BusinessProfileUpdate (Request)**
```json
{
  "name": "string",
  "contact_name": "string",
  "mobile": "string",
  "address": "string",
  "website": "string",
  "brand_colours": "array",
  "youtube_profile_url": "string",
  "tiktok_profile_url": "string",
  "instagram_profile_url": "string",
  "facebook_profile_url": "string",
  "linkedin_profile_url": "string"
}
```

**BusinessProfileResponse**
```json
{
  "name": "string",
  "contact_name": "string",
  "mobile": "string",
  "address": "string",
  "website": "string",
  "logo_url": "string",
  "brand_colours": "array",
  "youtube_profile_url": "string",
  "tiktok_profile_url": "string",
  "instagram_profile_url": "string",
  "facebook_profile_url": "string",
  "linkedin_profile_url": "string",
  "is_youtube_connected": "boolean",
  "youtube_username": "string",
  "is_tiktok_connected": "boolean",
  "tiktok_username": "string",
  "is_instagram_connected": "boolean",
  "instagram_username": "string"
}
```

---

## 4. BUSINESS ONBOARDING (Preferences)

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| GET | `/api/v1/businesses/onboard/questions` | BusinessPreferencesPage | Get onboarding question options |
| POST | `/api/v1/businesses/onboard` | BusinessPreferencesPage (Save) | Submit business preferences |

### Schemas

**BusinessOnboardRequest**
```json
{
  "consent_business_details": "boolean (required)",
  "understands_marketing_assistance": "boolean (required)",
  "understands_featuring_influencer": "boolean (required)",
  "understands_content_remaining_live": "boolean (required)",
  "allowed_categories": ["array of strings (required)"],
  "preferred_tones": ["array of strings (required)"],
  "brand_positioning": ["array of strings (required)"],
  "audience_type": ["array of strings (required)"],
  "understands_pausing_participation": "boolean (required)",
  "category_preferences": {"object (required)": "..."},
  "understands_automated_matching": "boolean (required)",
  "understands_shown_campaigns": "boolean (required)",
  "allowed_regions": ["array of strings (required)"]
}
```

---

## 5. BUSINESS SOCIAL MEDIA AUTH

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| GET | `/api/v1/businesses/youtube/auth-url?return_url=` | BusinessProfilePage | Get YouTube OAuth URL |
| GET | `/api/v1/businesses/youtube/auth/callback?code=&state=` | (Callback) | YouTube auth callback |
| GET | `/api/v1/businesses/tiktok/auth-url?return_url=` | BusinessProfilePage | Get TikTok OAuth URL |
| GET | `/api/v1/businesses/tiktok/auth/callback?code=&state=` | (Callback) | TikTok auth callback |
| GET | `/api/v1/businesses/instagram/auth-url?return_url=` | BusinessProfilePage | Get Instagram OAuth URL |
| GET | `/api/v1/businesses/instagram/auth/callback?code=&state=` | (Callback) | Instagram auth callback |

---

## 6. INFLUENCER PROFILE

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| PUT | `/api/v1/users/me/influencer-profile` | InfluencerProfilePage | Update influencer profile |
| POST | `/api/v1/users/me/influencer-profile/profile-image` | InfluencerProfilePage (photo upload) | Upload profile image (multipart) |

### Schemas

**InfluencerProfileUpdate (Request)**
```json
{
  "name": "string",
  "display_name": "string",
  "gender": "string",
  "age": "integer",
  "dob": "string (date)",
  "country": "string",
  "city": "string",
  "bio": "string",
  "website": "string",
  "language": "string"
}
```

**InfluencerProfileResponse**
```json
{
  "display_name": "string",
  "gender": "string",
  "age": "integer",
  "dob": "string",
  "country": "string",
  "city": "string",
  "bio": "string",
  "website": "string",
  "image_url": "string",
  "language": "string",
  "is_youtube_connected": "boolean",
  "youtube_username": "string",
  "is_tiktok_connected": "boolean",
  "tiktok_username": "string",
  "is_instagram_connected": "boolean",
  "instagram_username": "string",
  "clone_job_status": "string",
  "clone_job_progress": "number",
  "voice_job_status": "string",
  "voice_job_progress": "number",
  "avatar_video_url": "string",
  "avatar_video_job_status": "string",
  "avatar_video_job_progress": "number",
  "total_num_of_followers": "integer",
  "total_engagement_rate": "number",
  "youtube_tier": "string (nano|micro|mid|macro|mega)",
  "tiktok_tier": "string",
  "instagram_tier": "string",
  "tier_info": "object"
}
```

---

## 7. INFLUENCER ONBOARDING (Preferences)

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| GET | `/api/v1/influencers/onboard/questions` | InfluencerPreferencesPage | Get onboarding question options |
| POST | `/api/v1/influencers/onboard` | InfluencerPreferencesPage (Save) | Submit influencer preferences |

### Schemas

**InfluencerOnboardRequest**
```json
{
  "consent_name": "boolean (required)",
  "consent_likeness": "boolean (required)",
  "consent_voice": "boolean (required)",
  "consent_category_limits": "boolean (required)",
  "consent_pause_participation": "boolean (required)",
  "consent_identified_as_ai": "boolean (required)",
  "consent_remains_live": "boolean (required)",
  "allowed_categories": ["array of strings (required)"],
  "preferred_tones": ["array of strings (required)"],
  "brand_positioning": ["array of strings (required)"],
  "audience_type": ["array of strings (required)"],
  "understands_pausing_participation": "boolean (required)",
  "category_preferences": {"object (required)": "..."},
  "understands_shown_campaigns": "boolean (required)",
  "understands_automated_matching": "boolean (required)",
  "allowed_regions": ["array of strings (required)"]
}
```

---

## 8. DIGITAL TWIN (Clone & Voice)

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| POST | `/api/v1/influencers/clone/create` | CreateDigitalTwinPage (photo) | Upload photo to create avatar clone (multipart: `image_file`) |
| POST | `/api/v1/influencers/voice/create` | CreateDigitalTwinPage (voice) | Upload audio to clone voice (multipart: `audio_file`) |
| POST | `/api/v1/influencers/avatar-video/generate` | DigitalTwinProgressPage | Trigger avatar intro video generation |
| POST | `/api/v1/influencers/avatar-video/publish` | DigitalTwinIntroPage | Publish the generated intro video |

---

## 9. INFLUENCER SOCIAL MEDIA AUTH

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| GET | `/api/v1/influencers/youtube/auth-url?return_url=` | InfluencerProfilePage | Get YouTube OAuth URL |
| GET | `/api/v1/influencers/youtube/auth/callback?code=&state=` | (Callback) | YouTube auth callback |
| GET | `/api/v1/influencers/tiktok/auth-url?return_url=` | InfluencerProfilePage | Get TikTok OAuth URL |
| GET | `/api/v1/influencers/tiktok/auth/callback?code=&state=` | (Callback) | TikTok auth callback |
| GET | `/api/v1/influencers/instagram/auth-url?return_url=` | InfluencerProfilePage | Get Instagram OAuth URL |
| GET | `/api/v1/influencers/instagram/auth/callback?code=&state=` | (Callback) | Instagram auth callback |

---

## 10. INFLUENCER METRICS

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| GET | `/api/v1/influencers/metrics` | DashboardPage (Influencer) | Get overall influencer performance metrics |

### Schema

**InfluencerMetricsResponse**
```json
{
  "id": "integer",
  "total_views": "integer",
  "total_likes": "integer",
  "total_comments": "integer",
  "total_saves": "integer",
  "total_shares": "integer",
  "total_engagement_rate": "number",
  "num_of_campaigns": "integer",
  "total_revenue": "integer"
}
```

---

## 11. BRANDS (CRUD)

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| POST | `/api/v1/brands` | BrandsPage (Add Brand) | Create a new brand |
| GET | `/api/v1/brands?page=1&page_size=10` | BrandsPage (List) | List all brands (paginated) |
| GET | `/api/v1/brand/{brand_id}` | BrandSetupPage | Get single brand details |
| PUT | `/api/v1/brand/{brand_id}` | BrandSetupPage (Save) | Update brand |
| DELETE | `/api/v1/brand/{brand_id}` | BrandsPage (Delete) | Delete brand |
| POST | `/api/v1/brand/{brand_id}/logo` | BrandSetupPage (logo upload) | Upload brand logo (multipart: `image_file`) |

### Schemas

**BrandCreate (Request)**
```json
{
  "name": "string (required)",
  "description": "string",
  "mobile": "string",
  "address": "string",
  "website": "string",
  "brand_colours": "array",
  "youtube_profile_url": "string",
  "tiktok_profile_url": "string",
  "instagram_profile_url": "string",
  "facebook_profile_url": "string",
  "linkedin_profile_url": "string"
}
```

**BrandResponse**
```json
{
  "id": "integer",
  "name": "string",
  "description": "string",
  "mobile": "string",
  "address": "string",
  "website": "string",
  "logo_url": "string",
  "brand_colours": "array",
  "is_profile_complete": "boolean",
  "created_at": "datetime",
  "is_youtube_connected": "boolean",
  "is_tiktok_connected": "boolean",
  "is_instagram_connected": "boolean"
}
```

---

## 12. BRAND PREFERENCES

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| GET | `/api/v1/brand/{brand_id}/preference/questions` | BusinessPreferencesPage | Get preference question options for brand |
| POST | `/api/v1/brand/{brand_id}/preference` | BusinessPreferencesPage (Save) | Save brand preferences |

---

## 13. BRAND SOCIAL MEDIA AUTH

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| GET | `/api/v1/brand/{brand_id}/youtube/auth-url?return_url=` | BrandSetupPage | Get YouTube OAuth URL for brand |
| GET | `/api/v1/brands/youtube/auth/callback?code=&state=` | (Callback) | YouTube auth callback |
| GET | `/api/v1/brand/{brand_id}/tiktok/auth-url?return_url=` | BrandSetupPage | Get TikTok OAuth URL for brand |
| GET | `/api/v1/brands/tiktok/auth/callback?code=&state=` | (Callback) | TikTok auth callback |
| GET | `/api/v1/brand/{brand_id}/instagram/auth-url?return_url=` | BrandSetupPage | Get Instagram OAuth URL for brand |
| GET | `/api/v1/brands/instagram/auth/callback?code=&state=` | (Callback) | Instagram auth callback |

---

## 14. BRAND BIO

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| POST | `/api/v1/brand/{brand_id}/brand-bio/generate` | BrandBioPage (Generate) | Auto-generate brand bio with AI |
| GET | `/api/v1/brand/{brand_id}/brand-bio` | BrandBioPage (Load) | Get existing brand bio |
| PUT | `/api/v1/brand/{brand_id}/brand-bio` | BrandBioPage (Save) | Update brand bio manually |

### Schemas

**BrandBioUpdate (Request)**
```json
{
  "description": "string (required)",
  "visual_identity": "string (required)"
}
```

**BrandBioResponse**
```json
{
  "description": "string",
  "visual_identity": "string"
}
```

---

## 15. CAMPAIGNS (CRUD)

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| POST | `/api/v1/brand/{brand_id}/campaigns` | CampaignPage (Create) | Create a new campaign |
| GET | `/api/v1/brand/{brand_id}/campaigns?page=&page_size=` | BrandCampaignsPage | List campaigns for a brand |
| GET | `/api/v1/campaign/{campaign_id}` | CampaignTypePage (Load) | Get campaign details |
| PUT | `/api/v1/campaign/{campaign_id}` | CampaignTypePage (Save) | Update campaign |
| DELETE | `/api/v1/campaign/{campaign_id}` | BrandCampaignsPage (Delete) | Delete campaign |

### Schemas

**CampaignCreate (Request)**
```json
{
  "name": "string",
  "description": "string",
  "focus": "brand_awareness | product_launch | event_promo | promotion",
  "website": "string",
  "start_date": "string (date)",
  "products": [{"name": "str", "description": "str", "price": "str"}],
  "event": {"name": "str", "venue": "str", "ticket_prices": "str", "start_date": "str", "end_date": "str"},
  "promotions": [{"name": "str", "description": "str", "code": "str"}]
}
```

**CampaignResponse**
```json
{
  "id": "integer",
  "brand_id": "integer",
  "name": "string",
  "description": "string",
  "focus": "brand_awareness | product_launch | event_promo | promotion",
  "website": "string",
  "status": "draft | planning | active | completed | paused",
  "start_date": "string",
  "created_at": "datetime",
  "duration": "string",
  "influencer_price_gbp": "number",
  "price_gbp": "number",
  "payment_status": "unpaid | pending | paid | failed",
  "products": "array",
  "event": "object",
  "promotions": "array",
  "images": "array",
  "influencers": "array"
}
```

---

## 16. CAMPAIGN IMAGES

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| POST | `/api/v1/campaign/{campaign_id}/images/upload` | CampaignTypePage (image upload) | Upload campaign image (multipart: `image_file`) |
| DELETE | `/api/v1/campaign-image/{image_id}` | CampaignTypePage (remove image) | Delete campaign image |

---

## 17. CAMPAIGN PLAN

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| POST | `/api/v1/campaign/{campaign_id}/plan/generate` | BusinessPlanPage (Generate) | Auto-generate campaign plan with AI |
| GET | `/api/v1/campaign/{campaign_id}/plan` | BusinessPlanPage (Load) | Get campaign plan |
| PUT | `/api/v1/campaign/{campaign_id}/plan` | BusinessPlanPage (Save) | Update campaign plan manually |

### Schemas

**CampaignPlanUpdate (Request)**
```json
{
  "target_market": "string (required)",
  "target_customer": "string (required)",
  "competition_analysis": "string (required)",
  "growth_target": "string (required)"
}
```

---

## 18. INFLUENCER SELECTION & PRICING

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| GET | `/api/v1/campaign/{campaign_id}/influencers/recommend` | InfluencersPage | Get recommended influencers (with filters) |
| POST | `/api/v1/campaign/{campaign_id}/influencers/select` | InfluencersPage (Select) | Select an influencer for campaign |
| POST | `/api/v1/campaign/{campaign_id}/duration/select` | PaymentPage | Select campaign duration |
| GET | `/api/v1/campaigns/pricing-list` | PaymentPage | Get pricing tiers |

### Filter Params (query string for recommend)
```
gender, min_age, max_age, country, city, language,
min_followers, max_followers, min_engagement_rate, max_engagement_rate,
youtube_tier, tiktok_tier, instagram_tier, duration, budget
```

**SelectInfluencerRequest**
```json
{ "influencer_id": "integer (required)" }
```

**SelectCampaignDurationRequest**
```json
{ "duration": "7_days | 14_days | 30_days | 60_days | 90_days" }
```

---

## 19. CAMPAIGN PAYMENT

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| POST | `/api/v1/campaign/{campaign_id}/pay` | PaymentPage | Initiate Stripe payment for campaign |
| POST | `/api/v1/webhooks/stripe` | (Webhook - backend only) | Stripe payment webhook |

### Schema

**CampaignPaymentResponse**
```json
{
  "client_secret": "string (Stripe)",
  "payment_intent_id": "integer"
}
```

---

## 20. CONTENT PLAN & GENERATION

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| POST | `/api/v1/campaign/{campaign_id}/pre-content/plan/generate` | ContentPlanPage | Generate pre-content plan |
| GET | `/api/v1/campaign/{campaign_id}/pre-content/plan` | ContentPlanPage | Get pre-content plan |
| POST | `/api/v1/campaign/{campaign_id}/content/plan/generate` | ContentPlanPage | Generate final content plan |
| GET | `/api/v1/campaign/{campaign_id}/content/plan` | ContentPlanPage | Get final content plan |
| POST | `/api/v1/campaign/{campaign_id}/contents/generate` | ContentPlanPage | Generate all content (posts & reels) |
| POST | `/api/v1/campaign/{campaign_id}/start` | ContentPlanPage / DashboardPage | Start the campaign |

---

## 21. POSTS (CRUD & Actions)

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| GET | `/api/v1/campaign/{campaign_id}/posts?page=&page_size=` | ContentPlanPage | List campaign posts |
| GET | `/api/v1/post/{post_id}` | ContentPlanPage (detail) | Get single post |
| PUT | `/api/v1/post/{post_id}` | ContentPlanPage (edit) | Update post |
| DELETE | `/api/v1/post/{post_id}` | ContentPlanPage (delete) | Delete post |
| POST | `/api/v1/post/{post_id}/generate` | ContentPlanPage | Generate post content |
| POST | `/api/v1/post/{post_id}/publish` | ContentPlanPage | Publish post to social media |
| GET | `/api/v1/post/{post_id}/metrics` | DashboardPage | Get post metrics |
| GET | `/api/v1/post/{post_id}/metrics/refresh` | DashboardPage | Refresh post metrics |

---

## 22. REELS (CRUD & Actions)

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| GET | `/api/v1/campaign/{campaign_id}/reels?page=&page_size=` | ContentPlanPage | List campaign reels |
| GET | `/api/v1/reel/{reel_id}` | ContentPlanPage (detail) | Get single reel |
| PUT | `/api/v1/reel/{reel_id}` | ContentPlanPage (edit) | Update reel |
| DELETE | `/api/v1/reel/{reel_id}` | ContentPlanPage (delete) | Delete reel |
| POST | `/api/v1/reel/{reel_id}/generate` | ContentPlanPage | Generate reel video |
| POST | `/api/v1/reel/{reel_id}/publish` | ContentPlanPage | Publish reel to social media |
| GET | `/api/v1/reel/{reel_id}/metrics` | DashboardPage | Get reel metrics |
| GET | `/api/v1/reel/{reel_id}/metrics/refresh` | DashboardPage | Refresh reel metrics |

---

## 23. CAMPAIGN METRICS & DASHBOARD

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| GET | `/api/v1/campaign/{campaign_id}/metrics` | DashboardPage (Business) | Get campaign metrics summary |
| GET | `/api/v1/campaign/{campaign_id}/metrics-over-time` | DashboardPage (Charts) | Get campaign metrics over time |
| GET | `/api/v1/campaign/{campaign_id}/contents?page=&page_size=` | DashboardPage | List all campaign content (posts + reels) |

### Schema

**CampaignMetricsResponse**
```json
{
  "id": "integer",
  "total_views": "integer",
  "total_likes": "integer",
  "total_comments": "integer",
  "total_saves": "integer",
  "total_shares": "integer",
  "total_engagement_rate": "number",
  "posts_stats": "array",
  "reels_stats": "array"
}
```

---

## 24. INFLUENCER-SIDE CAMPAIGN VIEWS

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| GET | `/api/v1/influencers/campaigns?page=&page_size=` | DashboardPage (Influencer) | List influencer's campaigns |
| GET | `/api/v1/influencers/campaign/{campaign_id}` | (Detail) | Get campaign as influencer |
| GET | `/api/v1/influencers/campaign/{campaign_id}/plan` | (Detail) | Get campaign plan as influencer |
| GET | `/api/v1/influencers/campaign/{campaign_id}/content/plan` | (Detail) | Get content plan as influencer |
| GET | `/api/v1/influencers/campaign/{campaign_id}/posts` | (Detail) | List posts as influencer |
| GET | `/api/v1/influencers/campaign/{campaign_id}/reels` | (Detail) | List reels as influencer |
| GET | `/api/v1/influencers/campaign/{campaign_id}/contents` | (Detail) | List all content as influencer |
| GET | `/api/v1/influencers/campaign/{campaign_id}/metrics` | (Detail) | Get campaign metrics as influencer |

---

## 25. INFLUENCER SUBSCRIPTIONS

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| GET | `/api/v1/influencers/subscriptions/plan-list` | InfluencerSettingsPage | List available subscription plans |
| GET | `/api/v1/influencers/subscriptions` | InfluencerSettingsPage | Get current subscription |
| POST | `/api/v1/influencers/subscriptions` | InfluencerSettingsPage | Create subscription |
| POST | `/api/v1/influencers/subscriptions/manage` | InfluencerSettingsPage | Manage subscription (Stripe portal) |

---

## 26. VIRTUAL INFLUENCERS (Public)

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| GET | `/api/v1/virtual-influencers?page=&page_size=` | InfluencersPage | List virtual influencers for selection |
| GET | `/api/v1/virtual-influencer/{vi_id}` | InfluencersPage (detail) | Get virtual influencer details |

---

## 27. MEDIA

| Method | Endpoint | Frontend Page | Description |
|--------|----------|---------------|-------------|
| GET | `/api/v1/media/{filename}` | Global (images/videos) | Serve uploaded media files |

---

## FRONTEND PAGE -> ENDPOINT MAPPING (Quick Reference)

| Frontend Page | Endpoints Used |
|---------------|---------------|
| **SignInPage** | `POST auth/register/business`, `POST auth/register/influencer`, `POST auth/login` |
| **BusinessProfilePage** | `PUT users/me/business-profile`, `POST users/me/business-profile/logo` |
| **BusinessPreferencesPage** | `GET businesses/onboard/questions`, `POST businesses/onboard` |
| **BrandsPage** | `GET brands`, `POST brands`, `DELETE brand/{id}` |
| **BrandSetupPage** | `GET brand/{id}`, `PUT brand/{id}`, `POST brand/{id}/logo` |
| **BrandBioPage** | `GET brand/{id}/brand-bio`, `PUT brand/{id}/brand-bio`, `POST brand/{id}/brand-bio/generate` |
| **BrandCampaignsPage** | `GET brand/{id}/campaigns` |
| **CampaignPage** | `POST brand/{id}/campaigns` |
| **CampaignTypePage** | `GET campaign/{id}`, `PUT campaign/{id}`, `POST campaign/{id}/images/upload` |
| **BusinessPlanPage** | `GET campaign/{id}/plan`, `PUT campaign/{id}/plan`, `POST campaign/{id}/plan/generate` |
| **InfluencersPage** | `GET campaign/{id}/influencers/recommend`, `POST campaign/{id}/influencers/select`, `GET virtual-influencers` |
| **PaymentPage** | `GET campaigns/pricing-list`, `POST campaign/{id}/duration/select`, `POST campaign/{id}/pay` |
| **ContentPlanPage** | `GET campaign/{id}/content/plan`, `POST campaign/{id}/content/plan/generate`, `GET campaign/{id}/posts`, `GET campaign/{id}/reels` |
| **DashboardPage (Business)** | `GET campaign/{id}/metrics`, `GET campaign/{id}/metrics-over-time` |
| **InfluencerProfilePage** | `PUT users/me/influencer-profile`, `POST users/me/influencer-profile/profile-image` |
| **InfluencerPreferencesPage** | `GET influencers/onboard/questions`, `POST influencers/onboard` |
| **CreateDigitalTwinPage** | `POST influencers/clone/create`, `POST influencers/voice/create` |
| **DigitalTwinProgressPage** | `POST influencers/avatar-video/generate`, `GET users/me` (poll progress) |
| **DigitalTwinIntroPage** | `POST influencers/avatar-video/publish` |
| **DashboardPage (Influencer)** | `GET influencers/metrics`, `GET influencers/campaigns` |
| **BusinessSettingsPage** | `PUT users/me`, `POST users/password/change`, `DELETE users/me` |
| **InfluencerSettingsPage** | `PUT users/me`, `POST users/password/change`, `DELETE users/me`, `GET influencers/subscriptions` |
| **Layout (global)** | `GET users/me`, `POST auth/logout`, `POST auth/refresh` |

---

**Total Endpoints: 100+**
**Document Generated: March 24, 2026**
