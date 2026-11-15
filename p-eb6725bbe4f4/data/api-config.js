/* MENAFoods data adapter — configuration.
   PUBLIC PREVIEW: mode stays 'sample' (browser-only sample data, nothing leaves the device).
   'live' is for a future build that talks to the Catalyst gateway (Development first):
     baseUrl  = Catalyst app domain, e.g. https://<project>-<id>.development.catalystserverless.com
     prefix   = '/server/mf_zoho_gateway/v1'
   No API keys, tokens, org ids or secrets ever go in this file or anywhere in the front end.
   The browser only holds the httpOnly session cookie that the gateway sets after OTP login. */
window.MF_API_CONFIG = {
  mode: 'sample',          // 'sample' | 'live'
  baseUrl: '',             // set only in a live build; empty = same origin
  prefix: '/server/mf_zoho_gateway/v1',
  erpPrefix: '/server/mf_erp_connector/v1',
  timeoutMs: 15000
};
