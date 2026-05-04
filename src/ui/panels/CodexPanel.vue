<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUIStore } from '@/stores/ui'
import { SPIRITS, SKILLS } from '@/data/gameData'
import { SERIES_NAMES } from '@/types/game'
import type { SpiritSeries } from '@/types/game'
import { systemIconPath, spiritIconPath, skillIconPath } from '@/assets/art-direction/icon-paths'
import GameIcon from '@/ui/components/GameIcon.vue'

const uiStore = useUIStore()

const activeTab = ref<'spirit' | 'skill' | 'monster'>('spirit')
const seriesFilter = ref<SpiritSeries | 'all'>('all')

const filteredSpirits = computed(() => {
  if (seriesFilter.value === 'all') return SPIRITS
  return SPIRITS.filter(s => s.series === seriesFilter.value)
})

const filteredSkills = computed(() => {
  if (seriesFilter.value === 'all') return SKILLS
  return SKILLS.filter(s => s.series === seriesFilter.value)
})

/** 怪物图鉴 */
const monsters = [
  { name: '人面魔蛛', level: 10, area: '迷罗湖', type: '魂兽', desc: '剧毒型魂兽，网丝坚韧' },
  { name: '火云犀甲牛', level: 15, area: '迷罗湖', type: '魂兽', desc: '防御极高的重型魂兽' },
  { name: '幽灵蛛', level: 12, area: '迷罗湖', type: '魂兽', desc: '善于隐匿的暗杀型魂兽' },
  { name: '毒蛛', level: 10, area: '迷罗湖', type: '魂兽', desc: '体型小但毒性猛烈' },
  { name: '铁甲犀牛', level: 20, area: '圣天涯', type: '魂兽', desc: '全身覆盖铁甲的犀牛' },
  { name: '泰坦巨猿', level: 50, area: '天青湖', type: 'Boss', desc: '传说中的十万年魂兽' },
  { name: '天青牛蟒', level: 60, area: '天青湖', type: 'Boss', desc: '龙族近亲，实力恐怖' },
  { name: '深海魔鲸王', level: 91, area: '海神岛', type: 'Boss', desc: '海洋霸主，近神级存在' },
  { name: '暗金恐爪熊', level: 70, area: '杀戮之都', type: 'Boss', desc: '攻防兼备的凶暴魂兽' },
  { name: '邪魔虎鲸', level: 55, area: '星斗中心', type: '魂兽', desc: '水域霸主，攻击力极强' },
]

function seriesColor(series: SpiritSeries) {
  return series === 'strength' ? '#ff6644' : series === 'agility' ? '#44ff88' : '#4488ff'
}

function monsterIcon(type: string) {
  return type === 'Boss' ? systemIconPath('boss') : systemIconPath('spirit')
}
</script>

