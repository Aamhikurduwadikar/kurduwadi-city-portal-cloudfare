# अभिमानास्पद व्यक्तिमत्त्वे Setup

Supabase SQL Editor मध्ये `database/personalities.sql` एकदा Run करा.

यामुळे `personalities` आणि `personality_submissions` tables, RLS आणि indexes तयार होतील.

नागरिक `personality-submit.html` वरून सूचना पाठवू शकतात. त्या `personality_submissions` मध्ये pending राहतील. Admin पडताळणीनंतर verified profile `personalities` मध्ये तयार करून `status='approved'` आणि `published=true` केल्यावर `personalities.html` वर दिसेल.

फोटो `community-images/personalities/...` path मध्ये जातील आणि Supabase Storage delivery वापरतील.
