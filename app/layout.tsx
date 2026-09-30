import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://pizzarialobo.com'),
  title: {
    default: 'Pizzaria Lobo — Forno a Lenha | Cardápio e Pedidos',
    template: '%s | Pizzaria Lobo',
  },
  description:
    'Pizzaria Lobo — Deus é Fiel. Pizza artesanal no forno a lenha, pastéis e batatas. Monte seu pedido e finalize pelo WhatsApp.',
  manifest: '/manifest.json',
  themeColor: '#B43C1E',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
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
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Pizzaria Lobo',
  },
  robots: {
    index: true,
    follow: true,
  },
};

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
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
