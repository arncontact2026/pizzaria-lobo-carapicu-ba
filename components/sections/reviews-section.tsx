'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Star } from 'lucide-react';
import { fadeUp, FadeIn, SectionEyebrow } from './section-anim';

const REVIEWS = [
  { name: 'Ana S.', rating: 5, text: 'Massa leve e borda crocante de verdade. A calabresa chegou quentinha e bem recheada.', time: 'há 2 semanas' },
  { name: 'Carlos M.', rating: 5, text: 'Peço quase todo sábado. A quatro queijos é generosa e o atendimento no WhatsApp é rápido.', time: 'há 1 mês' },
  { name: 'Maria O.', rating: 4, text: 'Pizza saborosa e pastel bem sequinho. Bom custo-benefício para a família toda.', time: 'há 1 mês' },
  { name: 'Pedro S.', rating: 5, text: 'A Lobo virou nossa favorita aqui de casa. Dá para sentir o gosto do forno a lenha.', time: 'há 3 semanas' },
];

export function ReviewsSection() {
  const reduceMotion = useReducedMotion();
  return (
    <section id="avaliacoes" className="below-fold py-12 px-4 max-w-5xl mx-auto scroll-mt-16">
      <FadeIn>
        <SectionEyebrow>Quem pede, volta</SectionEyebrow>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">O que diz quem é de casa</h2>
        <div className="flex items-center justify-center gap-1 mb-8" aria-label="Nota média 4.8 de 5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" aria-hidden />
          ))}
          <span className="ml-2 font-semibold">4.8</span>
          <span className="text-muted-foreground text-sm ml-1">(mais de 200 avaliações)</span>
        </div>
      </FadeIn>

      <div className="grid md:grid-cols-2 gap-4">
        {REVIEWS.map((review, i) => (
          <motion.figure
            key={review.name}
            initial={fadeUp(reduceMotion)}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className="bg-card border border-border/50 rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary"
                aria-hidden
              >
                {review.name.charAt(0)}
              </div>
              <figcaption>
                <p className="font-semibold text-sm">{review.name}</p>
                <div className="flex gap-0.5" aria-label={`${review.rating} de 5 estrelas`}>
                  {Array.from({ length: review.rating }).map((_, s) => (
                    <Star key={s} className="w-3 h-3 fill-yellow-400 text-yellow-400" aria-hidden />
                  ))}
                </div>
              </figcaption>
            </div>
            <blockquote className="text-sm text-muted-foreground leading-relaxed">
              &ldquo;{review.text}&rdquo;
            </blockquote>
            <p className="text-xs text-muted-foreground/60 mt-2">{review.time}</p>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
