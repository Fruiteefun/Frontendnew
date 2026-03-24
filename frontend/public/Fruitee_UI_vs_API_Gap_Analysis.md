# Fruitee - UI vs API Gap Analysis

**Date:** March 24, 2026
**Swagger Docs:** http://18.135.75.87:8000/docs
**Total Mismatches Found:** 40+

---

## 1. SignInPage vs RegisterSchema

| # | Issue Type | UI Field | API Field | Detail |
|---|-----------|----------|-----------|--------|
| 1 | Extra in UI | `name` (Full Name) | Not in RegisterSchema | API only takes `email` + `password`. `name` must be sent separately via `PUT /api/v1/users/me` |
| 2 | Extra in UI | `phone` | Not in RegisterSchema | No phone at user level. Only `mobile` exists in BusinessProfileUpdate. Influencer has no phone field at all |
| 3 | Extra in UI | `userType` (role dropdown) | Not in RegisterSchema | Role is determined by endpoint (`/register/business` vs `/register/influencer`), not a form field |

---

## 2. BusinessProfilePage vs BusinessProfileUpdate

| # | Issue Type | UI Field | API Field | Detail |
|---|-----------|----------|-----------|--------|
| 4 | No API match | `description` (About) | -- | API has NO description/about field in BusinessProfileUpdate |
| 5 | No API match | `tiktokShop` | -- | API has NO TikTok Shop field (only `tiktok_profile_url`) |
| 6 | Field split mismatch | `country` + `city` (separate inputs) | `address` (single string) | UI splits location into two fields, API has one combined address field |
| 7 | Format mismatch | `instagram`, `tiktok`, `linkedin` (handles: `@xxx`) | `*_profile_url` (full URLs) | API expects full profile URLs, UI collects short @handles |
| 8 | Missing in UI | -- | `contact_name` | API supports contact name, UI does not collect it |
| 9 | Missing in UI | -- | `facebook_profile_url` | API supports Facebook URL, UI removed Facebook entirely |
| 10 | Missing in UI | -- | `youtube_profile_url` | API supports YouTube URL, UI has no YouTube input |
| 11 | Missing in UI | -- | `brand_colours` | API supports it on BusinessProfile, but UI has brand colors on BrandSetupPage instead |

---

## 3. InfluencerProfilePage vs InfluencerProfileUpdate

| # | Issue Type | UI Field | API Field | Detail |
|---|-----------|----------|-----------|--------|
| 12 | Key name mismatch | `fullName` | `name` | Different key names, need mapping when sending to API |
| 13 | Missing in UI | -- | `bio` | API supports bio text, UI does not collect it |
| 14 | Missing in UI | -- | `website` | API supports website URL, UI does not collect it |
| 15 | Missing in UI | -- | `age` | API has age field (may need to be auto-calculated from DOB on frontend or backend) |
| 16 | Concept mismatch | `instagram`, `tiktok`, `youtube` (text handle inputs) | OAuth flow only | API manages social media via OAuth endpoints (auth-url + callback), NOT text fields. `InfluencerProfileUpdate` has zero social URL fields |

---

## 4. BusinessPreferencesPage vs BusinessOnboardRequest

| # | Issue Type | UI Field | API Field | Detail |
|---|-----------|----------|-----------|--------|
| 17 | Single vs Array | `selectedCategory` (single string) | `allowed_categories` (array of strings) | API expects an array, UI currently allows only single selection |
| 18 | Missing in UI entirely | -- | `allowed_regions[]` | Business preferences page has NO region selection section at all. API requires it |
| 19 | Missing in UI | -- | `category_preferences` (object) | API requires this as a key-value object. UI does not collect it |

---

## 5. InfluencerPreferencesPage vs InfluencerOnboardRequest

| # | Issue Type | UI Field | API Field | Detail |
|---|-----------|----------|-----------|--------|
| 20 | Single vs Array | `selectedRegion` (single string via radio button) | `allowed_regions[]` (array of strings) | API expects an array of regions, UI only allows single region selection |
| 21 | Missing in UI | -- | `category_preferences` (object) | API requires this as a key-value object. UI does not collect it |

---

## 6. BrandSetupPage vs BrandCreate / BrandUpdate

| # | Issue Type | UI Field | API Field | Detail |
|---|-----------|----------|-----------|--------|
| 22 | Missing in UI (CRITICAL) | -- | `name` (required for BrandCreate) | BrandCreate requires a brand name. UI has no Brand Name input field |
| 23 | Missing in UI | -- | `description` | API supports brand description, UI does not collect it |
| 24 | Missing in UI | -- | `mobile` | API supports brand phone number, UI does not have it |
| 25 | Missing in UI | -- | `address` | API supports brand address, UI does not have it |
| 26 | Missing in UI | -- | 5x social `*_profile_url` fields | API supports YouTube, TikTok, Instagram, Facebook, LinkedIn URLs. UI has none |
| 27 | No API match | `brandFonts[]` | -- | API has NO fonts field anywhere |
| 28 | No API match | `toneOfVoice` | -- | API has NO tone of voice field at brand level |
| 29 | No API match | `productImages[]` | -- | No product images at brand level in API (campaign images exist separately) |

---

## 7. BrandBioPage vs BrandBioUpdate -- MAJOR STRUCTURAL MISMATCH

| # | Issue Type | UI Field | API Field | Detail |
|---|-----------|----------|-----------|--------|
| 30 | Structural mismatch (4 fields vs 2) | `lookAndFeel` | `visual_identity` | Likely maps 1:1 |
| 31 | Structural mismatch | `voice` | Must combine into `description` | API only has `description` for all non-visual identity text |
| 32 | Structural mismatch | `personalityValues` | Must combine into `description` | Same as above |
| 33 | Structural mismatch | `customerExperience` | Must combine into `description` | Same as above |

