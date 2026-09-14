# Kurduwadi City Portal — Final Submission Checklist

## Completed
- Responsive Marathi city portal pages
- Supabase frontend configuration
- News / Events / Ideas / Noticeboard submission flow
- Personality submission + admin approval RPC
- Digital Business Card + admin approve/reject RPC
- Gallery: direct Photo upload (no URL input)
- Gallery: direct Video upload (no URL input)
- Supabase Storage bucket: `community-images`
- Gallery admin: Approve / Reject / Delete
- Approved media shown on public Gallery
- SEO files: `sitemap.xml`, `robots.txt`, `site.webmanifest`
- Vercel configuration: `vercel.json`

## Supabase one-time setup
Run these SQL files in Supabase SQL Editor in this order if the project database is not already configured:
1. `database/schema.sql`
2. `database/PHASE2.sql`
3. `database/PHASE3_SECURITY.sql`
4. `database/PHASE4_FINAL.sql`
5. `database/noticeboard.sql`
6. `database/personalities.sql`
7. `database/PERSONALITY_APPROVAL_FIX.sql`
8. `database/BUSINESS_CARD_FIX.sql`
9. `database/BUSINESS_CARD_APPROVE_REJECT_FINAL.sql`
10. `database/GALLERY_DIRECT_UPLOAD_FINAL.sql`

If a table/function already exists, use the project SQL files' `create ... if not exists` / `create or replace` statements as provided and resolve only duplicate legacy objects if Supabase reports one.

## Admin setup
Create the admin user in Supabase Authentication, then add that user's UUID to `public.admin_profiles` with role `admin`.

## Final test flow
1. Open `gallery-submit.html`.
2. Select Photo → upload → submit.
3. Login to `/admin/` → Gallery Submissions → Approve.
4. Open `gallery.html` and verify the photo appears.
5. Repeat with Video.
6. Test Reject and Delete from Admin.
7. Test Digital Business Card approve/reject.
8. Test Personality approve/reject.
9. Check mobile layout and all main navigation links.

## Important
The frontend must contain only the Supabase URL and public anon/publishable key. Never add a `service_role` or secret key to frontend files.
