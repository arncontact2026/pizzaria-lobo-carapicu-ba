'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('Erro na página:', error);
  }, [error]);

  return (
    <div className="min-h-[60svh] flex flex-col items-center justify-center text-center px-6 py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-primary font-semibold mb-2">
        Ops, algo travou
      </p>
      <h2 className="text-2xl font-bold mb-2">Não se preocupe, seu pedido está a salvo</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        A sacola fica guardada no aparelho. Toque abaixo para recarregar a tela sem perder nada.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3.5 rounded-full text-base transition-all"
      >
        Recarregar a página
      </button>
    </div>
  );
}
