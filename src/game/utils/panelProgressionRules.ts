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

export function buildArenaOpponentSeeds(
  baseLevel: number,
  combatPower: number,
  count: number = 9,
): ArenaOpponentSeed[] {
  const safeBaseLevel = Math.max(1, baseLevel)
  const safePower = Math.max(360, combatPower)
  const total = Math.max(8, count)

  return ARENA_NAME_POOL.slice(0, total).map((entry, index) => {
    const levelOffset = index - 2
    const level = Math.max(1, safeBaseLevel + levelOffset)
    const powerScale = 0.74 + index * 0.08
    return {
      id: index + 1,
      name: entry.name,
      title: entry.title,
      level,
      power: Math.max(280, Math.floor(safePower * powerScale)),
    }
  })
}
