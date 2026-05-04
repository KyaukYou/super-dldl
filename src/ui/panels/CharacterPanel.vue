<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'
import { useUIStore } from '@/stores/ui'
import { FACTION_NAMES, SERIES_NAMES } from '@/types/game'
import { displayName } from '@/data/displayData'
import { spiritIconPath } from '@/assets/art-direction/icon-paths'
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
</script>

<template>
  <div v-if="char" class="character-panel panel-base">
    <div class="panel-header">
      <h3 class="panel-title">角色属性</h3>
      <button class="close-btn" type="button" @click.stop="uiStore.closePanel()">关闭</button>
    </div>

    <div class="profile-section">
      <GameIcon
        :src="spirit ? spiritIconPath(spirit.id) : ''"
        quality="orange"
        :size="84"
        :title="spiritName"
        :fallback-text="spiritName.slice(0, 1) || '魂'"
      />
      <div class="profile-info">
        <div class="char-name">{{ char.name }}</div>
        <div class="char-title">Lv.{{ char.level }} {{ gameStore.rankTitle }}</div>
        <div class="char-tags">
          <span class="tag faction">{{ FACTION_NAMES[char.faction] }}</span>
          <span v-if="spirit" class="tag spirit">{{ spiritName }}</span>
          <span v-if="spirit" class="tag series">{{ SERIES_NAMES[spirit.series] }}</span>
        </div>
      </div>
    </div>

    <div class="bar-section">
      <div class="bar-row">
        <span class="bar-label hp">HP</span>
        <div class="bar-base">
          <div class="bar-fill hp-fill" :style="{ width: `${hpPercent}%` }"></div>
          <span class="bar-text">{{ char.stats.hp }} / {{ char.stats.maxHp }}</span>
        </div>
      </div>
      <div class="bar-row">
        <span class="bar-label mp">MP</span>
        <div class="bar-base">
          <div class="bar-fill mp-fill" :style="{ width: `${mpPercent}%` }"></div>
          <span class="bar-text">{{ char.stats.mp }} / {{ char.stats.maxMp }}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <h4 class="section-title">基础属性</h4>
      <div class="stats-grid">
        <div class="stat-item"><span class="stat-label">力量</span><span class="stat-value">{{ char.stats.str }}</span></div>
        <div class="stat-item"><span class="stat-label">敏捷</span><span class="stat-value">{{ char.stats.agi }}</span></div>
        <div class="stat-item"><span class="stat-label">智力</span><span class="stat-value">{{ char.stats.int }}</span></div>
        <div class="stat-item"><span class="stat-label">体质</span><span class="stat-value">{{ char.stats.vit }}</span></div>
      </div>
    </div>

    <div class="section">
      <h4 class="section-title">战斗属性</h4>
      <div class="stats-grid">
        <div class="stat-item"><span class="stat-label">攻击</span><span class="stat-value">{{ char.stats.atk }}</span></div>
        <div class="stat-item"><span class="stat-label">防御</span><span class="stat-value">{{ char.stats.def }}</span></div>
        <div class="stat-item"><span class="stat-label">暴击率</span><span class="stat-value">{{ char.stats.critRate.toFixed(1) }}%</span></div>
        <div class="stat-item"><span class="stat-label">闪避率</span><span class="stat-value">{{ char.stats.dodgeRate.toFixed(1) }}%</span></div>
        <div class="stat-item"><span class="stat-label">攻速</span><span class="stat-value">{{ char.stats.atkSpeed.toFixed(2) }}</span></div>
        <div class="stat-item"><span class="stat-label">魂环</span><span class="stat-value">{{ char.rings.length }}/9</span></div>
      </div>
    </div>

    <div v-if="char.rings.length > 0" class="section">
      <h4 class="section-title">魂环年限</h4>
      <div class="ring-years">
        <div v-for="ring in char.rings" :key="ring.slot" class="ring-year-item">
          <span class="ring-slot-label">第{{ ring.slot }}魂环</span>
          <span class="ring-year-value">{{ ring.yearRange }}年</span>
        </div>
      </div>
    </div>

    <div v-if="spirit" class="section">
      <h4 class="section-title">武魂天赋</h4>
      <div class="talent-box">
        <div class="talent-head">
          <GameIcon
            :src="spiritIconPath(spirit!.id)"
            quality="orange"
            :size="46"
            :title="spiritName"
            :fallback-text="spiritName.slice(0, 1)"
          />
          <div>
            <div class="talent-name">{{ spiritName }}</div>
            <div class="talent-series">{{ SERIES_NAMES[spirit.series] }}</div>
          </div>
        </div>
        <div class="talent-desc">{{ spirit.talent }}</div>
        <div class="talent-power">先天魂力 <span class="power-val">{{ spirit.innatePower }}</span></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.character-panel {
  width: 740px;
  height: calc(100vh - 304px);
  padding: 24px 20px;
  overflow-y: auto;
}

.panel-header,
.profile-section,
.bar-section,
.section {
  margin-bottom: 16px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.profile-section {
  display: flex;
  gap: 14px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(200, 168, 78, 0.15);
}

.profile-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  min-width: 0;
}

.char-name {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-border-gold);
}

.char-title,
.stat-label,
.talent-desc {
  color: var(--color-text-secondary);
}

.char-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
}

.tag.faction { background: rgba(74, 158, 255, 0.12); color: #78b6ff; }
.tag.spirit { background: rgba(255, 176, 58, 0.12); color: #ffcf75; }
.tag.series { background: rgba(116, 255, 171, 0.12); color: #83efaa; }

.bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.bar-label {
  width: 30px;
  text-align: right;
  font-size: 11px;
  font-weight: 700;
}

.bar-label.hp { color: var(--color-hp); }
.bar-label.mp { color: var(--color-mp); }

.hp-fill { background: linear-gradient(90deg, #c53030, #e53e3e); }
.mp-fill { background: linear-gradient(90deg, #2b6cb0, #4299e1); }

.section-title {
  margin-bottom: 8px;
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

.stat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.24);
}

.stat-value,
.talent-name {
  font-weight: 700;
}

.ring-years {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ring-year-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.24);
}

.ring-slot-label {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.ring-year-value {
  color: #f4d98a;
  font-weight: 700;
}

.talent-box {
  padding: 12px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.24);
  border: 1px solid rgba(200, 168, 78, 0.15);
}

.talent-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.talent-series {
  font-size: 12px;
  color: #7eb6ff;
}

.talent-desc {
  font-size: 12px;
  line-height: 1.6;
}

.talent-power {
  margin-top: 8px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.power-val {
  color: #ffd700;
  font-weight: 700;
}
</style>
