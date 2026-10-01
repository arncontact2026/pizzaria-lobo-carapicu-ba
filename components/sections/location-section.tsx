'use client';

import { MapPin, Navigation } from 'lucide-react';
import { PIZZERIA_ADDRESS_FULL, PIZZERIA_MAPS_EMBED_URL, PIZZERIA_MAPS_LINK_URL, PIZZERIA_MAPS_ROUTE_URL } from '@/lib/data';
import { FadeIn, SectionEyebrow } from './section-anim';

export function LocationSection() {
  return (
    <section id="localizacao" aria-label="Onde estamos" className="below-fold py-12 px-4 max-w-5xl mx-auto scroll-mt-16">
      <FadeIn>
        <SectionEyebrow>Onde estamos</SectionEyebrow>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
          Passe para buscar ou peça em casa
        </h2>
        <p className="text-muted-foreground text-center mb-8 flex items-center justify-center gap-1.5 text-sm md:text-base">
          <MapPin className="w-4 h-4 text-primary flex-shrink-0" aria-hidden />
          {PIZZERIA_ADDRESS_FULL}
        </p>
      </FadeIn>

      <FadeIn className="overflow-hidden rounded-2xl border border-border/50 bg-card">
        <iframe
          title="Mapa da Pizzaria Lobo em Carapicuíba"
          src={PIZZERIA_MAPS_EMBED_URL}
          className="w-full h-[300px] md:h-[360px] border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <div className="flex flex-col sm:flex-row gap-2 p-4">
          <a
            href={PIZZERIA_MAPS_ROUTE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
          >
            <Navigation className="w-4 h-4" aria-hidden />
            Como chegar
          </a>
          <a
            href={PIZZERIA_MAPS_LINK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 border border-border bg-card hover:border-primary/50 font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
          >
            <MapPin className="w-4 h-4 text-primary" aria-hidden />
            Abrir no Google Maps
          </a>
        </div>
      </FadeIn>
    </section>
  );
}
