# Supabase + CDN Setup — आम्ही Kurduwadikar

## 1) Database
Supabase Dashboard → SQL Editor → `database/schema.sql` पूर्ण SQL एकदा Run करा.

## 2) Admin
Authentication → Users मध्ये admin email/password user तयार करा.
नंतर SQL Editor मध्ये:
`insert into public.admin_profiles (id, role) values ('ADMIN_AUTH_USER_UUID', 'admin');`
UUID बदला.

## 3) Frontend configuration
फक्त `js/config.js` उघडा आणि हे दोन values भरा:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` (publishable/anon key)

**service_role/secret key frontend मध्ये कधीही ठेवू नका.**

## 4) Storage + CDN
`schema.sql` `community-images` नावाचा public bucket तयार करते. फोटो folders:
- `ideas/`
- `news/`
- `events/`

Upload करताना 5 MB limit आणि JPG/PNG/WebP validation आहे. `cacheControl=31536000` वापरले आहे आणि Supabase Storage public URL edge/CDN delivery साठी वापरला जातो.

## 5) Run locally
Static website असल्याने project folder मध्ये VS Code Live Server वापरू शकता.

## 6) Vercel
GitHub repository import करा किंवा Vercel मध्ये project deploy करा. Supabase frontend values `js/config.js` मध्ये configure केल्यावर site live करता येईल.
