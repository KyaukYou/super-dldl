<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'
import { useUIStore } from '@/stores/ui'
import { FACTION_NAMES } from '@/types/game'
import { MAPS } from '@/data/gameData'
import { displayName, mapLabels } from '@/data/displayData'
import { systemIconPath } from '@/assets/art-direction/icon-paths'
import playerAvatar from '@/assets/avatars/avatar_soul_master_v1.png'
import GameIcon from '@/ui/components/GameIcon.vue'

const gameStore = useGameStore()
const uiStore = useUIStore()

const char = computed(() => gameStore.character)
const spirit = computed(() => gameStore.spiritDef)
const spiritName = computed(() => spirit.value ? displayName(spirit.value.id, spirit.value.name) : '')

const hpPercent = computed(() => {
  if (!char.value) return 0
  return Math.floor((char.value.stats.hp / char.value.stats.maxHp) * 100)
})

const mpPercent = computed(() => {
  if (!char.value) return 0
  return Math.floor((char.value.stats.mp / char.value.stats.maxMp) * 100)
})

const expPercent = computed(() => {
  if (!char.value) return 0
  return Math.floor((char.value.exp / char.value.expToNext) * 100)
})

const currentMapName = computed(() => {
  if (!char.value) return ''
  const map = MAPS.find((item) => item.id === gameStore.currentMapId)
  return map ? mapLabels[map.id] ?? map.name : FACTION_NAMES[char.value.faction]
})

const avatarInitial = computed(() => spiritName.value.slice(0, 1) || char.value?.name.slice(0, 1) || '魂')

function openWorldMap() {
  void uiStore.openPanel('worldMap')
}
</script>

<template>
  <header v-if="char" class="top-bar panel-base">
    <div class="player-info">
      <button class="avatar-frame" type="button" title="角色信息" @click.stop="uiStore.openPanel('character')">
        <GameIcon
          class="avatar"
          :src="playerAvatar"
          quality="orange"
          :size="48"
          :title="spiritName || char.name"
          :fallback-text="avatarInitial"
        />
      </button>
      <div class="info-body">
        <div class="name-row">
          <span class="name">{{ char.name }}</span>
          <span class="level">Lv.{{ char.level }} {{ gameStore.rankTitle }}</span>
        </div>
        <div class="bar-row">
          <div class="bar-base hp-bar">
            <div class="bar-fill" :style="{ width: `${hpPercent}%`, background: 'var(--color-hp)' }"></div>
            <span class="bar-text">{{ char.stats.hp }}/{{ char.stats.maxHp }}</span>
          </div>
        </div>
        <div class="bar-row">
          <div class="bar-base mp-bar">
            <div class="bar-fill" :style="{ width: `${mpPercent}%`, background: 'var(--color-mp)' }"></div>
            <span class="bar-text">{{ char.stats.mp }}/{{ char.stats.maxMp }}</span>
          </div>
        </div>
        <div class="bar-row">
          <div class="bar-base exp-bar">
            <div class="bar-fill" :style="{ width: `${expPercent}%`, background: 'var(--color-exp)' }"></div>
            <span class="bar-text">{{ expPercent }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mini-map">
      <button class="map-chip" title="世界地图" type="button" @click.stop="openWorldMap">
        <img :src="systemIconPath('world_map')" alt="" />
        <span>{{ currentMapName }}</span>
      </button>
      <div class="gold">金币 {{ char.gold }}</div>
    </div>
  </header>
</template>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 66px;
  padding: 8px 14px;
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0;
  background:
    linear-gradient(180deg, rgba(25, 23, 18, 0.96), rgba(8, 13, 20, 0.94)),
    radial-gradient(circle at 18% 0%, rgba(221, 182, 87, 0.24), transparent 28%);
}

.player-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-frame {
  width: 58px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(200, 168, 78, 0.54);
  border-radius: 6px;
  background:
    radial-gradient(circle at 50% 38%, rgba(200, 168, 78, 0.24), transparent 58%),
    rgba(0, 0, 0, 0.42);
  box-shadow: inset 0 0 14px rgba(74, 158, 255, 0.18), 0 0 10px rgba(200, 168, 78, 0.16);
  cursor: pointer;
}

.info-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.name-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.name {
  color: var(--color-border-gold);
  font-weight: 700;
  font-size: 14px;
}

.level {
  color: var(--color-text-secondary);
  font-size: 11px;
}

.bar-row {
  width: 186px;
}

.mini-map {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.map-chip {
  height: 42px;
  min-width: 160px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 4px 5px;
  color: var(--color-text-primary);
  background: rgba(0, 0, 0, 0.34);
  border: 1px solid rgba(200, 168, 78, 0.34);
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.18s, box-shadow 0.18s;
}

.map-chip:hover,
.avatar-frame:hover {
  border-color: var(--color-border-gold);
  box-shadow: 0 0 14px rgba(200, 168, 78, 0.22);
}

.map-chip img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.gold {
  color: #ffd700;
  font-weight: 700;
}
</style>