**Suggested mapping:** `lookAndFeel` -> `visual_identity`. Combine `voice` + `personalityValues` + `customerExperience` -> `description`

---

## 8. BusinessPlanPage vs CampaignPlanUpdate -- MASSIVE STRUCTURAL MISMATCH

| # | Issue Type | UI Field | API Field | Detail |
|---|-----------|----------|-----------|--------|
| 34 | 12+ fields vs 4 | `territory`, `marketSizeValue`, `marketSizeCustomers` | `target_market` (single string) | All market fields must be serialized into one string |
| 35 | Field consolidation | `targetAge`, `targetGender`, `targetInterests`, `targetIncome`, `targetLifestyle` | `target_customer` (single string) | All demographic fields must be combined into one string |
| 36 | Field consolidation | `competitors[]` (each with 5 sub-fields: name, positioning, platforms, contentStyle, keyTactic), `advantageOverCompetitors` | `competition_analysis` (single string) | Entire competitor table must be serialized into one string |
| 37 | Field consolidation | `expectedFollowers`, `expectedLikes`, `expectedCustomers` | `growth_target` (single string) | All growth metrics must be combined into one string |

---

## 9. CampaignPage + CampaignTypePage vs CampaignCreate / CampaignUpdate

| # | Issue Type | UI Field | API Field | Detail |
|---|-----------|----------|-----------|--------|
| 38 | Missing in UI | -- | `products[]` (name, description, price) | API supports product list per campaign. UI does not collect products |
| 39 | Missing in UI | -- | `event{}` (name, venue, ticket_prices, ticket_url, event_url, start_date, end_date) | API supports full event details. UI does not collect event info |
| 40 | Missing in UI | -- | `promotions[]` (name, description, code) | API supports promotion codes. UI does not collect promotions |
| 41 | Format mismatch | `selectedType` values: `brand-awareness`, `product-launch`, `event-promo`, `promotion` | `focus` enum: `brand_awareness`, `product_launch`, `event_promo`, `promotion` | Hyphenated (UI) vs underscored (API). Needs mapping |

---

## 10. Entire Pages / Features Missing from UI

| # | API Feature | Endpoints | UI Status |
|---|------------|-----------|-----------|
| 42 | Forgot / Reset Password | `POST /api/v1/auth/password/forgot`, `POST /api/v1/auth/password/reset` | No UI screen exists |
| 43 | Influencer Subscription Management | `GET/POST /api/v1/influencers/subscriptions`, `/subscriptions/plan-list`, `/subscriptions/manage` | No UI screen exists |
| 44 | Virtual Influencer Browsing | `GET /api/v1/virtual-influencers`, `GET /api/v1/virtual-influencer/{vi_id}` | No UI screen exists |
| 45 | Post Individual Detail / Edit | `GET/PUT/DELETE /api/v1/post/{post_id}`, `POST /post/{id}/generate`, `POST /post/{id}/publish` | No detail or edit screen exists |
| 46 | Reel Individual Detail / Edit | `GET/PUT/DELETE /api/v1/reel/{reel_id}`, `POST /reel/{id}/generate`, `POST /reel/{id}/publish` | No detail or edit screen exists |
| 47 | Pre-Content Plan Generation | `POST /api/v1/campaign/{id}/pre-content/plan/generate`, `GET .../pre-content/plan` | Not wired into ContentPlanPage |
| 48 | Campaign Start Trigger | `POST /api/v1/campaign/{id}/start` | No start button or trigger in UI |
| 49 | Campaign Metrics Over Time (Charts) | `GET /api/v1/campaign/{id}/metrics-over-time` | DashboardPage uses hardcoded mock chart data |
| 50 | Influencer-side Campaign Views | `GET /api/v1/influencers/campaigns`, `.../campaign/{id}`, `.../plan`, `.../content/plan`, `.../posts`, `.../reels`, `.../contents`, `.../metrics` | No influencer campaign detail screens exist |

---

## Summary by Severity

### CRITICAL (Blocks API Integration)
- #22: BrandSetupPage missing required `name` field for BrandCreate
- #34-37: BusinessPlanPage has 12+ fields that must map to 4 API strings
- #16: Social media on InfluencerProfilePage uses text inputs but API uses OAuth flow
- #7: BusinessProfilePage social handles are @format, API expects full URLs
- #17: Business category is single-select, API expects array

### HIGH (Feature Gaps)
- #4: BusinessProfilePage "About" field has no API match
- #18: BusinessPreferencesPage missing entire Region section
- #30-33: BrandBioPage has 4 fields but API only has 2
- #38-40: CampaignTypePage missing products, events, promotions
- #42-50: Nine entire features/pages have no UI

### MEDIUM (Data Mapping)
- #1-3: SignInPage collects extra fields not in RegisterSchema
- #6: Country+City vs single address field
- #12: fullName vs name key mapping
- #15: age field missing (auto-calculate from DOB?)
- #20: Influencer region is single-select, API expects array
- #41: Campaign type format mismatch (hyphens vs underscores)

### LOW (Nice-to-Have)
- #8-10: Missing optional social URLs in BusinessProfilePage
- #13-14: Missing bio and website in InfluencerProfilePage
- #23-26: Missing optional fields in BrandSetupPage
- #27-29: UI fields with no API equivalent (fonts, tone, product images)

---

**Document Generated:** March 24, 2026
**Total Issues:** 50
