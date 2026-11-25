import { prisma } from "@/lib/prisma";
import {
  ALL_SIRCILLA_NAME_EN,
  ALL_SIRCILLA_NAME_TE,
  ALL_SIRCILLA_SENTINEL,
} from "@/lib/locality";

export async function resolveLocalityId(
  localityId: string,
  customLocality?: string | null,
  customLocalityTelugu?: string | null
): Promise<string> {
  if (localityId === ALL_SIRCILLA_SENTINEL) {
    let allLoc = await prisma.locality.findFirst({
      where: { nameEnglish: { equals: ALL_SIRCILLA_NAME_EN, mode: "insensitive" } },
    });
    if (!allLoc) {
      allLoc = await prisma.locality.create({
        data: {
          nameEnglish: ALL_SIRCILLA_NAME_EN,
          nameTelugu: ALL_SIRCILLA_NAME_TE,
          town: "Sircilla",
          district: "Rajanna Sircilla",
        },
      });
    }
    return allLoc.id;
  }

  if (customLocality && customLocalityTelugu) {
    let newLoc = await prisma.locality.findFirst({
      where: { nameEnglish: customLocality },
    });
    if (!newLoc) {
      newLoc = await prisma.locality.create({
        data: {
          nameEnglish: customLocality,
          nameTelugu: customLocalityTelugu,
          town: "Sircilla",
          district: "Rajanna Sircilla",
        },
      });
    }
    return newLoc.id;
  }

  return localityId;
}
