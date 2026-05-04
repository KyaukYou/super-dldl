import type { RingColor, Quality, SpiritRing } from '@/types/game'

export const RING_LEVELS = [10, 20, 30, 40, 50, 60, 70, 80, 90]

export const SPIRIT_RING_ITEMS: Record<string, { color: RingColor; year: number; quality: Quality; label: string }> = {
  spirit_ring_white: { color: 'white', year: 100, quality: 'white', label: '\u5341\u5e74\u9b42\u73af' },
  spirit_ring_yellow: { color: 'yellow', year: 500, quality: 'green', label: '\u767e\u5e74\u9b42\u73af' },
  spirit_ring_purple: { color: 'purple', year: 3000, quality: 'purple', label: '\u5343\u5e74\u9b42\u73af' },
  spirit_ring_black: { color: 'black', year: 20000, quality: 'orange', label: '\u4e07\u5e74\u9b42\u73af' },
  spirit_ring_red: { color: 'red', year: 100000, quality: 'red', label: '\u5341\u4e07\u5e74\u9b42\u73af' },
}

export function spiritRingItemForLevel(level: number): string {
  if (level >= 90) return 'spirit_ring_red'
  if (level >= 70) return 'spirit_ring_black'
  if (level >= 40) return 'spirit_ring_purple'
  if (level >= 20) return 'spirit_ring_yellow'
  return 'spirit_ring_white'
}

export function spiritRingLabel(itemId: string): string {
  return SPIRIT_RING_ITEMS[itemId]?.label ?? '\u9b42\u73af'
}

export function spiritRingLabelWithYear(itemId: string, year?: number): string {
  const label = spiritRingLabel(itemId)
  return typeof year === 'number' && year > 0 ? `${label}(${Math.floor(year)}\u5e74)` : label
}

export function spiritRingYearForMonsterLevel(level: number): number {
  if (level >= 90) return 100000 + (level - 90) * 8000
  if (level >= 70) return 20000 + (level - 70) * 2500
  if (level >= 40) return 3000 + (level - 40) * 420
  if (level >= 20) return 500 + (level - 20) * 80
  return Math.max(10, level * 10)
}

export function spiritRingColorForYear(year: number): RingColor {
  if (year >= 100000) return 'red'
  if (year >= 10000) return 'black'
  if (year >= 1000) return 'purple'
  if (year >= 100) return 'yellow'
  return 'white'
}

export function nextAbsorbableRingSlot(level: number, rings: Pick<SpiritRing, 'slot'>[]): number | null {
  const unlockedSlotCount = RING_LEVELS.filter((requiredLevel) => level >= requiredLevel).length
  if (rings.length >= unlockedSlotCount) return null

  const occupiedSlots = new Set(rings.map((ring) => ring.slot))
  for (let slot = 1; slot <= unlockedSlotCount; slot++) {
    if (!occupiedSlots.has(slot)) return slot
  }

  return null
}

export function canDropSpiritRing(level: number, rings: Pick<SpiritRing, 'slot'>[]): boolean {
  return nextAbsorbableRingSlot(level, rings) !== null
}
