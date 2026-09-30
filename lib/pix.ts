/**
 * Geração do BR Code (Pix copia e cola) seguindo o padrão do Banco Central.
 * O QR apenas carrega estes dados: a confirmação do pagamento continua
 * pelo comprovante enviado no WhatsApp.
 */

export const PIX_CONFIG = {
  /** Chave Pix (CPF, só números). Confirme com o responsável antes de publicar. */
  key: '08250217403',
  /** Nome do recebedor (até 25 letras, sem acento — normalizado automaticamente). */
  name: 'Giliard Lobo Pessoa',
  /** Cidade do recebedor (obrigatória no BR Code, até 15 letras). */
  city: 'SAO PAULO',
} as const;

/** Remove acentos, mantém A-Z 0-9 e espaço, limita o tamanho. */
function normalizeField(value: string, maxLength: number): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function tlv(id: string, value: string): string {
  return `${id}${String(value.length).padStart(2, '0')}${value}`;
}

/** CRC16-CCITT-FALSE (polinômio 0x1021, início 0xFFFF). */
function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export interface PixPayloadOptions {
  key?: string;
  name?: string;
  city?: string;
  /** Valor em reais. Se zero/ausente, o cliente digita o valor no app do banco. */
  amount?: number;
  /** Identificador da transação (letras/números). */
  txid?: string;
}

/** Monta o "Pix copia e cola". Retorna '' se a chave for inválida. */
export function buildPixPayload(options: PixPayloadOptions = {}): string {
  const key = (options.key ?? PIX_CONFIG.key).trim();
  if (!key) return '';

  const name = normalizeField(options.name ?? PIX_CONFIG.name, 25) || 'RECEBEDOR';
  const city = normalizeField(options.city ?? PIX_CONFIG.city, 15) || 'BRASIL';
  const txid = (options.txid ?? '***').replace(/[^a-zA-Z0-9]/g, '').slice(0, 25) || '***';

  const merchantAccount = tlv('00', 'br.gov.bcb.pix') + tlv('01', key);

  let payload =
    tlv('00', '01') +
    tlv('26', merchantAccount) +
    tlv('52', '0000') +
    tlv('53', '986');

  const amount = options.amount ?? 0;
  if (Number.isFinite(amount) && amount > 0) {
    if (amount > 999999999.99) return '';
    payload += tlv('54', amount.toFixed(2));
  }

  payload +=
    tlv('58', 'BR') + tlv('59', name) + tlv('60', city) + tlv('62', tlv('05', txid));

  return payload + '6304' + crc16(payload + '6304');
}

/** Gera um identificador curto para o pedido (ex.: LOBO-4F8K2A). */
export function newOrderRef(): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase().replace(/[^A-Z0-9]/g, 'X');
  return `LOBO-${rand.padEnd(6, '0').slice(0, 6)}`;
}
