import { CartItem, CheckoutData } from './types';
import { WHATSAPP_NUMBER, DELIVERY_FEE_TEXT } from './data';
import { getItemPrice } from './cart-context';
import { formatBRL, parseBRLInput, sanitizeLine } from './format';

const PAYMENT_LABELS: Record<CheckoutData['payment'], string> = {
  pix: 'Pix',
  card: 'Cartão',
  cash: 'Dinheiro',
};

const WIDTH = 62;
const DIVIDER = '-'.repeat(WIDTH);

/** Saudação conforme o horário: Bom Dia / Boa Tarde / Boa Noite. */
function greeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Bom Dia !';
  if (h >= 12 && h < 18) return 'Boa Tarde !';
  return 'Boa Noite !';
}

function center(text: string): string {
  const t = text.slice(0, WIDTH);
  const left = Math.max(0, Math.floor((WIDTH - t.length) / 2));
  return ' '.repeat(left) + t;
}

/** Preço no padrão do exemplo: R$ 08,00 (sempre 2 dígitos nos reais). */
function pricePad(value: number): string {
  const safe = Number.isFinite(value) && value >= 0 ? value : 0;
  const reais = Math.floor(safe);
  const cents = Math.round((safe - reais) * 100);
  const reaisStr = reais < 10 ? `0${reais}` : `${reais}`;
  return `R$ ${reaisStr},${String(cents).padStart(2, '0')}`;
}

/** Linha "etiqueta .... valor" alinhada à direita em 62 colunas. */
function row(label: string, value: string): string {
  const v = value.slice(0, WIDTH);
  const cleanLabel = label.slice(0, WIDTH);
  if (cleanLabel.length + 1 + v.length >= WIDTH) return `${cleanLabel} ${v}`;
  return cleanLabel + ' '.repeat(WIDTH - cleanLabel.length - v.length) + v;
}

/** Mensagem no formato do cupom do WhatsApp. */
export function generateWhatsAppMessage(
  items: CartItem[],
  checkout: CheckoutData,
  subtotal: number,
  _orderRef?: string,
): string {
  const c = checkout.customer;
  const lines: string[] = [];

  lines.push(DIVIDER);
  lines.push(center(greeting()));
  lines.push('');
  lines.push(center('Meu Pedido'));
  lines.push(DIVIDER);

  items.slice(0, 100).forEach((item) => {
    const unit = getItemPrice(item);
    const sizeSuffix = item.size ? ` (${sanitizeLine(item.size.name, 20)})` : '';
    lines.push(row(`${item.quantity}x ${sanitizeLine(item.product.name, 40)}${sizeSuffix}`, pricePad(unit * item.quantity)));
    if (item.crust && item.crust.price > 0) {
      lines.push(row(`Borda ${sanitizeLine(item.crust.name, 40)}`, pricePad(item.crust.price)));
    }
    for (const extra of item.extras.slice(0, 10)) {
      lines.push(row(`+ ${sanitizeLine(extra.name, 40)}`, pricePad(extra.price * item.quantity)));
    }
    if (item.observations) {
      lines.push(`Obs: ${sanitizeLine(item.observations, 56)}`);
    }
  });

  const safeSubtotal = Number.isFinite(subtotal) && subtotal >= 0 ? subtotal : 0;

  lines.push(row('Taxa De Entrega', DELIVERY_FEE_TEXT));
  lines.push(row('Total', pricePad(safeSubtotal)));
  lines.push(DIVIDER);
  lines.push(center(`Forma de Pagamento ${PAYMENT_LABELS[checkout.payment] ?? 'Pix'}`));

  if (checkout.payment === 'cash' && checkout.cashAmount) {
    const cash = parseBRLInput(checkout.cashAmount);
    if (Number.isFinite(cash) && cash > 0) {
      lines.push(row('Troco para', formatBRL(cash)));
      const change = cash - safeSubtotal;
      if (change > 0) lines.push(row('Devolver', formatBRL(change)));
    }
  }

  lines.push(DIVIDER);
  lines.push(`Cliente ${sanitizeLine(c.name, 53)}`);
  lines.push(`Contato ${sanitizeLine(c.phone, 53)}`);
  lines.push('Endereço');
  const addressLine = [c.address, c.number ? `N${c.number}` : '', c.complement, c.neighborhood ? `Bairro ${c.neighborhood}` : '']
    .filter(Boolean)
    .join(' ');
  lines.push(sanitizeLine(addressLine, WIDTH));
  if (c.reference) lines.push(`Referencia ${sanitizeLine(c.reference, 51)}`);
  lines.push(DIVIDER);

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
