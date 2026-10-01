'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { PIZZERIA_NAME } from '@/lib/data';
import { encodeImageSrc } from '@/lib/format';

const BANNER_IMAGES = [
  {
    src: '/banner pizza 1.webp',
    alt: 'Pizza de calabresa com azeitonas saindo do forno a lenha',
    subtitle: 'Forno a lenha — sabor de verdade',
  },
  {
    src: '/banner pizza 2.webp',
    alt: 'Pizza com mussarela derretida e manjericão fresco',
    subtitle: 'Ingredientes frescos, massa leve',
  },
  {
    src: '/banner pizza 3.webp',
    alt: 'Pizza portuguesa com presunto, ovos e pimentão',
    subtitle: 'Receita de família, feita com capricho',
  },
];

const SLIDE_DURATION = 6000;

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const touchStartX = useRef<number | null>(null);

  const goToSlide = useCallback(
    (index: number) => {
      setDirection(index > currentSlide ? 1 : -1);
      setCurrentSlide(index);
    },
    [currentSlide],
  );

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % BANNER_IMAGES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + BANNER_IMAGES.length) % BANNER_IMAGES.length);
  }, []);

  // Gesto de arrastar no celular para trocar de foto.
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) nextSlide();
    else prevSlide();
  };

  // Avanço automático simples: um timer por slide, sem re-render a cada 50ms.
  useEffect(() => {
    if (paused || reduceMotion) return;
    const t = window.setTimeout(nextSlide, SLIDE_DURATION);
    return () => window.clearTimeout(t);
  }, [currentSlide, paused, reduceMotion, nextSlide]);

  const scrollToMenu = () => {
    document.getElementById('cardapio')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <section
      id="hero-banner"
      className="relative min-h-[68svh] flex items-center justify-center overflow-hidden bg-neutral-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Fundo com carrossel */}
      <div className="absolute inset-0" aria-hidden={false}>
        <AnimatePresence mode="sync" custom={direction}>
          <motion.div
            key={`slide-${currentSlide}`}
            custom={direction}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction > 0 ? 60 : -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction > 0 ? -60 : 60 }}
            transition={{ duration: reduceMotion ? 0.2 : 0.6 }}
            className="absolute inset-0"
          >
            <Image
              src={encodeImageSrc(BANNER_IMAGES[currentSlide].src)}
              alt={BANNER_IMAGES[currentSlide].alt}
              fill
              priority={currentSlide === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto pt-20">
        <motion.p
          className="text-xs sm:text-sm uppercase tracking-[0.2em] text-white/60 mb-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Pizzaria de bairro · Forno a lenha
        </motion.p>
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3 tracking-tight"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {PIZZERIA_NAME}
        </motion.h1>

        <motion.p
          className="text-sm sm:text-base text-white/55 font-light tracking-wide mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          Deus é Fiel
        </motion.p>

        <div className="h-8 md:h-10 mb-5 overflow-hidden" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={`subtitle-${currentSlide}`}
              className="text-sm sm:text-base md:text-lg text-white/75 font-light"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              {BANNER_IMAGES[currentSlide].subtitle}
            </motion.p>
          </AnimatePresence>
        </div>

        <motion.p
          className="text-sm md:text-base text-white/60 mb-8 max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Massa aberta na hora, molho caseiro e aquele cheiro de lenha que abraça.
          Monte seu pedido aqui e finalize pelo WhatsApp em menos de um minuto.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <button
            onClick={scrollToMenu}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3.5 rounded-full text-base transition-all hover:scale-[1.03] active:scale-[0.98]"
          >
            Ver cardápio e pedir
          </button>
          <a
            href="#sobre"
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-8 py-3.5 rounded-full text-base transition-all hover:bg-white/20"
          >
            Conhecer a casa
          </a>
        </motion.div>

        {/* Indicadores do carrossel */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {BANNER_IMAGES.map((banner, index) => (
            <button
              key={`indicator-${index}`}
              onClick={() => goToSlide(index)}
              className="group p-1"
              aria-label={`Ir para a foto ${index + 1}: ${banner.subtitle}`}
              aria-current={index === currentSlide}
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-500 overflow-hidden relative ${
                  index === currentSlide ? 'w-10 bg-white/30' : 'w-3 bg-white/30 group-hover:bg-white/50'
                }`}
              >
                {index === currentSlide && !reduceMotion && !paused && (
                  <span
                    key={`progress-${currentSlide}`}
                    className="absolute inset-y-0 left-0 bg-white rounded-full hero-progress-fill"
                    style={{ animationDuration: `${SLIDE_DURATION}ms` }}
                  />
                )}
                {index === currentSlide && (paused || reduceMotion) && (
                  <span className="absolute inset-0 bg-white/70 rounded-full" />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Scroll */}
      <motion.button
        type="button"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 p-1"
        animate={reduceMotion ? {} : { y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        onClick={scrollToMenu}
        aria-label="Rolar até o cardápio"
      >
        <ChevronDown className="w-7 h-7 text-white/60" />
      </motion.button>
    </section>
  );
}
