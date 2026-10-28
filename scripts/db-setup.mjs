// Creates the tables and seeds the starter content (only into empty tables).
// Run once: npm run db:setup   (reads DATABASE_URL from .env.local)
import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set — add it to .env.local')
  process.exit(1)
}
const sql = neon(process.env.DATABASE_URL)

await sql.query(`
  create table if not exists gallery_images (
    id serial primary key,
    url text not null,
    alt text not null default '',
    caption text,
    created_at timestamptz not null default now()
  )`)

await sql.query(`
  create table if not exists posts (
    id serial primary key,
    slug text not null unique,
    title text not null,
    date date not null default current_date,
    excerpt text not null default '',
    cover text,
    content text not null default '',
    published boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )`)

const [{ count: images }] = await sql`select count(*)::int as count from gallery_images`
if (images === 0) {
  await sql`
    insert into gallery_images (url, alt, caption, created_at) values
      ('/hero-portrait.jpg', 'Umut Arda Yılmaz kanyonda yürürken', null, now() - interval '1 minute'),
      ('/arda-2.jpg', 'Umut Arda Yılmaz kürsüde konuşma yaparken', 'Bilecik Türk Dünyası Gençlik Konseyi', now())`
  console.log('Seeded gallery_images')
}

const [{ count: posts }] = await sql`select count(*)::int as count from posts`
if (posts === 0) {
  await sql`
    insert into posts (slug, title, date, excerpt, cover, content) values
      (
        'bilecik-turk-dunyasi-genclik-konseyi',
        'Bilecik Türk Dünyası Gençlik Konseyi',
        '2026-10-20',
        'Türk Devletleri Teşkilatı Gençlik Platformu’nun Bilecik teşkilatı ve Türk dünyasına yönelik gençlik çalışmaları.',
        '/arda-2.jpg',
        ${[
          'Türk Dünyası Gençlik Konseyi, Türk Devletleri Teşkilatı’nın gençlik platformudur. Bilecik teşkilatı, üniversite gençliğini Türk dünyası ile ilgili projelerde bir araya getirmek amacıyla kuruldu.',
          'Konsey; konferanslar, paneller ve kültürel etkinlikler aracılığıyla Türk dünyası ülkeleri arasındaki gençlik iş birliğini güçlendirmeyi hedefler.',
          'Etkinlik duyuruları ve güncel çalışmalar için konseyin Instagram hesabını takip edebilirsiniz.',
        ].join('\n\n')}
      ),
      (
        'uluslararasi-iliskiler',
        'Uluslararası İlişkiler yolculuğu',
        '2026-09-15',
        'Siyaset Bilimi ve Kamu Yönetimi’nden Uluslararası İlişkiler bölümüne uzanan akademik yol.',
        '/tdgk.jpeg',
        ${[
          'Bilecik Şeyh Edebali Üniversitesi Siyaset Bilimi ve Kamu Yönetimi bölümünde başlayan lisans eğitimi, 2026 yılı itibarıyla Uluslararası İlişkiler bölümünde devam ediyor.',
          'Bu bölüm, Türk dünyasına yönelik stratejik projeleri akademik bir temele oturtmak için yeni bir bakış açısı sunuyor.',
        ].join('\n\n')}
      )`
  console.log('Seeded posts (sample content — replace it from the admin panel)')
}

console.log('Database ready')
