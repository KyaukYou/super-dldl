<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'
import { useUIStore } from '@/stores/ui'
import { RING_COLOR_MAP } from '@/types/game'
import { factionLabels, seriesLabels } from '@/data/displayData'
import { SKILLS } from '@/data/gameData'
import { spiritIconPath, skillIconPath } from '@/assets/art-direction/icon-paths'
import GameIcon from '@/ui/components/GameIcon.vue'

const gameStore = useGameStore()
const uiStore = useUIStore()

const char = computed(() => gameStore.character)
const spirit = computed(() => gameStore.spiritDef)

function getSkillName(skillId: string | null) {
  if (!skillId) return '未装配'
  return SKILLS.find((s) => s.id === skillId)?.name ?? '未知魂技'
}

function getSkillDef(skillId: string | null) {
  if (!skillId) return null
  return SKILLS.find((s) => s.id === skillId) ?? null
}

function ringUnlockLevel(slot: number) {
  return slot * 10
}
</script>

<template>
  <div v-if="char && spirit" class="spirit-panel panel-base">
    <div class="panel-header">
      <h3 class="panel-title">武魂信息</h3>
      <button class="close-btn" type="button" @click.stop="uiStore.closePanel()">关闭</button>
    </div>

    <div class="spirit-card">
      <GameIcon :src="spiritIconPath(spirit!.id)" quality="orange" :size="86" :title="spirit!.name" :fallback-text="spirit!.name.slice(0, 1)" />
      <div class="spirit-info-text">
        <div class="spirit-name">{{ spirit.name }}</div>
        <div class="spirit-meta">
          <span class="spirit-series">{{ seriesLabels[spirit.series] }}</span>
          <span class="spirit-faction">{{ factionLabels[char.faction] }}</span>
        </div>
        <div class="spirit-power-row">
          <span class="power-label">先天魂力</span>
          <div class="power-bar">
            <div class="power-fill" :style="{ width: `${(spirit.innatePower / 10) * 100}%` }"></div>
          </div>
          <span class="power-value">{{ spirit.innatePower }}/10</span>
        </div>
        <div class="spirit-talent">天赋：{{ spirit.talent }}</div>
      </div>
    </div>

    <div class="base-stats">
      <h4 class="section-title">基础属性</h4>
      <div class="stats-grid">
        <div class="stat-item"><span>力量</span><b>{{ spirit.baseStats.str }}</b></div>
        <div class="stat-item"><span>敏捷</span><b>{{ spirit.baseStats.agi }}</b></div>
        <div class="stat-item"><span>智力</span><b>{{ spirit.baseStats.int }}</b></div>
        <div class="stat-item"><span>体质</span><b>{{ spirit.baseStats.vit }}</b></div>
      </div>
    </div>

    <div class="ring-section">
      <h4 class="section-title">魂环 {{ char.rings.length }}/9</h4>
      <div class="ring-list">
        <div v-for="n in 9" :key="n" class="ring-item" :class="{ locked: char.level < ringUnlockLevel(n) }">
          <div
            class="ring-circle"
            :style="{
              borderColor: n <= char.rings.length ? RING_COLOR_MAP[char.rings[n - 1]!.color].css : '#333',
              boxShadow: n <= char.rings.length ? `0 0 10px ${RING_COLOR_MAP[char.rings[n - 1]!.color].css}60` : 'none',
            }"
          >
            {{ n }}
          </div>
          <span v-if="n <= char.rings.length" class="ring-label">{{ RING_COLOR_MAP[char.rings[n - 1]!.color].label }}</span>
          <span v-if="n <= char.rings.length" class="ring-year">{{ char.rings[n - 1]!.yearRange }}年</span>
          <span v-else-if="char.level >= ringUnlockLevel(n)" class="ring-label ready">可吸收</span>
          <span v-else class="ring-label locked-label">{{ ringUnlockLevel(n) }}级</span>
          <span v-if="n <= char.rings.length && char.rings[n - 1]!.skillId" class="ring-skill">
            {{ getSkillName(char.rings[n - 1]!.skillId) }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="char.rings.length > 0" class="equipped-skills">
      <h4 class="section-title">已装配魂技</h4>
      <div class="skill-list">
        <div v-for="ring in char.rings" :key="ring.slot" class="skill-item">
          <GameIcon
            :src="ring.skillId ? skillIconPath(ring.skillId) : ''"
            quality="purple"
            :size="38"
            :title="getSkillName(ring.skillId)"
            :fallback-text="getSkillName(ring.skillId).slice(0, 1)"
          />
          <div class="skill-info">
            <span class="skill-name">{{ getSkillName(ring.skillId) }}</span>
            <span class="skill-desc">{{ getSkillDef(ring.skillId)?.description ?? '尚未选择魂技' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spirit-panel {
  width: 740px;
  height: calc(100vh - 304px);
  padding: 24px 20px;
  overflow-y: auto;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.spirit-card {
  display: flex;
  gap: 14px;
  margin-bottom: 14px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.28);
  border-radius: 8px;
  border: 1px solid rgba(200, 168, 78, 0.15);
}

.spirit-info-text {
  min-width: 0;
  flex: 1;
}

.spirit-name {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-border-gold);
}

.spirit-meta {
  display: flex;
  gap: 8px;
  margin: 6px 0;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.spirit-series {
  color: #7eb6ff;
}

.spirit-power-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.power-label,
.power-value,
.spirit-talent,
.stat-item span,
.ring-label,
.skill-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.power-bar {
  flex: 1;
  min-width: 120px;
  height: 8px;
  background: rgba(0, 0, 0, 0.45);
  border-radius: 999px;
  overflow: hidden;
}

.power-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffd700, #ff8c00);
}

.power-value {
  color: #ffd700;
  font-weight: 700;
}

.spirit-talent {
  line-height: 1.6;
}

.section-title {
  margin: 14px 0 8px;
  padding-bottom: 4px;
  font-size: 13px;
  color: var(--color-border-gold);
  border-bottom: 1px solid rgba(200, 168, 78, 0.15);
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.stat-item,
.skill-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.22);
}

.stat-item {
  justify-content: space-between;
}

.ring-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ring-item {
  width: 54px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.ring-item.locked {
  opacity: 0.44;
}

.ring-circle {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #333;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  font-weight: 700;
  font-size: 15px;
}

.ring-label.ready {
  color: #44ff88;
}

.ring-year {
  font-size: 11px;
  color: #f4d98a;
}

.ring-skill {
  max-width: 80px;
  overflow: hidden;
  color: var(--color-border-gold);
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.skill-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skill-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.skill-name {
  font-size: 13px;
  font-weight: 700;
}
</style>
