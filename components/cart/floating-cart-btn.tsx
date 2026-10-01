'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatBRL } from '@/lib/format';
import { playClick } from '@/lib/sound';

export function FloatingCartButton() {
  const { getItemCount, setCartOpen, getSubtotal } = useCart();
  const count = getItemCount();
  const subtotal = getSubtotal();

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-4 left-3 right-3 sm:bottom-6 sm:left-4 sm:right-4 z-30 md:hidden"
        >
          <button
            type="button"
            onClick={() => { playClick(); setCartOpen(true); }}
            aria-label={`Ver sacola com ${count} itens, total ${formatBRL(subtotal)}`}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-2xl flex items-center justify-between px-5 shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" aria-hidden />
              <span className="text-sm">Ver sacola</span>
              <span className="bg-primary-foreground/20 text-xs px-2 py-0.5 rounded-full" aria-hidden>
                {count > 99 ? '99+' : count}
              </span>
            </span>
            <span className="text-base font-semibold">{formatBRL(subtotal)}</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
