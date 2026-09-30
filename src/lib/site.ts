// Site-wide identity and contact values. One place to change them.

export const SITE_URL = 'https://anglicanpath.org';
export const SITE_NAME = 'Anglican Path';

/**
 * Public contact address, shown on /about/ and /about/review/ and emitted in
 * the Organization JSON-LD. Receiving mail at it needs Cloudflare Email
 * Routing on the anglicanpath.org zone (the zone had no MX records on
 * 2026-09-30).
 */
export const CONTACT_EMAIL = 'hello@anglicanpath.org';

/** Public phone number, or null. /about/review/ offers withdrawal "by email
 *  or phone"; the number is shown only once the operator sets one. */
export const CONTACT_PHONE: string | null = null;

/**
 * Site-relative path to the organisation logo for JSON-LD, or null. Null on
 * purpose: public/favicon.svg is still the scaffold default (CHECK_060) and
 * public/og-default.png is a placeholder, so neither is a logo to publish.
 */
export const LOGO_PATH: string | null = null;
