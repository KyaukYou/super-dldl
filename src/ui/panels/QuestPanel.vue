<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useGameStore } from '@/stores/game'
import { useUIStore } from '@/stores/ui'
import { ITEMS } from '@/data/gameData'
import { itemLabels } from '@/data/displayData'
import { systemIconPath } from '@/assets/art-direction/icon-paths'
import { generatedButtons } from '@/assets/art-direction/generated-paths'
import GameIcon from '@/ui/components/GameIcon.vue'

type QuestTab = 'main' | 'daily' | 'sect'
type QuestState = {
  id: string
  tab: QuestTab
  name: string
  desc: string
  current: number
  total: number
  rewardExp: number
  rewardGold: number
  rewardItem?: string
  targetPanel: Parameters<ReturnType<typeof useUIStore>['openPanel']>[0]
}

const uiStore = useUIStore()
const gameStore = useGameStore()
const activeTab = ref<QuestTab>('main')
const claimed = reactive<Record<string, boolean>>(JSON.parse(localStorage.getItem('quest-claimed') || '{}'))

const questTabs: { key: QuestTab; label: string; icon: string }[] = [
  { key: 'main', label: '主线', icon: systemIconPath('quest') },
  { key: 'daily', label: '日常', icon: systemIconPath('auto_fight') },
  { key: 'sect', label: '宗门', icon: systemIconPath('sect') },
]

const quests = computed<QuestState[]>(() => {
  const char = gameStore.character
  const kills = Math.min(30, Math.max(0, Math.floor((char?.exp ?? 0) / 120)))
  const materialCount = gameStore.inventory
    .filter((item) => ITEMS.find((def) => def.id === item.itemId)?.type === 'material')
    .reduce((sum, item) => sum + item.quantity, 0)
  const hasRing = (char?.rings.length ?? 0) > 0 ? 1 : 0
  const level = char?.level ?? 1

  return [
    { id: 'main_map', tab: 'main', name: '初入星斗', desc: '前往世界地图挑战任意魂兽，熟悉战斗节奏。', current: kills, total: 3, rewardExp: 500, rewardGold: 120, rewardItem: 'hp_potion_s', targetPanel: 'worldMap' },
    { id: 'main_ring', tab: 'main', name: '第一魂环', desc: '提升等级并吸收第一个魂环，解锁魂技栏。', current: hasRing, total: 1, rewardExp: 900, rewardGold: 180, rewardItem: 'scroll_s1', targetPanel: 'spirit' },
    { id: 'main_power', tab: 'main', name: '魂师进阶', desc: '角色达到 Lv.10，踏入正式魂师之路。', current: level, total: 10, rewardExp: 1200, rewardGold: 260, rewardItem: 'mp_potion_s', targetPanel: 'worldMap' },
    { id: 'daily_hunt', tab: 'daily', name: '每日猎魂', desc: '累计击败 30 只魂兽，获得稳定修炼资源。', current: kills, total: 30, rewardExp: 1800, rewardGold: 300, rewardItem: 'bone_fragment', targetPanel: 'worldMap' },
    { id: 'daily_material', tab: 'daily', name: '材料补给', desc: '收集 10 个任意材料，交给铁匠铺备用。', current: materialCount, total: 10, rewardExp: 700, rewardGold: 220, rewardItem: 'deep_sea_silver', targetPanel: 'smithy' },
    { id: 'sect_trial', tab: 'sect', name: '宗门试炼', desc: '参与宗门事务，积累宗门贡献。', current: Math.min(3, Math.floor(level / 4)), total: 3, rewardExp: 1000, rewardGold: 200, rewardItem: 'ancient_scroll', targetPanel: 'sect' },
  ]
})

const visibleQuests = computed(() => quests.value.filter((quest) => quest.tab === activeTab.value))

function itemName(id: string) {
  return itemLabels[id]?.name ?? ITEMS.find((item) => item.id === id)?.name ?? id
}

function progressPercent(q: QuestState) {
  return `${Math.min(100, Math.floor((q.current / q.total) * 100))}%`
}

