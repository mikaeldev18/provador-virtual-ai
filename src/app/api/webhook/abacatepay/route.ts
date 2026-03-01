import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyWebhookSignature } from '@/lib/abacatepay';
import { addMonths } from 'date-fns';

/**
 * Webhook do Abacate Pay
 *
 * Eventos (campo `event`):
 *   billing.paid      – status PAID
 *   billing.expired   – status EXPIRED
 *   billing.cancelled – status CANCELLED
 *   billing.refunded  – status REFUNDED
 *
 * O campo `data` segue o tipo IBilling do SDK oficial.
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-abacatepay-signature') ?? '';

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 });
  }

  let payload: { event: string; data: Record<string, unknown> };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }

  const { event, data } = payload;
  const billingId = data?.id as string | undefined;

  console.log(`[AbacatePay webhook] event=${event} billingId=${billingId}`);

  if (!billingId) {
    return NextResponse.json({ error: 'billing id ausente' }, { status: 400 });
  }

  try {
    // Localiza o pagamento salvo no banco pelo ID do Abacate Pay
    const payment = await prisma.payment.findFirst({
      where: { abacatePayId: billingId },
    });

    switch (event) {
      // ── Pagamento confirmado ──────────────────────────────────────────────
      case 'billing.paid': {
        await prisma.payment.updateMany({
          where: { abacatePayId: billingId },
          data: { status: 'paid', paidAt: new Date() },
        });

        if (payment?.type === 'subscription') {
          const now = new Date();
          await prisma.subscription.update({
            where: { userId: payment.userId },
            data: {
              status: 'active',
              abacatePayId: billingId,
              currentPeriodStart: now,
              currentPeriodEnd: addMonths(now, 1),
            },
          });
          console.log(`[AbacatePay] Assinatura ativada – userId=${payment.userId}`);
        }

        if (payment?.type === 'extra_usage') {
          console.log(`[AbacatePay] Usos extras pagos – userId=${payment.userId}`);
        }
        break;
      }

      // ── Cobrança expirada ────────────────────────────────────────────────
      case 'billing.expired': {
        await prisma.payment.updateMany({
          where: { abacatePayId: billingId },
          data: { status: 'expired' },
        });

        if (payment?.type === 'subscription') {
          await prisma.subscription.updateMany({
            where: { userId: payment.userId },
            data: { status: 'past_due' },
          });
        }
        break;
      }

      // ── Cobrança cancelada ───────────────────────────────────────────────
      case 'billing.cancelled': {
        await prisma.payment.updateMany({
          where: { abacatePayId: billingId },
          data: { status: 'failed' },
        });

        if (payment?.type === 'subscription') {
          await prisma.subscription.updateMany({
            where: { userId: payment.userId },
            data: { status: 'cancelled' },
          });
        }
        break;
      }

      // ── Estorno ──────────────────────────────────────────────────────────
      case 'billing.refunded': {
        await prisma.payment.updateMany({
          where: { abacatePayId: billingId },
          data: { status: 'failed' },
        });
        break;
      }

      default:
        console.log(`[AbacatePay webhook] evento não tratado: ${event}`);
    }
  } catch (error) {
    console.error('[AbacatePay webhook] Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
