import assert from 'node:assert/strict'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'

const tempDir = 'tmp/inventory-hints-test'

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
  include: [
    '../../src/game/utils/inventoryHints.ts',
    '../../src/game/utils/spiritRingDrops.ts',
    '../../src/types/game.ts',
  ],
}, null, 2))

const tsc = spawnSync('node', [
  'node_modules/typescript/bin/tsc',
  '-p',
  `${tempDir}/tsconfig.json`,
], { stdio: 'inherit' })

assert.equal(tsc.status, 0)

const compiledPath = `${tempDir}/dist/game/utils/inventoryHints.js`
const compiledSource = await readFile(compiledPath, 'utf8')
await writeFile(compiledPath, compiledSource.replace("'./spiritRingDrops'", "'./spiritRingDrops.js'"))

const hints = await import(`../${tempDir}/dist/game/utils/inventoryHints.js`)

const boneHints = hints.inventoryUsageHints({ itemId: 'bone_fragment', quantity: 2 })
assert.equal(boneHints[0].text.includes('3个魂骨碎片'), true)
assert.equal(boneHints[1].text.includes('还差1个'), true)
assert.equal(boneHints[2].text.includes('合成魂骨'), true)

const scrollHints = hints.inventoryUsageHints({ itemId: 'ancient_scroll', quantity: 1 })
assert.equal(scrollHints.some((hint) => hint.text.includes('高阶随机魂骨')), true)

const ringHints = hints.inventoryUsageHints({ itemId: 'spirit_ring_yellow', quantity: 1, year: 200 })
assert.equal(ringHints[0].text.includes('200年'), true)
assert.equal(ringHints[0].text.includes('百年魂环'), true)

await rm(tempDir, { recursive: true, force: true })
console.log('inventory hints ok')
