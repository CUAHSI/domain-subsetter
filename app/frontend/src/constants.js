export const APP_BASE = import.meta.env.VITE_APP_BASE || "VITE_APP_BASE_PLACEHOLDER";

let APP_URL_IN = import.meta.env.VITE_APP_FULL_URL || "VITE_APP_FULL_URL_PLACEHOLDER";
export const APP_URL = APP_URL_IN.endsWith("/") ? APP_URL_IN : `${APP_URL_IN}/`

export const GIS_SERVICES_URL = import.meta.env.VITE_GIS_SERVICES_URL || "VITE_GIS_SERVICES_URL_PLACEHOLDER";

export const API_BASE = import.meta.env.VITE_APP_API_URL || "VITE_APP_API_URL_PLACEHOLDER";
export const ENDPOINTS = {
  openapi: `${API_BASE}/openapi.json`,
  authCuahsiAuthorize: `${API_BASE}/auth/front/authorize`,
  authCuahsiCallback: `${API_BASE}/auth/front/callback`,
  authenticatedRoute: `${API_BASE}/authenticated-route`,
  userInfo: `${API_BASE}/users/me`,
  submit: `${API_BASE}/submit`,
  download: `${API_BASE}/url`,
  logs: `${API_BASE}/logs`,
  argo: `${API_BASE}/argo`,
  url: `${API_BASE}/url`,
  submissions: `${API_BASE}/submissions`,
  refresh: `${API_BASE}/refresh`,
};
