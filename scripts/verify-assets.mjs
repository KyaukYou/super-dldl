import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'src/assets/art-direction/asset-manifest.json'), 'utf8'))
const all = [
  ...manifest.spirits,
  ...manifest.skills,
  ...manifest.bones,
  ...manifest.items,
  ...manifest.systemIcons,
  ...manifest.frames,
]

const missing = []
const present = []

for (const item of all) {
  const fullPath = path.join(root, item.relativePath)
  if (fs.existsSync(fullPath)) {
    present.push(fullPath)
  } else {
    missing.push(item.relativePath)
  }
}

console.log(JSON.stringify({
  expected: all.length,
  present: present.length,
  missing: missing.length,
  missingItems: missing,
}, null, 2))

if (missing.length > 0) {
  process.exitCode = 1
}
