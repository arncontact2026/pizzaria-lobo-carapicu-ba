'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { PIZZERIA_NAME } from '@/lib/data';
import Image from 'next/image';

const NAV_ITEMS = [
  { label: 'Início', href: '#hero-banner' },
  { label: 'Cardápio', href: '#cardapio' },
  { label: 'Promoção', href: '#promocoes' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Localização', href: '#localizacao' },
  { label: 'Avaliações', href: '#avaliacoes' },
];

export function Header() {
  const { getItemCount, setCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const count = getItemCount();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled || menuOpen ? 'bg-card/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#hero-banner" className="flex items-center gap-2" aria-label="Pizzaria Lobo — voltar ao início">
          <Image
            src="/logo.png"
            alt="Logotipo da Pizzaria Lobo"
            width={44}
            height={44}
            className="object-contain w-10 h-10 sm:w-11 sm:h-11"
            priority
          />
          <span className={`font-bold text-base sm:text-lg ${scrolled || menuOpen ? 'text-foreground' : 'text-white'}`}>
            {PIZZERIA_NAME}
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Navegação principal">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                scrolled ? 'text-foreground/70' : 'text-white/80'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={count > 0 ? `Abrir pedido com ${count} itens` : 'Abrir pedido'}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              scrolled || menuOpen ? 'bg-secondary hover:bg-secondary/80' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <ShoppingCart
              className={`w-5 h-5 ${scrolled || menuOpen ? 'text-foreground' : 'text-white'}`}
              aria-hidden
            />
            {count > 0 && (
              <span
                className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[11px] font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center"
                aria-hidden
              >
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            className={`md:hidden w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              scrolled || menuOpen ? 'bg-secondary' : 'bg-white/10 text-white'
            }`}
          >
            {menuOpen ? <X className="w-5 h-5" aria-hidden /> : <Menu className="w-5 h-5" aria-hidden />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-card border-t border-border overflow-hidden"
          >
            <nav className="px-4 py-3 space-y-1" aria-label="Navegação móvel">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
