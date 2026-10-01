/**
 * Trava de scroll com contagem de referência.
 * Vários modais podem travar/destravar sem disputa: o scroll do body
 * só é liberado quando o último modal fecha. Elimina a classe inteira
 * de bugs de "página travada" por overflow perdido.
 */

let locks = 0;
let prevOverflow = '';

function isBrowser(): boolean {
  return typeof document !== 'undefined';
}

export function lockScroll(): void {
  if (!isBrowser()) return;
  if (locks === 0) prevOverflow = document.body.style.overflow;
  locks += 1;
  document.body.style.overflow = 'hidden';
}

export function unlockScroll(): void {
  if (!isBrowser()) return;
  locks = Math.max(0, locks - 1);
  if (locks === 0) document.body.style.overflow = prevOverflow;
}

/** Liberação forçada (navegações entre modal e página). */
export function forceUnlockScroll(): void {
  if (!isBrowser()) return;
  locks = 0;
  document.body.style.overflow = '';
}
