# Personality module fix

- Admin panel now calls `approve_personality_submission()` when clicking **मंजूर करा**.
- `personalities.js` now matches the live schema used by the project (`photo_url`, `position`, `reference_url`) and does not require a nonexistent `published` column.
- Personality photo upload is standardized to the `community-images` Supabase bucket.

Important: the SQL RPC `public.approve_personality_submission(submission_id bigint)` must already exist in Supabase. It was created during setup.
