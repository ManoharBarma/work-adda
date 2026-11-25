export const ALL_SIRCILLA_NAME_EN = "All Sircilla";
export const ALL_SIRCILLA_NAME_TE = "సిరిసిల్ల అంతటా";
export const ALL_SIRCILLA_SENTINEL = "__ALL_SIRCILLA__";

export function isAllSircillaLocality(
  locality?: { nameEnglish?: string | null } | null
): boolean {
  return locality?.nameEnglish?.trim().toLowerCase() === ALL_SIRCILLA_NAME_EN.toLowerCase();
}

export function sortLocalitiesWithAllSircillaFirst<T extends { nameEnglish: string }>(
  localities: T[]
): T[] {
  return [...localities].sort((a, b) => {
    const aIsAll = isAllSircillaLocality(a);
    const bIsAll = isAllSircillaLocality(b);
    if (aIsAll && !bIsAll) return -1;
    if (!aIsAll && bIsAll) return 1;
    return a.nameEnglish.localeCompare(b.nameEnglish);
  });
}
