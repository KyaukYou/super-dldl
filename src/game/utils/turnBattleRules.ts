export type TurnBattleAction =
  | { type: 'normal' }
  | { type: 'skill'; slot: number }

export interface TurnSkillLike {
  cooldown: number
}

export interface MonsterSkillLike {
  id: string
  name: string
  cooldown: number
  damageMultiplier: number
}

export function actionFromTimeout(): TurnBattleAction {
  return { type: 'normal' }
}

export function skillCooldownTurns(skill: TurnSkillLike): number {
  return Math.max(1, Math.ceil(skill.cooldown / 5))
}

export function tickCooldowns<Key>(cooldowns: Map<Key, number>) {
  for (const [slot, turns] of cooldowns) {
    const next = turns - 1
    if (next <= 0) cooldowns.delete(slot)
    else cooldowns.set(slot, next)
  }
}

export function isSkillReady(slot: number, cooldowns: Map<number, number>) {
  return !cooldowns.has(slot)
}

export function chooseMonsterAction(
  skills: MonsterSkillLike[],
  cooldowns: Map<string, number>,
  random: () => number,
  skillChance: number,
): { type: 'normal' } | { type: 'skill'; skill: MonsterSkillLike } {
  const readySkills = skills.filter((skill) => !cooldowns.has(skill.id))
  if (readySkills.length === 0 || random() >= skillChance) return { type: 'normal' }
  const index = Math.min(readySkills.length - 1, Math.floor(random() * readySkills.length))
  return { type: 'skill', skill: readySkills[index]! }
}
