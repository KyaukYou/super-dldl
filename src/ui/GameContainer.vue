<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import Phaser from 'phaser'
import { createGameConfig } from '@/game/config'
import { useGameStore } from '@/stores/game'
import { useUIStore } from '@/stores/ui'
import CharacterCreate from '@/ui/CharacterCreate.vue'
import RingSkillSelectPanel from '@/ui/panels/RingSkillSelectPanel.vue'

const gameContainer = ref<HTMLDivElement>()
let game: Phaser.Game | null = null

const gameStore = useGameStore()
const uiStore = useUIStore()

onMounted(async () => {
  const loaded = gameStore.loadGame()
  if (loaded && gameStore.hasCharacter) {
    uiStore.isCreatingCharacter = false
    await uiStore.openPanel('city')
    await nextTick()
    requestAnimationFrame(() => {
      initGame()
    })
  }
})

onUnmounted(() => {
  if (game) {
    game.destroy(true)
    game = null
  }
})

function initGame() {
  if (!gameContainer.value) {
    console.error('[GameContainer] gameContainer ref is null')
    return
  }

  if (game) {
    game.destroy(true)
  }

  game = new Phaser.Game(createGameConfig(gameContainer.value))
  ;(window as any).__phaserGame = game

  game.events.on('ready', () => {
    const canvas = gameContainer.value?.querySelector('canvas')
    if (canvas) {
      ;(canvas as any).__phaserGame = game
    }
  })
}

function onCharacterCreated() {
  uiStore.isCreatingCharacter = false
  nextTick(() => {
    uiStore.openPanel('city')
    requestAnimationFrame(() => {
      initGame()
    })
  })
}
</script>

<template>
  <div class="game-container">
    <CharacterCreate
      v-if="uiStore.isCreatingCharacter"
      @created="onCharacterCreated"
    />

    <div
      v-else
      ref="gameContainer"
      class="game-canvas"
      :class="{ hidden: false }"
    ></div>

    <RingSkillSelectPanel />
  </div>
</template>

<style scoped>
.game-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.game-canvas {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  inset: 0;
}

.game-canvas.hidden {
  visibility: hidden;
  pointer-events: none;
}

.game-canvas canvas {
  display: block;
}
</style>
