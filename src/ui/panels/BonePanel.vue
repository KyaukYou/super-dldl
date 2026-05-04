<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore } from '@/stores/game'
import { useUIStore } from '@/stores/ui'
import type { BoneSlot, Quality } from '@/types/game'
import { BONES } from '@/data/gameData'
import { boneSlotLabels, qualityLabels, statLabel } from '@/data/displayData'
import { systemIconPath, boneIconPath } from '@/assets/art-direction/icon-paths'
import GameIcon from '@/ui/components/GameIcon.vue'

const gameStore = useGameStore()
const uiStore = useUIStore()

const char = computed(() => gameStore.character)
const activeTab = ref<'equip' | 'codex' | 'forge'>('equip')

const boneTabs = [
  { key: 'equip', label: '装备' },
  { key: 'codex', label: '图鉴' },
  { key: 'forge', label: '合成' },
] as const

const boneSlots: { slot: BoneSlot; row: number; col: number }[] = [
  { slot: 'head', row: 0, col: 1 },
  { slot: 'leftArm', row: 1, col: 0 },
  { slot: 'torso', row: 1, col: 1 },
  { slot: 'rightArm', row: 1, col: 2 },
  { slot: 'leftLeg', row: 2, col: 0 },
  { slot: 'rightLeg', row: 2, col: 2 },
  { slot: 'external', row: 3, col: 1 },
]

const selectedSlot = ref<BoneSlot | null>(null)

function getEquippedBone(slot: BoneSlot) {
  if (!char.value) return null
  return char.value.equippedBones[slot]
}

function getEquippedBoneDef(slot: BoneSlot) {
  const boneId = getEquippedBone(slot)
  if (!boneId) return null
  return BONES.find((b) => b.id === boneId) ?? null
}

const selectedBone = computed(() => {
  if (!selectedSlot.value) return null
  return getEquippedBoneDef(selectedSlot.value)
})

function selectSlot(slot: BoneSlot) {
  selectedSlot.value = selectedSlot.value === slot ? null : slot
}

function qualityColor(quality: Quality) {
  const map: Record<Quality, string> = {
    white: '#d4d4d4',
    green: '#4aff7a',
    blue: '#4a9eff',
    purple: '#b44aff',
    orange: '#ff8c00',
    red: '#ff4a4a',
  }
  return map[quality]
}

function qualityClass(quality: Quality) {
  return `quality-${quality}`
}

function goHuntBone() {
  void uiStore.openPanel('worldMap')
}

function formatStats(stats: Record<string, number>) {
  return Object.entries(stats)
    .map(([k, v]) => `${statLabel(k)} ${v > 0 ? '+' : ''}${v}${['critRate', 'dodgeRate'].includes(k) ? '%' : ''}`)
    .join('  ')
}
</script>

