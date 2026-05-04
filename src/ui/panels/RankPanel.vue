<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useGameStore } from '@/stores/game'
import { getRankTitle, FACTION_NAMES } from '@/types/game'
import { systemIconPath } from '@/assets/art-direction/icon-paths'
import GameIcon from '@/ui/components/GameIcon.vue'

type RankTab = 'level' | 'power' | 'arena' | 'wealth'
type RankEntry = { rank: number; name: string; faction: string; level?: number; power?: number; wins?: number; gold?: number; isPlayer?: boolean }

const uiStore = useUIStore()
const gameStore = useGameStore()
const activeTab = ref<RankTab>('power')

const rankTabs: { key: RankTab; label: string; icon: string }[] = [
  { key: 'level', label: '等级', icon: systemIconPath('character') },
  { key: 'power', label: '战力', icon: systemIconPath('spirit') },
  { key: 'arena', label: '竞技', icon: systemIconPath('arena') },
  { key: 'wealth', label: '财富', icon: systemIconPath('shop') },
]

const aiPlayers = [
  { name: '剑道尘心', faction: '天斗帝国', level: 96, power: 128000, wins: 892, gold: 528000 },
  { name: '武魂殿圣女', faction: '武魂殿', level: 92, power: 119000, wins: 830, gold: 680000 },
  { name: '星罗战虎', faction: '星罗帝国', level: 88, power: 101500, wins: 746, gold: 352000 },
  { name: '蓝电龙子', faction: '天斗帝国', level: 76, power: 72400, wins: 612, gold: 180000 },
  { name: '七宝琉璃使', faction: '天斗帝国', level: 70, power: 68200, wins: 588, gold: 420000 },
  { name: '幽冥影刃', faction: '星罗帝国', level: 65, power: 59100, wins: 541, gold: 135000 },
]

const entries = computed<RankEntry[]>(() => {
  const char = gameStore.character
  const player = char ? {
    name: char.name,
    faction: FACTION_NAMES[char.faction],
    level: char.level,
    power: char.stats.combatPower,
    wins: Number(localStorage.getItem('arena-battles-today') || 0),
    gold: char.gold,
    isPlayer: true,
  } : null

  const all = player ? [...aiPlayers, player] : aiPlayers
  const key = activeTab.value === 'level' ? 'level' : activeTab.value === 'power' ? 'power' : activeTab.value === 'arena' ? 'wins' : 'gold'
  return [...all]
    .sort((a, b) => (b[key] ?? 0) - (a[key] ?? 0))
    .map((entry, index) => ({ ...entry, rank: index + 1 }))
})

const currentTab = computed(() => rankTabs.find((tab) => tab.key === activeTab.value) ?? rankTabs[0]!)
const playerRank = computed(() => entries.value.find((entry) => entry.isPlayer)?.rank ?? '-')

function rankColor(rank: number) {
  if (rank === 1) return '#ffd700'
  if (rank === 2) return '#d6d8dd'
  if (rank === 3) return '#d8975a'
  return 'var(--color-text-primary)'
}

function rankMeta(entry: RankEntry) {
  if (activeTab.value === 'level') return `Lv.${entry.level} ${getRankTitle(entry.level ?? 1)} / ${entry.faction}`
  if (activeTab.value === 'power') return `战力 ${(entry.power ?? 0).toLocaleString()} / ${entry.faction}`
  if (activeTab.value === 'arena') return `胜场 ${(entry.wins ?? 0).toLocaleString()} / ${entry.faction}`
  return `金币 ${(entry.gold ?? 0).toLocaleString()} / ${entry.faction}`
}
</script>

<template>
  <div class="rank-panel panel-base">
    <div class="panel-header">
      <h3 class="panel-title">排行榜</h3>
      <button class="close-btn" type="button" @click.stop="uiStore.closePanel()">关闭</button>
    </div>

    <div class="panel-scroll-body">
    <div class="summary">
      <GameIcon :src="currentTab.icon" :size="40" quality="blue" :title="currentTab.label" />
      <div>
        <div class="summary-title">{{ currentTab.label }}榜</div>
        <div class="summary-sub">你的当前名次：{{ playerRank }}</div>
      </div>
    </div>

    <div class="rank-tabs">
      <button v-for="tab in rankTabs" :key="tab.key" class="tab" :class="{ active: activeTab === tab.key }" type="button" @click.stop="activeTab = tab.key">
        {{ tab.label }}
      </button>
    </div>

    <div class="rank-list">
      <div v-for="entry in entries" :key="entry.name" class="rank-card" :class="{ me: entry.isPlayer }">
        <div class="rank-number" :style="{ color: rankColor(entry.rank) }">{{ entry.rank }}</div>
        <GameIcon :src="currentTab.icon" :size="42" :quality="entry.rank <= 3 ? 'orange' : 'blue'" :title="entry.name" />
        <div class="rank-main">
          <div class="rank-name">{{ entry.name }}</div>
          <div class="rank-meta">{{ rankMeta(entry) }}</div>
        </div>
        <div class="rank-badge">{{ entry.rank <= 3 ? `TOP ${entry.rank}` : `#${entry.rank}` }}</div>
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
.rank-panel {
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

.panel-header,
.summary,
.rank-card {
  display: flex;
  align-items: center;
}

.panel-header {
  justify-content: space-between;
  padding: 0 20px;
  padding-top: 10px;
  padding-right: 0;
  margin-bottom: 12px;
}

.summary,
.rank-card {
  gap: 10px;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.summary {
  margin-bottom: 12px;
  padding: 10px;
  border: 1px solid rgba(200, 168, 78, 0.15);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.24);
}

.summary-title {
  color: var(--color-border-gold);
  font-weight: 800;
}

.summary-sub,
.rank-meta {
  margin-top: 3px;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.rank-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}

.tab {
  padding: 5px 14px;
  color: var(--color-text-secondary);
  border: 1px solid rgba(200, 168, 78, 0.14);
  background: rgba(8, 10, 18, 0.64);
  border-radius: 4px;
  cursor: pointer;
}

.tab.active {
  color: var(--color-border-gold);
  background: rgba(200, 168, 78, 0.16);
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.rank-card {
  padding: 10px;
  border: 1px solid rgba(200, 168, 78, 0.1);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.22);
}

.rank-card.me {
  border-color: rgba(255, 215, 0, 0.42);
  background: rgba(255, 215, 0, 0.08);
}

.rank-number {
  width: 28px;
  text-align: center;
  font-size: 18px;
  font-weight: 900;
}

.rank-main {
  flex: 1;
  min-width: 0;
}

.rank-name {
  font-weight: 800;
}

.rank-badge {
  min-width: 54px;
  padding: 3px 8px;
  border-radius: 999px;
  color: var(--color-border-gold);
  background: rgba(200, 168, 78, 0.12);
  font-size: 10px;
  text-align: center;
}
</style>
