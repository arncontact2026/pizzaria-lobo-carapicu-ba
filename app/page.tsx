'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
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
function ModalFallback() {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" aria-hidden>
      <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-white animate-spin" />
    </div>
  );
}
const CartDrawer = dynamic(
  () => import('@/components/cart/cart-drawer').then((m) => m.CartDrawer),
  { ssr: false, loading: ModalFallback },
);
const CheckoutModal = dynamic(
  () => import('@/components/checkout/checkout-modal').then((m) => m.CheckoutModal),
  { ssr: false, loading: ModalFallback },
);

export default function Home() {
  // Pré-aquece o áudio no primeiro toque em qualquer lugar da página,
  // para nenhum botão pagar o custo de criá-lo.
  useEffect(() => {
    const warm = () => {
      import('@/lib/sound').then((m) => m.warmAudio()).catch(() => undefined);
    };
    window.addEventListener('pointerdown', warm, { once: true, passive: true, capture: true });
    return () => window.removeEventListener('pointerdown', warm, { capture: true });
  }, []);

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
