'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Check } from 'lucide-react';
import { Product, Size, Crust } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { encodeImageSrc, formatBRL } from '@/lib/format';
import { playAdd } from '@/lib/sound';
import { ModalShell } from '@/components/modal/modal-shell';

interface Props {
  product: Product;
  onClose: () => void;
}

export function ProductCustomization({ product, onClose }: Props) {
  const { addItem, setCartOpen } = useCart();
  const [selectedSize, setSelectedSize] = useState<Size | null>(
    product.sizes?.[1] ?? product.sizes?.[0] ?? null,
  );
  const [selectedCrust, setSelectedCrust] = useState<Crust | null>(
    product.crusts ? (product.crusts.find((c) => c.price === 0) ?? product.crusts[0]) : null,
  );
  const [observations, setObservations] = useState('');

  const getPrice = () => {
    let price = selectedSize ? selectedSize.price : product.price;
    if (selectedCrust) price += selectedCrust.price;
    return price;
  };

  const handleAdd = () => {
    // Fecha o popup primeiro; adiciona e abre a sacola no próximo quadro.
    // Evita duas animações de modal sobrepostas no mesmo gesto (travava
    // em celular fraco justamente ao adicionar bebidas).
    const selection = { product, size: selectedSize, crust: selectedCrust, obs: observations };
    onClose();
    requestAnimationFrame(() => {
      addItem(selection.product, selection.size, selection.crust, [], selection.obs);
      playAdd();
      setCartOpen(true);
    });
  };

  return (
    <ModalShell label={`Personalizar ${product.name}`} variant="sheet" onClose={onClose}>
        {/* Header Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-secondary/30">
          <Image
            src={encodeImageSrc(product.image)}
            alt={`${product.name} — ${product.description}`}
            fill
            sizes="(max-width: 640px) 100vw, 512px"
            className="object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar personalização"
            className="absolute top-4 right-4 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60"
          >
            <X className="w-4 h-4" aria-hidden />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-2xl font-bold text-white">{product.name}</h3>
            <p className="text-white/80 text-sm">{product.description}</p>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Sizes */}
          {product.sizes && (
            <fieldset>
              <legend className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                Tamanho
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {product.sizes.map((size) => {
                  const active = selectedSize?.name === size.name;
                  return (
                    <button
                      key={size.name}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      aria-pressed={active}
                      className={`p-3 rounded-xl border-2 text-left transition-all relative ${
                        active ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <span className="text-sm font-medium">{size.name}</span>
                      <span className="block text-xs text-muted-foreground mt-0.5">
                        {formatBRL(size.price)}
                      </span>
                      {active && <Check className="absolute top-2 right-2 w-4 h-4 text-primary" aria-hidden />}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* Crusts */}
          {product.crusts && (
            <fieldset>
              <legend className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                Borda
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {product.crusts.map((crust) => {
                  const active = selectedCrust?.name === crust.name;
                  return (
                    <button
                      key={crust.name}
                      type="button"
                      onClick={() => setSelectedCrust(crust)}
                      aria-pressed={active}
                      className={`p-3 rounded-xl border-2 text-left transition-all relative ${
                        active ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <span className="text-sm font-medium">{crust.name}</span>
                      <span className="block text-xs text-muted-foreground mt-0.5">
                        {crust.price > 0 ? `+ ${formatBRL(crust.price)}` : 'Inclusa'}
                      </span>
                      {active && <Check className="absolute top-2 right-2 w-4 h-4 text-primary" aria-hidden />}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* Observações (bebidas não precisam) */}
          {product.category !== 'bebidas' && (
          <div>
            <label
              htmlFor={`obs-${product.id}`}
              className="block font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2"
            >
              Observações <span className="normal-case font-normal">(opcional)</span>
            </label>
            <textarea
              id={`obs-${product.id}`}
              value={observations}
              onChange={(e) => setObservations(e.target.value.slice(0, 200))}
              maxLength={200}
              rows={2}
              placeholder="Ex.: sem cebola, bem passada, cortar em 6…"
              className="w-full p-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
            />
          </div>
          )}

          {/* Add Button */}
          <button
            type="button"
            onClick={handleAdd}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl text-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            Adicionar · {formatBRL(getPrice())}
          </button>
        </div>
    </ModalShell>
  );
}
