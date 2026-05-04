import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const manifest = JSON.parse(await fs.readFile(path.join(root, 'src/assets/art-direction/asset-manifest.json'), 'utf8'))

function group(category, id, title, items, columns) {
  return {
    category,
    id,
    title,
    count: items.length,
    columns,
    rows: Math.ceil(items.length / columns),
    items: items.map((item) => ({
      id: item.id,
      name: item.name,
      relativePath: item.relativePath,
      filename: item.filename,
      series: item.series ?? null,
      type: item.type ?? null,
      slot: item.slot ?? null,
      quality: item.quality ?? null,
    })),
  }
}

const groups = [
  group('spirit', 'spirit_strength_atlas_v1', '力量系武魂图集', manifest.spirits.filter((item) => item.series === 'strength'), 7),
  group('spirit', 'spirit_agility_atlas_v1', '敏捷系武魂图集', manifest.spirits.filter((item) => item.series === 'agility'), 7),
  group('spirit', 'spirit_intelligence_atlas_v1', '智力系武魂图集', manifest.spirits.filter((item) => item.series === 'intelligence'), 7),
  group('skill', 'skill_strength_atlas_v1', '力量系魂技图集', manifest.skills.filter((item) => item.series === 'strength'), 9),
  group('skill', 'skill_agility_atlas_v1', '敏捷系魂技图集', manifest.skills.filter((item) => item.series === 'agility'), 9),
  group('skill', 'skill_intelligence_atlas_v1', '智力系魂技图集', manifest.skills.filter((item) => item.series === 'intelligence'), 9),
  group('bone', 'bone_atlas_v1', '魂骨图集', manifest.bones, 9),
  group('misc', 'misc_icons_atlas_v1', '物品系统边框图集', [...manifest.items, ...manifest.systemIcons, ...manifest.frames], 9),
]

const outputDir = path.join(root, 'src/assets/art-direction')
await fs.writeFile(path.join(outputDir, 'icon-atlas-groups.json'), JSON.stringify(groups, null, 2), 'utf8')

const md = [
  '# 图标图集分组',
  '',
  ...groups.flatMap((groupItem) => [
    `## ${groupItem.id}`,
    '',
    `- 标题：${groupItem.title}`,
    `- 类别：${groupItem.category}`,
    `- 数量：${groupItem.count}`,
    `- 网格：${groupItem.columns} x ${groupItem.rows}`,
    `- 条目：${groupItem.items.map((item) => item.name).join('、')}`,
    '',
  ]),
]

await fs.writeFile(path.join(outputDir, 'icon-atlas-groups.md'), md.join('\n'), 'utf8')
console.log(`Exported ${groups.length} atlas groups`)

