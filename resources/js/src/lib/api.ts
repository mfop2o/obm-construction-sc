import axios from 'axios'

/* ============================================================================
   api — shared HTTP client for the Laravel backend.
   Uses same-origin Sanctum session auth: cookies are sent automatically and
   axios forwards the XSRF-TOKEN cookie as the X-XSRF-TOKEN header on every
   request, so no CSRF token bookkeeping is needed in components.
   ========================================================================== */

export const http = axios.create({
  baseURL: '/',
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
})

http.interceptors.request.use((config) => {
  const locale = localStorage.getItem('obm-locale') || 'en'
  config.headers['X-Locale'] = locale
  return config
})

