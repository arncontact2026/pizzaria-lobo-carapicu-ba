'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Pizzaria Lobo</h2>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>
            A página teve um problema, mas sua sacola está guardada no aparelho.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{ background: '#B43C1E', color: '#fff', border: 0, borderRadius: 999, padding: '12px 32px', fontSize: 16, fontWeight: 600 }}
          >
            Tentar de novo
          </button>
        </div>
      </body>
    </html>
  );
}
