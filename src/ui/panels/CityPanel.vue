<script setup lang="ts">
import { useUIStore } from '@/stores/ui'
import type { PanelName } from '@/stores/ui'
import { backgroundPaths } from '@/assets/art-direction/background-paths'
import { cityLuxuryButtons } from '@/assets/art-direction/generated-paths'

type CityHotspot = {
  id: Exclude<PanelName, null | 'city'>
  name: string
  x: number
  y: number
  tone: keyof typeof cityLuxuryButtons
}

const uiStore = useUIStore()

const hotspots: CityHotspot[] = [
  { id: 'sect', name: '宗门', x: 18, y: 27, tone: 'purple' },
  { id: 'worldMap', name: '世界地图', x: 80, y: 20, tone: 'green' },
  { id: 'academy', name: '学院', x: 52, y: 18, tone: 'blue' },
  { id: 'quest', name: '任务大厅', x: 42, y: 42, tone: 'gold' },
  { id: 'smithy', name: '铁匠铺', x: 25, y: 55, tone: 'blue' },
  { id: 'arena', name: '斗魂场', x: 53, y: 63, tone: 'red' },
  { id: 'shop', name: '商店', x: 78, y: 52, tone: 'gold' },
]

function enterBuilding(id: CityHotspot['id']) {
  void uiStore.openPanel(id)
}
</script>

<template>
  <div class="city-panel">
    <img class="city-bg" :src="backgroundPaths.cityWuhun" alt="武魂城主界面" />
    <div class="city-mask"></div>

    <button
      v-for="spot in hotspots"
      :key="spot.id"
      class="city-hotspot"
      :class="`tone-${spot.tone}`"
      :style="{ left: `${spot.x}%`, top: `${spot.y}%`, '--city-button-url': `url(${cityLuxuryButtons[spot.tone]})` }"
      type="button"
      @click.stop="enterBuilding(spot.id)"
    >
      <span class="hotspot-name">{{ spot.name }}</span>
    </button>
  </div>
</template>

<style scoped>
.city-panel {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #070b12;
}

.city-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.city-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(6, 10, 16, 0.0), rgba(6, 10, 16, 0.12));
  pointer-events: none;
}

.city-hotspot {
  position: absolute;
  width: 178px;
  height: 52px;
  padding: 0 30px;
  transform: translate(-50%, -50%);
  color: #fff1c8;
  font-size: 16px;
  font-weight: 800;
  text-shadow: 0 2px 4px #000, 0 0 10px rgba(255, 218, 120, 0.4);
  cursor: pointer;
  border: none;
  border-radius: 0;
  background: var(--city-button-url) center / 100% 100% no-repeat;
  filter: drop-shadow(0 5px 12px rgba(0, 0, 0, 0.58));
  transition: transform 0.15s, filter 0.15s, box-shadow 0.15s;
}

.city-hotspot::before {
  content: none;
}

.hotspot-name {
  position: relative;
  display: block;
  pointer-events: none;
  white-space: nowrap;
  transform: translateY(2px);
}

.city-hotspot:hover {
  transform: translate(-50%, -50%) scale(1.06);
  filter: brightness(1.16) drop-shadow(0 7px 16px rgba(0, 0, 0, 0.62));
}

.tone-green { color: #dcffe9; }
.tone-blue { color: #dbeeff; }
.tone-red { color: #ffe4dc; }
.tone-purple { color: #edddff; }
</style>
