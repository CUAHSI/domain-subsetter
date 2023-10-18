export const APP_NAME = process.env.VUE_APP_NAME || "";
export const APP_URL = process.env.VUE_APP_URL || "";
export const LOGIN_URL = process.env.VUE_APP_LOGIN_URL || "";
export const CLIENT_ID = process.env.OAUTH2_CLIENT_ID || "";

export const API_BASE = process.env.VUE_APP_API_URL || "";
export const ENDPOINTS = {
  redoc: `${API_BASE}/redoc`,
  authCuahsiAuthorize: `${API_BASE}/auth/cuahsi/authorize`,
  authCuahsiCallback: `${API_BASE}/auth/cuahsi/callback`,
  submit: `${API_BASE}/submit`,
  logs: `${API_BASE}/logs`,
  url: `${API_BASE}/url`,
  submissions: `${API_BASE}/submission`,
  authenticatedRoute: `${API_BASE}/authenticated-route`,
};
