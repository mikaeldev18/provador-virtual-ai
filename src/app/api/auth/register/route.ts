import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { generateStoreId, generateApiKey } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, storeName, storeUrl } = await req.json();

    if (!name || !email || !password || !storeName || !storeUrl) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Senha muito curta (mínimo 6 caracteres)' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const storeId = generateStoreId();
    const apiKey = generateApiKey();

    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setDate(periodEnd.getDate() + 30);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        storeName,
        storeUrl,
        storeId,
        apiKey,
        subscription: {
          create: {
            status: 'active',
            plan: 'basic',
            priceMonthly: 1990,
            freeUsesLimit: 100,
            extraUseCost: 10,
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
          },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Erro interno. Tente novamente.' }, { status: 500 });
  }
}
