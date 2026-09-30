/** Helpers compartilhados de formatação e segurança leve de texto. */

export function formatBRL(value: number): string {
  if (!Number.isFinite(value)) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/** Codifica caminhos de imagem com espaços/acentos sem quebrar o restante da URL. */
export function encodeImageSrc(src: string): string {
  try {
    return encodeURI(src);
  } catch {
    return src;
  }
}

/** Remove quebras de linha e limita tamanho para evitar quebra da mensagem do pedido. */
export function sanitizeLine(value: string, maxLength = 120): string {
  return value
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/** Converte "1.234,56" ou "1234.56" para número. Retorna NaN se inválido. */
export function parseBRLInput(value: string): number {
  const normalized = value.trim().replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
  const num = Number(normalized);
  return Number.isFinite(num) ? num : NaN;
}

/** Validação simples de telefone brasileiro (10 ou 11 dígitos). */
export function isValidBRPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11;
}

/** Formata CEP enquanto digita: 00000-000. */
export function formatCepInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

/** Extrai só os dígitos do CEP. */
export function cepDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, 8);
}
