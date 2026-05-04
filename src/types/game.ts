export type Faction = 'wuhundian' | 'tiandou' | 'xingluo'

export const FACTION_NAMES: Record<Faction, string> = {
  wuhundian: '武魂殿',
  tiandou: '天斗帝国',
  xingluo: '星罗帝国',
}

export type SpiritSeries = 'strength' | 'agility' | 'intelligence'

export const SERIES_NAMES: Record<SpiritSeries, string> = {
  strength: '强攻系',
  agility: '敏攻系',
  intelligence: '控制系',
}

export type RingColor = 'white' | 'yellow' | 'purple' | 'black' | 'red'

export const RING_COLOR_MAP: Record<RingColor, { label: string; css: string }> = {
  white: { label: '十年', css: '#e0e0e0' },
  yellow: { label: '百年', css: '#ffd700' },
  purple: { label: '千年', css: '#b44aff' },
  black: { label: '万年', css: '#1a1a2e' },
  red: { label: '十万年', css: '#ff4a4a' },
}

export type Quality = 'white' | 'green' | 'blue' | 'purple' | 'orange' | 'red'

export const QUALITY_NAMES: Record<Quality, string> = {
  white: '普通',
  green: '精良',
  blue: '稀有',
  purple: '史诗',
  orange: '传说',
  red: '神话',
}

export type BoneSlot = 'head' | 'torso' | 'leftArm' | 'rightArm' | 'leftLeg' | 'rightLeg' | 'external'

export const BONE_SLOT_NAMES: Record<BoneSlot, string> = {
  head: '头部魂骨',
  torso: '躯干魂骨',
  leftArm: '左臂魂骨',
  rightArm: '右臂魂骨',
  leftLeg: '左腿魂骨',
  rightLeg: '右腿魂骨',
  external: '外附魂骨',
}

export type RankTitle =
  | 'hunshi' | 'hunshi2' | 'dahunshi' | 'hunzun'
  | 'hunzong' | 'hunwang' | 'hundi' | 'hunsheng'
  | 'hundouluo' | 'fenghaodouluo'

export const RANK_TITLES: { min: number; max: number; title: string }[] = [
  { min: 1, max: 10, title: '魂士' },
  { min: 11, max: 20, title: '魂师' },
  { min: 21, max: 30, title: '大魂师' },
  { min: 31, max: 40, title: '魂尊' },
  { min: 41, max: 50, title: '魂宗' },
  { min: 51, max: 60, title: '魂王' },
  { min: 61, max: 70, title: '魂帝' },
  { min: 71, max: 80, title: '魂圣' },
  { min: 81, max: 90, title: '魂斗罗' },
  { min: 91, max: 99, title: '封号斗罗' },
]

export function getRankTitle(level: number): string {
  const rank = RANK_TITLES.find((item) => level >= item.min && level <= item.max)
  return rank?.title ?? '魂士'
}

export interface SpiritDef {
  id: string
  name: string
  series: SpiritSeries
  icon?: string
  innatePower: number
  talent: string
  baseStats: { str: number; agi: number; int: number; vit: number }
}

export interface SkillDef {
  id: string
  name: string
  series: SpiritSeries
  icon?: string
  type: 'damage' | 'buff' | 'debuff' | 'heal' | 'control'
  description: string
  cooldown: number
  ringSlot: number
  mpCost: number
  damageMultiplier?: number
  statBuff?: { stat: string; multiplier: number; duration: number }
  statDebuff?: { stat: string; multiplier: number; duration: number }
  healAmount?: number
  controlDuration?: number
}

export interface SpiritRing {
  slot: number
  color: RingColor
  yearRange: number
  skillId: string | null
}

export interface BoneDef {
  id: string
  name: string
  icon?: string
  slot: BoneSlot
  quality: Quality
  stats: Record<string, number>
  source: string
}

export interface CharacterStats {
  str: number
  agi: number
  int: number
  vit: number
  atk: number
  def: number
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  critRate: number
  dodgeRate: number
  atkSpeed: number
  combatPower: number
}

export interface Character {
  name: string
  level: number
  exp: number
  expToNext: number
  faction: Faction
  spiritId: string
  spirit2Id: string | null
  rings: SpiritRing[]
  equippedBones: Record<BoneSlot, string | null>
  stats: CharacterStats
  gold: number
}

export interface MapDef {
  id: string
  name: string
  minLevel: number
  faction: Faction | 'public'
  tilemapKey: string
  bosses: string[]
  dropTable: string[]
}

export interface ItemDef {
  id: string
  name: string
  icon?: string
  quality: Quality
  type: 'equipment' | 'material' | 'potion' | 'bone' | 'bone_scroll' | 'special' | 'spirit_ring'
  description: string
  stackable: boolean
  maxStack: number
  sellPrice: number
}

export interface InventoryItem {
  itemId: string
  quantity: number
  year?: number
}

export interface QuickSlot {
  itemId: string | null
}

export interface QuestDef {
  id: string
  type: 'main' | 'side' | 'daily' | 'sect'
  name: string
  description: string
  objectives: { type: string; target: string; count: number }[]
  rewards: { type: string; id: string; count: number }[]
}
