# Fruitee - UI vs API Gap Analysis (Updated)

**Date:** March 24, 2026 (Post-fixes)
**Swagger Docs:** http://18.135.75.87:8000/docs
**Previous Analysis:** 50 issues identified
**This Analysis:** 35 remaining issues (15 resolved)

---

## RESOLVED ISSUES (From Previous Analysis)

| # | Page | What Was Fixed |
|---|------|----------------|
| R1 | BusinessProfilePage | "About" field removed (had no API match) |
| R2 | BusinessProfilePage | `contactName` (Your Name) added — maps to API `contact_name` |
| R3 | BusinessProfilePage | YouTube handle added — maps to API `youtube_profile_url` |
| R4 | BusinessPreferencesPage | Categories changed to multi-select array — now matches API `allowed_categories[]` |
| R5 | BusinessPreferencesPage | Regions section added (UK, US, EU, India, Global) — maps to API `allowed_regions[]` |
| R6 | BrandBioPage | Fields restructured to Description + Visual Identity + Customer Experience — now matches API `description` + `visual_identity` |
| R7 | SignInPage | Forgot/Reset Password flow added — maps to API `/auth/password/forgot` + `/auth/password/reset` |
| R8 | InfluencerPaymentPage | New subscription/payment page added — maps to API `/influencers/subscriptions` |
| R9 | ContentPlanPage | "Start Campaign" button added — maps to API `POST /campaign/{id}/start` |
| R10-R15 | Multiple pages | Back buttons added to all applicable screens |

---

## REMAINING ISSUES

### 1. SignInPage vs Auth API

| # | Issue Type | UI Field | API Field | Detail | Severity |
|---|-----------|----------|-----------|--------|----------|
| 1 | Extra in UI | `name` (Full Name) | Not in `RegisterSchema` | API only takes `email` + `password`. Name must be sent separately via `PUT /api/v1/users/me` after registration | MEDIUM |
| 2 | Extra in UI | `phone` | Not in `RegisterSchema` | No phone at user level. Only `mobile` in BusinessProfileUpdate. Influencers have no phone field in API | MEDIUM |
| 3 | Extra in UI | `userType` (role dropdown) | Not in `RegisterSchema` | Role is determined by which register endpoint you call (`/register/business` vs `/register/influencer`), not a form field | LOW (just routing logic) |

---

### 2. BusinessProfilePage vs BusinessProfileUpdate

| # | Issue Type | UI Field | API Field | Detail | Severity |
|---|-----------|----------|-----------|--------|----------|
| 4 | No API match | `tiktokShop` | -- | API has NO TikTok Shop field (only `tiktok_profile_url`) | HIGH |
| 5 | Leftover state | `twitter` (in formData state) | -- | Dead field in state, no UI input renders for it. Should be cleaned up | LOW |
| 6 | Field split mismatch | `country` + `city` (separate) | `address` (single string) | UI splits location into two, API has one combined field. Need to concatenate on submit | MEDIUM |
| 7 | Format mismatch | `instagram`, `tiktok`, `youtube` (handles: `@xxx`) | `*_profile_url` (full URLs) | API expects full profile URLs, UI collects @handles. Need URL transformation on submit | HIGH |
| 8 | Missing in UI | -- | `facebook_profile_url` | API supports Facebook URL, UI doesn't have it | LOW |
| 9 | Misplaced | -- | `brand_colours` | API has it on BusinessProfile, but UI has brand colors on BrandSetupPage. Will need mapping decision | MEDIUM |

---

### 3. InfluencerProfilePage vs InfluencerProfileUpdate

| # | Issue Type | UI Field | API Field | Detail | Severity |
|---|-----------|----------|-----------|--------|----------|
| 10 | Key name mismatch | `fullName` | `name` | Different key names, need mapping when sending to API | LOW (easy mapping) |
| 11 | Missing in UI | -- | `bio` | API supports bio text, UI doesn't collect it | MEDIUM |
| 12 | Missing in UI | -- | `website` | API supports personal website URL, UI doesn't collect it | LOW |
| 13 | Auto-calculate needed | -- | `age` | API has age field. Should auto-calculate from `dateOfBirth` on submit | LOW |
| 14 | Concept mismatch | `instagram`, `tiktok`, `youtube` (text handles) | OAuth flow only | API manages social media via OAuth (auth-url + callback), NOT text fields. `InfluencerProfileUpdate` has zero social URL fields. Text handles serve no API purpose — social connections must go through OAuth | HIGH |

---

### 4. BusinessPreferencesPage vs BusinessOnboardRequest

| # | Issue Type | UI Field | API Field | Detail | Severity |
|---|-----------|----------|-----------|--------|----------|
| 15 | Missing in UI | -- | `category_preferences` (object) | API requires this as a key-value object mapping categories to preference levels. UI doesn't collect it | MEDIUM |

---

### 5. InfluencerPreferencesPage vs InfluencerOnboardRequest

| # | Issue Type | UI Field | API Field | Detail | Severity |
|---|-----------|----------|-----------|--------|----------|
| 16 | Single vs Array | `selectedRegion` (single string) | `allowed_regions[]` (array) | Influencer region is still single-select radio button. API expects array. Should change to multi-select like Business | MEDIUM |
| 17 | Missing in UI | -- | `category_preferences` (object) | Same as Business — API requires it, UI doesn't collect it | MEDIUM |

