'use client';

import { motion, useReducedMotion } from 'framer-motion';

export function fadeUp(reduceMotion: boolean | null) {
  return reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 };
}

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/** Bloco com entrada suave ao rolar — padrão único das seções. */
export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={fadeUp(reduceMotion)}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface EyebrowProps {
  children: React.ReactNode;
}

/** Rótulo pequeno acima dos títulos das seções. */
export function SectionEyebrow({ children }: EyebrowProps) {
  return (
    <p className="text-center text-xs uppercase tracking-[0.18em] text-primary font-semibold mb-2">
      {children}
    </p>
  );
}
