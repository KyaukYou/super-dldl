import Phaser from 'phaser'
import { generateAllTextures } from '@/game/utils/isoUtils'
import { backgroundPaths } from '@/assets/art-direction/background-paths'
import {
  battleEffectSources,
  battleTextureSources,
} from '@/game/scenes/battleVisuals'

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  preload() {
    const w = this.cameras.main.width
    const h = this.cameras.main.height
    const bar = this.add.graphics()
    const box = this.add.graphics()
    box.fillStyle(0x222222, 0.8)
    box.fillRect(w / 2 - 160, h / 2 - 25, 320, 50)
    const txt = this.add.text(w / 2, h / 2 - 40, '加载中...', { fontSize: '18px', color: '#c8a84e' }).setOrigin(0.5)
    const pct = this.add.text(w / 2, h / 2, '0%', { fontSize: '16px', color: '#e8dcc8' }).setOrigin(0.5)

    this.load.on('progress', (v: number) => {
      bar.clear()
      bar.fillStyle(0xc8a84e, 1)
      bar.fillRect(w / 2 - 150, h / 2 - 15, 300 * v, 30)
      pct.setText(`${Math.floor(v * 100)}%`)
    })
    this.load.on('complete', () => {
      bar.destroy()
      box.destroy()
      txt.destroy()
      pct.destroy()
    })

    this.load.image('bg_city_wuhun', backgroundPaths.cityWuhun)
    this.load.image('bg_battle_xingdou_outer', backgroundPaths.battleXingdouOuter)
    for (const [key, url] of Object.entries(battleTextureSources)) this.load.image(key, url)
    for (const [key, url] of Object.entries(battleEffectSources)) this.load.image(key, url)
  }

  create() {
    generateAllTextures(this)
    this.scene.start('GameScene')
  }
}