function canClaim(q: QuestState) {
  return q.current >= q.total && !claimed[q.id]
}

function goQuest(q: QuestState) {
  void uiStore.openPanel(q.targetPanel)
}

function claim(q: QuestState) {
  if (!canClaim(q)) return
  gameStore.addExp(q.rewardExp)
  gameStore.addGold(q.rewardGold)
  if (q.rewardItem) gameStore.addItem(q.rewardItem, 1)
  claimed[q.id] = true
  localStorage.setItem('quest-claimed', JSON.stringify(claimed))
  gameStore.saveGame()
}
</script>

<template>
  <div class="quest-panel panel-base">
    <div class="panel-header">
      <div class="title-wrap">
        <GameIcon :src="systemIconPath('quest')" :size="34" quality="orange" title="任务" />
        <h3 class="panel-title">任务大厅</h3>
      </div>
      <button class="asset-action icon-only" type="button" :style="{ '--asset-button-url': `url(${generatedButtons.close})` }" @click.stop="uiStore.closePanel()">关闭</button>
    </div>

    <div class="quest-tabs">
      <button v-for="tab in questTabs" :key="tab.key" class="tab" :class="{ active: activeTab === tab.key }" type="button" @click.stop="activeTab = tab.key">
        {{ tab.label }}
      </button>
    </div>

    <div class="quest-list">
      <div v-for="quest in visibleQuests" :key="quest.id" class="quest-card">
        <GameIcon :src="questTabs.find((tab) => tab.key === quest.tab)?.icon" :size="42" quality="blue" :title="quest.name" />
        <div class="quest-main">
          <div class="quest-title-row">
            <span class="quest-name">{{ quest.name }}</span>
            <span class="quest-state" :class="{ done: canClaim(quest), claimed: claimed[quest.id] }">{{ claimed[quest.id] ? '已领取' : canClaim(quest) ? '可领取' : '进行中' }}</span>
          </div>
          <div class="quest-desc">{{ quest.desc }}</div>
          <div class="progress-row">
            <div class="progress-bar"><div class="progress-fill" :style="{ width: progressPercent(quest) }"></div></div>
            <span>{{ Math.min(quest.current, quest.total) }}/{{ quest.total }}</span>
          </div>
          <div class="reward-row">
            奖励：经验 {{ quest.rewardExp }} / 金币 {{ quest.rewardGold }}<span v-if="quest.rewardItem"> / {{ itemName(quest.rewardItem) }}</span>
          </div>
        </div>
        <div class="quest-actions">
          <button class="asset-action text-xs" type="button" :style="{ '--asset-button-url': `url(${generatedButtons.goTo})` }" @click.stop="goQuest(quest)">前往</button>
          <button class="asset-action text-xs" type="button" :style="{ '--asset-button-url': `url(${generatedButtons.claimAll})` }" :disabled="!canClaim(quest)" @click.stop="claim(quest)">领取</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quest-panel {
  width: 740px;
  height: calc(100vh - 304px);
  padding: 24px 20px;
  overflow-y: auto;
}

.panel-header,
.title-wrap,
.quest-title-row,
.progress-row {
  display: flex;
  align-items: center;
}

.panel-header {
  justify-content: space-between;
  margin-bottom: 12px;
}

.title-wrap {
  gap: 10px;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.quest-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
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

.quest-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quest-card {
  display: flex;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.24);
  border: 1px solid rgba(200, 168, 78, 0.1);
}

.quest-main {
  flex: 1;
  min-width: 0;
}

.quest-title-row {
  justify-content: space-between;
  gap: 8px;
}

.quest-name {
  font-weight: 800;
  color: var(--color-text-primary);
}

.quest-state {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 10px;
  color: var(--color-text-secondary);
  background: rgba(255, 255, 255, 0.06);
}

.quest-state.done {
  color: #44ff88;
  background: rgba(68, 255, 136, 0.12);
}

.quest-state.claimed {
  color: #ffd700;
}

.quest-desc,
.reward-row,
.progress-row {
  margin-top: 5px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.progress-row {
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.45);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #c8a84e, #44ff88);
}

.quest-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}
</style>
