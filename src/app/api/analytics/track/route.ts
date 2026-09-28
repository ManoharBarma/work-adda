import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { workerId, type } = body;

    if (!workerId || !type) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
    }

    // 1. Log the interaction event (for time-based analytics)
    await prisma.workerInteraction.create({
      data: {
        workerId,
        type
      }
    });

    // 2. Increment the aggregate counter on the Worker model for instant UI reads
    let updateField = {};
    if (type === 'VIEW') updateField = { profileViews: { increment: 1 } };
    else if (type === 'CALL') updateField = { callClicks: { increment: 1 } };
    else if (type === 'WHATSAPP') updateField = { whatsappClicks: { increment: 1 } };
    else if (type === 'SHARE') updateField = { shareClicks: { increment: 1 } };

    if (Object.keys(updateField).length > 0) {
      await prisma.worker.update({
        where: { id: workerId },
        data: updateField
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
