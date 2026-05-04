<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useGameStore } from '@/stores/game'
import { useUIStore, type PanelName } from '@/stores/ui'
import { ITEMS } from '@/data/gameData'
import { itemLabels } from '@/data/displayData'
import { systemIconPath } from '@/assets/art-direction/icon-paths'
import { generatedButtons } from '@/assets/art-direction/generated-paths'
import { dailyQuestClaimKey } from '@/game/utils/panelProgressionRules'
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
  rewardItemQuantity?: number
  targetPanel: PanelName
}

const MAIN_CLAIM_KEY = 'quest-claimed-main'
const dailyClaimKey = dailyQuestClaimKey()

const uiStore = useUIStore()
const gameStore = useGameStore()
const activeTab = ref<QuestTab>('main')
const mainClaimed = reactive<Record<string, boolean>>(JSON.parse(localStorage.getItem(MAIN_CLAIM_KEY) || localStorage.getItem('quest-claimed') || '{}'))
const dailyClaimed = reactive<Record<string, boolean>>(JSON.parse(localStorage.getItem(dailyClaimKey) || '{}'))

const questTabs: { key: QuestTab; label: string; icon: string }[] = [
  { key: 'main', label: '主线', icon: systemIconPath('quest') },
  { key: 'daily', label: '日常', icon: systemIconPath('auto_fight') },
  { key: 'sect', label: '宗门', icon: systemIconPath('sect') },
]

const quests = computed<QuestState[]>(() => {
  const char = gameStore.character
  const kills = Math.min(80, Math.max(0, Math.floor((char?.exp ?? 0) / 120)))
  const materialCount = gameStore.inventory
    .filter((item) => ITEMS.find((def) => def.id === item.itemId)?.type === 'material')
    .reduce((sum, item) => sum + item.quantity, 0)
  const potionCount = gameStore.inventory
    .filter((item) => ITEMS.find((def) => def.id === item.itemId)?.type === 'potion')
    .reduce((sum, item) => sum + item.quantity, 0)
  const hasRing = (char?.rings.length ?? 0) > 0 ? 1 : 0
  const ringYears = char?.rings.reduce((sum, ring) => sum + ring.yearRange, 0) ?? 0
  const level = char?.level ?? 1
  const gold = char?.gold ?? 0
  const combatPower = char?.stats.combatPower ?? 0

  return [
    { id: 'main_map', tab: 'main', name: '初入星斗', desc: '前往世界地图挑战任意魂兽，熟悉战斗节奏。', current: kills, total: 3, rewardExp: 800, rewardGold: 220, rewardItem: 'hp_potion_s', rewardItemQuantity: 2, targetPanel: 'worldMap' },
    { id: 'main_ring', tab: 'main', name: '第一魂环', desc: '吸收第一个魂环，解锁魂技栏。', current: hasRing, total: 1, rewardExp: 1200, rewardGold: 300, rewardItem: 'scroll_s1', targetPanel: 'spirit' },
    { id: 'main_power', tab: 'main', name: '魂师进阶', desc: '角色达到 Lv.10，踏上正式魂师之路。', current: level, total: 10, rewardExp: 1800, rewardGold: 480, rewardItem: 'mp_potion_s', rewardItemQuantity: 2, targetPanel: 'worldMap' },
    { id: 'main_arena', tab: 'main', name: '登上斗魂台', desc: '战力达到 2000 后，前往斗魂场挑战 AI 魂师。', current: combatPower, total: 2000, rewardExp: 1600, rewardGold: 420, rewardItem: 'ancient_scroll', targetPanel: 'arena' },

    { id: 'daily_hunt_10', tab: 'daily', name: '每日热身', desc: '累计击败 10 只魂兽。', current: kills, total: 10, rewardExp: 1200, rewardGold: 320, rewardItem: 'hp_potion_s', rewardItemQuantity: 2, targetPanel: 'worldMap' },
    { id: 'daily_hunt_30', tab: 'daily', name: '猎魂巡回', desc: '累计击败 30 只魂兽，领取稳定修炼资源。', current: kills, total: 30, rewardExp: 2600, rewardGold: 680, rewardItem: 'bone_fragment', rewardItemQuantity: 2, targetPanel: 'worldMap' },
    { id: 'daily_material', tab: 'daily', name: '材料补给', desc: '收集 10 个任意材料，交给铁匠铺备用。', current: materialCount, total: 10, rewardExp: 1200, rewardGold: 420, rewardItem: 'deep_sea_silver', targetPanel: 'smithy' },
    { id: 'daily_potion', tab: 'daily', name: '药剂整备', desc: '背包内保留 4 瓶药剂，保证外出狩猎续航。', current: potionCount, total: 4, rewardExp: 900, rewardGold: 360, rewardItem: 'mp_potion_s', rewardItemQuantity: 2, targetPanel: 'bag' },
    { id: 'daily_ring_years', tab: 'daily', name: '魂环淬炼', desc: '魂环总年限达到 200 年。', current: ringYears, total: 200, rewardExp: 1800, rewardGold: 520, rewardItem: 'scroll_s1', targetPanel: 'spirit' },
    { id: 'daily_gold', tab: 'daily', name: '金币储备', desc: '身上持有 1000 金币。', current: gold, total: 1000, rewardExp: 1000, rewardGold: 500, rewardItem: 'exp_potion_s', targetPanel: 'shop' },

    { id: 'sect_trial', tab: 'sect', name: '宗门试炼', desc: '角色达到 Lv.12，参与宗门安排的基础试炼。', current: level, total: 12, rewardExp: 1800, rewardGold: 420, rewardItem: 'ancient_scroll', targetPanel: 'sect' },
    { id: 'sect_supply', tab: 'sect', name: '宗门补给', desc: '交付 15 个材料，为宗门仓库补货。', current: materialCount, total: 15, rewardExp: 1500, rewardGold: 500, rewardItem: 'bone_fragment', rewardItemQuantity: 2, targetPanel: 'sect' },
    { id: 'sect_guard', tab: 'sect', name: '守护演武', desc: '战力达到 3000，完成宗门守护演武。', current: combatPower, total: 3000, rewardExp: 2400, rewardGold: 760, rewardItem: 'domain_shard', targetPanel: 'sect' },
    { id: 'sect_ring', tab: 'sect', name: '魂环共鸣', desc: '魂环总年限达到 500 年，领取宗门修炼资源。', current: ringYears, total: 500, rewardExp: 2600, rewardGold: 800, rewardItem: 'scroll_m1', targetPanel: 'spirit' },
  ]
})

