'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import {
  CartItem,
  Product,
  Size,
  Crust,
  Extra,
  CheckoutData,
  PaymentMethod,
  CustomerInfo,
} from './types';
import { DELIVERY_FEE } from './data';
import { parseBRLInput } from './format';

interface CartContextType {
  items: CartItem[];
  checkout: CheckoutData;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  addItem: (
    product: Product,
    size: Size | null,
    crust: Crust | null,
    extras: Extra[],
    observations?: string,
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateObservations: (id: string, observations: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
  setCartOpen: (open: boolean) => void;
  setCheckoutOpen: (open: boolean) => void;
  updateCustomer: (field: keyof CustomerInfo, value: string) => void;
  setPayment: (method: PaymentMethod) => void;
  setCashAmount: (amount: string) => void;
  resetCheckout: () => void;
  getChange: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'pizzaria-lobo-cart-v1';
const MAX_QTY_PER_ITEM = 20;
const MAX_ITEMS = 100;

const EMPTY_CUSTOMER: CustomerInfo = {
  name: '',
  phone: '',
  cep: '',
  address: '',
  number: '',
  complement: '',
  neighborhood: '',
  reference: '',
};

function getItemPrice(item: CartItem): number {
  const sizePrice = item.size?.price ?? item.product.price;
  const crustPrice = item.crust?.price ?? 0;
  const extrasPrice = Array.isArray(item.extras)
    ? item.extras.reduce((sum, e) => sum + (Number(e?.price) || 0), 0)
    : 0;
  const price = (Number(sizePrice) || 0) + (Number(crustPrice) || 0) + extrasPrice;
  return Number.isFinite(price) && price >= 0 ? price : 0;
}

function buildSignature(
  productId: string,
  size: Size | null,
  crust: Crust | null,
  extras: Extra[],
  observations: string,
): string {
  const extrasKey = [...extras]
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b))
    .join('|');
  return [productId, size?.name ?? '-', crust?.name ?? '-', extrasKey, observations.trim().toLowerCase()].join('::');
}

function safeParseStored(value: string | null): CartItem[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item) =>
          item &&
          typeof item.id === 'string' &&
          item.product &&
          typeof item.product.id === 'string' &&
          typeof item.quantity === 'number',
      )
      .slice(0, MAX_ITEMS)
      .map((item) => ({
        ...item,
        quantity: Math.min(Math.max(1, Math.floor(item.quantity)), MAX_QTY_PER_ITEM),
        extras: Array.isArray(item.extras) ? item.extras : [],
        observations: typeof item.observations === 'string' ? item.observations.slice(0, 200) : '',
      }));
  } catch {
    return [];
  }
}

let idCounter = 0;
function newId(): string {
  idCounter += 1;
  const rand =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${Date.now().toString(36)}-${rand}-${idCounter}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [checkout, setCheckout] = useState<CheckoutData>({
    customer: EMPTY_CUSTOMER,
    payment: 'pix',
    cashAmount: '',
  });

  // Restaura o carrinho salvo no navegador (evita perder o pedido ao recarregar).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      setItems(safeParseStored(stored));
    } catch {
      setItems([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persiste a cada mudança, sem bloquear a interface.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Armazenamento cheio ou indisponível: segue sem persistir.
    }
  }, [items, hydrated]);

  const addItem = useCallback(
    (product: Product, size: Size | null, crust: Crust | null, extras: Extra[], observations = '') => {
      const cleanObs = observations.trim().slice(0, 200);
      const signature = buildSignature(product.id, size, crust, extras, cleanObs);
      setItems((prev) => {
        const existing = prev.find(
          (item) =>
            buildSignature(
              item.product.id,
              item.size,
              item.crust,
              item.extras,
              item.observations ?? '',
            ) === signature,
        );
        if (existing) {
          return prev.map((item) =>
            item.id === existing.id
              ? { ...item, quantity: Math.min(item.quantity + 1, MAX_QTY_PER_ITEM) }
              : item,
          );
        }
        if (prev.length >= MAX_ITEMS) return prev;
        return [
          ...prev,
          {
            id: `${product.id}-${newId()}`,
            product,
            size,
            crust,
            extras: [...extras],
            quantity: 1,
            observations: cleanObs,
          },
        ];
      });
    },
    [],
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    const qty = Math.floor(quantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(qty, MAX_QTY_PER_ITEM) } : item,
      ),
    );
  }, []);

  const updateObservations = useCallback((id: string, observations: string) => {
    const clean = observations.slice(0, 200);
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, observations: clean } : item)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0),
    [items],
  );
  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const getSubtotal = useCallback(() => subtotal, [subtotal]);
  const getTotal = useCallback(() => subtotal + DELIVERY_FEE, [subtotal]);
  const getItemCount = useCallback(() => itemCount, [itemCount]);

  const updateCustomer = useCallback((field: keyof CustomerInfo, value: string) => {
    const limits: Record<keyof CustomerInfo, number> = {
      name: 80,
      phone: 20,
      cep: 9,
      address: 120,
      number: 12,
      complement: 60,
      neighborhood: 60,
      reference: 120,
    };
    setCheckout((prev) => ({
      ...prev,
      customer: { ...prev.customer, [field]: value.slice(0, limits[field]) },
    }));
  }, []);

  const setPayment = useCallback((method: PaymentMethod) => {
    setCheckout((prev) => ({ ...prev, payment: method }));
  }, []);

  const setCashAmount = useCallback((amount: string) => {
    // Aceita apenas dígitos, ponto e vírgula, até 12 caracteres.
    const clean = amount.replace(/[^\d.,]/g, '').slice(0, 12);
    setCheckout((prev) => ({ ...prev, cashAmount: clean }));
  }, []);

  const resetCheckout = useCallback(() => {
    setCheckout({ customer: EMPTY_CUSTOMER, payment: 'pix', cashAmount: '' });
  }, []);

  const getChange = useCallback(() => {
    if (checkout.payment !== 'cash' || !checkout.cashAmount) return 0;
    const cash = parseBRLInput(checkout.cashAmount);
    if (!Number.isFinite(cash)) return 0;
    return cash - (subtotal + DELIVERY_FEE);
  }, [checkout.payment, checkout.cashAmount, subtotal]);

  const value = useMemo<CartContextType>(
    () => ({
      items,
      checkout,
      isCartOpen,
      isCheckoutOpen,
      addItem,
      removeItem,
      updateQuantity,
      updateObservations,
      clearCart,
      getSubtotal,
      getTotal,
      getItemCount,
      setCartOpen,
      setCheckoutOpen,
      updateCustomer,
      setPayment,
      setCashAmount,
      resetCheckout,
      getChange,
    }),
    [
      items,
      checkout,
      isCartOpen,
      isCheckoutOpen,
      addItem,
      removeItem,
      updateQuantity,
      updateObservations,
      clearCart,
      getSubtotal,
      getTotal,
      getItemCount,
      updateCustomer,
      setPayment,
      setCashAmount,
      resetCheckout,
      getChange,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

export { getItemPrice };
