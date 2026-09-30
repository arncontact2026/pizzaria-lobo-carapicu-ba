/** Busca de endereço por CEP usando a API pública ViaCEP. */

export interface CepAddress {
  street: string;
  neighborhood: string;
  city: string;
  uf: string;
}

interface ViaCepResponse {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: string;
}

export async function fetchAddressByCep(cep: string): Promise<CepAddress> {
  const digits = cep.replace(/\D/g, '').slice(0, 8);
  if (digits.length !== 8) throw new Error('CEP incompleto.');

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
      signal: controller.signal,
    });
    if (!res.ok) throw new Error('Não foi possível buscar o CEP agora.');
    const data = (await res.json()) as ViaCepResponse;
    if (!data || data.erro) throw new Error('CEP não encontrado.');
    return {
      street: data.logradouro ?? '',
      neighborhood: data.bairro ?? '',
      city: data.localidade ?? '',
      uf: data.uf ?? '',
    };
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error('Não foi possível buscar o CEP agora.');
  } finally {
    window.clearTimeout(timeout);
  }
}
