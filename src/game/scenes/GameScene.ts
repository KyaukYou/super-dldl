import Phaser from 'phaser'

export class GameScene extends Phaser.Scene {
  private autoFight = false
  private ambientTexts: Phaser.GameObjects.Text[] = []

  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    const w = this.cameras.main.width
    const h = this.cameras.main.height

    this.add.image(w / 2, h / 2, 'bg_city_wuhun').setDisplaySize(w, h).setDepth(-100)
    this.add.rectangle(w / 2, h / 2, w, h, 0x05070d, 0.18).setDepth(-90)

    this.createAmbientLife()
  }

  private createAmbientLife() {
    const messages = [
      'AI 魂师小队正在前往星斗外围',
      '斗魂场传来新的挑战邀请',
      '商会正在收购魂骨碎片',
      '宗门巡逻队刷新今日委托',
    ]

    messages.forEach((message, index) => {
      const text = this.add.text(80 + index * 210, 500 - (index % 2) * 28, message, {
        fontFamily: 'Microsoft YaHei',
        fontSize: '13px',
        color: '#f4e6ba',
        stroke: '#000000',
        strokeThickness: 3,
      }).setAlpha(0.72).setDepth(10)

      this.tweens.add({
        targets: text,
        y: text.y - 8,
        alpha: 0.35,
        duration: 2200 + index * 240,
        yoyo: true,
        repeat: -1,
      })
      this.ambientTexts.push(text)
    })
  }

  setAutoFight(enabled: boolean) {
    this.autoFight = enabled
  }

  isAutoFighting(): boolean {
    return this.autoFight
  }
}
