<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore } from '@/stores/game'
import { useUIStore } from '@/stores/ui'
import { MAPS } from '@/data/gameData'
import { factionLabels, mapLabels } from '@/data/displayData'
import { REGION_MONSTERS, type BattleMonsterDef } from '@/game/scenes/BattleScene'
import { monsterYearText } from '@/game/utils/panelProgressionRules'
import type { Faction } from '@/types/game'
import { backgroundPaths } from '@/assets/art-direction/background-paths'
import { systemIconPath } from '@/assets/art-direction/icon-paths'
import { returnFromBattleScene, startBattleScene } from '@/game/utils/battleSceneFlow'

const uiStore = useUIStore()
const gameStore = useGameStore()
const char = computed(() => gameStore.character)

const selectedRegion = ref(gameStore.currentMapId || 'miluo_lake')
const selectedMonster = ref<BattleMonsterDef | null>(REGION_MONSTERS[selectedRegion.value]?.[0] ?? null)

const regionPins: Record<string, { x: number; y: number }> = {
  miluo_lake: { x: 35.2, y: 89.6 },
  xingdou_outer: { x: 46.2, y: 76.6 },
  shengtianya: { x: 58.9, y: 86.8 },
  tongtian_cave: { x: 67.5, y: 77.1 },
  xingdou_edge: { x: 54.5, y: 67.4 },
  tasi_grassland: { x: 68.9, y: 57.9 },
  xingdou_center: { x: 46.7, y: 58.3 },
  tianqing_lake: { x: 40.8, y: 40.8 },
  slaughter_city: { x: 74.4, y: 34.4 },
  haotian_sect: { x: 27.3, y: 31.2 },
  seagod_island: { x: 17.2, y: 73.3 },
  ice_forest: { x: 84.3, y: 20.2 },
}

const regionMap = computed(() => MAPS.find((map) => map.id === selectedRegion.value) ?? MAPS[0]!)
const regionMonsters = computed(() => REGION_MONSTERS[selectedRegion.value] ?? [])

function mapName(id: string, fallback: string) {
  return mapLabels[id] ?? fallback
}

function factionLabel(faction: Faction | 'public') {
  return factionLabels[faction]
}

function canEnterRegion(region: { minLevel: number; faction: Faction | 'public' }): boolean {
  if (!char.value) return false
  if (char.value.level < region.minLevel) return false
  if (region.faction !== 'public' && char.value.faction !== region.faction) return false
  return true
}

function regionLockReason(region: { minLevel: number; faction: Faction | 'public' }): string {
  if (!char.value) return '尚未创建角色'
  if (char.value.level < region.minLevel) return `需要 Lv.${region.minLevel}`
  if (region.faction !== 'public' && char.value.faction !== region.faction) return '阵营限制'
  return ''
}

function selectRegion(regionId: string) {
  selectedRegion.value = regionId
  selectedMonster.value = REGION_MONSTERS[regionId]?.[0] ?? null
}

function returnToWorldMap(game: any) {
  returnFromBattleScene(game, () => {
    void uiStore.openPanel('worldMap')
  })
}

function startBattle() {
  if (!selectedMonster.value || !canEnterRegion(regionMap.value)) return
  const game = (window as Window & { __phaserGame?: any }).__phaserGame
  if (!game) return

  gameStore.currentMapId = selectedRegion.value
  gameStore.saveGame()
  uiStore.hidePanel()

  startBattleScene(game, {
    region: selectedRegion.value,
    monsterId: selectedMonster.value.id,
    onVictory: () => returnToWorldMap(game),
    onDefeat: () => returnToWorldMap(game),
  })
}
</script>

