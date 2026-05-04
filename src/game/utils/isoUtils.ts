import Phaser from 'phaser'

const TILE_W = 128
const TILE_H = 64

export function toScreen(tileX: number, tileY: number) {
  return { x: (tileX - tileY) * (TILE_W / 2), y: (tileX + tileY) * (TILE_H / 2) }
}

export function toTile(screenX: number, screenY: number) {
  return {
    x: Math.floor((screenX / (TILE_W / 2) + screenY / (TILE_H / 2)) / 2),
    y: Math.floor((screenY / (TILE_H / 2) - screenX / (TILE_W / 2)) / 2),
  }
}

export function getTileSize() { return { w: TILE_W, h: TILE_H } }

export function generateAllTextures(scene: Phaser.Scene) {
  generateTileTextures(scene)
  generateCharacterTextures(scene)
  generateMonsterTextures(scene)
  generateNPCTextures(scene)
}

/** 程序化生成 128x64 等距地块纹理 */
export function generateTileTextures(scene: Phaser.Scene) {
  const W = TILE_W, H = TILE_H
  const HW = W / 2, HH = H / 2

  function makeTile(key: string, c1: number, c2: number, extra?: (g: Phaser.GameObjects.Graphics) => void) {
    const g = scene.add.graphics()
    g.fillStyle(c1)
    g.beginPath(); g.moveTo(HW, 0); g.lineTo(W, HH); g.lineTo(HW, H); g.lineTo(0, HH); g.closePath(); g.fillPath()
    if (c2) {
      g.fillStyle(c2)
      for (let i = 0; i < 14; i++) g.fillRect(Phaser.Math.Between(10, W - 20), Phaser.Math.Between(6, H - 12), 8, 5)
    }
    if (extra) extra(g)
    g.generateTexture(key, W, H); g.destroy()
  }

  makeTile('tile_grass', 0x3a7d44, 0x4a9d54, g => g.fillStyle(0xee6688).fillRect(40, 18, 4, 4))
  makeTile('tile_dirt', 0x8b6914, 0x7a5c10)
  makeTile('tile_water', 0x1a5588, 0x3399cc, g => {
    g.fillStyle(0x55aadd).fillRect(25, 10, 20, 4)
    g.fillStyle(0x55aadd).fillRect(45, 22, 24, 4)
  })
  makeTile('tile_stone', 0x555555, 0x777777, g => {
    g.fillStyle(0x3a3a3a).fillRect(30, 8, 4, 14)
    g.fillStyle(0x3a3a3a).fillRect(50, 22, 4, 12)
    g.fillStyle(0x666666).fillRect(20, 18, 22, 2)
  })
}

/** 高清角色纹理 64x96 */
function generateCharacterTextures(scene: Phaser.Scene) {
  const W = 64, H = 96
  function makeChar(key: string, bodyColor: number, hairColor: number = 0x332211, headColor: number = 0xf0c090) {
    if (scene.textures.exists(key)) return
    const g = scene.add.graphics()
    // 头
    g.fillStyle(headColor).fillRect(20, 4, 24, 24)
    g.fillStyle(hairColor).fillRect(20, 4, 24, 8).fillRect(20, 4, 4, 24)
    // 眼
    g.fillStyle(0x111111).fillRect(26, 14, 4, 4).fillRect(36, 14, 4, 4)
    g.fillStyle(0xffffff).fillRect(27, 14, 2, 2).fillRect(37, 14, 2, 2)
    // 身体
    g.fillStyle(bodyColor).fillRect(18, 28, 28, 28)
    const hi = Phaser.Display.Color.GetColor(
      Math.min(255, ((bodyColor >> 16) & 0xff) + 40),
      Math.min(255, ((bodyColor >> 8) & 0xff) + 40),
      Math.min(255, (bodyColor & 0xff) + 40))
    g.fillStyle(hi).fillRect(22, 32, 20, 6)
    // 腰带
    g.fillStyle(0x8b6914).fillRect(18, 52, 28, 4)
    g.fillStyle(0xdbb85e).fillRect(28, 52, 8, 4)
    // 手臂
    g.fillStyle(bodyColor).fillRect(8, 32, 8, 22).fillRect(48, 32, 8, 22)
    g.fillStyle(headColor).fillRect(8, 54, 8, 5).fillRect(48, 54, 8, 5)
    // 腿
    g.fillStyle(0x334466).fillRect(22, 57, 8, 26).fillRect(34, 57, 8, 26)
    g.fillStyle(0x442211).fillRect(20, 81, 12, 8).fillRect(32, 81, 12, 8)
    // 阴影
    g.fillStyle(0x000000, 0.2).fillRect(22, 89, 20, 5)
    g.generateTexture(key, W, H); g.destroy()
  }
  makeChar('char_player', 0x4488ff)
  makeChar('char_npc_iron', 0xff8844)
  makeChar('char_npc_shop', 0x44ff88)
  makeChar('char_npc_quest', 0xffdd44)
}

