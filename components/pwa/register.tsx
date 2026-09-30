'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;
    // Registra sem bloquear a renderização e evita re-registro em dev/HMR.
    const t = window.setTimeout(() => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // PWA é progressivo: falha silenciosa não quebra o pedido.
      });
    }, 2000);
    return () => window.clearTimeout(t);
  }, []);

  return null;
}
