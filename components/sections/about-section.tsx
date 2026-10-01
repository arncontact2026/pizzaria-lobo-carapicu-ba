'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Flame } from 'lucide-react';

export function AboutSection() {
  const reduceMotion = useReducedMotion();
  return (
    <section id="sobre" className="below-fold py-12 px-4 max-w-5xl mx-auto scroll-mt-16">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative rounded-2xl w-full aspect-[4/3] overflow-hidden bg-muted">
            <Image
              src={encodeURI('/banner pizza 2.webp')}
              alt="Pizza artesanal saindo do forno a lenha da Pizzaria Lobo"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
              className="object-cover"
            />
          </div>
        </motion.div>
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs uppercase tracking-[0.18em] text-primary font-semibold mb-2">
            Nossa história
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Uma pizzaria de bairro, feita com capricho</h2>
          <p className="text-primary font-medium italic mb-4">Deus é Fiel</p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Aqui a massa descansa, o molho é caseiro e cada pizza vai ao forno a lenha
            uma por vez. É o cuidado de quem recebe vizinho, amigo e família — não só cliente.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Além das pizzas, preparamos pastéis crocantes, batatas generosas e temos
            bebida gelada para acompanhar. Se ficar em dúvida, chame no WhatsApp que a
            gente ajuda a montar o pedido.
          </p>
          <dl className="flex gap-8">
            <div className="text-center">
              <dt className="sr-only">Sabores no cardápio</dt>
              <dd className="text-2xl font-bold text-primary">60+</dd>
              <dd className="text-xs text-muted-foreground">sabores</dd>
            </div>
            <div className="text-center">
              <dt className="sr-only">Tipo de forno</dt>
              <dd className="text-2xl font-bold text-primary inline-flex items-center gap-1">
                <Flame className="w-5 h-5" aria-hidden /> Lenha
              </dd>
              <dd className="text-xs text-muted-foreground">forno tradicional</dd>
            </div>
            <div className="text-center">
              <dt className="sr-only">Avaliação média</dt>
              <dd className="text-2xl font-bold text-primary">4.8</dd>
              <dd className="text-xs text-muted-foreground">nota média</dd>
            </div>
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
