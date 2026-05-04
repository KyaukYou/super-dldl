import assert from 'node:assert/strict'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'

const tempDir = 'tmp/panel-progression-rules-test'

await rm(tempDir, { recursive: true, force: true })
await mkdir(tempDir, { recursive: true })
await writeFile(`${tempDir}/tsconfig.json`, JSON.stringify({
  compilerOptions: {
    target: 'ES2020',
    module: 'ES2020',
    moduleResolution: 'bundler',
    skipLibCheck: true,
    strict: true,
    baseUrl: '../..',
    paths: {
      '@/*': ['src/*'],
    },
    outDir: 'dist',
  },
  include: ['../../src/game/utils/panelProgressionRules.ts'],
}, null, 2))

const tsc = spawnSync('node', [
  'node_modules/typescript/bin/tsc',
  '-p',
  `${tempDir}/tsconfig.json`,
], { stdio: 'inherit' })

assert.equal(tsc.status, 0)

const rules = await import(`../${tempDir}/dist/panelProgressionRules.js`)

assert.equal(rules.dailyQuestClaimKey(new Date('2026-05-04T10:00:00')), 'quest-claimed-daily-2026-05-04')
assert.equal(rules.arenaBattleCountKey(new Date('2026-05-04T10:00:00')), 'arena-battles-today-2026-05-04')
assert.equal(rules.monsterYearText(18), '十年魂兽 / 180年')
assert.equal(rules.monsterYearText(38), '百年魂兽 / 1940年')
assert.equal(rules.monsterYearText(45), '千年魂兽 / 5100年')
assert.equal(rules.arenaMonsterSkillChance(36) >= 0.65, true)
assert.equal(rules.arenaMonsterActionIntervalMs(36) < 2000, true)

const opponents = rules.buildArenaOpponentSeeds(26, 2227, 12)
assert.equal(opponents.length >= 8, true)
assert.equal(opponents[0].level, 24)
assert.equal(opponents.at(-1).level > 26, true)
assert.equal(new Set(opponents.map((opponent) => opponent.name)).size, opponents.length)
assert.equal(opponents.every((opponent) => opponent.power > 0), true)
assert.equal(opponents.at(-1).power > 2227, true)

await rm(tempDir, { recursive: true, force: true })
console.log('panel progression rules ok')
