'use client';

import { CartItem, CheckoutData } from '@/lib/types';
import { getItemPrice } from '@/lib/cart-context';
import { DELIVERY_FEE_TEXT, PIZZERIA_NAME, PIZZERIA_SLOGAN } from '@/lib/data';
import { formatBRL } from '@/lib/format';

interface ReceiptPreviewProps {
  items: CartItem[];
  checkout: CheckoutData;
  subtotal: number;
  total: number;
  orderRef: string;
  paymentLabel: string;
}

/** Cupom em estilo papel térmico (80 mm) para conferência antes do envio. */
export function ReceiptPreview({ items, checkout, subtotal, total, orderRef, paymentLabel }: ReceiptPreviewProps) {
  const now = new Date();
  const dateStr = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  const c = checkout.customer;

  return (
    <section aria-labelledby="cupom-titulo">
      <h4 id="cupom-titulo" className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2 text-center">
        Confira o pedido e endereço
      </h4>

      <div id="cupom-termico" className="mx-auto max-w-[300px] bg-white text-black rounded-lg px-4 py-5 font-mono text-[12px] leading-relaxed shadow-inner border border-border">
        <p className="text-center font-bold text-[14px]">{PIZZERIA_NAME.toUpperCase()}</p>
        <p className="text-center italic">{PIZZERIA_SLOGAN}</p>
        <p className="text-center">
          Pedido {orderRef} · {dateStr}
        </p>
        <div aria-hidden className="border-t border-dashed border-neutral-400 my-1.5" />

        {items.map((item, i) => {
          const unit = getItemPrice(item);
          return (
            <div key={item.id} className="mb-1.5">
              <p className="font-bold">
                {item.quantity}x {item.product.name.toUpperCase()}
              </p>
              {item.size && <p>&nbsp;&nbsp;{item.size.name}</p>}
              {item.crust && <p>&nbsp;&nbsp;Borda: {item.crust.name}</p>}
              {(item.extras ?? []).length > 0 && (
                <p>&nbsp;&nbsp;+ {(item.extras ?? []).map((e) => e.name).join(', ')}</p>
              )}
              {item.observations ? <p>&nbsp;&nbsp;Obs: {item.observations}</p> : null}
              <p className="flex justify-between">
                <span>
                  {item.quantity} x {formatBRL(unit)}
                </span>
                <span className="font-bold">{formatBRL(unit * item.quantity)}</span>
              </p>
              {i < items.length - 1 && <p>&nbsp;</p>}
            </div>
          );
        })}

        <div aria-hidden className="border-t border-dashed border-neutral-400 my-1.5" />
        <p className="flex justify-between">
          <span>SUBTOTAL</span>
          <span>{formatBRL(subtotal)}</span>
        </p>
        <p className="flex justify-between">
          <span>ENTREGA</span>
          <span>{DELIVERY_FEE_TEXT}</span>
        </p>
        <p className="flex justify-between font-bold text-[15px] mt-1">
          <span>TOTAL</span>
          <span>{formatBRL(total)}</span>
        </p>
        <div aria-hidden className="border-t border-dashed border-neutral-400 my-1.5" />

        <p className="font-bold">ENTREGA</p>
        <p>{c.name}</p>
        {c.cep ? <p>CEP: {c.cep}</p> : null}
        <p>
          {c.address}, {c.number}
          {c.complement ? ` - ${c.complement}` : ''}
        </p>
        <p>
          {c.neighborhood}
          {c.reference ? ` (Ref: ${c.reference})` : ''}
        </p>
        <p>Tel: {c.phone}</p>
        <div aria-hidden className="border-t border-dashed border-neutral-400 my-1.5" />

        <p className="flex justify-between">
          <span>PAGAMENTO</span>
          <span className="font-bold">{paymentLabel}</span>
        </p>
        <div aria-hidden className="border-t border-dashed border-neutral-400 my-1.5" />
        <p className="text-center font-bold">OBRIGADO PELA PREFERENCIA!</p>
      </div>
    </section>
  );
}
