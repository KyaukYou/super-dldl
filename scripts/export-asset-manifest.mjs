import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const source = await fs.readFile(path.join(root, 'src/data/gameData.ts'), 'utf8')

function extractBlock(name, nextName) {
  const start = source.indexOf(`export const ${name}`)
  if (start === -1) throw new Error(`Missing block: ${name}`)
  const end = nextName ? source.indexOf(`export const ${nextName}`, start) : source.indexOf('export function getExpToNext', start)
  if (end === -1) throw new Error(`Missing end for block: ${name}`)
  return source.slice(start, end)
}

function extractObjects(block) {
  return block
    .split(/\r?\n/)
    .filter((line) => line.includes('{ id:'))
    .map((line) => {
      const id = line.match(/id:\s*'([^']+)'/)?.[1]
      const name = line.match(/name:\s*'([^']+)'|name:'([^']+)'/)?.[1] ?? line.match(/name:\s*'([^']+)'|name:'([^']+)'/)?.[2]
      if (!id || !name) return null
      return { id, name, raw: line.trim(), tail: line.trim() }
    })
    .filter(Boolean)
}

function findValue(raw, key) {
  const match = raw.match(new RegExp(`${key}:\\s*'([^']+)'`))
  return match?.[1] ?? null
}

function qualityColor(quality) {
  return {
    white: '#d8d8d8',
    green: '#43d97a',
    blue: '#3aa7ff',
    purple: '#b45cff',
    orange: '#ff9f2e',
    red: '#ff4242',
  }[quality] ?? '#d8d8d8'
}

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

function itemCategory(type) {
  return {
    potion: '药剂',
    material: '材料',
    bone: '魂骨材料',
    bone_scroll: '魂骨卷轴',
    special: '特殊道具',
    equipment: '装备',
  }[type] ?? '道具'
}

const spirits = extractObjects(extractBlock('SPIRITS', 'SKILLS')).map((item) => {
  const series = findValue(item.raw, 'series')
  return {
    ...item,
    series,
    filename: `spirit_${item.id}.png`,
    relativePath: `src/assets/icons/spirit/spirit_${item.id}.png`,
    promptType: 'spirit',
    accent: seriesVisual(series),
  }
})

const skills = extractObjects(extractBlock('SKILLS', 'BONES')).map((item) => {
  const series = findValue(item.raw, 'series')
  const type = findValue(item.raw, 'type')
  const ringSlotMatch = item.raw.match(/ringSlot:\s*(\d+)/)
  const ringSlot = ringSlotMatch ? Number(ringSlotMatch[1]) : null
  return {
    ...item,
    series,
    type,
    ringSlot,
    filename: `skill_${item.id}.png`,
    relativePath: `src/assets/icons/skill/skill_${item.id}.png`,
    promptType: 'skill',
    accent: `${seriesVisual(series)}, ${typeVisual(type)}`,
  }
})

const bones = extractObjects(extractBlock('BONES', 'MAPS')).map((item) => {
  const slot = findValue(item.raw, 'slot')
  const quality = findValue(item.raw, 'quality')
  return {
    ...item,
    slot,
    quality,
    filename: `bone_${item.id}.png`,
    relativePath: `src/assets/icons/bone/bone_${item.id}.png`,
    promptType: 'bone',
    accent: qualityColor(quality),
  }
})

const items = extractObjects(extractBlock('ITEMS', null)).map((item) => {
  const type = findValue(item.raw, 'type')
  const quality = findValue(item.raw, 'quality')
  const descMatch = item.raw.match(/description:\s*'([^']+)'/)
  return {
    ...item,
    type,
    quality,
    description: descMatch?.[1] ?? '',
    filename: `item_${item.id}.png`,
    relativePath: `src/assets/icons/item/item_${item.id}.png`,
    promptType: 'item',
    accent: qualityColor(quality),
    categoryLabel: itemCategory(type),
  }
})

