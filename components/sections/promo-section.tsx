'use client';

import { BadgePercent } from 'lucide-react';
import { PROMO } from '@/lib/data';
import { formatBRL } from '@/lib/format';
import { FadeIn, SectionEyebrow } from './section-anim';

export function PromoSection() {
  return (
    <section id="promocoes" className="below-fold py-12 px-4 max-w-5xl mx-auto scroll-mt-16">
      <FadeIn>
        <SectionEyebrow>Oferta da casa</SectionEyebrow>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
          Para dividir sem pesar no bolso
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          Sabores selecionados por apenas {formatBRL(PROMO.price)}
        </p>
      </FadeIn>

      <FadeIn className="relative bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto">
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
          <BadgePercent className="w-3.5 h-3.5" aria-hidden />
          Promoção
        </span>
        <h3 className="text-xl font-bold mb-1">Pizzas selecionadas</h3>
        <p className="text-4xl font-bold text-primary mb-4">{formatBRL(PROMO.price)}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {PROMO.flavors.map((flavor) => (
            <div key={flavor} className="rounded-xl px-3 py-2 bg-card/80 border border-border/40 text-sm font-medium">
              {flavor}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{PROMO.deliveryNote}. Consulte a taxa da sua região no WhatsApp antes de fechar o pedido.</p>
      </FadeIn>
    </section>
  );
}
