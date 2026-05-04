<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'
import { RING_COLOR_MAP } from '@/types/game'
import { skillIconPath } from '@/assets/art-direction/icon-paths'
import { generatedButtons } from '@/assets/art-direction/generated-paths'
import GameIcon from '@/ui/components/GameIcon.vue'

const gameStore = useGameStore()

const pending = computed(() => gameStore.pendingRingChoice)

const skillTypeMap: Record<string, string> = {
  damage: '伤害',
  buff: '增益',
  debuff: '减益',
  heal: '治疗',
  control: '控制',
}

function selectSkill(skillId: string) {
  gameStore.confirmRingChoice(skillId)
}

function closePanel() {
  gameStore.cancelRingChoice()
}
</script>

<template>
  <Transition name="fade">
    <div v-if="pending" class="ring-skill-overlay" @click.self="closePanel">
      <div class="ring-skill-panel">
        <div class="panel-head">
          <h2 class="title">吸收魂环</h2>
          <button class="close-btn" type="button" @click="closePanel">关闭</button>
        </div>
        <div class="ring-info">
          <span class="ring-badge" :style="{ background: RING_COLOR_MAP[pending.color].css }">
            第{{ pending.slot }}魂环
          </span>
          <span class="ring-year">{{ pending.year }} 年</span>
        </div>
        <p class="hint">请选择这枚魂环附带的魂技</p>
        <div class="skill-list">
          <button
            v-for="skill in pending.skills"
            :key="skill.id"
            class="skill-card"
            type="button"
            @click="selectSkill(skill.id)"
          >
            <GameIcon :src="skillIconPath(skill.id)" quality="purple" :size="48" :title="skill.name" />
            <div class="skill-copy">
              <div class="skill-header">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-type" :class="skill.type">{{ skillTypeMap[skill.type] ?? skill.type }}</span>
              </div>
              <p class="skill-desc">{{ skill.description }}</p>
              <div class="skill-meta">
                <span>冷却 {{ skill.cooldown }} 秒</span>
                <span>魂力 {{ skill.mpCost }}</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.ring-skill-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-skill-panel {
  min-width: 560px;
  max-width: min(92vw, 760px);
  padding: 22px;
  color: var(--color-text-primary);
  background:
    radial-gradient(circle at 50% 0%, rgba(200, 168, 78, 0.16), transparent 32%),
    linear-gradient(135deg, rgba(22, 28, 42, 0.98), rgba(8, 10, 18, 0.98));
  border: 1px solid rgba(200, 168, 78, 0.42);
  border-radius: 8px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.55);
  animation: pop-in 0.24s ease-out;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

@keyframes pop-in {
  from { transform: scale(0.94); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.title {
  font-size: 22px;
  color: #ffd700;
  margin: 0;
  text-shadow: 0 0 12px rgba(255, 215, 0, 0.45);
}

.ring-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.ring-badge {
  display: inline-block;
  padding: 4px 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: bold;
  color: #12151c;
}

.ring-year,
.hint {
  color: var(--color-text-secondary);
}

.hint {
  margin: 0 0 12px;
}

.skill-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skill-card {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px;
  text-align: left;
  color: inherit;
  background: rgba(0, 0, 0, 0.24);
  border: 1px solid rgba(200, 168, 78, 0.08);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.skill-card:hover {
  background: rgba(200, 168, 78, 0.12);
  border-color: rgba(200, 168, 78, 0.42);
  transform: translateY(-1px);
}

.skill-copy {
  flex: 1;
  min-width: 0;
}

.skill-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.skill-name {
  font-size: 15px;
  font-weight: 800;
  color: var(--color-border-gold);
}

.skill-type {
  padding: 2px 6px;
  border-radius: 999px;
  font-size: 11px;
  background: rgba(255, 255, 255, 0.08);
}

.skill-desc {
  margin: 0 0 6px;
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.45;
}

.skill-meta {
  display: flex;
  gap: 12px;
  color: rgba(255, 255, 255, 0.62);
  font-size: 11px;
}
</style>
