import { NextResponse } from "next/server";
import { InteractionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const VALID_INTERACTION_TYPES = new Set<string>(Object.values(InteractionType));

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const workerId = typeof body?.workerId === "string" ? body.workerId.trim() : "";
    const type = typeof body?.type === "string" ? body.type.trim() : "";

    if (!workerId || !VALID_INTERACTION_TYPES.has(type)) {
      return NextResponse.json(
        { success: false, error: "Invalid tracking parameters" },
        { status: 400 }
      );
    }

    const workerExists = await prisma.worker.findUnique({
      where: { id: workerId },
      select: { id: true },
    });

    if (!workerExists) {
      return NextResponse.json(
        { success: false, error: "Worker not found" },
        { status: 404 }
      );
    }

    const interactionType = type as InteractionType;

    // 1. Log the interaction event (for time-based analytics)
    await prisma.workerInteraction.create({
      data: {
        workerId,
        type: interactionType,
      },
    });

    // 2. Increment the aggregate counter on the Worker model for instant UI reads
    let updateField = {};
    if (interactionType === "VIEW") updateField = { profileViews: { increment: 1 } };
    else if (interactionType === "CALL") updateField = { callClicks: { increment: 1 } };
    else if (interactionType === "WHATSAPP") updateField = { whatsappClicks: { increment: 1 } };
    else if (interactionType === "SHARE") updateField = { shareClicks: { increment: 1 } };

    if (Object.keys(updateField).length > 0) {
      await prisma.worker.update({
        where: { id: workerId },
        data: updateField,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