---

### 6. BrandSetupPage vs BrandCreate / BrandUpdate

| # | Issue Type | UI Field | API Field | Detail | Severity |
|---|-----------|----------|-----------|--------|----------|
| 18 | Missing in UI (CRITICAL) | -- | `name` (required) | BrandCreate API **requires** a brand name. UI has no Brand Name input on BrandSetupPage | CRITICAL |
| 19 | Missing in UI | -- | `description` | API supports brand description, UI doesn't collect it | MEDIUM |
| 20 | Missing in UI | -- | `mobile` | API supports brand phone, UI doesn't have it | LOW |
| 21 | Missing in UI | -- | `address` | API supports brand address, UI doesn't have it | LOW |
| 22 | Missing in UI | -- | 5x social `*_profile_url` fields | API supports YouTube, TikTok, Instagram, Facebook, LinkedIn URLs. UI has none | MEDIUM |
| 23 | No API match | `brandFonts[]` | -- | API has NO fonts field | LOW (UI-only feature) |
| 24 | No API match | `toneOfVoice` | -- | API has NO tone of voice field at brand level | LOW (UI-only feature) |
| 25 | No API match | `productImages[]` | -- | No product images at brand level in API | LOW (UI-only feature) |

---

### 7. BrandBioPage vs BrandBioUpdate

| # | Issue Type | UI Field | API Field | Detail | Severity |
|---|-----------|----------|-----------|--------|----------|
| 26 | 3 fields vs 2 | `description`, `visualIdentity`, `customerExperience` | `description`, `visual_identity` | UI has 3 fields, API has 2. `customerExperience` needs to be appended to `description` on submit | MEDIUM |

---

### 8. BusinessPlanPage vs CampaignPlanUpdate — MAJOR STRUCTURAL MISMATCH

| # | Issue Type | UI Field | API Field | Detail | Severity |
|---|-----------|----------|-----------|--------|----------|
| 27 | 12+ fields vs 4 | `territory`, `marketSizeValue`, `marketSizeCustomers` | `target_market` (string) | All market fields must be serialized into one string | HIGH |
| 28 | Field consolidation | `targetAge`, `targetGender`, `targetInterests`, `targetIncome`, `targetLifestyle` | `target_customer` (string) | All demographics must be combined into one string | HIGH |
| 29 | Field consolidation | `competitors[5 sub-fields each]`, `advantageOverCompetitors` | `competition_analysis` (string) | Competitor table must be serialized into one string | HIGH |
| 30 | Field consolidation | `expectedFollowers`, `expectedLikes`, `expectedCustomers` | `growth_target` (string) | All growth metrics must be combined into one string | HIGH |

---

### 9. CampaignPage + CampaignTypePage vs CampaignCreate / CampaignUpdate

| # | Issue Type | UI Field | API Field | Detail | Severity |
|---|-----------|----------|-----------|--------|----------|
| 31 | Missing in UI | -- | `products[]` (name, desc, price) | API supports product list per campaign. UI doesn't collect it | MEDIUM |
| 32 | Missing in UI | -- | `event{}` (name, venue, dates, tickets) | API supports event details. UI doesn't collect it | MEDIUM |
| 33 | Missing in UI | -- | `promotions[]` (name, desc, code) | API supports promo codes. UI doesn't collect it | MEDIUM |
| 34 | Format mismatch | `selectedType`: `brand-awareness` | `focus`: `brand_awareness` | Hyphen vs underscore. Easy mapping on submit | LOW |

---

### 10. Pages / Features Still Missing from UI

| # | API Feature | Endpoints | Severity |
|---|------------|-----------|----------|
| 35 | Virtual Influencer Browsing | `GET /virtual-influencers`, `GET /virtual-influencer/{id}` | MEDIUM |

---

## SUMMARY BY SEVERITY

| Severity | Count | Details |
|----------|-------|---------|
| **CRITICAL** | 1 | BrandSetupPage missing required `name` field (#18) |
| **HIGH** | 6 | TikTok Shop no API match (#4), social handle format mismatch (#7), Influencer social via OAuth not text (#14), BusinessPlan 12-to-4 field mapping (#27-30) |
| **MEDIUM** | 13 | Field mappings, missing optional fields, category_preferences, region single-vs-array, BrandBio 3-vs-2, campaign products/events/promos |
| **LOW** | 11 | Easy key mappings, dead state fields, UI-only features, role routing |

---

## WHAT CHANGED SINCE LAST ANALYSIS

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Total Issues | 50 | 35 | -15 resolved |
| Critical | 5 | 1 | -4 |
| High | 10 | 6 | -4 |
| Medium | 7 | 13 | +6 (reclassified from previous "Missing entire page/feature") |
| Low | 8 | 11 | +3 (reclassified) |
| Missing Pages/Features | 9 | 1 | -8 (Forgot Password, Subscriptions, Start Campaign etc. added) |

---

**Document Generated:** March 24, 2026
