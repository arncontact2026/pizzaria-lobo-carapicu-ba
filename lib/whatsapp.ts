import { CartItem, CheckoutData } from './types';
import { WHATSAPP_NUMBER } from './data';
import { getItemPrice } from './cart-context';
import { formatBRL, parseBRLInput, sanitizeLine } from './format';

const PAYMENT_LABELS: Record<CheckoutData['payment'], string> = {
  pix: 'Pix',
  card: 'Cartão',
  cash: 'Dinheiro',
};

const WIDTH = 40;
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

/** Linha "etiqueta .... valor" alinhada à direita, nunca passa da largura. */
function row(label: string, value: string): string {
  const v = value.slice(0, WIDTH);
  const maxLabel = Math.max(1, WIDTH - v.length - 1);
  const cleanLabel = label.slice(0, maxLabel);
  return cleanLabel + ' '.repeat(WIDTH - cleanLabel.length - v.length) + v;
}

/** Quebra linha longa em várias de até WIDTH caracteres (endereço). */
function wrap(text: string): string[] {
  const words = text.split(' ').filter(Boolean);
  const out: string[] = [];
  let current = '';
  for (const w of words) {
    const next = current ? `${current} ${w}` : w;
    if (next.length <= WIDTH) {
      current = next;
    } else {
      if (current) out.push(current);
      current = w.length > WIDTH ? w.slice(0, WIDTH) : w;
    }
  }
  if (current) out.push(current);
  return out.length ? out : [''];
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
    const sizeSuffix = item.size ? ` (${sanitizeLine(item.size.name, 12)})` : '';
    lines.push(row(`${item.quantity}x ${sanitizeLine(item.product.name, 24)}${sizeSuffix}`, pricePad(unit * item.quantity)));
    if (item.crust && item.crust.price > 0) {
      lines.push(row(`Borda ${sanitizeLine(item.crust.name, 24)}`, pricePad(item.crust.price)));
    }
    for (const extra of item.extras.slice(0, 10)) {
      lines.push(row(`+ ${sanitizeLine(extra.name, 24)}`, pricePad(extra.price * item.quantity)));
    }
    if (item.observations) {
      lines.push(`Obs: ${sanitizeLine(item.observations, 34)}`);
    }
  });

  const safeSubtotal = Number.isFinite(subtotal) && subtotal >= 0 ? subtotal : 0;

  lines.push(row('Taxa De Entrega', 'Consultar taxa'));
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
  lines.push(`Cliente ${sanitizeLine(c.name, 31)}`);
  lines.push(`Contato ${sanitizeLine(c.phone, 31)}`);
  lines.push('Endereço');
  const addressLine = [c.address, c.number ? `N${c.number}` : '', c.complement, c.neighborhood ? `Bairro ${c.neighborhood}` : '']
    .filter(Boolean)
    .join(' ');
  for (const part of wrap(sanitizeLine(addressLine, 200))) lines.push(part);
  if (c.reference) lines.push(`Referencia ${sanitizeLine(c.reference, 29)}`);
  lines.push(DIVIDER);

  // Bloco monoespaçado: no WhatsApp, só assim os valores alinham em coluna.
  const body = lines
    .join('\n')
    .replace(/`/g, "'")
    .slice(0, 3900);
  return '```\n' + body + '\n```';
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
