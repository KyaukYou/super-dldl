type PhaserGameLike = {
  scene: {
    stop: (key: string) => void
    start: (key: string, data?: unknown) => void
    isActive?: (key: string) => boolean
    isSleeping?: (key: string) => boolean
    getScene?: (key: string) => unknown
  }
}

export function startBattleScene(game: PhaserGameLike, data: unknown) {
  window.requestAnimationFrame(() => {
    game.scene.stop('BattleScene')
    game.scene.stop('GameScene')
    window.requestAnimationFrame(() => {
      game.scene.start('BattleScene', data)
    })
  })
}

export function returnFromBattleScene(game: PhaserGameLike, afterReturn: () => void) {
  window.requestAnimationFrame(() => {
    game.scene.stop('BattleScene')
    window.requestAnimationFrame(() => {
      game.scene.start('GameScene')
      afterReturn()
    })
  })
}

export function isBattleSceneRunning(game: PhaserGameLike | null | undefined): boolean {
  if (!game) return false
  return game.scene.isActive?.('BattleScene') ?? false
}

export function stopBattleScene(game: PhaserGameLike | null | undefined, afterReturn?: () => void) {
  if (!game) return
  window.requestAnimationFrame(() => {
    game.scene.stop('BattleScene')
    window.requestAnimationFrame(() => {
      game.scene.start('GameScene')
      afterReturn?.()
    })
  })
}
