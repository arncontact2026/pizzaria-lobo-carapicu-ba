'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Product } from '@/lib/types';
import { encodeImageSrc, formatBRL } from '@/lib/format';
import { playClick } from '@/lib/sound';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  index: number;
  priority?: boolean;
}

export function ProductCard({ product, onSelect, index, priority = false }: ProductCardProps) {
  const reduceMotion = useReducedMotion();
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: Math.min(index % 8, 4) * 0.05, duration: 0.4 }}
      className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary/30">
        {!imgError ? (
          <Image
            src={encodeImageSrc(product.image)}
            alt={`${product.name} — ${product.description}`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading={priority ? undefined : 'lazy'}
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm px-4 text-center">
            {product.name}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        <span className="absolute bottom-2 left-2 bg-primary text-primary-foreground font-bold text-sm px-2 py-1 rounded-lg">
          {formatBRL(product.price)}
        </span>
        {product.priceBrotinho && (
          <span className="absolute top-2 right-2 bg-black/55 backdrop-blur-sm text-white text-[11px] font-medium px-2 py-1 rounded-lg">
            Brotinho {formatBRL(product.priceBrotinho)}
          </span>
        )}
      </div>

      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-bold text-[15px] sm:text-base mb-0.5 leading-snug">{product.name}</h3>
          <p className="text-xs sm:text-[13px] text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>
        </div>
        <button
          onClick={() => { playClick(); onSelect(product); }}
          aria-label={`Personalizar e adicionar ${product.name} ao pedido`}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
        >
          <Plus className="w-4 h-4" aria-hidden />
          Adicionar
        </button>
      </div>
    </motion.div>
  );
}
