'use client';

/**
 * Sons de interface gerados via WebAudio (nenhum arquivo de áudio).
 * Só tocam após gesto do usuário e respeitam a preferência de mudo.
 */

const STORAGE_KEY = 'pizzaria-lobo-sound';
let ctx: AudioContext | null = null;

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

export function setSoundEnabled(enabled: boolean): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off');
  } catch {
    // Sem armazenamento: segue com o padrão.
  }
}

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, startAt: number, duration: number, volume: number, type: OscillatorType = 'triangle') {
  const ac = audio();
  if (!ac) return;
  try {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ac.currentTime + startAt);
    gain.gain.linearRampToValueAtTime(volume, ac.currentTime + startAt + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + startAt + duration);
    osc.connect(gain).connect(ac.destination);
    osc.start(ac.currentTime + startAt);
    osc.stop(ac.currentTime + startAt + duration + 0.02);
  } catch {
    // Áudio indisponível: ignora silenciosamente.
  }
}

/** Clique suave padrão. */
export function playClick(): void {
  if (!isSoundEnabled()) return;
  tone(520, 0, 0.09, 0.12);
}

/** Confirmação de adição (duas notas ascendentes). */
export function playAdd(): void {
  if (!isSoundEnabled()) return;
  tone(523.25, 0, 0.1, 0.12);
  tone(783.99, 0.07, 0.14, 0.12);
}
