import Phaser from 'phaser'
import { BootScene } from '@/game/scenes/BootScene'
import { GameScene } from '@/game/scenes/GameScene'
import { BattleScene } from '@/game/scenes/BattleScene'

export function createGameConfig(parentEl: HTMLElement): Phaser.Types.Core.GameConfig {
  const pw = 960
  const ph = 540

  console.log('[Config] creating game:', pw, 'x', ph)

  return {
    type: Phaser.AUTO,
    parent: parentEl,
    width: pw,
    height: ph,
    backgroundColor: '#0a0e1a',
    pixelArt: false,
    roundPixels: false,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, GameScene, BattleScene],
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
  }
}
