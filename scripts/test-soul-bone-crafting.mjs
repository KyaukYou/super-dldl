import assert from 'node:assert/strict'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'

const tempDir = 'tmp/soul-bone-crafting-test'

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
    '../../src/game/utils/soulBoneCrafting.ts',
    '../../src/types/game.ts',
  ],
}, null, 2))

const tsc = spawnSync('node', [
  'node_modules/typescript/bin/tsc',
  '-p',
  `${tempDir}/tsconfig.json`,
], { stdio: 'inherit' })

assert.equal(tsc.status, 0)

const compiledPath = `${tempDir}/dist/game/utils/soulBoneCrafting.js`
const compiledSource = await readFile(compiledPath, 'utf8')
await writeFile(compiledPath, compiledSource)

const crafting = await import(`../${tempDir}/dist/game/utils/soulBoneCrafting.js`)

assert.equal(crafting.inventoryItemCount([{ itemId: 'bone_fragment', quantity: 4 }], 'bone_fragment'), 4)
assert.equal(crafting.firstOpenBoneSlot({
  head: 'a',
  torso: 'b',
  leftArm: null,
  rightArm: null,
  leftLeg: null,
  rightLeg: null,
  external: null,
}), 'leftArm')

assert.equal(crafting.canCraftBoneRecipe(
  crafting.BONE_CRAFT_RECIPES.bone_fragment_random,
  [{ itemId: 'bone_fragment', quantity: 3 }],
  { head: null, torso: null, leftArm: null, rightArm: null, leftLeg: null, rightLeg: null, external: null },
), true)

assert.equal(crafting.canCraftBoneRecipe(
  crafting.BONE_CRAFT_RECIPES.bone_fragment_random,
  [{ itemId: 'bone_fragment', quantity: 2 }],
  { head: null, torso: null, leftArm: null, rightArm: null, leftLeg: null, rightLeg: null, external: null },
), false)

const selected = crafting.chooseCraftedBone(
  crafting.BONE_CRAFT_RECIPES.ancient_scroll_random,
  [
    { id: 'b_head_green', name: 'A', slot: 'head', quality: 'green', stats: {}, source: 'x' },
    { id: 'b_head_purple', name: 'B', slot: 'head', quality: 'purple', stats: {}, source: 'x' },
    { id: 'b_head_purple_2', name: 'C', slot: 'head', quality: 'purple', stats: {}, source: 'x' },
  ],
  'head',
  1,
)

assert.equal(['b_head_purple', 'b_head_purple_2'].includes(selected.id), true)

await rm(tempDir, { recursive: true, force: true })
console.log('soul bone crafting ok')