const visibleQuests = computed(() => quests.value.filter((quest) => quest.tab === activeTab.value))

function claimedBucket(q: QuestState) {
  return q.tab === 'main' ? mainClaimed : dailyClaimed
}

function persistClaimed(q: QuestState) {
  if (q.tab === 'main') localStorage.setItem(MAIN_CLAIM_KEY, JSON.stringify(mainClaimed))
  else localStorage.setItem(dailyClaimKey, JSON.stringify(dailyClaimed))
}

function isClaimed(q: QuestState) {
  return !!claimedBucket(q)[q.id]
}

function itemName(id: string) {
  return itemLabels[id]?.name ?? ITEMS.find((item) => item.id === id)?.name ?? id
}

function progressPercent(q: QuestState) {
  return `${Math.min(100, Math.floor((q.current / q.total) * 100))}%`
}

function canClaim(q: QuestState) {
  return q.current >= q.total && !isClaimed(q)
}

function goQuest(q: QuestState) {
  void uiStore.openPanel(q.targetPanel)
}

function claim(q: QuestState) {
  if (!canClaim(q)) return
  gameStore.addExp(q.rewardExp)
  gameStore.addGold(q.rewardGold)
  if (q.rewardItem) gameStore.addItem(q.rewardItem, q.rewardItemQuantity ?? 1)
  claimedBucket(q)[q.id] = true
  persistClaimed(q)
  gameStore.saveGame()
}
</script>

<template>
  <div class="quest-panel panel-base">
    <div class="panel-header">
      <h3 class="panel-title">任务大厅</h3>
      <button class="close-btn" type="button" aria-label="关闭" @click.stop="uiStore.closePanel()">关闭</button>
    </div>

    <div class="panel-scroll-body">
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
            <span class="quest-state" :class="{ done: canClaim(quest), claimed: isClaimed(quest) }">{{ isClaimed(quest) ? '已领取' : canClaim(quest) ? '可领取' : '进行中' }}</span>
          </div>
          <div class="quest-desc">{{ quest.desc }}</div>
          <div class="progress-row">
            <div class="progress-bar"><div class="progress-fill" :style="{ width: progressPercent(quest) }"></div></div>
            <span>{{ Math.min(quest.current, quest.total) }}/{{ quest.total }}</span>
          </div>
          <div class="reward-row">
            奖励：经验 {{ quest.rewardExp }} / 金币 {{ quest.rewardGold }}<span v-if="quest.rewardItem"> / {{ itemName(quest.rewardItem) }} x{{ quest.rewardItemQuantity ?? 1 }}</span>
          </div>
        </div>
        <div class="quest-actions">
          <button class="asset-action text-xs" type="button" :style="{ '--asset-button-url': `url(${generatedButtons.goTo})` }" @click.stop="goQuest(quest)">前往</button>
          <button class="asset-action text-xs" type="button" :style="{ '--asset-button-url': `url(${generatedButtons.claimAll})` }" :disabled="!canClaim(quest)" @click.stop="claim(quest)">领取</button>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
.quest-panel {
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
.quest-title-row,
.progress-row {
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
  flex: 0 0 auto;
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
