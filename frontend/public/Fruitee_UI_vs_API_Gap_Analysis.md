# Fruitee - UI vs API Gap Analysis (v3 - Post All Fixes)

**Date:** March 25, 2026
**Swagger Docs:** http://18.135.75.87:8000/docs
**Previous Analyses:** v1 (50 issues) -> v2 (35 issues) -> v3 (this document)

---

## RESOLVED IN THIS ROUND

| # | Page | What Was Fixed |
|---|------|----------------|
| R1 | BusinessProfilePage | Social media handles replaced with OAuth connect buttons (Instagram, TikTok Shop, TikTok, YouTube) — now matches API OAuth flow |
| R2 | InfluencerProfilePage | Social media handles replaced with OAuth connect buttons (Instagram, TikTok, YouTube, TikTok Shop) — now matches API OAuth flow |
| R3 | BrandSetupPage | "Connect Social Media Accounts" section added with 4 buttons — now maps to API social auth endpoints |
| R4 | InfluencerPreferencesPage | Region changed to multi-select with square checkboxes — now matches API `allowed_regions[]` array |
| R5 | CampaignTypePage | Products sub-form added for product-launch (name, description, price) — now matches API `products[]` |
| R6 | CampaignTypePage | Events sub-form added for event-promo (name, venue, dates, tickets) — now matches API `event{}` |
| R7 | CampaignTypePage | Promotions sub-form added for promotion (name, description, code) — now matches API `promotions[]` |
| R8 | SignInPage | "Phone" renamed to "Mobile" — better aligns with API `mobile` field |
| R9 | BrandSetupPage | Brand name confirmed present on BrandsPage (not BrandSetupPage) — resolves the CRITICAL issue |
| R10 | BusinessPreferencesPage / InfluencerPreferencesPage | "Categories You Wish to Participate In" confirmed as mapping to API `category_preferences` |

---

## CUMULATIVE RESOLUTION TRACKER

| Round | Issues Found | Resolved | Remaining |
|-------|-------------|----------|-----------|
| v1 (Initial) | 50 | — | 50 |
| v2 (Post round 1 fixes) | — | 15 | 35 |
| v3 (Post round 2 fixes) | — | 16 | 19 |

---

## REMAINING ISSUES (19)

### HIGH (4)

| # | Page | UI Field | API Field | Detail |
|---|------|----------|-----------|--------|
| 1 | BusinessProfilePage | `tiktokShop` button | -- | API has NO TikTok Shop field. `tiktok_profile_url` exists but is for TikTok, not TikTok Shop. Backend may need a new field or TikTok Shop maps to an existing one |
| 2 | BusinessPlanPage | `territory`, `marketSizeValue`, `marketSizeCustomers` | `target_market` (single string) | 3 UI fields must be serialized into one API string |
| 3 | BusinessPlanPage | `targetAge`, `targetGender`, `targetInterests`, `targetIncome`, `targetLifestyle` | `target_customer` (single string) | 5 UI fields must be serialized into one API string |
| 4 | BusinessPlanPage | `competitors[]` (5 sub-fields each), `advantageOverCompetitors`, `expectedFollowers`, `expectedLikes`, `expectedCustomers` | `competition_analysis` + `growth_target` (2 strings) | All competitor/growth data must be serialized into 2 API strings |

---

### MEDIUM (8)

| # | Page | UI Field | API Field | Detail |
|---|------|----------|-----------|--------|
| 5 | SignInPage | `name` (Full Name) | Not in `RegisterSchema` | Must be sent separately via `PUT /api/v1/users/me` after registration |
| 6 | SignInPage | `phone` (Mobile) | Not in `RegisterSchema` | Must be sent to business profile `mobile` or stored separately. Influencer API has no phone field |
| 7 | BusinessProfilePage | `country` + `city` | `address` (single string) | Must concatenate on submit: `"${city}, ${country}"` |
| 8 | InfluencerProfilePage | -- | `bio` | API supports bio text, UI doesn't collect it |
| 9 | BrandBioPage | `description`, `visualIdentity`, `customerExperience` (3 fields) | `description`, `visual_identity` (2 fields) | `customerExperience` must be appended to `description` on submit |
| 10 | BrandSetupPage | -- | `description` | API supports brand description, UI doesn't collect it. User confirmed not needed |
| 11 | CampaignTypePage | `selectedType` format: `brand-awareness` | `focus` format: `brand_awareness` | Hyphen vs underscore — needs string transform on submit |
| 12 | -- | -- | Virtual Influencer Browsing | `GET /virtual-influencers` endpoint has no UI page |

---

### LOW (7)

| # | Page | UI Field | API Field | Detail |
|---|------|----------|-----------|--------|
| 13 | SignInPage | `userType` dropdown | -- | Role determined by endpoint, not form field. Just routing logic needed |
| 14 | BusinessProfilePage | Dead `twitter` field in formData state | -- | Leftover state variable, no UI renders it. Cleanup needed |
| 15 | BusinessProfilePage | -- | `facebook_profile_url` | API supports Facebook, UI doesn't have it (by design) |
| 16 | InfluencerProfilePage | `fullName` | `name` | Key rename on submit: `fullName` -> `name` |
| 17 | InfluencerProfilePage | -- | `website` | API supports personal website, UI doesn't collect it |
| 18 | InfluencerProfilePage | -- | `age` | Auto-calculate from `dateOfBirth` on submit |
| 19 | BrandSetupPage | `brandFonts[]`, `toneOfVoice`, `productImages[]` | -- | UI-only fields with no API equivalent. Will be ignored during integration or backend needs new fields |

---

## SUMMARY BY SEVERITY

| Severity | Count | Key Items |
|----------|-------|-----------|
| **CRITICAL** | 0 | All critical issues resolved |
| **HIGH** | 4 | TikTok Shop no API field, BusinessPlanPage 12-to-4 field serialization |
| **MEDIUM** | 8 | Post-registration name/phone flow, address concatenation, bio missing, BrandBio 3-to-2, Virtual Influencers page |
| **LOW** | 7 | Key renames, dead state cleanup, UI-only features, auto-calculations |
| **TOTAL** | **19** | |

---

## PROGRESS OVER TIME

| Metric | v1 | v2 | v3 (Now) |
|--------|----|----|----------|
| Total Remaining | 50 | 35 | **19** |
| Critical | 5 | 1 | **0** |
| High | 10 | 6 | **4** |
| Medium | 7 | 13 | **8** |
| Low | 8 | 11 | **7** |
| Missing Pages | 9 | 1 | **1** |
| Resolution Rate | -- | 30% | **62%** |

---

## NOTES

- **Issue 1 (TikTok Shop)**: Requires backend decision — either add a `tiktok_shop_profile_url` field to the API, or map TikTok Shop OAuth to existing `tiktok_profile_url`.
- **Issues 2-4 (BusinessPlanPage)**: The largest remaining structural mismatch. When integrating, the frontend must serialize 12+ granular fields into 4 free-text API strings. Consider using structured JSON strings.
- **Issue 10**: User confirmed brand description is NOT needed.
- **Issue 15**: Facebook was intentionally removed from UI.

**Document Generated:** March 25, 2026
