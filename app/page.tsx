'use client';

import dynamic from 'next/dynamic';
import { CartProvider } from '@/lib/cart-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { HighlightsSection } from '@/components/home/highlights-section';
import { MenuSection } from '@/components/menu/menu-section';
import {
  PromoSection,
  AboutSection,
  HoursSection,
  LocationSection,
  ReviewsSection,
} from '@/components/sections/info-sections';
import { FloatingCartButton } from '@/components/cart/floating-cart-btn';
import { ServiceWorkerRegistration } from '@/components/pwa/register';

// Modais pesados carregam só quando abertos — alivia o primeiro carregamento.
const CartDrawer = dynamic(
  () => import('@/components/cart/cart-drawer').then((m) => m.CartDrawer),
  { ssr: false },
);
const CheckoutModal = dynamic(
  () => import('@/components/checkout/checkout-modal').then((m) => m.CheckoutModal),
  { ssr: false },
);

export default function Home() {
  return (
    <CartProvider>
      <ServiceWorkerRegistration />
      <Header />
      <main>
        <HeroSection />
        <HighlightsSection />
        <MenuSection />
        <PromoSection />
        <AboutSection />
        <HoursSection />
        <LocationSection />
        <ReviewsSection />
      </main>
      <Footer />
      <FloatingCartButton />
      <CartDrawer />
      <CheckoutModal />
    </CartProvider>
  );
}
