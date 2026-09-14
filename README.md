# Kurduwadi City Portal — Marathi Premium + Admin

## नवीन बदल
- Home page आता **Main Content + Right Sidebar** layout मध्ये आहे; page वर गोंधळ कमी ठेवला आहे.
- Right sidebar मध्ये: **ताज्या बातम्या, महत्त्वाचे नंबर, शेती व कृषी, व्यवसाय/नोकरी, धार्मिक स्थळे, शाळा व शिक्षण, हॉस्पिटल व आरोग्य, बचत गट**.
- प्रत्येक category वर click केल्यावर **स्वतंत्र detail page** उघडते.
- News आणि माहितीपर **Blog/Article pages** जोडले आहेत.
- Marathi साठी **Noto Sans Devanagari + Tiro Devanagari Marathi** fonts वापरले आहेत.
- SEO-friendly title/description/keywords आणि internal links वाढवले आहेत.
- Privacy page जोडला आहे.
- Mobile responsive design सुधारले आहे.
- Supabase citizen directory/admin workflow आधीप्रमाणे उपलब्ध आहे.

## Google AdSense / कमाईबाबत
ही रचना AdSense साठी content/SEO तयार करण्यास मदत करते; **कमाई हमखास होईल असे नाही**. AdSense मंजुरीसाठी original useful content, स्पष्ट About/Contact/Privacy pages, चांगला user experience आणि Google च्या धोरणांचे पालन आवश्यक आहे.

AdSense account मंजूर झाल्यानंतर Google कडून मिळालेला ad code `<!-- AdSense... -->` comment असलेल्या जागी/Google च्या सांगण्यानुसार जोडा. Approval आधी बनावट publisher ID किंवा ad code वापरू नका.

## Supabase
`js/app.js`, `js/profile.js`, `js/directory.js`, `js/admin.js` मध्ये तुमचा Supabase URL आणि **anon key** भरा. `service_role` key frontend मध्ये कधीही ठेवू नका.

## Hosting
Vercel / Netlify / Cloudflare Pages वर `index.html` root मध्ये ठेवून deploy करा.

## Admin
`admin/index.html` वरून Supabase Auth login करून pending citizen profiles approve/reject करता येतात.

## नागरिकांकडून बातमी आणि कार्यक्रम
`submit.html` वरून कोणताही नागरिक बातमी किंवा कार्यक्रम पाठवू शकतो. Submission `pending` राहते. Admin `/admin/` मधून तपासून `approved` केल्यावरच public pages वर दिसते. Supabase मध्ये `database/schema.sql` पुन्हा Run करा.

## नवीन: 💡 Community Ideas + Image CDN
- `ideas.html` वर नागरिक कल्पना/सूचना पाठवू शकतात.
- `database/schema.sql` मध्ये `ideas` table आणि `community-images` Supabase Storage bucket setup आहे.
- Supabase Storage मधून public images CDN मार्फत serve होतात.
- Images: JPG/PNG/WebP, max 5 MB; upload path `ideas/<uuid>.<ext>` आणि `cacheControl=31536000`.
- Frontend मध्ये `service_role` key वापरू नका.
- Schema SQL Supabase SQL Editor मध्ये एकदा run करा; त्यानंतर `js/ideas.js` मध्ये project URL + anon key भरा.

## FINAL: Direct Photo + Video Upload

The Gallery submission page now accepts direct photo/video files; users do not enter media URLs.
- Photo: JPG, PNG, WEBP, GIF up to 10 MB
- Video: MP4, WebM, MOV up to 100 MB
- Upload destination: Supabase Storage bucket `community-images`
- Database table: `public.gallery_items`
- New submissions start as `pending`
- Admin can approve, reject, or delete submissions
- Only approved records are displayed by the public Gallery page

Run `database/GALLERY_DIRECT_UPLOAD_FINAL.sql` in Supabase SQL Editor to enable the Gallery table, RLS policies, Storage bucket and admin delete RPC.
See `FINAL_SUBMISSION_CHECKLIST.md` for the final submission sequence.
