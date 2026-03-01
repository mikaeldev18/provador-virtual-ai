const BASE = "https://api.abacatepay.com/v1";

function getHeaders() {
  const key = process.env.ABACATEPAY_API_KEY;
  if (!key) throw new Error("ABACATEPAY_API_KEY nao definida");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + key,
  };
}

async function apiFetch(path: string, init?: RequestInit): Promise<any> {
  const res = await fetch(BASE + path, {
    ...init,
    headers: { ...getHeaders(), ...((init?.headers as any) ?? {}) },
  });
  const json = await res.json();
  if (json.error) throw new Error("AbacatePay API: " + json.error);
  return json.data;
}

export async function createSubscription(params: {
  userId: string;
  userName: string;
  userEmail: string;
  returnUrl: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  return apiFetch("/billing/create", {
    method: "POST",
    body: JSON.stringify({
      frequency: "ONE_TIME",
      methods: ["PIX", "CARD"],
      products: [
        {
          externalId: "plan-basico-" + params.userId,
          name: "Plano Basico - ProvadorVirtualAI",
          description: "100 usos de provador virtual por mes",
          quantity: 1,
          price: 1990,
        },
      ],
      returnUrl: params.returnUrl,
      completionUrl: appUrl + "/dashboard?payment=success",
      customer: {
        name: params.userName || "Lojista",
        email: params.userEmail,
        cellphone: "(11) 99999-9999",
        taxId: "123.456.789-09",
      },
    }),
  });
}

export async function createPixQrCode(data: {
  amount: number;
  description?: string;
  expiresIn?: number;
  customer?: { name: string; email: string; cellphone: string; taxId: string };
  metadata?: Record<string, string>;
}) {
  return apiFetch("/pixQrCode/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
}