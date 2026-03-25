const API_BASE = process.env.REACT_APP_BACKEND_URL;

// Token management
const getToken = () => localStorage.getItem("fruitee_access_token");
const getRefreshToken = () => localStorage.getItem("fruitee_refresh_token");

const saveTokens = (access, refresh) => {
  localStorage.setItem("fruitee_access_token", access);
  localStorage.setItem("fruitee_refresh_token", refresh);
};

const clearTokens = () => {
  localStorage.removeItem("fruitee_access_token");
  localStorage.removeItem("fruitee_refresh_token");
};

// Base fetch with auth header + auto-refresh
const apiFetch = async (path, options = {}) => {
  const token = getToken();
  const headers = { ...options.headers };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  let res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  // If 401, try token refresh
  if (res.status === 401 && getRefreshToken()) {
    const refreshRes = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: getRefreshToken() }),
    });
    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();
      if (refreshData.success) {
        saveTokens(refreshData.data.access_token, refreshData.data.refresh_token);
        headers["Authorization"] = `Bearer ${refreshData.data.access_token}`;
        res = await fetch(`${API_BASE}${path}`, { ...options, headers });
      }
    }
    if (res.status === 401) {
      clearTokens();
      window.location.href = "/signin";
      return { success: false, error: "Session expired" };
    }
  }

  try {
    const json = await res.json();
    if (!res.ok && !json.success) {
      throw new Error(json.detail || json.error || "Request failed");
    }
    return json;
  } catch (parseError) {
    // Handle cases where response body was already consumed or is not JSON
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }
    throw parseError;
  }
};

