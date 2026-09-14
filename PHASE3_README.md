# Phase 3 — Search, Sharing, SEO, Security & Deployment

## Included
- Global Supabase-backed search
- Share / copy-link / print controls
- QR code on Digital Business Cards
- robots.txt + sitemap.xml template
- Vercel security headers
- Google Analytics loader (disabled until GA_MEASUREMENT_ID is set)
- Security SQL
- Admin Phase 2 sections hidden until authenticated

## Before production
1. Deploy to Vercel.
2. Replace `YOUR-DOMAIN` in `robots.txt` and `sitemap.xml`.
3. Put your Google Analytics Measurement ID (`G-...`) in `js/config.js`.
4. Add the deployed domain to Google Search Console and submit `/sitemap.xml`.
5. For AdSense, apply only after the site has substantial original content and required legal/contact pages; add the publisher code only after approval.
