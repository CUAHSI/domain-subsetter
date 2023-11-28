export const APP_NAME = import.meta.env.VITE_APP_NAME || "";
export const APP_URL = import.meta.env.VITE_APP_URL || "";
export const APP_BASE = import.meta.env.VITE_APP_BASE || "";

export const API_BASE = import.meta.env.VITE_APP_API_URL || "";
export const ENDPOINTS = {
  openapi: `${API_BASE}/openapi.json`,
  authCuahsiAuthorize: `${API_BASE}/auth/front/authorize`,
  authCuahsiCallback: `${API_BASE}/auth/front/callback`,
  authenticatedRoute: `${API_BASE}/authenticated-route`,
  userInfo: `${API_BASE}/users/me`,
  submit: `${API_BASE}/submit`,
  download: `${API_BASE}/url`,
  logs: `${API_BASE}/logs`,
  url: `${API_BASE}/url`,
  submissions: `${API_BASE}/submissions`,
  refresh: `${API_BASE}/refresh`,
};
