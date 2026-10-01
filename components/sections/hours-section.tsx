'use client';

import { useState, useEffect } from 'react';
import { Clock, Truck, CreditCard } from 'lucide-react';
import { HOURS, DELIVERY_FEE_TEXT, PAYMENT_METHODS } from '@/lib/data';
import { PaymentBrandBadges } from './payment-brands';
import { FadeIn } from './section-anim';

export function HoursSection() {
  const days = [
    { day: 'Segunda', hours: HOURS.mon },
    { day: 'Terça', hours: HOURS.tue },
    { day: 'Quarta', hours: HOURS.wed },
    { day: 'Quinta', hours: HOURS.thu },
    { day: 'Sexta', hours: HOURS.fri },
    { day: 'Sábado', hours: HOURS.sat },
    { day: 'Domingo', hours: HOURS.sun },
  ];

  const [todayIndex, setTodayIndex] = useState<number | null>(null);
  const adjustedIndex = todayIndex === null ? -1 : todayIndex === 0 ? 6 : todayIndex - 1;

  // Dia da semana só no cliente: evita divergência com o HTML gerado no servidor.
  useEffect(() => {
    setTodayIndex(new Date().getDay());
  }, []);

  return (
    <section className="below-fold py-12 px-4 max-w-5xl mx-auto" aria-label="Horários e entrega">
      <div className="grid md:grid-cols-2 gap-8">
        <FadeIn>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary" aria-hidden />
            Horário de funcionamento
          </h2>
          <div className="space-y-2">
            {days.map((d, i) => (
              <div
                key={d.day}
                className={`flex justify-between p-3 rounded-xl ${i === adjustedIndex ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/50'}`}
              >
                <span className={`font-medium ${i === adjustedIndex ? 'text-primary' : ''}`}>
                  {d.day} {i === adjustedIndex && '(hoje)'}
                </span>
                <span className={i === adjustedIndex ? 'font-semibold text-primary' : 'text-muted-foreground'}>
                  {d.hours}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Truck className="w-6 h-6 text-primary" aria-hidden />
            Entrega
          </h2>
          <div className="bg-secondary/50 rounded-xl p-5 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Entregamos na região. Como a taxa varia por bairro, confirmamos o valor
              com você no WhatsApp antes de fechar — sem surpresa.
            </p>
            <div className="flex justify-between text-sm">
              <span>Taxa de entrega</span>
              <span className="font-semibold">{DELIVERY_FEE_TEXT}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Pedido</span>
              <span className="font-semibold">pelo WhatsApp</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-6 mb-4 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" aria-hidden />
            Pagamento
          </h2>
          <div className="bg-secondary/50 rounded-xl p-5">
            <PaymentBrandBadges />
            <div className="flex flex-wrap gap-2 mt-3">
              {PAYMENT_METHODS.filter(
                (m) => !['Visa', 'Mastercard', 'Pix'].includes(m),
              ).map((method) => (
                <span
                  key={method}
                  className="bg-card border border-border/50 text-xs font-medium px-2.5 py-1 rounded-lg"
                >
                  {method}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              No dinheiro, informe o valor para calcularmos seu troco no checkout.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