// ====== AUTH ======
export const authApi = {
  registerBusiness: async (email, password) => {
    const res = await fetch(`${API_BASE}/api/v1/auth/register/business`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    let json;
    try {
      json = await res.json();
    } catch {
      throw new Error("Registration failed");
    }
    if (!res.ok || !json.success) {
      throw new Error(json.error || json.detail || "Registration failed");
    }
    return json;
  },

  registerInfluencer: async (email, password) => {
    const res = await fetch(`${API_BASE}/api/v1/auth/register/influencer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    let json;
    try {
      json = await res.json();
    } catch {
      throw new Error("Registration failed");
    }
    if (!res.ok || !json.success) {
      throw new Error(json.error || json.detail || "Registration failed");
    }
    return json;
  },

  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    let json;
    try {
      json = await res.json();
    } catch {
      throw new Error("Invalid email or password");
    }
    if (!res.ok || !json.success) {
      throw new Error(json.error || json.detail || "Invalid email or password");
    }
    return json;
  },

  logout: () =>
    apiFetch("/api/v1/auth/logout", { method: "POST" }),

  forgotPassword: (email) =>
    apiFetch("/api/v1/auth/password/forgot", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token, newPassword) =>
    apiFetch("/api/v1/auth/password/reset", {
      method: "POST",
      body: JSON.stringify({ token, new_password: newPassword }),
    }),

  refresh: () =>
    apiFetch("/api/v1/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: getRefreshToken() }),
    }),
};

// ====== USER ======
export const userApi = {
  getMe: () => apiFetch("/api/v1/users/me"),

  updateMe: (data) =>
    apiFetch("/api/v1/users/me", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteMe: () =>
    apiFetch("/api/v1/users/me", { method: "DELETE" }),

  changePassword: (oldPassword, newPassword) =>
    apiFetch("/api/v1/users/password/change", {
      method: "POST",
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    }),
};

// ====== BUSINESS PROFILE ======
export const businessProfileApi = {
  update: (data) =>
    apiFetch("/api/v1/users/me/business-profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  uploadLogo: (file) => {
    const formData = new FormData();
    formData.append("image_file", file);
    return apiFetch("/api/v1/users/me/business-profile/logo", {
      method: "POST",
      body: formData,
    });
  },
};

// ====== BUSINESS ONBOARDING ======
export const businessOnboardApi = {
  getQuestions: () => apiFetch("/api/v1/businesses/onboard/questions"),

  submit: (data) =>
    apiFetch("/api/v1/businesses/onboard", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ====== INFLUENCER PROFILE ======
export const influencerProfileApi = {
  update: (data) =>
    apiFetch("/api/v1/users/me/influencer-profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("image_file", file);
    return apiFetch("/api/v1/users/me/influencer-profile/profile-image", {
      method: "POST",
      body: formData,
    });
  },
};

// ====== INFLUENCER ONBOARDING ======
export const influencerOnboardApi = {
  getQuestions: () => apiFetch("/api/v1/influencers/onboard/questions"),

  submit: (data) =>
    apiFetch("/api/v1/influencers/onboard", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ====== SOCIAL MEDIA OAUTH ======
export const socialAuthApi = {
  // Influencer
  influencerAuthUrl: (platform, returnUrl) =>
    apiFetch(`/api/v1/influencers/${platform}/auth-url?return_url=${encodeURIComponent(returnUrl)}`),

  // Business
  businessAuthUrl: (platform, returnUrl) =>
    apiFetch(`/api/v1/businesses/${platform}/auth-url?return_url=${encodeURIComponent(returnUrl)}`),

  // Brand
  brandAuthUrl: (brandId, platform, returnUrl) =>
    apiFetch(`/api/v1/brand/${brandId}/${platform}/auth-url?return_url=${encodeURIComponent(returnUrl)}`),
};


// ====== INFLUENCER CLONE / VOICE / VIDEO ======
export const influencerCloneApi = {
  createClone: (imageFile) => {
    const formData = new FormData();
    formData.append("image_file", imageFile);
    return apiFetch("/api/v1/influencers/clone/create", {
      method: "POST",
      body: formData,
    });
  },

  createVoice: (audioFile) => {
    const formData = new FormData();
    formData.append("audio_file", audioFile);
    return apiFetch("/api/v1/influencers/voice/create", {
      method: "POST",
      body: formData,
    });
  },

  generateAvatarVideo: () =>
    apiFetch("/api/v1/influencers/avatar-video/generate", { method: "POST" }),

  publishAvatarVideo: () =>
    apiFetch("/api/v1/influencers/avatar-video/publish", { method: "POST" }),
};

// ====== INFLUENCER METRICS ======
export const influencerMetricsApi = {
  get: () => apiFetch("/api/v1/influencers/metrics"),
  getCampaigns: (page = 1, pageSize = 10) =>
    apiFetch(`/api/v1/influencers/campaigns?page=${page}&page_size=${pageSize}`),
};

// ====== BRANDS ======
export const brandsApi = {
  list: (page = 1, pageSize = 10) =>
    apiFetch(`/api/v1/brands?page=${page}&page_size=${pageSize}`),

  create: (data) =>
    apiFetch("/api/v1/brands", { method: "POST", body: JSON.stringify(data) }),

  get: (brandId) => apiFetch(`/api/v1/brand/${brandId}`),

  update: (brandId, data) =>
    apiFetch(`/api/v1/brand/${brandId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (brandId) =>
    apiFetch(`/api/v1/brand/${brandId}`, { method: "DELETE" }),

  uploadLogo: (brandId, file) => {
    const formData = new FormData();
    formData.append("image_file", file);
    return apiFetch(`/api/v1/brand/${brandId}/logo`, {
      method: "POST",
      body: formData,
    });
  },

  // Brand Bio
  getBio: (brandId) => apiFetch(`/api/v1/brand/${brandId}/brand-bio`),
  updateBio: (brandId, data) =>
    apiFetch(`/api/v1/brand/${brandId}/brand-bio`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  generateBio: (brandId) =>
    apiFetch(`/api/v1/brand/${brandId}/brand-bio/generate`, { method: "POST" }),

  // Brand Preferences
  getPreferenceQuestions: (brandId) =>
    apiFetch(`/api/v1/brand/${brandId}/preference/questions`),
  submitPreference: (brandId, data) =>
    apiFetch(`/api/v1/brand/${brandId}/preference`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Social Auth URLs
  getYoutubeAuthUrl: (brandId, returnUrl) =>
    apiFetch(`/api/v1/brand/${brandId}/youtube/auth-url?return_url=${encodeURIComponent(returnUrl)}`),
  getTiktokAuthUrl: (brandId, returnUrl) =>
    apiFetch(`/api/v1/brand/${brandId}/tiktok/auth-url?return_url=${encodeURIComponent(returnUrl)}`),
  getInstagramAuthUrl: (brandId, returnUrl) =>
    apiFetch(`/api/v1/brand/${brandId}/instagram/auth-url?return_url=${encodeURIComponent(returnUrl)}`),
};

// ====== CAMPAIGNS ======
export const campaignsApi = {
  create: (brandId, data) =>
    apiFetch(`/api/v1/brand/${brandId}/campaigns`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  list: (brandId, page = 1, pageSize = 10) =>
    apiFetch(`/api/v1/brand/${brandId}/campaigns?page=${page}&page_size=${pageSize}`),

  get: (campaignId) => apiFetch(`/api/v1/campaign/${campaignId}`),

  update: (campaignId, data) =>
    apiFetch(`/api/v1/campaign/${campaignId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (campaignId) =>
    apiFetch(`/api/v1/campaign/${campaignId}`, { method: "DELETE" }),

  uploadImage: (campaignId, file) => {
    const formData = new FormData();
    formData.append("image_file", file);
    return apiFetch(`/api/v1/campaign/${campaignId}/images/upload`, {
      method: "POST",
      body: formData,
    });
  },

  deleteImage: (imageId) =>
    apiFetch(`/api/v1/campaign-image/${imageId}`, { method: "DELETE" }),

  // Plan
  getPlan: (campaignId) => apiFetch(`/api/v1/campaign/${campaignId}/plan`),
  updatePlan: (campaignId, data) =>
    apiFetch(`/api/v1/campaign/${campaignId}/plan`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  generatePlan: (campaignId) =>
    apiFetch(`/api/v1/campaign/${campaignId}/plan/generate`, { method: "POST" }),

  // Influencer Selection
  recommendInfluencers: (campaignId, filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiFetch(`/api/v1/campaign/${campaignId}/influencers/recommend?${params}`);
  },
  selectInfluencer: (campaignId, influencerId) =>
    apiFetch(`/api/v1/campaign/${campaignId}/influencers/select`, {
      method: "POST",
      body: JSON.stringify({ influencer_id: influencerId }),
    }),

  // Duration & Payment
  selectDuration: (campaignId, duration) =>
    apiFetch(`/api/v1/campaign/${campaignId}/duration/select`, {
      method: "POST",
      body: JSON.stringify({ duration }),
    }),
  getPricingList: () => apiFetch("/api/v1/campaigns/pricing-list"),
  pay: (campaignId) =>
    apiFetch(`/api/v1/campaign/${campaignId}/pay`, { method: "POST" }),

  // Content Plan
  getContentPlan: (campaignId) =>
    apiFetch(`/api/v1/campaign/${campaignId}/content/plan`),
  generateContentPlan: (campaignId) =>
    apiFetch(`/api/v1/campaign/${campaignId}/content/plan/generate`, { method: "POST" }),
  getPreContentPlan: (campaignId) =>
    apiFetch(`/api/v1/campaign/${campaignId}/pre-content/plan`),
  generatePreContentPlan: (campaignId) =>
    apiFetch(`/api/v1/campaign/${campaignId}/pre-content/plan/generate`, { method: "POST" }),

  // Content Generation & Start
  generateContents: (campaignId) =>
    apiFetch(`/api/v1/campaign/${campaignId}/contents/generate`, { method: "POST" }),
  start: (campaignId) =>
    apiFetch(`/api/v1/campaign/${campaignId}/start`, { method: "POST" }),

  // Posts & Reels
  getPosts: (campaignId, page = 1, pageSize = 10) =>
    apiFetch(`/api/v1/campaign/${campaignId}/posts?page=${page}&page_size=${pageSize}`),
  getReels: (campaignId, page = 1, pageSize = 10) =>
    apiFetch(`/api/v1/campaign/${campaignId}/reels?page=${page}&page_size=${pageSize}`),
  getContents: (campaignId, page = 1, pageSize = 10) =>
    apiFetch(`/api/v1/campaign/${campaignId}/contents?page=${page}&page_size=${pageSize}`),

  // Metrics
  getMetrics: (campaignId) => apiFetch(`/api/v1/campaign/${campaignId}/metrics`),
  getMetricsOverTime: (campaignId) =>
    apiFetch(`/api/v1/campaign/${campaignId}/metrics-over-time`),
};

// ====== INFLUENCER SUBSCRIPTIONS ======
export const subscriptionsApi = {
  getPlanList: () => apiFetch("/api/v1/influencers/subscriptions/plan-list"),
  get: () => apiFetch("/api/v1/influencers/subscriptions"),
  create: (data) =>
    apiFetch("/api/v1/influencers/subscriptions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  manage: () =>
    apiFetch("/api/v1/influencers/subscriptions/manage", { method: "POST" }),
};

// ====== SOCIAL AUTH (Business-level) ======
export const businessSocialApi = {
  getYoutubeAuthUrl: (returnUrl) =>
    apiFetch(`/api/v1/businesses/youtube/auth-url?return_url=${encodeURIComponent(returnUrl)}`),
  getTiktokAuthUrl: (returnUrl) =>
    apiFetch(`/api/v1/businesses/tiktok/auth-url?return_url=${encodeURIComponent(returnUrl)}`),
  getInstagramAuthUrl: (returnUrl) =>
    apiFetch(`/api/v1/businesses/instagram/auth-url?return_url=${encodeURIComponent(returnUrl)}`),
};

// ====== SOCIAL AUTH (Influencer-level) ======
export const influencerSocialApi = {
  getYoutubeAuthUrl: (returnUrl) =>
    apiFetch(`/api/v1/influencers/youtube/auth-url?return_url=${encodeURIComponent(returnUrl)}`),
  getTiktokAuthUrl: (returnUrl) =>
    apiFetch(`/api/v1/influencers/tiktok/auth-url?return_url=${encodeURIComponent(returnUrl)}`),
  getInstagramAuthUrl: (returnUrl) =>
    apiFetch(`/api/v1/influencers/instagram/auth-url?return_url=${encodeURIComponent(returnUrl)}`),
};

// Helper exports
export { getToken, saveTokens, clearTokens };