const systemIcons = [
  { id: 'character', name: '角色', filename: 'ui_character.png', relativePath: 'src/assets/icons/system/ui_character.png' },
  { id: 'bag', name: '背包', filename: 'ui_bag.png', relativePath: 'src/assets/icons/system/ui_bag.png' },
  { id: 'spirit', name: '武魂', filename: 'ui_spirit.png', relativePath: 'src/assets/icons/system/ui_spirit.png' },
  { id: 'skill', name: '魂技', filename: 'ui_skill.png', relativePath: 'src/assets/icons/system/ui_skill.png' },
  { id: 'bone', name: '魂骨', filename: 'ui_bone.png', relativePath: 'src/assets/icons/system/ui_bone.png' },
  { id: 'codex', name: '图鉴', filename: 'ui_codex.png', relativePath: 'src/assets/icons/system/ui_codex.png' },
  { id: 'quest', name: '任务', filename: 'ui_quest.png', relativePath: 'src/assets/icons/system/ui_quest.png' },
  { id: 'rank', name: '排行', filename: 'ui_rank.png', relativePath: 'src/assets/icons/system/ui_rank.png' },
  { id: 'arena', name: '竞技场', filename: 'ui_arena.png', relativePath: 'src/assets/icons/system/ui_arena.png' },
  { id: 'sect', name: '宗门', filename: 'ui_sect.png', relativePath: 'src/assets/icons/system/ui_sect.png' },
  { id: 'world_map', name: '世界地图', filename: 'ui_world_map.png', relativePath: 'src/assets/icons/system/ui_world_map.png' },
  { id: 'shop', name: '商店', filename: 'ui_shop.png', relativePath: 'src/assets/icons/system/ui_shop.png' },
  { id: 'smithy', name: '铁匠铺', filename: 'ui_smithy.png', relativePath: 'src/assets/icons/system/ui_smithy.png' },
  { id: 'academy', name: '学院', filename: 'ui_academy.png', relativePath: 'src/assets/icons/system/ui_academy.png' },
  { id: 'settings', name: '设置', filename: 'ui_settings.png', relativePath: 'src/assets/icons/system/ui_settings.png' },
  { id: 'chat', name: '聊天', filename: 'ui_chat.png', relativePath: 'src/assets/icons/system/ui_chat.png' },
  { id: 'auto_fight', name: '自动战斗', filename: 'ui_auto_fight.png', relativePath: 'src/assets/icons/system/ui_auto_fight.png' },
  { id: 'mail', name: '邮件', filename: 'ui_mail.png', relativePath: 'src/assets/icons/system/ui_mail.png' },
  { id: 'map_pin', name: '地图点位', filename: 'ui_map_pin.png', relativePath: 'src/assets/icons/system/ui_map_pin.png' },
  { id: 'boss', name: 'Boss', filename: 'ui_boss.png', relativePath: 'src/assets/icons/system/ui_boss.png' },
  { id: 'lock', name: '锁定', filename: 'ui_lock.png', relativePath: 'src/assets/icons/system/ui_lock.png' },
]

const frames = [
  'white',
  'green',
  'blue',
  'purple',
  'orange',
  'red',
].map((quality) => ({
  id: `quality_${quality}`,
  name: `${quality} 品质边框`,
  quality,
  filename: `frame_quality_${quality}.png`,
  relativePath: `src/assets/icons/frames/frame_quality_${quality}.png`,
}))

const manifest = {
  generatedAt: new Date().toISOString(),
  counts: {
    spirits: spirits.length,
    skills: skills.length,
    bones: bones.length,
    items: items.length,
    systemIcons: systemIcons.length,
    frames: frames.length,
    totalIconAssets: spirits.length + skills.length + bones.length + items.length + systemIcons.length + frames.length,
  },
  spirits,
  skills,
  bones,
  items,
  systemIcons,
  frames,
}

const outputDir = path.join(root, 'src/assets/art-direction')
await fs.writeFile(path.join(outputDir, 'asset-manifest.json'), JSON.stringify(manifest, null, 2), 'utf8')

const summary = [
  '# 全量图标资产清单',
  '',
  `- 武魂：${spirits.length}`,
  `- 魂技：${skills.length}`,
  `- 魂骨：${bones.length}`,
  `- 物品：${items.length}`,
  `- 系统图标：${systemIcons.length}`,
  `- 品质边框：${frames.length}`,
  `- 总计：${manifest.counts.totalIconAssets}`,
  '',
  '## 说明',
  '',
  '- 详细条目见 `asset-manifest.json`。',
  '- 每个条目都包含 `id`、`name`、`filename`、`relativePath` 和分类信息。',
  '- 所有图标都将按该清单一次性补齐。',
  '',
  '## 分类',
  '',
  '- `spirits`：武魂图标',
  '- `skills`：魂技图标',
  '- `bones`：魂骨图标',
  '- `items`：物品、药剂、材料、特殊道具图标',
  '- `systemIcons`：系统入口和通用功能图标',
  '- `frames`：品质边框',
  '',
]

await fs.writeFile(path.join(outputDir, 'asset-manifest.md'), summary.join('\n'), 'utf8')

console.log(`Asset manifest exported to ${path.join(outputDir, 'asset-manifest.json')}`)
console.log(JSON.stringify(manifest.counts, null, 2))
