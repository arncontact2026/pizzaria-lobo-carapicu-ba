'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Search,
  Pizza,
  Flame,
  Beef,
  Drumstick,
  Leaf,
  Sandwich,
  Fish,
  Star,
  CakeSlice,
  CupSoda,
  Cookie,
  LayoutGrid,
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '@/lib/data';
import { Product, CategorySlug } from '@/lib/types';
import { ProductCard } from './product-card';
import { ProductCustomization } from './product-customization';

const CATEGORY_ICONS: Record<string, typeof Pizza> = {
  pizza: Pizza,
  flame: Flame,
  beef: Beef,
  drumstick: Drumstick,
  leaf: Leaf,
  sandwich: Sandwich,
  fish: Fish,
  star: Star,
  cake: CakeSlice,
  fries: Cookie,
  pie: Cookie,
  cup: CupSoda,
};

const PAGE_SIZE = 12;

function useDebounced(value: string, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<CategorySlug>('queijo');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const reduceMotion = useReducedMotion();

  const debouncedSearch = useDebounced(search.trim().toLowerCase());

  const filteredProducts = useMemo(() => {
    if (debouncedSearch) {
      return PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(debouncedSearch) ||
          p.description.toLowerCase().includes(debouncedSearch),
      );
    }
    return PRODUCTS.filter((p) => p.category === activeCategory);
  }, [activeCategory, debouncedSearch]);

  // Sempre que trocar de categoria ou busca, volta a mostrar a primeira página.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, debouncedSearch]);

  // Permite que outros componentes (ex.: sugestão na sacola) abram uma categoria.
  useEffect(() => {
    const handler = (e: Event) => {
      const slug = (e as CustomEvent<CategorySlug>).detail;
      if (!slug || !CATEGORIES.some((c) => c.slug === slug)) return;
      // Segurança: nenhum modal pode ter deixado o scroll do body travado.
      document.body.style.overflow = '';
      setActiveCategory(slug);
      setSearch('');
      // Rolagem instantânea: o 'smooth' compete com a troca da grade
      // e deixa a página presa no meio do caminho em alguns celulares.
      document.getElementById('cardapio')?.scrollIntoView({ behavior: 'auto' });
    };
    window.addEventListener('lobo:show-category', handler);
    return () => window.removeEventListener('lobo:show-category', handler);
  }, []);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount],
  );

  const activeCategoryName = debouncedSearch
    ? `Resultados para "${search.trim()}"`
    : (CATEGORIES.find((c) => c.slug === activeCategory)?.name ?? 'Cardápio');

  return (
    <section id="cardapio" className="py-12 px-4 max-w-5xl mx-auto scroll-mt-16">
      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        <p className="text-center text-xs uppercase tracking-[0.18em] text-primary font-semibold mb-2">
          Cardápio
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
          Escolha com calma, peça sem pressa
        </h2>
        <p className="text-muted-foreground text-center mb-8 max-w-xl mx-auto text-sm md:text-base">
          Tudo sai do forno a lenha na hora. Toque em um sabor para escolher o
          tamanho e a borda.
        </p>
      </motion.div>

      {/* Busca */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden />
        <label htmlFor="busca-cardapio" className="sr-only">
          Buscar no cardápio
        </label>
        <input
          id="busca-cardapio"
          type="search"
          autoComplete="off"
          maxLength={60}
          placeholder="Buscar por sabor ou ingrediente…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-10 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            aria-label="Limpar busca"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground px-2 py-1"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Categorias */}
      {!debouncedSearch && (
        <div
          role="tablist"
          aria-label="Categorias do cardápio"
          className="flex gap-2 overflow-x-auto pb-4 mb-6 -mx-4 px-4"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.icon] ?? LayoutGrid;
            const active = activeCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveCategory(cat.slug)}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-sm transition-all border ${
                  active
                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                    : 'bg-card text-foreground/80 border-border hover:border-primary/40'
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden />
                {cat.name}
              </button>
            );
          })}
        </div>
      )}

      <p className="text-sm text-muted-foreground mb-4" aria-live="polite">
        {activeCategoryName} · {filteredProducts.length}{' '}
        {filteredProducts.length === 1 ? 'opção' : 'opções'}
      </p>

      {/* Grade de produtos */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory + debouncedSearch}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
        >
          {visibleProducts.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setSelectedProduct}
              index={i}
              priority={i < 2}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium text-foreground">Nada por aqui com esse nome</p>
          <p className="text-sm mt-1">
            Tente buscar por &quot;calabresa&quot;, &quot;queijo&quot; ou &quot;chocolate&quot;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setActiveCategory('queijo');
            }}
            className="mt-4 text-sm font-semibold text-primary hover:underline"
          >
            Voltar ao início do cardápio
          </button>
        </div>
      )}

      {visibleCount < filteredProducts.length && (
        <div className="text-center mt-8">
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="px-8 py-3 rounded-full border border-border bg-card font-semibold text-sm hover:border-primary/50 hover:text-primary transition-colors"
          >
            Mostrar mais sabores ({filteredProducts.length - visibleCount} restantes)
          </button>
        </div>
      )}

      {/* Modal de personalização */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductCustomization
            key={selectedProduct.id}
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
