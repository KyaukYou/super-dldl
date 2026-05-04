import assert from 'node:assert/strict'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'

const tempDir = 'tmp/spirit-ring-drops-test'

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
  include: ['../../src/game/utils/spiritRingDrops.ts'],
}, null, 2))

const tsc = spawnSync('node', [
  'node_modules/typescript/bin/tsc',
  '-p',
  `${tempDir}/tsconfig.json`,
], { stdio: 'inherit' })

assert.equal(tsc.status, 0)

const drops = await import(`../${tempDir}/dist/game/utils/spiritRingDrops.js`)

assert.equal(drops.spiritRingYearForMonsterLevel(18), 180)
assert.equal(drops.spiritRingYearForMonsterLevel(26), 980)
assert.equal(drops.spiritRingLabelWithYear('spirit_ring_white', 200), '十年魂环(200年)')
assert.equal(drops.spiritRingLabelWithYear('spirit_ring_yellow', 500), '百年魂环(500年)')
assert.equal(drops.spiritRingColorForYear(99), 'white')
assert.equal(drops.spiritRingColorForYear(100), 'yellow')
assert.equal(drops.spiritRingColorForYear(200), 'yellow')
assert.equal(drops.spiritRingColorForYear(1000), 'purple')
assert.equal(drops.spiritRingColorForYear(10000), 'black')
assert.equal(drops.spiritRingColorForYear(100000), 'red')

await rm(tempDir, { recursive: true, force: true })
console.log('spirit ring drops ok')