<template>
  <div v-if="char" class="bone-panel panel-base">
    <div class="panel-header">
      <div class="title-wrap">
        <GameIcon :src="systemIconPath('bone')" :size="34" quality="orange" title="魂骨" fallback-text="骨" />
        <h3 class="panel-title">魂骨</h3>
      </div>
      <button class="close-btn" type="button" @click.stop="uiStore.closePanel()">关闭</button>
    </div>

    <div class="bone-tabs">
      <button
        v-for="tab in boneTabs"
        :key="tab.key"
        class="tab"
        :class="{ active: activeTab === tab.key }"
        type="button"
        @click.stop="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <template v-if="activeTab === 'equip'">
      <div class="bone-layout">
        <button
          v-for="b in boneSlots"
          :key="b.slot"
          class="bone-slot"
          :style="{ gridRow: b.row + 1, gridColumn: b.col + 1 }"
          :class="{ equipped: !!getEquippedBoneDef(b.slot), selected: selectedSlot === b.slot }"
          type="button"
          @click.stop="selectSlot(b.slot)"
        >
          <GameIcon
            :src="getEquippedBoneDef(b.slot) ? boneIconPath(getEquippedBoneDef(b.slot)!.id) : ''"
            :quality="getEquippedBoneDef(b.slot)?.quality ?? 'white'"
            :size="48"
            :empty="!getEquippedBoneDef(b.slot)"
            :fallback-text="boneSlotLabels[b.slot].slice(0, 1)"
          />
          <div class="bone-info">
            <div class="bone-slot-name">{{ boneSlotLabels[b.slot] }}</div>
            <div v-if="getEquippedBoneDef(b.slot)" class="bone-equipped-name" :style="{ color: qualityColor(getEquippedBoneDef(b.slot)!.quality) }">
              {{ getEquippedBoneDef(b.slot)!.name }}
            </div>
            <div v-else class="bone-empty">空位</div>
          </div>
        </button>
      </div>

      <div v-if="selectedSlot && selectedBone" class="bone-detail">
        <div class="detail-head">
          <GameIcon :src="boneIconPath(selectedBone.id)" :quality="selectedBone.quality" :size="58" :fallback-text="selectedBone.name.slice(0, 1)" />
          <div>
            <div class="detail-name" :style="{ color: qualityColor(selectedBone.quality) }">{{ selectedBone.name }}</div>
            <div class="detail-quality" :style="{ color: qualityColor(selectedBone.quality) }">{{ qualityLabels[selectedBone.quality] }}</div>
          </div>
        </div>
        <div class="detail-stats">{{ formatStats(selectedBone.stats) }}</div>
        <div class="detail-source">来源：{{ selectedBone.source }}</div>
      </div>
      <div v-else-if="selectedSlot" class="bone-detail">
        <div class="detail-empty">该部位尚未装备魂骨</div>
        <button class="btn-dark text-xs mt-2" type="button" @click.stop="goHuntBone">前往狩猎</button>
      </div>
    </template>

    <template v-if="activeTab === 'codex'">
      <div class="codex-list">
        <div v-for="bone in BONES" :key="bone.id" class="codex-item" :class="qualityClass(bone.quality)">
          <GameIcon :src="boneIconPath(bone.id)" :quality="bone.quality" :size="42" :fallback-text="bone.name.slice(0, 1)" />
          <div class="codex-info">
            <div class="codex-name" :style="{ color: qualityColor(bone.quality) }">{{ bone.name }}</div>
            <div class="codex-slot">{{ boneSlotLabels[bone.slot] }}</div>
            <div class="codex-stats">{{ formatStats(bone.stats) }}</div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="activeTab === 'forge'">
      <div class="forge-area">
        <p>收集魂骨碎片可以合成随机魂骨。</p>
        <div class="forge-slots">
          <div class="forge-slot">材料 1</div>
          <div class="forge-slot">材料 2</div>
          <div class="forge-slot">材料 3</div>
        </div>
        <div class="forge-arrow">→</div>
        <div class="forge-result">?</div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.bone-panel {
  width: 740px;
  height: calc(100vh - 304px);
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-scroll-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.panel-header,
.title-wrap,
.bone-tabs,
.detail-head {
  display: flex;
  align-items: center;
}

.panel-header {
  justify-content: space-between;
  margin-bottom: 12px;
}

.title-wrap,
.detail-head {
  gap: 10px;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.bone-tabs {
  gap: 6px;
  margin-bottom: 12px;
}

.tab {
  padding: 5px 14px;
  font-size: 12px;
  color: var(--color-text-secondary);
  border: 1px solid rgba(200, 168, 78, 0.12);
  background: rgba(8, 10, 18, 0.64);
  border-radius: 4px;
  cursor: pointer;
}

.tab.active {
  color: var(--color-border-gold);
  background: rgba(200, 168, 78, 0.16);
  border-color: rgba(200, 168, 78, 0.24);
}

.bone-layout {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto auto auto;
  gap: 8px;
  margin-bottom: 12px;
}

.bone-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  min-height: 108px;
  padding: 10px 6px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.24);
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
}

.bone-slot.equipped {
  border-color: rgba(74, 255, 122, 0.3);
  background: rgba(74, 255, 122, 0.05);
}

.bone-slot.selected {
  border-color: var(--color-border-gold);
  box-shadow: 0 0 8px rgba(200, 168, 78, 0.28);
}

.bone-info {
  text-align: center;
}

.bone-slot-name,
.bone-empty,
.codex-slot,
.codex-stats,
.detail-source,
.detail-empty,
.forge-area {
  font-size: 11px;
  color: var(--color-text-secondary);
}

.bone-equipped-name,
.codex-name,
.detail-name {
  font-size: 12px;
  font-weight: 700;
}

.bone-detail {
  padding: 10px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid rgba(200, 168, 78, 0.15);
}

.detail-quality {
  font-size: 12px;
}

.detail-stats {
  margin: 8px 0 4px;
  font-size: 12px;
  line-height: 1.6;
}

.codex-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.codex-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-left: 3px solid transparent;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.2);
}

.codex-item.quality-blue { border-left-color: #4a9eff; }
.codex-item.quality-purple { border-left-color: #b44aff; }
.codex-item.quality-orange { border-left-color: #ff8c00; }
.codex-item.quality-red { border-left-color: #ff4a4a; }

.codex-info {
  min-width: 0;
}

.forge-area {
  text-align: center;
  padding: 20px 0;
}

.forge-slots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 16px 0;
}

.forge-slot {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed rgba(200, 168, 78, 0.3);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
}

.forge-arrow {
  margin: 8px 0;
  color: var(--color-border-gold);
  font-size: 24px;
}

.forge-result {
  width: 70px;
  height: 70px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border-gold-dim);
  border-radius: 8px;
  background: rgba(200, 168, 78, 0.1);
  color: var(--color-border-gold);
  font-size: 24px;
}
</style>
