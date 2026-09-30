'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Clock, Flame, Pizza, Wallet } from 'lucide-react';

const HIGHLIGHTS = [
  {
    icon: Flame,
    title: 'Forno a lenha',
    desc: 'Massa leve, borda crocante',
  },
  {
    icon: Pizza,
    title: 'Cardápio variado',
    desc: 'Pizzas, pastéis, batatas e bebidas',
  },
  {
    icon: Clock,
    title: 'Todo dia, 18h às 00h',
    desc: 'Inclusive fins de semana',
  },
  {
    icon: Wallet,
    title: 'Pagamento facilitado',
    desc: 'Pix, cartões e dinheiro',
  },
];

export function HighlightsSection() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="py-12 px-4 max-w-5xl mx-auto" aria-label="Diferenciais da casa">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {HIGHLIGHTS.map((item, i) => (
          <motion.div
            key={item.title}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.07, duration: 0.45 }}
            className="flex flex-col items-center text-center p-5 rounded-2xl bg-card border border-border/50"
          >
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <item.icon className="w-5 h-5 text-primary" aria-hidden />
            </div>
            <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