/** 怪物纹理 */
function generateMonsterTextures(scene: Phaser.Scene) {
  function makeMonster(key: string, color: number, size: 's' | 'm' | 'l') {
    if (scene.textures.exists(key)) return
    const s = size === 'l' ? 4.5 : size === 'm' ? 3 : 2.5
    const W = Math.floor(32 * s), H = Math.floor(32 * s)
    const g = scene.add.graphics()
    const bw = Math.floor(W * 0.7), bh = Math.floor(H * 0.55)
    const ox = Math.floor((W - bw) / 2), oy = Math.floor(H * 0.12)
    g.fillStyle(color).fillRect(ox, oy, bw, bh)
    // eye
    const es = Math.max(4, Math.floor(8 * s / 2.5)), ey = oy + Math.floor(bh * 0.2)
    const gap = Math.floor(bw * 0.18)
    g.fillStyle(0xff1111).fillRect(ox + bw / 2 - gap - es, ey, es, es).fillRect(ox + bw / 2 + gap, ey, es, es)
    // mouth
    const my = oy + Math.floor(bh * 0.6)
    g.fillStyle(0x220000).fillRect(ox + Math.floor(bw * 0.2), my, Math.floor(bw * 0.6), Math.max(3, Math.floor(4 * s / 2.5)))
    // teeth
    g.fillStyle(0xffffff)
    const tc = size === 'l' ? 5 : 4
    for (let i = 0; i < tc; i++) {
      const tx = ox + Math.floor(bw * 0.22) + i * Math.floor(bw * 0.56 / tc)
      g.fillRect(tx, my, Math.max(2, Math.floor(3 * s / 2.5)), Math.max(3, Math.floor(4 * s / 2.5)))
    }
    // legs
    const lw = Math.max(5, Math.floor(10 * s / 2.5)), lh = Math.max(8, Math.floor(14 * s / 2.5))
    const lc = Phaser.Display.Color.GetColor(Math.max(0, ((color >> 16) & 0xff) - 20), Math.max(0, ((color >> 8) & 0xff) - 20), Math.max(0, (color & 0xff) - 20))
    g.fillStyle(lc).fillRect(ox + Math.floor(bw * 0.2), oy + bh, lw, lh).fillRect(ox + bw - Math.floor(bw * 0.2) - lw, oy + bh, lw, lh)
    // Boss horns
    if (size === 'l') {
      g.fillStyle(0x886622).fillRect(ox + 4, oy - 18, 8, 22).fillRect(ox + bw - 12, oy - 18, 8, 22)
      g.fillStyle(0xaa8833).fillRect(ox + 4, oy - 18, 6, 5).fillRect(ox + bw - 10, oy - 18, 6, 5)
    }
    g.generateTexture(key, W, H); g.destroy()
  }
  makeMonster('monster_spider', 0x884488, 's')
  makeMonster('monster_rhino', 0x888844, 'm')
  makeMonster('monster_boss', 0xcc2222, 'l')
  makeMonster('monster_deer', 0x66aa99, 's')
  makeMonster('monster_wolf', 0x445577, 'm')
  makeMonster('monster_serpent', 0x338866, 'm')
  makeMonster('monster_guard', 0x776655, 'm')
  makeMonster('monster_tree', 0x446633, 'l')
  makeMonster('monster_crane', 0xddddcc, 'm')
  makeMonster('monster_tiger', 0xcc8844, 'm')
  makeMonster('monster_bat', 0x443366, 's')
}

/** NPC纹理 */
function generateNPCTextures(scene: Phaser.Scene) {
  function makeNPC(key: string, bodyColor: number) {
    const W = 64, H = 100, g = scene.add.graphics()
    g.fillStyle(0xf0c090).fillRect(20, 4, 24, 24)
    g.fillStyle(0x553322).fillRect(20, 4, 24, 8).fillRect(20, 4, 4, 24)
    g.fillStyle(0x111111).fillRect(26, 14, 4, 4).fillRect(36, 14, 4, 4)
    g.fillStyle(0xffffff).fillRect(27, 14, 2, 2).fillRect(37, 14, 2, 2)
    g.fillStyle(bodyColor).fillRect(18, 28, 28, 28)
    g.fillStyle(0x8b6914).fillRect(18, 52, 28, 4)
    g.fillStyle(0xdbb85e).fillRect(28, 52, 8, 4)
    g.fillStyle(bodyColor).fillRect(8, 32, 8, 22).fillRect(48, 32, 8, 22)
    g.fillStyle(0xf0c090).fillRect(8, 54, 8, 5).fillRect(48, 54, 8, 5)
    g.fillStyle(0x334466).fillRect(22, 57, 8, 26).fillRect(34, 57, 8, 26)
    g.fillStyle(0x442211).fillRect(20, 81, 12, 8).fillRect(32, 81, 12, 8)
    // 金色感叹号
    g.fillStyle(0xffd700).fillRect(30, -12, 4, 14).fillRect(28, 4, 8, 4)
    g.generateTexture(key, W, H); g.destroy()
  }
  makeNPC('npc_iron', 0xff8844)
  makeNPC('npc_shop', 0x44ff88)
}
