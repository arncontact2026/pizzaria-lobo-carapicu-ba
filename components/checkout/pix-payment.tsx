'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Check, Copy, QrCode } from 'lucide-react';
import { buildPixPayload, PIX_CONFIG } from '@/lib/pix';
import { formatBRL } from '@/lib/format';

interface PixPaymentProps {
  amount: number;
  orderRef: string;
}

/** Bloco de pagamento Pix: QR + copia e cola, com o valor exato do pedido. */
export function PixPayment({ amount, orderRef }: PixPaymentProps) {
  const [qrSrc, setQrSrc] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const payload = buildPixPayload({ amount, txid: orderRef.replace(/[^A-Z0-9]/gi, '').slice(0, 20) || 'PEDIDO' });

  useEffect(() => {
    let active = true;
    setQrSrc('');
    if (!payload) return;
    QRCode.toDataURL(payload, {
      width: 480,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#000000', light: '#ffffff' },
    })
      .then((url) => {
        if (active) setQrSrc(url);
      })
      .catch(() => {
        if (active) setQrSrc('');
      });
    return () => {
      active = false;
    };
  }, [payload]);

  const handleCopy = async () => {
    if (!payload) return;
    try {
      await navigator.clipboard.writeText(payload);
    } catch {
      // Fallback para navegadores sem Clipboard API.
      const ta = document.createElement('textarea');
      ta.value = payload;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  };

  if (!payload) return null;

  return (
    <section aria-labelledby="pix-titulo" className="rounded-2xl border border-border bg-background p-4">
      <h5 id="pix-titulo" className="flex items-center gap-2 font-bold text-sm mb-1">
        <QrCode className="w-4 h-4 text-primary" aria-hidden />
        Pague com Pix — {formatBRL(amount)}
      </h5>
      <p className="text-xs text-muted-foreground mb-3">
        Favorecido: {PIX_CONFIG.name}. Abra o app do seu banco, escaneie ou cole o código.
      </p>

      <div className="flex justify-center mb-3">
        {qrSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qrSrc}
            alt={`QR Code Pix de ${formatBRL(amount)} para ${PIX_CONFIG.name}`}
            className="w-48 h-48 rounded-xl border border-border bg-white p-1"
            width={192}
            height={192}
          />
        ) : (
          <div className="w-48 h-48 rounded-xl border border-border bg-secondary/50 flex items-center justify-center text-xs text-muted-foreground">
            Gerando QR…
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-primary/40 text-primary font-semibold text-sm py-2.5 hover:bg-primary/5 transition-colors"
      >
        {copied ? <Check className="w-4 h-4" aria-hidden /> : <Copy className="w-4 h-4" aria-hidden />}
        {copied ? 'Código copiado!' : 'Copiar código Pix'}
      </button>
      <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
        Depois de pagar, toque em enviar abaixo e <strong>anexe o comprovante</strong> na conversa
        do WhatsApp para confirmarmos seu pedido.
      </p>
    </section>
  );
}
