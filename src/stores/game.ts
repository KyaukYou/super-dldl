import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { BoneSlot, Character, Faction, InventoryItem, QuickSlot, SkillDef, SpiritRing } from '@/types/game'
import { getRankTitle, type RingColor } from '@/types/game'
import { BONES, getExpToNext, ITEMS, SKILLS, SPIRITS } from '@/data/gameData'
import {
  nextAbsorbableRingSlot as getNextAbsorbableRingSlot,
  SPIRIT_RING_ITEMS,
  spiritRingColorForYear,
} from '@/game/utils/spiritRingDrops'
const SAVE_KEY = 'chaoyue-dalu-save'
const QUICK_SLOT_COUNT = 8

export interface PendingRingChoice {
  slot: number
  color: RingColor
  year: number
  skills: SkillDef[]
  sourceItemId: string
  sourceYear?: number
}

export const useGameStore = defineStore('game', () => {
  const character = ref<Character | null>(null)
  const inventory = ref<InventoryItem[]>([])
  const quickSlots = ref<QuickSlot[]>(createDefaultQuickSlots())
  const currentMapId = ref<string>('miluo_lake')
  const pendingRingChoice = ref<PendingRingChoice | null>(null)

  const hasCharacter = computed(() => character.value !== null)
  const rankTitle = computed(() => character.value ? getRankTitle(character.value.level) : '')
  const spiritDef = computed(() => {
    if (!character.value) return null
    return SPIRITS.find((spirit) => spirit.id === character.value!.spiritId) ?? null
  })

  function createCharacter(name: string, faction: Faction, spiritId: string) {
    const spirit = SPIRITS.find((item) => item.id === spiritId)
    if (!spirit) return

    const base = spirit.baseStats
    const hp = base.vit * 20 + 100
    const mp = base.int * 15 + 50
    character.value = {
      name,
      level: 1,
      exp: 0,
      expToNext: getExpToNext(1),
      faction,
      spiritId,
      spirit2Id: null,
      rings: [],
      equippedBones: {
        head: null,
        torso: null,
        leftArm: null,
        rightArm: null,
        leftLeg: null,
        rightLeg: null,
        external: null,
      },
      stats: {
        str: base.str,
        agi: base.agi,
        int: base.int,
        vit: base.vit,
        atk: base.str * 2 + 10,
        def: base.vit + 5,
        hp,
        maxHp: hp,
        mp,
        maxMp: mp,
        critRate: 5 + base.agi * 0.5,
        dodgeRate: 3 + base.agi * 0.3,
        atkSpeed: 1.0 + base.agi * 0.02,
        combatPower: 0,
      },
      gold: 100,
    }

    inventory.value = [
      { itemId: 'hp_potion_s', quantity: 10 },
      { itemId: 'mp_potion_s', quantity: 10 },
    ]
    quickSlots.value = createDefaultQuickSlots(['hp_potion_s', 'mp_potion_s'])

    recalculateStats()
    if (character.value) {
      character.value.stats.hp = character.value.stats.maxHp
      character.value.stats.mp = character.value.stats.maxMp
    }
    saveGame()
  }

  function addRing(ring: SpiritRing) {
    if (!character.value) return
    const normalizedRing = normalizeRingColor(ring)
    const existing = character.value.rings.findIndex((item) => item.slot === normalizedRing.slot)
    if (existing >= 0) character.value.rings[existing] = normalizedRing
    else character.value.rings.push(normalizedRing)
    normalizeRingSlots()
    saveGame()
  }

  function normalizeRingColor(ring: SpiritRing): SpiritRing {
    return {
      ...ring,
      color: spiritRingColorForYear(ring.yearRange),
    }
  }

  function normalizeRingColors() {
    if (!character.value) return
    character.value.rings = character.value.rings.map(normalizeRingColor)
  }

  function normalizeRingSlots() {
    if (!character.value) return
    character.value.rings = [...character.value.rings]
      .sort((a, b) => a.slot - b.slot)
      .map((ring, index) => ({
        ...normalizeRingColor(ring),
        slot: index + 1,
      }))
  }

  function equipBone(slot: BoneSlot, boneId: string) {
    if (!character.value) return
    character.value.equippedBones[slot] = boneId
    recalculateStats()
    saveGame()
  }

  function unequipBone(slot: BoneSlot) {
    if (!character.value) return
    character.value.equippedBones[slot] = null
    recalculateStats()
    saveGame()
  }

  function recalculateStats() {
    if (!character.value) return
    normalizeRingSlots()
    const base = SPIRITS.find((spirit) => spirit.id === character.value!.spiritId)?.baseStats
    if (!base) return

    const stats = character.value.stats
    const level = character.value.level
    const baseStr = base.str + (level - 1) * 2
    const baseAgi = base.agi + (level - 1)
    const baseInt = base.int + (level - 1)
    const baseVit = base.vit + (level - 1) * 2

    let boneStr = 0
    let boneAgi = 0
    let boneInt = 0
    let boneVit = 0
    let boneAtk = 0
    let boneDef = 0
    let boneHp = 0
    let boneMp = 0
    let boneCrit = 0
    let boneDodge = 0
    let boneSpeed = 0

    for (const boneId of Object.values(character.value.equippedBones)) {
      if (!boneId) continue
      const bone = BONES.find((item) => item.id === boneId)
      if (!bone) continue
      const bs = bone.stats
      boneStr += bs.str ?? 0
      boneAgi += bs.agi ?? 0
      boneInt += bs.int ?? 0
      boneVit += bs.vit ?? 0
      boneAtk += bs.atk ?? 0
      boneDef += bs.def ?? 0
      boneHp += bs.maxHp ?? 0
      boneMp += bs.mp ?? 0
      boneCrit += bs.critRate ?? 0
      boneDodge += bs.dodgeRate ?? 0
      boneSpeed += bs.atkSpeed ?? 0
    }

    stats.str = baseStr + boneStr
    stats.agi = baseAgi + boneAgi
    stats.int = baseInt + boneInt
    stats.vit = baseVit + boneVit
    stats.maxHp = stats.vit * 20 + 100 + boneHp
    stats.hp = Math.min(stats.hp, stats.maxHp)
    stats.maxMp = stats.int * 15 + 50 + boneMp
    stats.mp = Math.min(stats.mp, stats.maxMp)
    stats.atk = stats.str * 2 + 10 + boneAtk
    stats.def = stats.vit + 5 + boneDef
    stats.critRate = Math.min(80, 5 + stats.agi * 0.5 + boneCrit)
    stats.dodgeRate = Math.min(80, 3 + stats.agi * 0.3 + boneDodge)
    stats.atkSpeed = 1.0 + stats.agi * 0.02 + boneSpeed
    const ringPower = character.value.rings.reduce((sum, ring) => sum + 500 + Math.floor(ring.yearRange / 10), 0)
    stats.combatPower = Math.floor(stats.atk * 2 + stats.def + stats.maxHp * 0.5 + ringPower)
  }

  function addItem(itemId: string, quantity: number = 1) {
    const existing = inventory.value.find((item) => item.itemId === itemId && item.year === undefined)
    if (existing) existing.quantity += quantity
    else inventory.value.push({ itemId, quantity })
    saveGame()
  }

  function addSpiritRingItem(itemId: string, year: number, quantity: number = 1) {
    const existing = inventory.value.find((item) => item.itemId === itemId && item.year === year)
    if (existing) existing.quantity += quantity
    else inventory.value.push({ itemId, quantity, year })
    saveGame()
  }

  function removeItem(itemId: string, quantity: number = 1, year?: number) {
    const existing = inventory.value.find((item) => item.itemId === itemId && item.year === year)
    if (!existing) return
    existing.quantity -= quantity
    if (existing.quantity <= 0) {
      inventory.value = inventory.value.filter((item) => !(item.itemId === itemId && item.year === year))
    }
    saveGame()
  }

  function createDefaultQuickSlots(defaultItems: string[] = []): QuickSlot[] {
    return Array.from({ length: QUICK_SLOT_COUNT }, (_, index) => ({ itemId: defaultItems[index] ?? null }))
  }

  function normalizeQuickSlots(slots: unknown): QuickSlot[] {
    const raw = Array.isArray(slots) ? slots : []
    return Array.from({ length: QUICK_SLOT_COUNT }, (_, index) => {
      const candidate = raw[index] as QuickSlot | string | null | undefined
      const itemId = typeof candidate === 'string' ? candidate : candidate?.itemId
      return { itemId: itemId && canAssignToQuickSlot(itemId) ? itemId : null }
    })
  }

  function canAssignToQuickSlot(itemId: string): boolean {
    const def = ITEMS.find((item) => item.id === itemId)
    return def?.type === 'potion'
  }

  function assignQuickSlot(slotIndex: number, itemId: string): boolean {
    if (slotIndex < 0 || slotIndex >= QUICK_SLOT_COUNT || !canAssignToQuickSlot(itemId)) return false
    quickSlots.value[slotIndex] = { itemId }
    saveGame()
    return true
  }

  function clearQuickSlot(slotIndex: number) {
    if (slotIndex < 0 || slotIndex >= QUICK_SLOT_COUNT) return
    quickSlots.value[slotIndex] = { itemId: null }
    saveGame()
  }

  function useQuickSlot(slotIndex: number): boolean {
    if (!character.value || slotIndex < 0 || slotIndex >= QUICK_SLOT_COUNT) return false
    const itemId = quickSlots.value[slotIndex]?.itemId
    if (!itemId) return false
    const item = inventory.value.find((entry) => entry.itemId === itemId)
    if (!item || item.quantity <= 0) return false
    return usePotionItem(itemId)
  }

  function usePotionItem(itemId: string): boolean {
    if (!character.value || !canAssignToQuickSlot(itemId)) return false
    const stats = character.value.stats
    let used = false
    if (itemId.includes('hp_potion') && stats.hp < stats.maxHp) {
      const amount = itemId.includes('_l') ? 500 : itemId.includes('_m') ? 200 : 80
      stats.hp = Math.min(stats.maxHp, stats.hp + amount)
      used = true
    } else if (itemId.includes('mp_potion') && stats.mp < stats.maxMp) {
      const amount = itemId.includes('_l') ? 400 : itemId.includes('_m') ? 150 : 60
      stats.mp = Math.min(stats.maxMp, stats.mp + amount)
      used = true
    } else if (itemId.includes('exp_potion')) {
      const exp = itemId.includes('_l') ? 8000 : itemId.includes('_m') ? 2000 : 500
      addExp(exp)
      used = true
    } else if (itemId === 'allheal_potion' && (stats.hp < stats.maxHp || stats.mp < stats.maxMp)) {
      stats.hp = stats.maxHp
      stats.mp = stats.maxMp
      used = true
    }
    if (!used) return false
    removeItem(itemId, 1)
    saveGame()
    return true
  }

  function useSpiritStone(itemId: string): boolean {
    if (!character.value) return false
    const bonusYear = itemId === 'scroll_s1' ? 100 : itemId === 'scroll_m1' ? 500 : 0
    if (bonusYear <= 0) return false
    const firstRing = character.value.rings.find((ring) => ring.slot === 1) ?? character.value.rings[0]
    if (!firstRing) return false
    firstRing.yearRange += bonusYear
    firstRing.color = spiritRingColorForYear(firstRing.yearRange)
    removeItem(itemId, 1)
    recalculateStats()
    saveGame()
    return true
  }

  function addExp(amount: number) {
    if (!character.value) return
    character.value.exp += amount
    while (character.value.exp >= character.value.expToNext) {
      character.value.exp -= character.value.expToNext
      character.value.level += 1
      character.value.expToNext = getExpToNext(character.value.level)

      recalculateStats()
      character.value.stats.hp = character.value.stats.maxHp
      character.value.stats.mp = character.value.stats.maxMp
    }
    saveGame()
  }

  function nextAbsorbableRingSlot(): number | null {
    if (!character.value) return null
    return getNextAbsorbableRingSlot(character.value.level, character.value.rings)
  }

  function openRingChoiceFromItem(itemId: string, year?: number): boolean {
    if (!character.value) return false
    const currentCharacter = character.value
    const ringInfo = SPIRIT_RING_ITEMS[itemId]
    if (!ringInfo) return false

    const slot = nextAbsorbableRingSlot()
    if (!slot) return false

    const series = SPIRITS.find((spirit) => spirit.id === currentCharacter.spiritId)?.series ?? 'strength'
    const skills = SKILLS.filter((skill) => skill.series === series && skill.ringSlot === slot)
    pendingRingChoice.value = {
      slot,
      color: ringInfo.color,
      year: typeof year === 'number' && year > 0 ? year : ringInfo.year,
      skills,
      sourceItemId: itemId,
      sourceYear: year,
    }
    saveGame()
    return true
  }

  function hasOpenRingSlot(): boolean {
    return nextAbsorbableRingSlot() !== null
  }

  function cancelRingChoice() {
    pendingRingChoice.value = null
    saveGame()
  }

  function confirmRingChoice(skillId: string) {
    if (!character.value || !pendingRingChoice.value) return
    const pendingChoice = pendingRingChoice.value
    const ring: SpiritRing = {
      slot: pendingChoice.slot,
      color: pendingChoice.color,
      yearRange: pendingChoice.year,
      skillId,
    }
    addRing(ring)
    removeItem(pendingChoice.sourceItemId, 1, pendingChoice.sourceYear)
    pendingRingChoice.value = null
    recalculateStats()
    saveGame()
  }

  function addGold(amount: number) {
    if (!character.value) return
    character.value.gold += amount
    saveGame()
  }

  function saveGame() {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      character: character.value,
      inventory: inventory.value,
      quickSlots: quickSlots.value,
      currentMapId: currentMapId.value,
    }))
  }

  function loadGame(): boolean {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return false
    try {
      const data = JSON.parse(raw)
      character.value = data.character
      inventory.value = (data.inventory ?? []).map((item: InventoryItem) => ({
        itemId: item.itemId,
        quantity: item.quantity,
        year: typeof item.year === 'number' ? item.year : undefined,
      }))
      quickSlots.value = normalizeQuickSlots(data.quickSlots)
      currentMapId.value = data.currentMapId ?? 'miluo_lake'
      normalizeRingColors()
      normalizeRingSlots()
      recalculateStats()
      return true
    } catch {
      return false
    }
  }

  function deleteSave() {
    localStorage.removeItem(SAVE_KEY)
    character.value = null
    inventory.value = []
    quickSlots.value = createDefaultQuickSlots()
    pendingRingChoice.value = null
  }

  return {
    character,
    inventory,
    quickSlots,
    currentMapId,
    pendingRingChoice,
    hasCharacter,
    rankTitle,
    spiritDef,
    createCharacter,
    addRing,
    equipBone,
    unequipBone,
    recalculateStats,
    addItem,
    addSpiritRingItem,
    removeItem,
    canAssignToQuickSlot,
    assignQuickSlot,
    clearQuickSlot,
    useQuickSlot,
    usePotionItem,
    useSpiritStone,
    addExp,
    openRingChoiceFromItem,
    hasOpenRingSlot,
    cancelRingChoice,
    confirmRingChoice,
    addGold,
    saveGame,
    loadGame,
    deleteSave,
  }
})
