<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useGameStore } from '@/stores/game'
import { useUIStore } from '@/stores/ui'
import { SPIRITS } from '@/data/gameData'
import { displayName, itemLabels } from '@/data/displayData'
import { itemIconPath, systemIconPath } from '@/assets/art-direction/icon-paths'
import {
  generatedButtons,
  generatedNpcPortraits,
  generatedPortraitPath,
} from '@/assets/art-direction/generated-paths'
import { returnFromBattleScene, startBattleScene } from '@/game/utils/battleSceneFlow'
import GameIcon from '@/ui/components/GameIcon.vue'

const uiStore = useUIStore()
const gameStore = useGameStore()
const char = computed(() => gameStore.character)

const arenaPoints = ref(Number(localStorage.getItem('arena-points') || 1000))
const battlesToday = ref(Number(localStorage.getItem('arena-battles-today') || 0))
const maxBattles = 10
const battleResult = ref<string | null>(null)

function persistArena() {
  localStorage.setItem('arena-points', String(arenaPoints.value))
  localStorage.setItem('arena-battles-today', String(battlesToday.value))
}

function generateOpponents() {
  if (!char.value) return []
  const base = char.value.level
  const combatPower = Math.max(420, char.value.stats.combatPower || 420)
  const names = ['天斗学院 凌霜', '星罗战魂 岩山', '武魂殿巡查 洛燃']
  return names.map((name, index) => {
    const spirit = SPIRITS[(index * 17 + base) % SPIRITS.length]!
    const powerScale = 0.82 + index * 0.14
    return {
      id: index + 1,
      name,
      level: Math.max(1, base + index - 1),
      spirit,
      spiritName: displayName(spirit.id, spirit.name),
      power: Math.floor(combatPower * powerScale),
      textureKey: index === 0 ? 'monster_wolf' : index === 1 ? 'monster_guard' : 'monster_tiger',
    }
  })
}

const opponents = ref(generateOpponents())

const arenaShopItems = [
  { id: 'bone_fragment', name: itemLabels.bone_fragment!.name, desc: itemLabels.bone_fragment!.desc, icon: itemIconPath('bone_fragment'), price: 500, quality: 'blue' as const },
  { id: 'ancient_scroll', name: itemLabels.ancient_scroll!.name, desc: itemLabels.ancient_scroll!.desc, icon: itemIconPath('ancient_scroll'), price: 900, quality: 'purple' as const },
  { id: 'ring_random', name: itemLabels.ring_random!.name, desc: itemLabels.ring_random!.desc, icon: itemIconPath('ring_random'), price: 1500, quality: 'purple' as const },
]

const selectedShopItem = ref(arenaShopItems[0]!)

const opponentPortraits = [
  generatedPortraitPath('ai_soul_master_male_01'),
  generatedPortraitPath('ai_soul_master_female_01'),
  generatedPortraitPath('ai_soul_master_male_02'),
]

watch(char, () => {
  opponents.value = generateOpponents()
}, { immediate: true })

function resolveArenaBattle(game: any, win: boolean, opponent: ReturnType<typeof generateOpponents>[0]) {
  battlesToday.value += 1
  if (win) {
    arenaPoints.value += 80
    gameStore.addGold(120)
    gameStore.addExp(450)
    battleResult.value = `挑战 ${opponent.name} 胜利，竞技积分 +80`
  } else {
    arenaPoints.value = Math.max(0, arenaPoints.value - 25)
    if (char.value) char.value.stats.hp = Math.max(1, Math.floor(char.value.stats.maxHp * 0.55))
    battleResult.value = `惜败给 ${opponent.name}，竞技积分 -25`
  }
  persistArena()
  gameStore.saveGame()
  opponents.value = generateOpponents()
  returnFromBattleScene(game, () => {
    void uiStore.openPanel('arena')
  })
}

function fight(opponent: ReturnType<typeof generateOpponents>[0]) {
  if (!char.value || battlesToday.value >= maxBattles) return
  const game = (window as Window & { __phaserGame?: any }).__phaserGame
  if (!game) return

  uiStore.hidePanel()
  startBattleScene(game, {
    arenaOpponent: {
      name: opponent.name,
      level: opponent.level,
      power: opponent.power,
      textureKey: opponent.textureKey,
    },
    onVictory: () => resolveArenaBattle(game, true, opponent),
    onDefeat: () => resolveArenaBattle(game, false, opponent),
  })
}

function canRedeem(price: number) {
  return arenaPoints.value >= price
}

function redeem(itemId: string, price: number) {
  if (!canRedeem(price)) return
  arenaPoints.value -= price
  gameStore.addItem(itemId, 1)
  persistArena()
}
</script>

