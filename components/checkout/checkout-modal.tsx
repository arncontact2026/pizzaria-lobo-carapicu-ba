'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, CreditCard, Banknote, Check, MapPin, User, MessageCircle, Loader2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { generateWhatsAppMessage, openWhatsApp } from '@/lib/whatsapp';
import { formatBRL, isValidBRPhone, parseBRLInput, formatCepInput, cepDigits } from '@/lib/format';
import { fetchAddressByCep } from '@/lib/cep';
import { forceUnlockScroll } from '@/lib/scroll-lock';
import { newOrderRef } from '@/lib/pix';
import { PixPayment } from './pix-payment';
import { ReceiptPreview } from './receipt-preview';
import { ModalShell } from '@/components/modal/modal-shell';
import { PaymentMethod } from '@/lib/types';

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  pix: 'PIX',
  card: 'CARTÃO',
  cash: 'DINHEIRO',
};

const inputCls =
  'w-full p-3 bg-background border border-border rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary';

export function CheckoutModal() {
  const {
    items,
    checkout,
    isCheckoutOpen,
    setCheckoutOpen,
    updateCustomer,
    setPayment,
    setCashAmount,
    resetCheckout,
    getSubtotal,
    getTotal,
    getChange,
    clearCart,
  } = useCart();

  const [submitted, setSubmitted] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [sending, setSending] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');
  const [cepCity, setCepCity] = useState('');
  const lastCepFetched = useRef('');

  useEffect(() => {
    if (isCheckoutOpen) {
      setAttempted(false);
      setSending(false);
      setOrderRef(newOrderRef());
      setCepError('');
      setCepCity('');
      lastCepFetched.current = '';
    }
  }, [isCheckoutOpen]);

  const handleClose = useCallback(() => {
    const wasSubmitted = submitted;
    setSubmitted(false);
    setCheckoutOpen(false);
    if (wasSubmitted) {
      // Pedido concluído: volta ao topo para recomeçar.
      window.setTimeout(() => {
        forceUnlockScroll();
        window.scrollTo({ top: 0, behavior: 'auto' });
      }, 120);
    }
  }, [submitted, setCheckoutOpen]);

  const subtotal = getSubtotal();
  const total = getTotal();
  const change = getChange();

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    const c = checkout.customer;
    if (c.name.trim().length < 2) e.name = 'Informe seu nome.';
    if (!isValidBRPhone(c.phone)) e.phone = 'Informe um telefone válido com DDD.';
    const cepD = cepDigits(c.cep);
    if (cepD && cepD.length !== 8) e.cep = 'CEP incompleto.';
    if (c.address.trim().length < 3) e.address = 'Informe sua rua ou avenida.';
    if (!c.number.trim()) e.number = 'Informe o número.';
    if (c.neighborhood.trim().length < 2) e.neighborhood = 'Informe seu bairro.';
    if (checkout.payment === 'cash' && checkout.cashAmount) {
      const cash = parseBRLInput(checkout.cashAmount);
      if (!Number.isFinite(cash) || cash <= 0) e.cashAmount = 'Informe um valor válido.';
      else if (cash < total) e.cashAmount = 'Valor abaixo do total do pedido.';
    }
    return e;
  }, [checkout, total]);

  const isValid = Object.keys(errors).length === 0 && items.length > 0;
  const showError = (field: string) => attempted && errors[field];

  const handleCepChange = (value: string) => {
    const formatted = formatCepInput(value);
    updateCustomer('cep', formatted);
    setCepError('');
    const digits = cepDigits(formatted);
    if (digits.length === 8 && digits !== lastCepFetched.current) {
      lastCepFetched.current = digits;
      setCepLoading(true);
      setCepCity('');
      fetchAddressByCep(digits)
        .then((addr) => {
          if (addr.street) updateCustomer('address', addr.street.slice(0, 120));
          if (addr.neighborhood) updateCustomer('neighborhood', addr.neighborhood.slice(0, 60));
          if (addr.city) setCepCity(`${addr.city}${addr.uf ? `/${addr.uf}` : ''}`);
        })
        .catch((err: Error) => {
          setCepError(err.message || 'Não foi possível buscar o CEP agora.');
          setCepCity('');
        })
        .finally(() => setCepLoading(false));
    }
  };

  const handleSubmit = () => {
    setAttempted(true);
    if (!isValid || sending) return;
    setSending(true);
    try {
      const message = generateWhatsAppMessage(items, checkout, subtotal, orderRef || undefined);
      openWhatsApp(message);
      // Pedido enviado: zera a sacola e os dados para o próximo pedido.
      clearCart();
      resetCheckout();
      setSubmitted(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <ModalShell label="Finalizar pedido" variant="sheet" onClose={handleClose}>
            {submitted ? (
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="w-8 h-8 text-white" aria-hidden />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Pedido enviado</h3>
                <p className="text-muted-foreground mb-2 leading-relaxed">
                  Abrimos o WhatsApp com seu pedido prontinho. É só apertar enviar por lá.
                </p>
                {checkout.payment === 'pix' ? (
                  <p className="text-sm text-muted-foreground mb-6">
                    Não esqueça de <strong>anexar o comprovante do Pix</strong> na conversa para
                    confirmarmos seu pedido.
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground mb-6">
                    Fique de olho no celular: confirmamos a taxa de entrega e o tempo de preparo.
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleClose}
                  className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-xl hover:bg-primary/90 transition-all"
                >
                  Voltar ao início
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-card z-10">
                  <h2 className="text-lg font-bold">Finalizar pedido</h2>
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Fechar finalização"
                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/70"
                  >
                    <X className="w-4 h-4" aria-hidden />
                  </button>
                </div>

                <div className="p-5 space-y-6">
                  {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      Sua sacola está vazia. Adicione um item do cardápio para continuar.
                    </p>
                  ) : (
                    <>
                      {/* Customer Info */}
                      <section aria-labelledby="checkout-dados">
                        <h4
                          id="checkout-dados"
                          className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2"
                        >
                          <User className="w-4 h-4" aria-hidden />
                          Seus dados
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label htmlFor="co-name" className="sr-only">Seu nome</label>
                            <input
                              id="co-name"
                              placeholder="Seu nome *"
                              autoComplete="name"
                              maxLength={80}
                              value={checkout.customer.name}
                              onChange={(e) => updateCustomer('name', e.target.value)}
                              aria-invalid={!!showError('name')}
                              className={inputCls}
                            />
                            {showError('name') && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                          </div>
                          <div>
                            <label htmlFor="co-phone" className="sr-only">Telefone com DDD</label>
                            <input
                              id="co-phone"
                              placeholder="Telefone com DDD *"
                              autoComplete="tel"
                              inputMode="tel"
                              maxLength={20}
                              value={checkout.customer.phone}
                              onChange={(e) => updateCustomer('phone', e.target.value)}
                              aria-invalid={!!showError('phone')}
                              className={inputCls}
                            />
                            {showError('phone') && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                          </div>
                        </div>
                      </section>

                      {/* Address */}
                      <section aria-labelledby="checkout-endereco">
                        <h4
                          id="checkout-endereco"
                          className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2"
                        >
                          <MapPin className="w-4 h-4" aria-hidden />
                          Onde entregamos
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label htmlFor="co-cep" className="sr-only">CEP</label>
                            <div className="relative">
                              <input
                                id="co-cep"
                                placeholder="CEP (preenche o endereço sozinho)"
                                autoComplete="postal-code"
                                inputMode="numeric"
                                maxLength={9}
                                value={checkout.customer.cep}
                                onChange={(e) => handleCepChange(e.target.value)}
                                aria-invalid={!!showError('cep')}
                                className={inputCls}
                              />
                              {cepLoading && (
                                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-spin" aria-hidden />
                              )}
                            </div>
                            {showError('cep') ? (
                              <p className="text-xs text-destructive mt-1">{errors.cep}</p>
                            ) : cepError ? (
                              <p className="text-xs text-destructive mt-1">{cepError}</p>
                            ) : cepCity ? (
                              <p className="text-xs text-green-700 font-medium mt-1">
                                Endereço localizado: {cepCity}. Confira os campos abaixo.
                              </p>
                            ) : null}
                          </div>
                          <div>
                            <label htmlFor="co-address" className="sr-only">Rua ou avenida</label>
                            <input
                              id="co-address"
                              placeholder="Rua / Avenida *"
                              autoComplete="street-address"
                              maxLength={120}
                              value={checkout.customer.address}
                              onChange={(e) => updateCustomer('address', e.target.value)}
                              aria-invalid={!!showError('address')}
                              className={inputCls}
                            />
                            {showError('address') && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label htmlFor="co-number" className="sr-only">Número</label>
                              <input
                                id="co-number"
                                placeholder="Número *"
                                inputMode="numeric"
                                maxLength={12}
                                value={checkout.customer.number}
                                onChange={(e) => updateCustomer('number', e.target.value)}
                                aria-invalid={!!showError('number')}
                                className={inputCls}
                              />
                            </div>
                            <div className="col-span-2">
                              <label htmlFor="co-complement" className="sr-only">Complemento</label>
                              <input
                                id="co-complement"
                                placeholder="Complemento (apto, bloco)"
                                maxLength={60}
                                value={checkout.customer.complement}
                                onChange={(e) => updateCustomer('complement', e.target.value)}
                                className={inputCls}
                              />
                            </div>
                          </div>
                          {showError('number') && <p className="text-xs text-destructive -mt-1">{errors.number}</p>}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label htmlFor="co-neighborhood" className="sr-only">Bairro</label>
                              <input
                                id="co-neighborhood"
                                placeholder="Bairro *"
                                maxLength={60}
                                value={checkout.customer.neighborhood}
                                onChange={(e) => updateCustomer('neighborhood', e.target.value)}
                                aria-invalid={!!showError('neighborhood')}
                                className={inputCls}
                              />
                              {showError('neighborhood') && (
                                <p className="text-xs text-destructive mt-1">{errors.neighborhood}</p>
                              )}
                            </div>
                            <div>
                              <label htmlFor="co-reference" className="sr-only">Ponto de referência</label>
                              <input
                                id="co-reference"
                                placeholder="Referência"
                                maxLength={120}
                                value={checkout.customer.reference}
                                onChange={(e) => updateCustomer('reference', e.target.value)}
                                className={inputCls}
                              />
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Payment */}
                      <section aria-labelledby="checkout-pagamento">
                        <h4
                          id="checkout-pagamento"
                          className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3"
                        >
                          Como vai pagar
                        </h4>
                        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Forma de pagamento">
                          {(
                            [
                              { method: 'pix' as PaymentMethod, icon: QrCode, label: 'Pix' },
                              { method: 'card' as PaymentMethod, icon: CreditCard, label: 'Cartão' },
                              { method: 'cash' as PaymentMethod, icon: Banknote, label: 'Dinheiro' },
                            ]
                          ).map(({ method, icon: Icon, label }) => {
                            const active = checkout.payment === method;
                            return (
                              <button
                                key={method}
                                type="button"
                                role="radio"
                                aria-checked={active}
                                onClick={() => setPayment(method)}
                                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                                  active ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                                }`}
                              >
                                <Icon
                                  className={`w-5 h-5 ${active ? 'text-primary' : 'text-muted-foreground'}`}
                                  aria-hidden
                                />
                                <span className="text-xs font-medium">{label}</span>
                              </button>
                            );
                          })}
                        </div>

                        {checkout.payment === 'cash' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 overflow-hidden"
                          >
                            <label htmlFor="co-cash" className="sr-only">Valor em dinheiro para troco</label>
                            <input
                              id="co-cash"
                              placeholder="Troco para quanto? (ex.: 100,00)"
                              inputMode="decimal"
                              maxLength={12}
                              value={checkout.cashAmount}
                              onChange={(e) => setCashAmount(e.target.value)}
                              aria-invalid={!!showError('cashAmount')}
                              className={inputCls}
                            />
                            {showError('cashAmount') ? (
                              <p className="text-xs text-destructive mt-1">{errors.cashAmount}</p>
                            ) : change > 0 ? (
                              <p className="text-sm text-green-700 font-medium mt-2">
                                Seu troco: {formatBRL(change)}
                              </p>
                            ) : null}
                          </motion.div>
                        )}
                      </section>

                      {/* Pix */}
                      {checkout.payment === 'pix' && items.length > 0 && (
                        <PixPayment amount={total} orderRef={orderRef || 'PEDIDO'} />
                      )}

                      {/* Cupom térmico */}
                      {items.length > 0 && (
                        <ReceiptPreview
                          items={items}
                          checkout={checkout}
                          subtotal={subtotal}
                          total={total}
                          orderRef={orderRef || '—'}
                          paymentLabel={PAYMENT_LABELS[checkout.payment]}
                        />
                      )}

                      {attempted && !isValid && items.length > 0 && (
                        <p className="text-sm text-destructive" role="alert">
                          Confira os campos destacados acima para concluir seu pedido.
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={sending || items.length === 0}
                        className="w-full bg-green-700 hover:bg-green-800 disabled:bg-muted disabled:text-muted-foreground text-white font-bold py-4 rounded-xl text-base transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-5 h-5" aria-hidden />
                        {sending ? 'Preparando…' : 'Enviar pedido pelo WhatsApp'}
                      </button>
                      <p className="text-[11px] text-muted-foreground text-center -mt-2">
                        Ao enviar, abrimos o WhatsApp com tudo preenchido. Nada é cobrado por aqui.
                      </p>
                    </>
                  )}
                </div>
              </>
            )}
        </ModalShell>
      )}
    </AnimatePresence>
  );
}
