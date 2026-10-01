import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const SITE_URL = 'https://pizzarialobo.com';
const SITE_TITLE = 'Pizzaria Lobo em Carapicuíba — Pizza no Forno a Lenha | Peça pelo WhatsApp';
const SITE_DESCRIPTION =
  'Pizzaria Lobo em Carapicuíba — Deus é Fiel. Pizzas artesanais assadas no forno a lenha, pastéis crocantes, batatas e bebidas. Monte seu pedido no cardápio online e finalize pelo WhatsApp. Aberta todos os dias, das 18h à meia-noite.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | Pizzaria Lobo',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'pizzaria',
    'pizzaria em carapicuíba',
    'pizza em carapicuíba',
    'pizza forno a lenha',
    'delivery de pizza',
    'cardápio de pizza online',
    'pedir pizza pelo whatsapp',
    'pastel',
    'pizza doce',
  ],
  authors: [{ name: 'Pizzaria Lobo' }],
  creator: 'Pizzaria Lobo',
  manifest: '/manifest.json',
  themeColor: '#B43C1E',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  alternates: {
    canonical: SITE_URL,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pizzaria Lobo',
  },
  openGraph: {
    title: 'Pizzaria Lobo — Forno a Lenha',
    description:
      'Pizza artesanal no forno a lenha, com ingredientes selecionados. Monte seu pedido e finalize pelo WhatsApp.',
    url: SITE_URL,
    siteName: 'Pizzaria Lobo',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/banner pizza 1.webp',
        width: 1376,
        height: 768,
        alt: 'Pizza artesanal saindo do forno a lenha da Pizzaria Lobo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pizzaria Lobo — Forno a Lenha',
    description:
      'Monte seu pedido no cardápio online e finalize pelo WhatsApp. Aberta todos os dias, das 18h à meia-noite.',
    images: ['/banner pizza 1.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

function RestaurantJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Pizzaria Lobo',
    slogan: 'Deus é Fiel',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    servesCuisine: ['Pizzaria', 'Brasileira'],
    priceRange: 'R$ 6 - R$ 65',
    telephone: '+55-11-4202-7760',
    hasMenu: `${SITE_URL}/#cardapio`,
    hasMap: 'https://www.google.com/maps/search/?api=1&query=Rafard%202010%20casa%2040%2C%20Carapicu%C3%ADba%2C%20SP%2C%2006390-240',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rafard, 2010 - casa 40',
      addressLocality: 'Carapicuíba',
      addressRegion: 'SP',
      postalCode: '06390-240',
      addressCountry: 'BR',
    },
    areaServed: {
      '@type': 'City',
      name: 'Carapicuíba',
    },
    acceptsReservations: false,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '18:00',
        closes: '23:59',
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://wa.me" />
        <RestaurantJsonLd />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
