<script setup lang="ts">
import GameContainer from '@/ui/GameContainer.vue'
import TopBar from '@/ui/hud/TopBar.vue'
import LeftMenu from '@/ui/hud/LeftMenu.vue'
import BottomBar from '@/ui/hud/BottomBar.vue'
import CityPanel from '@/ui/panels/CityPanel.vue'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()
</script>

<template>
  <div class="game-layout">
    <TopBar class="top-bar" />
    <GameContainer class="game-area" />
    <LeftMenu class="left-menu" />

    <div v-if="!uiStore.isCreatingCharacter && uiStore.currentPanel === 'city'" class="city-overlay">
      <CityPanel />
    </div>

    <Transition name="panel-slide">
      <div
        v-if="uiStore.currentPanel !== 'city' && uiStore.currentPanelComponent && !uiStore.isCreatingCharacter"
        class="panel-overlay"
      >
        <component :is="uiStore.currentPanelComponent" />
      </div>
    </Transition>

    <BottomBar class="bottom-bar" />
  </div>
</template>

<style scoped>
.game-layout {
  width: 100vw; height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 142px 1fr;
  grid-template-areas:
    'top    top'
    'left   game'
    'bottom bottom';
  overflow: hidden;
  position: relative;
}
.top-bar { grid-area: top; z-index: 40; position: relative; }
.left-menu { grid-area: left; z-index: 35; position: relative; }
.game-area { grid-area: game; position: relative; min-width: 0; min-height: 0; }
.bottom-bar { grid-area: bottom; z-index: 40; position: relative; }

.panel-overlay {
  position: absolute;
  z-index: 34;
  top: 66px;
  left: 142px;
  right: 0;
  bottom: 220px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-y: auto;
  pointer-events: none;
  padding: 36px 24px;
}

.panel-overlay :deep(*) {
  pointer-events: auto;
}

.city-overlay {
  position: absolute;
  z-index: 12;
  top: 66px;
  left: 142px;
  right: 0;
  bottom: 200px;
  pointer-events: none;
}

.city-overlay :deep(.city-panel) {
  pointer-events: auto;
}

.panel-slide-enter-active, .panel-slide-leave-active {
  transition: all 0.25s ease;
}
.panel-slide-enter-from {
  opacity: 0; transform: translateX(-30px);
}
.panel-slide-leave-to {
  opacity: 0; transform: translateX(-20px);
}
</style>