<template>
  <div class="codex-panel panel-base">
    <div class="panel-header">
      <h3 class="panel-title">图鉴</h3>
      <button class="close-btn" @click="uiStore.closePanel()">关闭</button>
    </div>

    <div class="panel-scroll-body">
    <div class="codex-tabs">
      <button class="tab" :class="{ active: activeTab === 'spirit' }" @click="activeTab = 'spirit'">武魂</button>
      <button class="tab" :class="{ active: activeTab === 'skill' }" @click="activeTab = 'skill'">魂技</button>
      <button class="tab" :class="{ active: activeTab === 'monster' }" @click="activeTab = 'monster'">魂兽</button>
    </div>

    <div class="series-filter" v-if="activeTab !== 'monster'">
      <button class="filter-btn" :class="{ active: seriesFilter === 'all' }" @click="seriesFilter = 'all'">全部</button>
      <button class="filter-btn series-strength" :class="{ active: seriesFilter === 'strength' }" @click="seriesFilter = 'strength'">力量系</button>
      <button class="filter-btn series-agility" :class="{ active: seriesFilter === 'agility' }" @click="seriesFilter = 'agility'">敏捷系</button>
      <button class="filter-btn series-intelligence" :class="{ active: seriesFilter === 'intelligence' }" @click="seriesFilter = 'intelligence'">智力系</button>
    </div>

    <div class="panel-scroll-body">
    <!-- 武魂图鉴 -->
    <div class="codex-content" v-if="activeTab === 'spirit'">
      <div class="spirit-list">
        <div v-for="s in filteredSpirits" :key="s.id" class="spirit-card">
          <GameIcon :src="spiritIconPath(s.id)" quality="orange" :size="46" :title="s.name" />
          <div class="spirit-info">
            <div class="spirit-name">{{ s.name }}</div>
            <div class="spirit-meta">
              <span class="spirit-series" :style="{ color: seriesColor(s.series) }">{{ SERIES_NAMES[s.series] }}</span>
              <span class="spirit-power">先天魂力 {{ s.innatePower }}</span>
            </div>
            <div class="spirit-talent">天赋: {{ s.talent }}</div>
            <div class="spirit-stats">
              <span>力 {{ s.baseStats.str }}</span>
              <span>敏 {{ s.baseStats.agi }}</span>
              <span>智 {{ s.baseStats.int }}</span>
              <span>体 {{ s.baseStats.vit }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 魂技图鉴 -->
    <div class="codex-content" v-if="activeTab === 'skill'">
      <div class="skill-list">
        <div v-for="s in filteredSkills" :key="s.id" class="skill-card">
          <GameIcon :src="skillIconPath(s.id)" quality="purple" :size="44" :title="s.name" />
          <div class="skill-info">
            <div class="skill-name" :style="{ color: seriesColor(s.series) }">{{ s.name }}</div>
            <div class="skill-desc">{{ s.description }}</div>
          </div>
          <div class="skill-meta">
            <span class="skill-ring" :style="{ borderColor: seriesColor(s.series), color: seriesColor(s.series) }">{{ s.ringSlot }}环</span>
            <span class="skill-type" :class="`type-${s.type}`">
              {{ s.type === 'damage' ? '伤害' : s.type === 'buff' ? '增益' : s.type === 'debuff' ? '减益' : s.type === 'heal' ? '恢复' : '控制' }}
            </span>
            <span class="skill-cd">CD{{ s.cooldown }}s</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 魂兽图鉴 -->
    <div class="codex-content" v-if="activeTab === 'monster'">
      <div class="monster-list">
        <div v-for="m in monsters" :key="m.name" class="monster-card" :class="{ boss: m.type === 'Boss' }">
          <GameIcon :src="monsterIcon(m.type)" :quality="m.type === 'Boss' ? 'red' : 'blue'" :size="44" :title="m.name" />
          <div class="monster-info">
            <div class="monster-name">{{ m.name }}</div>
            <div class="monster-meta">
              <span class="monster-level">Lv.{{ m.level }}</span>
              <span class="monster-area">{{ m.area }}</span>
              <span class="monster-type" :class="m.type === 'Boss' ? 'type-boss' : 'type-normal'">{{ m.type }}</span>
            </div>
            <div class="monster-desc">{{ m.desc }}</div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
.codex-panel {
  width: 740px;
  position: absolute;
  top: 36px;
  bottom: 0;
  padding: 24px 0;
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
  padding: 0 20px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  padding-top: 10px;
  padding-right: 0;
  margin-bottom: 12px;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.close-btn:hover {
  color: var(--color-accent-red);
}

.codex-tabs,
.series-filter {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}

.tab,
.filter-btn {
  border: 1px solid rgba(200, 168, 78, 0.12);
  background: rgba(8, 10, 18, 0.64);
  color: var(--color-text-secondary);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}

.tab {
  padding: 5px 14px;
  font-size: 12px;
}

.filter-btn {
  padding: 4px 10px;
  font-size: 11px;
}

.tab.active,
.filter-btn.active {
  color: var(--color-border-gold);
  background: rgba(200, 168, 78, 0.16);
  border-color: rgba(200, 168, 78, 0.24);
}

.series-strength { color: #ff6644; }
.series-agility { color: #44ff88; }
.series-intelligence { color: #4488ff; }

.codex-content {
  max-height: 430px;
  overflow-y: auto;
  padding-right: 2px;
}

.spirit-list,
.skill-list,
.monster-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.spirit-card,
.skill-card,
.monster-card {
  display: flex;
  gap: 10px;
  padding: 10px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.24);
  border: 1px solid rgba(200, 168, 78, 0.08);
}

.monster-card.boss {
  border-color: rgba(255, 74, 74, 0.22);
  background: rgba(70, 16, 18, 0.28);
}

.spirit-info,
.skill-info,
.monster-info {
  flex: 1;
  min-width: 0;
}

.spirit-name,
.skill-name,
.monster-name {
  font-size: 14px;
  font-weight: bold;
}

.spirit-meta,
.monster-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 3px;
  font-size: 11px;
}

.spirit-series {
  font-weight: bold;
}

.spirit-power,
.monster-area {
  color: #ffd700;
}

.spirit-talent,
.skill-desc,
.monster-desc,
.monster-level {
  font-size: 11px;
  color: var(--color-text-secondary);
}

.spirit-talent,
.monster-desc {
  margin-top: 3px;
}

.spirit-stats {
  display: flex;
  gap: 8px;
  margin-top: 5px;
  font-size: 11px;
  color: var(--color-text-secondary);
}

.skill-card {
  align-items: center;
}

.skill-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.skill-ring,
.skill-type,
.monster-type {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  font-size: 10px;
  white-space: nowrap;
}

.skill-ring {
  min-width: 46px;
  padding: 3px 8px;
  border: 1px solid currentColor;
  background: rgba(0, 0, 0, 0.28);
}

.skill-type,
.monster-type {
  padding: 2px 8px;
}

.type-damage { color: #ff6b6b; background: rgba(255, 68, 68, 0.16); }
.type-buff { color: #52d273; background: rgba(68, 204, 68, 0.16); }
.type-debuff { color: #b77bff; background: rgba(180, 74, 255, 0.16); }
.type-heal { color: #5cbcff; background: rgba(68, 170, 255, 0.16); }
.type-control { color: #ffb35b; background: rgba(255, 170, 68, 0.16); }
.type-boss { color: #ff7e7e; background: rgba(255, 74, 74, 0.16); }
.type-normal { color: var(--color-text-secondary); background: rgba(255, 255, 255, 0.05); }

.skill-cd {
  font-size: 10px;
  color: var(--color-text-secondary);
}
</style>
