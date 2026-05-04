import type { CharacterStats, SkillDef } from '@/types/game'
import { statLabel } from '@/data/displayData'

export type BattleStatKey = 'atk' | 'def' | 'atkSpeed' | 'critRate' | 'dodgeRate' | 'str' | 'agi' | 'int' | 'vit'

export interface TimedEffect {
  id: string
  owner: 'player' | 'monster'
  stat: string
  multiplier: number
  expiresAt: number
}

export function effectMultiplier(effects: TimedEffect[], owner: 'player' | 'monster', stat: string, now: number): number {
  return effects
    .filter((effect) => effect.owner === owner && effect.stat === stat && effect.expiresAt > now)
    .reduce((total, effect) => total * effect.multiplier, 1)
}

export function effectivePlayerStat(stats: CharacterStats, effects: TimedEffect[], stat: BattleStatKey, now: number): number {
  const base = stats[stat]
  return base * effectMultiplier(effects, 'player', stat, now)
}

export function effectiveMonsterStat(base: number, effects: TimedEffect[], stat: 'atk' | 'def', now: number): number {
  return base * effectMultiplier(effects, 'monster', stat, now)
}

export function secondsRemaining(until: number, now: number): number {
  return Math.max(0, Math.ceil((until - now) / 1000))
}

export function playerAttackIntervalMs(atkSpeed: number): number {
  void atkSpeed
  return 1000
}

export function calculatePlayerDamage(
  stats: CharacterStats,
  monsterDef: number,
  effects: TimedEffect[],
  now: number,
  multiplier = 1,
  ignoreDefenseRatio = 0,
): { damage: number; crit: boolean } {
  const atk = effectivePlayerStat(stats, effects, 'atk', now)
  const critRate = effectivePlayerStat(stats, effects, 'critRate', now)
  const crit = Math.random() < Math.min(95, critRate) / 100
  const reducedDef = monsterDef * Math.max(0, 1 - ignoreDefenseRatio)
  let damage = Math.max(3, Math.floor((atk * multiplier - reducedDef * 0.45) * 0.62))
  if (crit) damage = Math.floor(damage * 1.8)
  return { damage, crit }
}

export function calculateMonsterDamage(monsterAtk: number, playerDef: number): number {
  return Math.max(2, Math.floor((monsterAtk - playerDef * 0.4 + Math.random() * 8) * 0.58))
}

export function skillCooldownMs(skill: SkillDef): number {
  return Math.max(4000, Math.round(skill.cooldown * 650))
}

export function skillEffectText(skill: SkillDef): string {
  if (skill.type === 'buff' && skill.statBuff) return `自身${statLabel(skill.statBuff.stat)}提升`
  if (skill.type === 'debuff' && skill.statDebuff) return `目标${statLabel(skill.statDebuff.stat)}降低`
  if (skill.type === 'heal') return '恢复生命'
  if (skill.type === 'control') return '控制目标'
  return '造成伤害'
}
