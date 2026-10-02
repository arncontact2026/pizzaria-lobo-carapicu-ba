'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2, CupSoda } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { getItemPrice } from '@/lib/cart-context';
import { DELIVERY_FEE_TEXT } from '@/lib/data';
import { encodeImageSrc, formatBRL } from '@/lib/format';
import { forceUnlockScroll } from '@/lib/scroll-lock';
import { ModalShell } from '@/components/modal/modal-shell';

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setCartOpen,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTotal,
    getItemCount,
    setCheckoutOpen,
  } = useCart();
  const [suggestDismissed, setSuggestDismissed] = useState(false);
  const closeCart = useCallback(() => setCartOpen(false), [setCartOpen]);

  const subtotal = getSubtotal();
  const total = getTotal();
  const count = getItemCount();

  // Sugestão de bebida: aparece quando há comida na sacola e nenhuma bebida ainda.
  const hasFood = items.some((item) => item.product.category !== 'bebidas');
  const hasDrink = items.some((item) => item.product.category === 'bebidas');
  const showDrinkSuggest = hasFood && !hasDrink && !suggestDismissed;

  // Permite dispensar e ver a sugestão de novo ao reabrir a sacola.
  useEffect(() => {
    if (!isCartOpen) setSuggestDismissed(false);
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <ModalShell key="cart-drawer" label="Sacola de pedidos" variant="drawer" onClose={closeCart}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" aria-hidden />
                <h2 className="text-base sm:text-lg font-bold">Sua sacola</h2>
                <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
                  {count} {count === 1 ? 'item' : 'itens'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Fechar sacola"
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/70"
              >
                <X className="w-4 h-4" aria-hidden />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              {items.length === 0 ? (
                <div className="text-center py-14">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" aria-hidden />
                  <p className="font-semibold">Sua sacola está vazia</p>
                  <p className="text-sm text-muted-foreground mt-1 mb-5">
                    Que tal começar por uma calabresa no forno a lenha?
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCartOpen(false);
                      window.setTimeout(() => {
                        document.getElementById('cardapio')?.scrollIntoView({ behavior: 'auto' });
                      }, 120);
                    }}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Ver o cardápio
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => {
                    const unitPrice = getItemPrice(item);
                    const extras = item.extras ?? [];
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="flex gap-3 p-3 bg-secondary/50 rounded-xl mb-3"
                      >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-background flex-shrink-0">
                        <Image
                          src={encodeImageSrc(item.product.image)}
                          alt={item.product.name}
                          fill
                          sizes="64px"
                          loading="lazy"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-sm leading-snug">{item.product.name}</h4>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remover ${item.product.name} da sacola`}
                            className="text-muted-foreground hover:text-destructive p-1 -m-1"
                          >
                            <Trash2 className="w-4 h-4" aria-hidden />
                          </button>
                        </div>
                        {item.size && <p className="text-xs text-muted-foreground">{item.size.name}</p>}
                        {item.crust && <p className="text-xs text-muted-foreground">Borda: {item.crust.name}</p>}
                        {extras.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Adicionais: {extras.map((e) => e.name).join(', ')}
                          </p>
                        )}
                        {(item.observations ?? '') && (
                          <p className="text-xs text-muted-foreground italic line-clamp-1">
                            Obs.: {item.observations}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-sm text-primary">
                            {formatBRL(unitPrice * item.quantity)}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label={`Diminuir quantidade de ${item.product.name}`}
                              className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center hover:bg-secondary"
                            >
                              <Minus className="w-3 h-3" aria-hidden />
                            </button>
                            <span className="text-sm font-semibold w-5 text-center" aria-live="polite">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= 20}
                              aria-label={`Aumentar quantidade de ${item.product.name}`}
                              className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-40"
                            >
                              <Plus className="w-3 h-3" aria-hidden />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            {/* Sugestão de bebida */}
            {showDrinkSuggest && (
              <div className="mt-4 flex items-center gap-2 rounded-2xl border border-primary/25 bg-primary/[0.04] p-3">
                <CupSoda className="w-5 h-5 text-primary flex-shrink-0" aria-hidden />
                <button
                  type="button"
                  onClick={() => {
                    // Fecha a sacola e navega no mesmo gesto: sem timers que
                    // possam dessincronizar a saída do overlay.
                    setCartOpen(false);
                    forceUnlockScroll();
                    window.dispatchEvent(
                      new CustomEvent('lobo:show-category', { detail: 'bebidas' }),
                    );
                  }}
                  className="flex-1 text-left"
                >
                  <span className="block text-sm font-bold leading-snug">
                    Gostaria de alguma bebida?
                  </span>
                  <span className="block text-xs text-primary font-semibold mt-0.5">
                    Ver bebidas geladas
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setSuggestDismissed(true)}
                  aria-label="Dispensar sugestão de bebidas"
                  className="text-muted-foreground hover:text-foreground p-1.5 -m-1"
                >
                  <X className="w-4 h-4" aria-hidden />
                </button>
              </div>
            )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 sm:p-5 border-t space-y-3 bg-card">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatBRL(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de entrega</span>
                  <span className="font-semibold text-xs">{DELIVERY_FEE_TEXT}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">{formatBRL(total)}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  A taxa de entrega é confirmada no WhatsApp, conforme seu bairro.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCartOpen(false);
                    setCheckoutOpen(true);
                  }}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  Continuar para entrega e pagamento
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </button>
              </div>
            )}
        </ModalShell>
      )}
    </AnimatePresence>
  );
}