<template>
  <div v-if="char" class="arena-panel panel-base">
    <div class="panel-header">
      <div class="title-wrap">
        <GameIcon :src="systemIconPath('arena')" :size="34" quality="orange" title="斗魂场" />
        <h3 class="panel-title">斗魂场</h3>
      </div>
      <button class="asset-action icon-only" type="button" :style="{ '--asset-button-url': `url(${generatedButtons.close})` }" @click.stop="uiStore.closePanel()">关闭</button>
    </div>

    <div class="arena-stats">
      <div class="stat"><span>竞技积分</span><b>{{ arenaPoints }}</b></div>
      <div class="stat"><span>今日挑战</span><b>{{ battlesToday }}/{{ maxBattles }}</b></div>
      <div class="stat"><span>我的战力</span><b>{{ char.stats.combatPower.toLocaleString() }}</b></div>
    </div>

    <h4 class="section-title">AI 匹配对手</h4>
    <div class="arena-guide">
      <GameIcon :src="generatedNpcPortraits.arenaReferee" :size="54" quality="orange" title="斗魂场裁判" />
      <span>AI 匹配已就绪，挑战次数会在每日重置。</span>
    </div>
    <div class="opponent-list">
      <div v-for="opponent in opponents" :key="opponent.id" class="opponent-card">
        <GameIcon :src="opponentPortraits[(opponent.id - 1) % opponentPortraits.length]" :size="46" quality="purple" :title="opponent.name" />
        <div class="opp-info">
          <div class="opp-name">Lv.{{ opponent.level }} {{ opponent.name }}</div>
          <div class="opp-meta">{{ opponent.spiritName }} / 战力 {{ opponent.power.toLocaleString() }}</div>
        </div>
        <button class="asset-action fight-btn" type="button" :style="{ '--asset-button-url': `url(${generatedButtons.challenge})` }" :disabled="battlesToday >= maxBattles" @click.stop="fight(opponent)">挑战</button>
      </div>
    </div>

    <div v-if="battleResult" class="result-box">{{ battleResult }}</div>

    <h4 class="section-title">积分兑换</h4>
    <div class="shop-layout">
      <div class="shop-list">
        <button v-for="item in arenaShopItems" :key="item.id" class="shop-item" :class="{ active: selectedShopItem.id === item.id }" type="button" @click.stop="selectedShopItem = item">
          <GameIcon :src="item.icon" :size="42" :quality="item.quality" :title="item.name" />
          <span>{{ item.name }}</span>
        </button>
      </div>
      <div class="shop-detail">
        <GameIcon :src="selectedShopItem.icon" :size="58" :quality="selectedShopItem.quality" :title="selectedShopItem.name" />
        <div class="shop-name">{{ selectedShopItem.name }}</div>
        <div class="shop-desc">{{ selectedShopItem.desc }}</div>
        <div class="shop-price">需要积分：{{ selectedShopItem.price }}</div>
        <button class="asset-action text-xs" type="button" :style="{ '--asset-button-url': `url(${generatedButtons.exchange})` }" :disabled="!canRedeem(selectedShopItem.price)" @click.stop="redeem(selectedShopItem.id, selectedShopItem.price)">兑换</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.arena-panel {
  width: 740px;
  height: calc(100vh - 304px);
  padding: 24px 20px;
  overflow-y: auto;
}

.panel-header,
.title-wrap,
.opponent-card,
.shop-item {
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

.arena-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.stat {
  padding: 10px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.26);
  border: 1px solid rgba(200, 168, 78, 0.12);
}

.stat span,
.opp-meta,
.shop-desc,
.shop-price {
  display: block;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.stat b {
  display: block;
  margin-top: 4px;
  color: var(--color-border-gold);
}

.section-title {
  margin: 12px 0 8px;
  font-size: 13px;
  color: var(--color-border-gold);
}

.arena-guide {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  padding: 10px;
  color: var(--color-text-secondary);
  font-size: 12px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.24);
  border: 1px solid rgba(200, 168, 78, 0.1);
}

.opponent-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.opponent-card {
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.24);
  border: 1px solid rgba(200, 168, 78, 0.1);
}

.opp-info {
  flex: 1;
  min-width: 0;
}

.opp-name,
.shop-name {
  font-weight: 800;
}

.fight-btn {
  padding: 7px 16px;
  color: #1c1608;
  font-weight: 800;
  border: 1px solid #dbb85e;
  border-radius: 6px;
  background: linear-gradient(180deg, #d7b65a, #8b6914);
  cursor: pointer;
}

.fight-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.result-box {
  margin-top: 10px;
  padding: 10px;
  border-radius: 8px;
  color: #ffd700;
  background: rgba(200, 168, 78, 0.1);
  border: 1px solid rgba(200, 168, 78, 0.22);
}

.shop-layout {
  display: grid;
  grid-template-columns: 210px 1fr;
  gap: 10px;
}

.shop-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.shop-item {
  gap: 8px;
  padding: 8px;
  color: var(--color-text-primary);
  border: 1px solid rgba(200, 168, 78, 0.1);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.22);
  cursor: pointer;
}

.shop-item.active {
  border-color: var(--color-border-gold);
}

.shop-detail {
  padding: 12px;
  border: 1px solid rgba(200, 168, 78, 0.15);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.26);
}

.shop-name,
.shop-desc,
.shop-price {
  margin-top: 8px;
}
</style>
