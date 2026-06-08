import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Umut Arda Yılmaz',
  description:
    'Bilecik Şeyh Edebali Üniversitesi Siyaset Bilimi ve Kamu Yönetimi bölümünde başladığı lisans eğitimini, 2026 yılı itibarıyla Uluslararası İlişkiler bölümünde sürdürmektedir. Türk Devletleri Teşkilatı Gençlik Platformu olan Türk Dünyası Gençlik Konseyi Bilecik Teşkilatı’nın Kurucu Onursal Başkanı olan Yılmaz; Türk dünyasına yönelik stratejik projeler yürütmektedir.',


}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${playfair.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
