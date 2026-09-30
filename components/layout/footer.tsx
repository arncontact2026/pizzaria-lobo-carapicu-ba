'use client';

import { Phone, Clock, Instagram, Facebook, MessageCircle } from 'lucide-react';
import {
  PIZZERIA_NAME,
  PIZZERIA_SLOGAN,
  PIZZERIA_PHONE,
  PIZZERIA_WHATSAPP,
  PIZZERIA_INSTAGRAM,
  WHATSAPP_NUMBER,
  PAYMENT_METHODS,
} from '@/lib/data';

export function Footer() {
  const instagramUrl = `https://instagram.com/${PIZZERIA_INSTAGRAM.replace('@', '')}`;

  return (
    <footer className="bg-foreground text-background/90 mt-12">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-1">{PIZZERIA_NAME}</h3>
            <p className="text-sm text-background/70 italic mb-3">{PIZZERIA_SLOGAN}</p>
            <p className="text-sm text-background/60 leading-relaxed mb-4">
              Pizza artesanal no forno a lenha, pastel crocante e batata generosa.
              Feita para reunir a família em volta da mesa.
            </p>
            <div className="flex gap-3">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                aria-label="Instagram da Pizzaria Lobo"
              >
                <Instagram className="w-5 h-5" aria-hidden />
              </a>
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                aria-label="Facebook da Pizzaria Lobo"
              >
                <Facebook className="w-5 h-5" aria-hidden />
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Quero fazer um pedido.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                aria-label="Conversar no WhatsApp"
              >
                <MessageCircle className="w-5 h-5" aria-hidden />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3">Fale com a gente</h4>
            <address className="space-y-2 text-sm not-italic">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" aria-hidden />
                <a href={`tel:${PIZZERIA_PHONE.replace(/\D/g, '')}`} className="hover:underline">
                  {PIZZERIA_PHONE}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 flex-shrink-0" aria-hidden />
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  WhatsApp: {PIZZERIA_WHATSAPP}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Instagram className="w-4 h-4 flex-shrink-0" aria-hidden />
                <span>{PIZZERIA_INSTAGRAM}</span>
              </p>
            </address>
            <div className="mt-4">
              <h5 className="text-xs font-semibold uppercase tracking-wide text-background/50 mb-2">
                Pagamento
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {PAYMENT_METHODS.map((method) => (
                  <span key={method} className="text-xs bg-background/10 px-2 py-1 rounded-md">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" aria-hidden />
              Horários
            </h4>
            <div className="space-y-1 text-sm text-background/60">
              <p>Segunda a domingo</p>
              <p className="text-lg font-semibold text-background/90">18:00 às 00:00</p>
            </div>
            <div className="mt-4 bg-background/10 rounded-xl p-3">
              <p className="text-sm font-medium text-background/80">
                Abrimos inclusive às segundas-feiras
              </p>
              <p className="text-xs text-background/50 mt-1">
                Taxa de entrega consultada por bairro no WhatsApp.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-6 text-center text-xs text-background/40">
          <p>
            &copy; {new Date().getFullYear()} {PIZZERIA_NAME} — {PIZZERIA_SLOGAN}. Todos os
            direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
