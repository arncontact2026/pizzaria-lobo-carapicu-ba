'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Clock, Star, Truck, CreditCard, BadgePercent, Flame } from 'lucide-react';
import { HOURS, DELIVERY_FEE_TEXT, PAYMENT_METHODS, PROMO } from '@/lib/data';
import { formatBRL } from '@/lib/format';

const REVIEWS = [
  { name: 'Ana S.', rating: 5, text: 'Massa leve e borda crocante de verdade. A calabresa chegou quentinha e bem recheada.', time: 'há 2 semanas' },
  { name: 'Carlos M.', rating: 5, text: 'Peço quase todo sábado. A quatro queijos é generosa e o atendimento no WhatsApp é rápido.', time: 'há 1 mês' },
  { name: 'Maria O.', rating: 4, text: 'Pizza saborosa e pastel bem sequinho. Bom custo-benefício para a família toda.', time: 'há 1 mês' },
  { name: 'Pedro S.', rating: 5, text: 'A Lobo virou nossa favorita aqui de casa. Dá para sentir o gosto do forno a lenha.', time: 'há 3 semanas' },
];

const fadeUp = (reduceMotion: boolean | null) =>
  reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 };

export function PromoSection() {
  const reduceMotion = useReducedMotion();
  return (
    <section id="promocoes" className="py-12 px-4 max-w-5xl mx-auto scroll-mt-16">
      <motion.div
        initial={fadeUp(reduceMotion)}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        <p className="text-center text-xs uppercase tracking-[0.18em] text-primary font-semibold mb-2">
          Oferta da casa
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
          Para dividir sem pesar no bolso
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          Sabores selecionados por apenas {formatBRL(PROMO.price)}
        </p>
      </motion.div>

      <motion.div
        initial={fadeUp(reduceMotion)}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="relative bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto"
      >
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
      </motion.div>
    </section>
  );
}

export function AboutSection() {
  const reduceMotion = useReducedMotion();
  return (
    <section id="sobre" className="py-12 px-4 max-w-5xl mx-auto scroll-mt-16">
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

export function HoursSection() {
  const reduceMotion = useReducedMotion();
  const days = [
    { day: 'Segunda', hours: HOURS.mon },
    { day: 'Terça', hours: HOURS.tue },
    { day: 'Quarta', hours: HOURS.wed },
    { day: 'Quinta', hours: HOURS.thu },
    { day: 'Sexta', hours: HOURS.fri },
    { day: 'Sábado', hours: HOURS.sat },
    { day: 'Domingo', hours: HOURS.sun },
  ];

  const todayIndex = new Date().getDay();
  const adjustedIndex = todayIndex === 0 ? 6 : todayIndex - 1;

  return (
    <section className="py-12 px-4 max-w-5xl mx-auto" aria-label="Horários e entrega">
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={fadeUp(reduceMotion)}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
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
        </motion.div>

        <motion.div
          initial={fadeUp(reduceMotion)}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
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
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((method) => (
                <span
                  key={method}
                  className="bg-card border border-border/50 text-sm font-medium px-3 py-1.5 rounded-lg"
                >
                  {method}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              No dinheiro, informe o valor para calcularmos seu troco no checkout.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  const reduceMotion = useReducedMotion();
  return (
    <section id="avaliacoes" className="py-12 px-4 max-w-5xl mx-auto scroll-mt-16">
      <motion.div
        initial={fadeUp(reduceMotion)}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        <p className="text-center text-xs uppercase tracking-[0.18em] text-primary font-semibold mb-2">
          Quem pede, volta
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">O que diz quem é de casa</h2>
        <div className="flex items-center justify-center gap-1 mb-8" aria-label="Nota média 4.8 de 5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" aria-hidden />
          ))}
          <span className="ml-2 font-semibold">4.8</span>
          <span className="text-muted-foreground text-sm ml-1">(mais de 200 avaliações)</span>
        </div>
      </motion.div>

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
