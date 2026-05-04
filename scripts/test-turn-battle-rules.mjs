import assert from 'node:assert/strict'
import { mkdir, rm } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'

const tempDir = 'tmp/turn-battle-rules-test'

await rm(tempDir, { recursive: true, force: true })
await mkdir(tempDir, { recursive: true })

const tsc = spawnSync('node', [
  'node_modules/typescript/bin/tsc',
  'src/game/utils/turnBattleRules.ts',
  '--target',
  'ES2020',
  '--module',
  'ES2020',
  '--moduleResolution',
  'bundler',
  '--skipLibCheck',
  '--strict',
  '--outDir',
  tempDir,
], { stdio: 'inherit' })

assert.equal(tsc.status, 0)

const rules = await import(`../${tempDir}/turnBattleRules.js`)

assert.deepEqual(rules.actionFromTimeout(), { type: 'normal' })
assert.equal(rules.skillCooldownTurns({ cooldown: 18 }), 4)
assert.equal(rules.skillCooldownTurns({ cooldown: 0 }), 1)

const cooldowns = new Map([[1, 2], [2, 1]])
rules.tickCooldowns(cooldowns)
assert.equal(cooldowns.get(1), 1)
assert.equal(cooldowns.has(2), false)
assert.equal(rules.isSkillReady(1, cooldowns), false)
assert.equal(rules.isSkillReady(2, cooldowns), true)

const monsterSkills = [
  { id: 'claw', name: 'Claw', cooldown: 2, damageMultiplier: 1.3 },
  { id: 'roar', name: 'Roar', cooldown: 3, damageMultiplier: 1.6 },
]
assert.deepEqual(
  rules.chooseMonsterAction(monsterSkills, new Map(), () => 0.99, 0.5),
  { type: 'normal' },
)
assert.equal(
  rules.chooseMonsterAction(monsterSkills, new Map(), () => 0.1, 0.5).type,
  'skill',
)

await rm(tempDir, { recursive: true, force: true })
console.log('turn battle rules ok')