<template>
  <div v-if="char" class="worldmap-panel panel-base">
    <div class="panel-header">
      <h3 class="panel-title">世界地图</h3>
      <button class="close-btn" type="button" aria-label="关闭" @click.stop="uiStore.closePanel()">关闭</button>
    </div>

    <div class="panel-scroll-body">
    <div class="worldmap-layout">
      <div class="map-stage">
        <img class="map-image" :src="backgroundPaths.worldDouluoMap" alt="斗罗大陆世界地图" />
        <button
          v-for="map in MAPS"
          :key="map.id"
          class="region-pin"
          :class="{ active: selectedRegion === map.id, locked: !canEnterRegion(map) }"
          :style="{ left: `${regionPins[map.id]?.x ?? 50}%`, top: `${regionPins[map.id]?.y ?? 50}%` }"
          :title="canEnterRegion(map) ? mapName(map.id, map.name) : `${mapName(map.id, map.name)} - ${regionLockReason(map)}`"
          type="button"
          @click.stop="selectRegion(map.id)"
        >
          <img :src="systemIconPath(canEnterRegion(map) ? 'map_pin' : 'lock')" alt="" />
          <span>{{ mapName(map.id, map.name) }}</span>
        </button>
      </div>

      <aside class="region-side">
        <section class="region-card">
          <div class="region-name">{{ mapName(regionMap.id, regionMap.name) }}</div>
          <div class="region-meta">
            <span>推荐等级 Lv.{{ regionMap.minLevel }}+</span>
            <span>{{ factionLabel(regionMap.faction) }}</span>
          </div>
          <div v-if="!canEnterRegion(regionMap)" class="region-lock">{{ regionLockReason(regionMap) }}</div>
        </section>

        <section class="monster-list">
          <button
            v-for="monster in regionMonsters"
            :key="monster.id"
            class="monster-card"
            :class="{ active: selectedMonster?.id === monster.id }"
            type="button"
            @click.stop="selectedMonster = monster"
          >
            <div class="monster-head">
              <span class="monster-level">Lv.{{ monster.level }}</span>
              <span class="monster-name">{{ monster.name }}</span>
            </div>
            <div class="monster-year">{{ monsterYearText(monster.level) }}</div>
            <div class="monster-stats">生命 {{ monster.hp }} / 攻击 {{ monster.atk }} / 防御 {{ monster.def }}</div>
            <div class="monster-reward">经验 {{ monster.exp }} / 金币 {{ monster.gold }}</div>
          </button>
          <div v-if="regionMonsters.length === 0" class="empty-state">该区域暂时无可挑战目标</div>
        </section>

        <section v-if="selectedMonster" class="battle-box">
          <div class="battle-title">目标确认</div>
          <div class="battle-name">{{ selectedMonster.name }}</div>
          <div class="battle-year">{{ monsterYearText(selectedMonster.level) }}</div>
          <div class="battle-reward">胜利后获得 {{ selectedMonster.exp }} 经验和 {{ selectedMonster.gold }} 金币</div>
          <button class="fight-btn" type="button" :disabled="!canEnterRegion(regionMap)" @click.stop="startBattle">进入战斗</button>
        </section>
      </aside>
    </div>
    </div>
  </div>
</template>

<style scoped>
.worldmap-panel {
  width: min(1320px, calc(100vw - 108px));
  position: absolute;
  top: 36px;
  bottom: 0;
  min-height: 560px;
  padding: 16px 0;
  padding-top: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-scroll-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
  padding: 0 16px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: 54px;
  padding: 0 16px;
  padding-top: 10px;
  padding-right: 0;
  margin-bottom: 10px;
}

.panel-sub {
  margin-top: 4px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.worldmap-layout {
  height: calc(100% - 64px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 14px;
}

.map-stage {
  position: relative;
  min-height: 0;
  overflow: hidden;
  border: 1px solid rgba(200, 168, 78, 0.18);
  border-radius: 8px;
  background: #0b1018;
}

.map-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.region-pin {
  position: absolute;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transform: translate(-50%, -50%);
  padding: 4px 10px 4px 4px;
  color: #f2e2b2;
  background: rgba(8, 13, 20, 0.9);
  border: 1px solid rgba(200, 168, 78, 0.32);
  border-radius: 999px;
  cursor: pointer;
}

.region-pin img {
  width: 24px;
  height: 24px;
}

.region-pin span {
  font-size: 12px;
  white-space: nowrap;
}

.region-pin.active,
.region-pin:hover {
  border-color: var(--color-border-gold);
  box-shadow: 0 0 14px rgba(200, 168, 78, 0.28);
}

.region-pin.locked {
  opacity: 0.62;
}

.region-side {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

.region-card,
.battle-box {
  padding: 12px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(200, 168, 78, 0.16);
}

.region-name,
.battle-title {
  color: var(--color-border-gold);
  font-size: 16px;
  font-weight: 700;
}

.region-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 6px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.region-lock {
  margin-top: 8px;
  color: #ff7a6c;
  font-size: 12px;
}

.monster-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  flex: 1;
  overflow-y: auto;
}

.monster-card {
  width: 100%;
  padding: 10px;
  text-align: left;
  color: var(--color-text-primary);
  background: rgba(0, 0, 0, 0.24);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
}

.monster-card.active,
.monster-card:hover {
  background: rgba(200, 168, 78, 0.08);
  border-color: rgba(200, 168, 78, 0.34);
}

.monster-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.monster-level {
  color: #ff9e6d;
  font-size: 12px;
}

.monster-name {
  font-weight: 700;
}

.monster-year {
  margin-top: 4px;
  color: #f0d38a;
  font-size: 11px;
}

.monster-stats,
.monster-reward,
.battle-reward,
.battle-year,
.empty-state {
  margin-top: 4px;
  color: var(--color-text-secondary);
  font-size: 11px;
}

.battle-name {
  margin-top: 6px;
  color: #f5e7bf;
  font-size: 15px;
}

.fight-btn {
  width: 100%;
  margin-top: 10px;
  padding: 10px 12px;
  color: #201a0d;
  font-weight: 700;
  background: linear-gradient(180deg, #c8a84e, #8b6914);
  border: 1px solid #dbb85e;
  border-radius: 6px;
  cursor: pointer;
}

.fight-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
