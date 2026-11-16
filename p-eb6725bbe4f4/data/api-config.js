/* MENAFoods data adapter — configuration.
   PUBLIC PREVIEW (GitHub Pages): always 'sample' (browser-only sample data, nothing leaves the device).
   LIVE: only when this same site is served by the Catalyst preview host, which also serves the gateway
   on the same origin (prefix '/server/mf_zoho_gateway/v1'), so there is no CORS and no key.
   No API keys, tokens, org ids or secrets ever go in this file or anywhere in the front end.
   The browser only holds the httpOnly session cookie that the gateway sets after OTP login. */
window.MF_API_CONFIG = {
  mode: 'auto',            // 'auto' = live only on the Catalyst preview host or with ?mode=live; otherwise sample
  baseUrl: '',             // always same-origin (relative); never put a Catalyst URL here
  prefix: '/server/mf_zoho_gateway/v1',
  erpPrefix: '/server/mf_erp_connector/v1',
  timeoutMs: 15000
};
