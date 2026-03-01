import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const user = session.user as any;

  const [payments, usages] = await Promise.all([
    prisma.payment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.usage.findMany({
      where: { storeId: user.storeId },
      orderBy: { timestamp: 'desc' },
      take: 500,
    }),
  ]);

  const rows: string[] = [];
  rows.push('=== PAGAMENTOS ===');
  rows.push('Data,Tipo,Valor (R$),Status,Descrição');
  for (const p of payments) {
    rows.push(
      [
        new Date(p.createdAt).toLocaleDateString('pt-BR'),
        p.type === 'subscription' ? 'Assinatura' : 'Usos Extras',
        (p.amount / 100).toFixed(2),
        p.status,
        p.description ?? '',
      ].join(',')
    );
  }

  rows.push('');
  rows.push('=== USOS DO PROVADOR ===');
  rows.push('Data/Hora,Produto,Converteu,Receita (R$),Custo (R$),Extra?');
  for (const u of usages) {
    rows.push(
      [
        new Date(u.timestamp).toLocaleString('pt-BR'),
        (u.productName || u.productUrl || '').replace(/,/g, ' '),
        u.converted ? 'Sim' : 'Não',
        u.revenue.toFixed(2),
        u.cost.toFixed(2),
        u.billedExtra ? 'Sim' : 'Não',
      ].join(',')
    );
  }

  const csv = rows.join('\n');
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="provadorvirtual-${new Date().toISOString().slice(0, 7)}.csv"`,
    },
  });
}
