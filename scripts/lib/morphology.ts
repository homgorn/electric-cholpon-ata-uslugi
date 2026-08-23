// scripts/lib/morphology.ts — Russian declension helpers (prepositional case + unit accusative)

/**
 * Simple Russian prepositional case generator for location names.
 * Covers common patterns for Kyrgyz/Russian geographic names.
 * Falls back to nominative if no rule matches.
 */
export function getPrepositional(name: string): string {
  // Already pre-computed in data (pre field) — use that as source of truth
  // This function is for dynamic generation when pre is not available
  return applyPrepositionalRules(name);
}

/**
 * Apply Russian prepositional case rules (в ком? в чём?)
 * Handles common patterns for Kyrgyz geographic names
 */
function applyPrepositionalRules(nominative: string): string {
  const n = nominative.trim();

  // Multi-word names: decline last word only (usually)
  const words = n.split(/\s+/);
  if (words.length > 1) {
    const last = words[words.length - 1];
    const declinedLast = declineSingleWord(last);
    if (declinedLast !== last) {
      return words.slice(0, -1).join(' ') + ' ' + declinedLast;
    }
  }

  return declineSingleWord(n);
}

function declineSingleWord(word: string): string {
  const w = word.trim();
  const lower = w.toLowerCase();

  // Proper nouns ending in -а, -я (feminine) → -е
  if (/[ая]$/i.test(w)) {
    return w.slice(0, -1) + (lower.endsWith('а') ? 'е' : 'е');
  }

  // Proper nouns ending in -о, -е (neuter) → -е
  if (/[оёе]$/i.test(w)) {
    return w.slice(0, -1) + 'е';
  }

  // Masculine ending in consonant → +е (Кара-Ой → Кара-Ое)
  if (/^[А-ЯA-Z]/.test(w) && /[бвгджзйклмнпрстфхцчшщ]$/i.test(w)) {
    return w + 'е';
  }

  // -й → -е (Кызыл-Орюк → Кызыл-Орюке)
  if (/й$/i.test(w)) {
    return w.slice(0, -1) + 'е';
  }

  // -ь → -и (if any)
  if (/ь$/i.test(w)) {
    return w.slice(0, -1) + 'и';
  }

  // -ы, -и (plural-like) → unchanged typically
  if (/[ыи]$/i.test(w)) {
    return w;
  }

  // -ово, -ево (neuter) → -ове (Ананьево → Ананьеве)
  if (/ово$/i.test(w)) return w.slice(0, -3) + 'ове';
  if (/ево$/i.test(w)) return w.slice(0, -3) + 'еве';

  // -ин, -ын → -ине (Кызыл-Орюк → Кызыл-Орюке handled above)
  if (/ын$/i.test(w)) return w.slice(0, -2) + 'ине';

  // Fallback: return as-is (many Kyrgyz names are indeclinable in practice)
  return w;
}

/**
 * Accusative case for units (за что? → за точку)
 */
export function getAccusativeUnit(unit: string): string {
  const unitMap: Record<string, string> = {
    'точка': 'точку',
    'точки': 'точки',
    'камера': 'камеру',
    'контур': 'контур',
    'м': 'метр',
    'м²': 'м²',
    'м2': 'м2',
    'шт': 'шт',
    'шт.': 'шт.',
    'выезд': 'выезд',
    'час': 'час',
    'объект': 'объект',
    'шлейф': 'шлейф',
    'система': 'систему',
    'комплект': 'комплект',
  };

  const normalized = unit.trim().toLowerCase();
  return unitMap[normalized] || unitMap[unit.trim()] || unit;
}

/**
 * Get prepositional form from location's pre field or generate
 */
export function getLocPre(loc: { pre?: string; name: string }): string {
  return loc.pre?.trim() || applyPrepositionalRules(loc.name);
}

/**
 * Unit accusative with fallback
 */
export function getUnitAcc(unit: string): string {
  return getAccusativeUnit(unit);
}