<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'
import { useUIStore } from '@/stores/ui'
import { RING_COLOR_MAP } from '@/types/game'
import { seriesLabels, skillTypeLabels } from '@/data/displayData'
import { SKILLS } from '@/data/gameData'
import { skillIconPath } from '@/assets/art-direction/icon-paths'
import GameIcon from '@/ui/components/GameIcon.vue'

const gameStore = useGameStore()
const uiStore = useUIStore()

const char = computed(() => gameStore.character)
const spirit = computed(() => gameStore.spiritDef)

function getRingSkill(ringSlot: number) {
  if (!char.value) return null
  const ring = char.value.rings.find((r) => r.slot === ringSlot)
  if (!ring || !ring.skillId) return null
  return SKILLS.find((s) => s.id === ring.skillId) ?? null
}

const availableSkills = computed(() => {
  if (!spirit.value) return []
  const equippedIds = (char.value?.rings.map((r) => r.skillId).filter(Boolean) as string[] | undefined) ?? []
  return SKILLS.filter((s) => s.series === spirit.value!.series && !equippedIds.includes(s.id))
})

const typeColors: Record<string, string> = {
  damage: '#ff6262',
  buff: '#44ff88',
  debuff: '#ff9b44',
  heal: '#44aaff',
  control: '#b44aff',
}
</script>

<template>
  <div v-if="char && spirit" class="skill-panel panel-base">
    <div class="panel-header">
      <h3 class="panel-title">魂技</h3>
      <button class="close-btn" type="button" @click.stop="uiStore.closePanel()">关闭</button>
    </div>

    <div class="section">
      <h4 class="section-title">已装配魂技</h4>
      <div class="ring-slots">
        <div v-for="n in 9" :key="n" class="ring-slot" :class="{ unlocked: n <= char.rings.length }">
          <div
            class="ring-indicator"
            :style="{
              borderColor: n <= char.rings.length ? RING_COLOR_MAP[char.rings[n - 1]!.color].css : '#333',
              boxShadow: n <= char.rings.length ? `0 0 8px ${RING_COLOR_MAP[char.rings[n - 1]!.color].css}50` : 'none',
            }"
          >
            {{ n }}
          </div>
          <div v-if="getRingSkill(n)" class="ring-skill">
            <GameIcon
              :src="getRingSkill(n) ? skillIconPath(getRingSkill(n)!.id) : ''"
              quality="purple"
              :size="38"
              :title="getRingSkill(n)?.name"
              :fallback-text="getRingSkill(n)?.name.slice(0, 1)"
            />
            <div>
              <div class="skill-name">{{ getRingSkill(n)!.name }}</div>
              <div
                class="skill-type-badge"
                :style="{ color: typeColors[getRingSkill(n)!.type], borderColor: typeColors[getRingSkill(n)!.type] }"
              >
                {{ skillTypeLabels[getRingSkill(n)!.type] }}
              </div>
            </div>
          </div>
          <div v-else class="ring-empty">
            <span v-if="n <= char.rings.length">未装配魂技</span>
            <span v-else>未解锁</span>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <h4 class="section-title">{{ seriesLabels[spirit.series] }}可用魂技</h4>
      <div class="skill-list">
        <div v-for="skill in availableSkills" :key="skill.id" class="skill-card">
          <GameIcon :src="skillIconPath(skill.id)" quality="purple" :size="44" :title="skill.name" :fallback-text="skill.name.slice(0, 1)" />
          <div class="skill-main">
            <div class="skill-card-header">
              <span class="skill-card-name">{{ skill.name }}</span>
              <span class="skill-type-badge" :style="{ color: typeColors[skill.type], borderColor: typeColors[skill.type] }">
                {{ skillTypeLabels[skill.type] }}
              </span>
            </div>
            <div class="skill-card-desc">{{ skill.description }}</div>
            <div class="skill-card-meta">
              <span>冷却 {{ skill.cooldown }} 秒</span>
              <span>魂力 {{ skill.mpCost }}</span>
              <span>第 {{ skill.ringSlot }} 魂环</span>
            </div>
          </div>
        </div>
        <div v-if="availableSkills.length === 0" class="empty-hint">该系魂技已经全部装配</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skill-panel {
  width: 740px;
  height: calc(100vh - 304px);
  padding: 24px 20px;
  overflow-y: auto;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.section {
  margin-bottom: 16px;
}

.section-title {
  margin-bottom: 8px;
  padding-bottom: 4px;
  font-size: 13px;
  color: var(--color-border-gold);
  border-bottom: 1px solid rgba(200, 168, 78, 0.15);
}

.ring-slots,
.skill-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.ring-slot,
.skill-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.ring-slot:not(.unlocked) {
  opacity: 0.42;
}

.ring-indicator {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #333;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  flex-shrink: 0;
  font-weight: 700;
}

.ring-skill {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ring-empty,
.skill-card-desc,
.skill-card-meta,
.empty-hint {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.skill-name,
.skill-card-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.skill-type-badge {
  display: inline-flex;
  width: fit-content;
  padding: 1px 6px;
  border: 1px solid;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 600;
}

.skill-main {
  min-width: 0;
  flex: 1;
}

.skill-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.skill-card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 6px;
}

.empty-hint {
  text-align: center;
  padding: 16px;
}
</style>
