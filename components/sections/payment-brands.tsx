/** Bandeiras de pagamento em SVG/CSS leve, sem imagens externas. */

function MastercardBadge({ box }: { box: string }) {
  return (
    <span
      role="img"
      aria-label="Mastercard"
      title="Mastercard"
      className={`inline-flex items-center justify-center bg-white border border-border/60 rounded-md px-2.5 ${box}`}
    >
      <svg className="h-[18px] w-auto" viewBox="0 0 34 20" aria-hidden>
        <circle cx="13" cy="10" r="8" fill="#EB001B" />
        <circle cx="21" cy="10" r="8" fill="#F79E1B" fillOpacity="0.85" />
      </svg>
    </span>
  );
}

function VisaBadge({ box }: { box: string }) {
  return (
    <span
      role="img"
      aria-label="Visa"
      title="Visa"
      className={`inline-flex items-center justify-center bg-white border border-border/60 rounded-md px-2.5 ${box}`}
    >
      <span className="text-[#1A1F71] font-black italic tracking-tight text-[15px] leading-none">
        VISA
      </span>
    </span>
  );
}

function EloBadge({ box }: { box: string }) {
  return (
    <span
      role="img"
      aria-label="Elo"
      title="Elo"
      className={`inline-flex items-center justify-center bg-[#1A1A1A] rounded-md px-2.5 ${box}`}
    >
      <span className="text-white font-bold lowercase text-[15px] leading-none tracking-tight">
        elo
      </span>
      <span className="ml-1 flex" aria-hidden>
        <span className="w-1.5 h-1.5 rounded-full bg-[#FFCB05]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#ED1C24] -ml-0.5" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#00A1DF] -ml-0.5" />
      </span>
    </span>
  );
}

function AmexBadge({ box }: { box: string }) {
  return (
    <span
      role="img"
      aria-label="American Express"
      title="American Express"
      className={`inline-flex items-center justify-center bg-[#2E77BC] rounded-md px-2.5 ${box}`}
    >
      <span className="text-white font-bold text-[10px] leading-none tracking-wide">
        AMEX
      </span>
    </span>
  );
}

function PixBadge({ box }: { box: string }) {
  return (
    <span
      role="img"
      aria-label="Pix"
      title="Pix"
      className={`inline-flex items-center justify-center gap-1 bg-white border border-border/60 rounded-md px-2.5 ${box}`}
    >
      <svg className="h-[14px] w-auto" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="#32BCAD"
          d="M12 1.5 14.5 9l7.5 3-7.5 3L12 22.5 9.5 15l-7.5-3 7.5-3L12 1.5Zm0 4.6L10.6 10l-3.9 2 3.9 2 1.4 3.9L13.4 14l3.9-2-3.9-2L12 6.1Z"
        />
      </svg>
      <span className="text-[#4A4A4A] font-bold italic text-[14px] leading-none">Pix</span>
    </span>
  );
}

export function PaymentBrandBadges({ compact = false }: { compact?: boolean }) {
  const box = compact ? 'h-7' : 'h-8';
  return (
    <span className={`flex flex-nowrap items-center overflow-x-auto ${compact ? 'gap-1.5' : 'gap-2'} pb-1 -mb-1`}>
      <MastercardBadge box={`${box} flex-shrink-0`} />
      <VisaBadge box={`${box} flex-shrink-0`} />
      <EloBadge box={`${box} flex-shrink-0`} />
      <AmexBadge box={`${box} flex-shrink-0`} />
      <PixBadge box={`${box} flex-shrink-0`} />
    </span>
  );
}
