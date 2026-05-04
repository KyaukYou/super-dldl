export type ArenaOpponentSeed = {
  id: number
  name: string
  title: string
  level: number
  power: number
}

const ARENA_NAME_POOL = [
  { name: '凌霜', title: '天斗学院精英' },
  { name: '岩山', title: '星罗战队强攻系' },
  { name: '洛羽', title: '武魂殿敏攻执事' },
  { name: '沐雨', title: '七宝支援魂师' },
  { name: '雷烈', title: '蓝电霸王宗弟子' },
  { name: '青岚', title: '风系控制魂师' },
  { name: '赤锋', title: '烈焰学院队长' },
  { name: '白芷', title: '治疗系守擂人' },
  { name: '顾长夜', title: '黑甲防御魂师' },
  { name: '苏流云', title: '敏攻系挑战者' },
  { name: '宁清遥', title: '辅助系魂尊' },
  { name: '霍千岳', title: '重装战魂师' },
  { name: '唐无锋', title: '昊天锤传人' },
  { name: '叶寒星', title: '冰系控制魂师' },
  { name: '朱照影', title: '幽冥敏攻魂师' },
  { name: '秦破军', title: '强攻系守擂魂师' },
]

function padDate(value: number): string {
  return String(value).padStart(2, '0')
}

export function formatLocalDate(date: Date = new Date()): string {
  return `${date.getFullYear()}-${padDate(date.getMonth() + 1)}-${padDate(date.getDate())}`
}

export function dailyQuestClaimKey(date: Date = new Date()): string {
  return `quest-claimed-daily-${formatLocalDate(date)}`
}

export function arenaBattleCountKey(date: Date = new Date()): string {
  return `arena-battles-today-${formatLocalDate(date)}`
}

export function monsterYearText(level: number): string {
  if (level >= 90) return `十万年魂兽 / ${100000 + (level - 90) * 8000}年`
  if (level >= 70) return `万年魂兽 / ${20000 + (level - 70) * 2500}年`
  if (level >= 40) return `千年魂兽 / ${3000 + (level - 40) * 420}年`
  if (level >= 20) return `百年魂兽 / ${500 + (level - 20) * 80}年`
  return `十年魂兽 / ${Math.max(10, level * 10)}年`
}

export function arenaMonsterSkillChance(level: number): number {
  if (level >= 45) return 0.78
  if (level >= 35) return 0.68
  return 0.58
}

export function arenaMonsterActionIntervalMs(level: number): number {
  return Math.max(1250, 2200 - level * 8)
}

export function buildArenaOpponentSeeds(
  baseLevel: number,
  combatPower: number,
  count: number = 9,
): ArenaOpponentSeed[] {
  const safeBaseLevel = Math.max(1, baseLevel)
  const safePower = Math.max(360, combatPower)
  const total = Math.min(ARENA_NAME_POOL.length, Math.max(8, count))

  return ARENA_NAME_POOL.slice(0, total).map((entry, index) => {
    const levelOffset = index - 2
    const level = Math.max(1, safeBaseLevel + levelOffset)
    const powerScale = 0.82 + index * 0.105
    return {
      id: index + 1,
      name: entry.name,
      title: entry.title,
      level,
      power: Math.max(280, Math.floor(safePower * powerScale)),
    }
  })
}
