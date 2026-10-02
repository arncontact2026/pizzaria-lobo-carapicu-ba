'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { lockScroll, unlockScroll } from '@/lib/scroll-lock';

interface ModalShellProps {
  label: string;
  onClose: () => void;
  /** 'sheet': sobe de baixo (checkout, personalização). 'drawer': entra pela direita (sacola). */
  variant?: 'sheet' | 'drawer';
  children: React.ReactNode;
}

const PANEL_SPRING = { type: 'spring', damping: 28, stiffness: 300 } as const;
// Saídas rápidas e determinísticas: overlay invisível nunca prende toques.
const OVERLAY_FADE = { duration: 0.15 } as const;
const DRAWER_EXIT = { duration: 0.22, ease: 'easeOut' } as const;

/**
 * Estrutura compartilhada dos modais: overlay, tecla ESC,
 * trava de scroll do fundo e animação de entrada/saída.
 * Deve ser renderizado dentro de um <AnimatePresence> do chamador.
 */
export function ModalShell({ label, onClose, variant = 'sheet', children }: ModalShellProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    lockScroll();
    return () => {
      document.removeEventListener('keydown', onKey);
      unlockScroll();
    };
  }, [onClose]);

  if (variant === 'drawer') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={OVERLAY_FADE}
        className="fixed inset-0 z-50 bg-black/60"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={DRAWER_EXIT}
          className="absolute right-0 top-0 bottom-0 w-full sm:max-w-md bg-card shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={OVERLAY_FADE}
      className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={PANEL_SPRING}
        className="bg-card w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
