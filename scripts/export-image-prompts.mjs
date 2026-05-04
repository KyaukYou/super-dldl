import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const manifestPath = path.join(root, 'src/assets/art-direction/asset-manifest.json')
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'))

function seriesVisual(series) {
  return {
    strength: 'crimson gold weapon-force, beast power, heavy impact',
    agility: 'azure silver speed trails, wings, claws, shadow motion',
    intelligence: 'emerald blue mystical aura, plants, gems, control magic',
  }[series] ?? 'mystic energy'
}

function typeVisual(type) {
  return {
    damage: 'violent impact, slash, burst, explosion, destructive energy',
    buff: 'upward aura, blessing sigil, enhancement glow',
    debuff: 'corrupting aura, weakening curse, draining magic',
    heal: 'restorative light, sacred pulse, rejuvenating bloom',
    control: 'binding, freezing, stunning, sealing, time-stop magic',
  }[type] ?? 'magical effect'
}

function qualityColor(quality) {
  return {
    white: '#d8d8d8 silver-white',
    green: '#43d97a emerald green',
    blue: '#3aa7ff soul blue',
    purple: '#b45cff mystic purple',
    orange: '#ff9f2e legendary orange-gold',
    red: '#ff4242 ancient crimson red',
  }[quality] ?? 'silver-white'
}

function iconBase(assetType, primaryRequest, extra) {
  return [
    'Use case: stylized-concept',
    `Asset type: ${assetType}, 512x512 game icon`,
    `Primary request: ${primaryRequest}`,
    'Style: Chinese fantasy soul-master MMORPG icon, antique gold rim light, dark jade-black magical background, painterly high contrast, premium browser RPG item art.',
    'Composition: one centered subject with strong silhouette, clear at 48px, subject fills 70-82% of the frame, no surrounding UI panel.',
    'Background: dark circular magical seal or smoky vignette, subtle soul energy glow, not a full environment.',
    'Lighting: crisp edge highlights, metal/gem shine when appropriate, dramatic but readable.',
    extra,
    'Avoid: text, numbers, watermark, logos, flat vector style, photorealistic screenshot, cluttered background, cropped subject.',
  ].filter(Boolean).join('\n')
}

function spiritPrompt(item) {
  return iconBase(
    'martial soul icon',
    `Create a unique icon for the martial soul "${item.name}" (${item.id}).`,
    `Series: ${item.series}; visual language: ${seriesVisual(item.series)}. Depict the symbolic manifestation of this martial soul, not a full character portrait.`
  )
}

function skillPrompt(item) {
  return iconBase(
    'combat soul skill icon',
    `Create a dynamic skill icon for "${item.name}" (${item.id}).`,
    `Skill type: ${item.type}; visual cue: ${typeVisual(item.type)}. Series: ${item.series}; energy language: ${seriesVisual(item.series)}. Soul ring slot: ${item.ringSlot}; imply increasing power without using text or numbers.`
  )
}

function bonePrompt(item) {
  return iconBase(
    'soul bone equipment icon',
    `Create an ancient soul bone equipment icon for "${item.name}" (${item.id}).`,
    `Body slot: ${item.slot}. Quality: ${item.quality}; aura color: ${qualityColor(item.quality)}. Depict a crystalline bone relic or armored bone artifact, mystical and elegant, not gory.`
  )
}

function itemPrompt(item) {
  return iconBase(
    'fantasy RPG item icon',
    `Create a clear item icon for "${item.name}" (${item.id}).`,
    `Item type: ${item.type}. Description cue: ${item.description}. Quality: ${item.quality}; accent color: ${qualityColor(item.quality)}. Single item centered with small magical glints.`
  )
}

function systemPrompt(item) {
  return iconBase(
    'system menu icon',
    `Create a system UI icon for "${item.name}" (${item.id}).`,
    'The icon should feel like a Chinese fantasy MMORPG HUD button: antique gold border, dark enamel base, luminous pictogram, readable at 32px, no text.'
  )
}

function framePrompt(item) {
  return [
    'Use case: stylized-concept',
    'Asset type: transparent-friendly square game item frame, 512x512',
    `Primary request: Create a reusable ${item.quality} quality item-frame border for RPG icons.`,
    `Color: ${qualityColor(item.quality)} with antique gold metal accents.`,
    'Composition: ornate square frame with empty dark center, strong corners, subtle inner glow, no subject item.',
    'Avoid: text, numbers, watermark, filled center art, full UI panel.',
  ].join('\n')
}

const records = [
  ...manifest.spirits.map((item) => ({ category: 'spirit', ...item, prompt: spiritPrompt(item) })),
  ...manifest.skills.map((item) => ({ category: 'skill', ...item, prompt: skillPrompt(item) })),
  ...manifest.bones.map((item) => ({ category: 'bone', ...item, prompt: bonePrompt(item) })),
  ...manifest.items.map((item) => ({ category: 'item', ...item, prompt: itemPrompt(item) })),
  ...manifest.systemIcons.map((item) => ({ category: 'system', ...item, prompt: systemPrompt(item) })),
  ...manifest.frames.map((item) => ({ category: 'frame', ...item, prompt: framePrompt(item) })),
]

const outputDir = path.join(root, 'src/assets/art-direction/prompts')
await fs.mkdir(outputDir, { recursive: true })

await fs.writeFile(path.join(outputDir, 'all-icon-prompts.jsonl'), records.map((record) => JSON.stringify(record)).join('\n'), 'utf8')

for (const category of ['spirit', 'skill', 'bone', 'item', 'system', 'frame']) {
  const items = records.filter((record) => record.category === category)
  await fs.writeFile(path.join(outputDir, `${category}-prompts.jsonl`), items.map((record) => JSON.stringify(record)).join('\n'), 'utf8')
}

const samples = records.slice(0, 12).map((record) => [
  `## ${record.category}/${record.id}`,
  '',
  `Path: \`${record.relativePath}\``,
  '',
  '```text',
  record.prompt,
  '```',
  '',
]).flat().join('\n')

await fs.writeFile(path.join(outputDir, 'prompt-samples.md'), samples, 'utf8')

console.log(`Exported ${records.length} image prompts to ${outputDir}`)
