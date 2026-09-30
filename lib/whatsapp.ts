import { CartItem, CheckoutData } from './types';
import { WHATSAPP_NUMBER, PIZZERIA_NAME, PIZZERIA_SLOGAN, DELIVERY_FEE_TEXT } from './data';
import { getItemPrice } from './cart-context';
import { formatBRL, parseBRLInput, sanitizeLine } from './format';

const PAYMENT_LABELS: Record<CheckoutData['payment'], string> = {
  pix: 'PIX',
  card: 'CARTÃO',
  cash: 'DINHEIRO',
};

const DIVIDER = '--------------------------------';

/** Mensagem no formato do cupom térmico. */
export function generateWhatsAppMessage(
  items: CartItem[],
  checkout: CheckoutData,
  subtotal: number,
  orderRef?: string,
): string {
  const c = checkout.customer;
  const lines: string[] = [];
  const now = new Date();
  const dateStr = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

  lines.push(PIZZERIA_NAME.toUpperCase());
  lines.push('');
  lines.push(PIZZERIA_SLOGAN);
  lines.push('');
  lines.push(`Pedido ${orderRef || 'S/REF'} · ${dateStr}`);
  lines.push('');
  lines.push(DIVIDER);
  lines.push('');

  items.slice(0, 100).forEach((item) => {
    const unit = getItemPrice(item);
    lines.push(`${item.quantity}x ${sanitizeLine(item.product.name, 60).toUpperCase()}`);
    lines.push('');
    if (item.size) {
      lines.push(`  ${sanitizeLine(item.size.name, 30)}`);
      lines.push('');
    }
    if (item.crust) {
      lines.push(`  Borda: ${sanitizeLine(item.crust.name, 30)}`);
      lines.push('');
    }
    if (item.extras.length) {
      lines.push(`  + ${item.extras.map((e) => sanitizeLine(e.name, 30)).join(', ')}`);
      lines.push('');
    }
    if (item.observations) {
      lines.push(`  Obs: ${sanitizeLine(item.observations, 200)}`);
      lines.push('');
    }
    lines.push(`${item.quantity} x ${formatBRL(unit)}`);
    lines.push(formatBRL(unit * item.quantity));
    lines.push('');
    lines.push('');
  });

  const safeSubtotal = Number.isFinite(subtotal) && subtotal >= 0 ? subtotal : 0;

  lines.push(DIVIDER);
  lines.push('');
  lines.push('SUBTOTAL');
  lines.push(formatBRL(safeSubtotal));
  lines.push('');
  lines.push('ENTREGA');
  lines.push(DELIVERY_FEE_TEXT);
  lines.push('');
  lines.push('TOTAL');
  lines.push(formatBRL(safeSubtotal));
  lines.push('');
  lines.push(DIVIDER);
  lines.push('');
  lines.push('ENTREGA');
  lines.push('');
  lines.push(sanitizeLine(c.name, 80));
  lines.push('');
  if (c.cep) {
    lines.push(`CEP: ${sanitizeLine(c.cep, 9)}`);
    lines.push('');
  }
  lines.push(
    sanitizeLine(
      `${c.address}, ${c.number}${c.complement ? ` - ${c.complement}` : ''}`,
      140,
    ),
  );
  lines.push('');
  lines.push(
    sanitizeLine(
      `${c.neighborhood}${c.reference ? ` (Ref: ${c.reference})` : ''}`,
      140,
    ),
  );
  lines.push('');
  lines.push(`Tel: ${sanitizeLine(c.phone, 20)}`);
  lines.push('');
  lines.push(DIVIDER);
  lines.push('');
  lines.push('PAGAMENTO');
  lines.push(PAYMENT_LABELS[checkout.payment] ?? 'PIX');
  if (checkout.payment === 'pix') {
    lines.push('Cliente paga via Pix — aguardar comprovante nesta conversa.');
  }
  if (checkout.payment === 'cash' && checkout.cashAmount) {
    const cash = parseBRLInput(checkout.cashAmount);
    if (Number.isFinite(cash) && cash > 0) {
      const change = cash - safeSubtotal;
      lines.push(
        change > 0
          ? `Troco para ${formatBRL(cash)} — levar ${formatBRL(change)}`
          : `Pagamento em dinheiro: ${formatBRL(cash)}`,
      );
    }
  }
  lines.push('');
  lines.push(DIVIDER);
  lines.push('');
  lines.push('OBRIGADO PELA PREFERENCIA!');

  return lines.join('\n').slice(0, 4000);
}

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message: string) {
  const url = getWhatsAppUrl(message);
  // window.open preserva o gesto do usuário na maioria dos navegadores.
  const win = window.open(url, '_blank', 'noopener,noreferrer');
  if (!win) {
    // Fallback para WebViews (Instagram, Facebook etc.) que bloqueiam
    // pop-up e clique programático: navega na própria aba.
    window.location.href = url;
  }
}
