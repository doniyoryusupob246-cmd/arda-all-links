import type { ComponentType, SVGProps } from 'react'
import {
  InstagramIcon,
  LinkedinIcon,
  TelegramIcon,
  WhatsappIcon,
} from '@/components/brand-icons'
import { Mail } from 'lucide-react'

export type SocialLink = {
  label: string
  href: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

export type Business = {
  id: string
  name: string
  website?: string
  instagram?: string
  logo: string
  /** Background image swapped in when this section is in view */
  background: string
}

export const profile = {
  name: 'Umut Arda Yılmaz',
  bio: 'Bilecik Şeyh Edebali Üniversitesi Siyaset Bilimi ve Kamu Yönetimi bölümünde başladığı lisans eğitimini, 2026 yılı itibarıyla Uluslararası İlişkiler bölümünde sürdürmektedir. Türk Devletleri Teşkilatı Gençlik Platformu olan Türk Dünyası Gençlik Konseyi Bilecik Teşkilatı’nın Kurucu Onursal Başkanı olan Yılmaz; Türk dünyasına yönelik stratejik projeler yürütmektedir.',
  avatar: '/avatar.png',
}

export const socials: SocialLink[] = [
  { label: 'Email', href: 'mailto:umuttardaylmazz@gmail.com', icon: Mail },
  { label: 'Telegram', href: 'https://t.me/UMUTT_ARDA', icon: TelegramIcon },
  { label: 'Instagram', href: 'https://www.instagram.com/umuttarda_81?igsh=MXBobTEwbWlqYXUwaQ==', icon: InstagramIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/umut-arda-yilmaz-45b39b377?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', icon: LinkedinIcon },
]

// Swap these placeholder image paths with your own personal photos later.
export const heroBackground = '/hero-portrait.jpg'

export const businesses: Business[] = [
  {
    id: 'arda-timber',
    name: 'ARDA LUXURY',
    website: 'https://arda-luxury.com',
    instagram: 'https://www.instagram.com/ardaluxury?igsh=emJydGo1ZXRzdXd3',
    background: '/bg-timber.png',
    logo: '/adra-luxury.jpeg',
  },
  {
    id: 'tengria-akademi',
    name: 'TENGRIA',
    instagram: 'https://www.instagram.com/tengriaofficial?igsh=emJydGo1ZXRzdXd3',
    background: '/bg-akademi.png',
    logo: '/tengria.jpeg',
  },
  {
    id: 'tdkg',
    name: 'BİLECİK TÜRK DÜNYASI GENÇLİK KONSEYİ',
    instagram: 'https://www.instagram.com/bilecik_tdgk/',
    website: 'https://bseu-tdgk.org.tr',
    background: '/bg-akademi.png',
    logo: '/tdgk.jpeg',
  },

]

// Full ordered list of backgrounds used by the scroll-bound crossfade.
export const backgrounds: string[] = [
  heroBackground,
  ...businesses.map((b) => b.background),
]
