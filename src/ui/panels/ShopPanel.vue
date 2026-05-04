<script setup lang="ts">
import { computed } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useGameStore } from '@/stores/game'
import { ITEMS } from '@/data/gameData'
import { itemIconPath } from '@/assets/art-direction/icon-paths'
import { generatedButtons, generatedNpcPortraits } from '@/assets/art-direction/generated-paths'
import GameIcon from '@/ui/components/GameIcon.vue'

const uiStore = useUIStore()
const gameStore = useGameStore()
const char = computed(() => gameStore.character)

const shopIds = [
  'hp_potion_s', 'hp_potion_m', 'hp_potion_l',
  'mp_potion_s', 'mp_potion_m', 'mp_potion_l',
  'scroll_s1', 'scroll_m1', 'forget_stone',
  'exp_potion_s', 'exp_potion_m', 'exp_potion_l',
]

const shopItems = computed(() => shopIds
  .map((id) => {
    const def = ITEMS.find(item => item.id === id)
    if (!def) return null
    return { ...def, price: Math.max(def.sellPrice * 5, 50) }
  })
  .filter(Boolean)
)

function buy(item: NonNullable<(typeof shopItems.value)[number]>) {
  if (!char.value || char.value.gold < item.price) return
  gameStore.addGold(-item.price)
  gameStore.addItem(item.id, 1)
  gameStore.saveGame()
}

function canBuy(price: number) {
  return !!char.value && char.value.gold >= price
}
</script>

<template>
  <div v-if="char" class="shop-panel panel-base">
    <div class="panel-header">
      <h3 class="panel-title">商店</h3>
      <span class="gold">金币 {{ char.gold }}</span>
      <button class="asset-action icon-only" type="button" :style="{ '--asset-button-url': `url(${generatedButtons.close})` }" @click="uiStore.closePanel()">关闭</button>
    </div>

    <div class="shopkeeper-card">
      <GameIcon :src="generatedNpcPortraits.shopkeeper" :size="54" quality="orange" title="商店老板" />
      <span>精品药水与基础修炼物资已备齐。</span>
    </div>

    <div class="shop-grid">
      <div v-for="item in shopItems" :key="item!.id" class="shop-item">
        <GameIcon :src="itemIconPath(item!.id)" :quality="item!.quality" :size="46" :title="item!.name" />
        <div class="item-info">
          <div class="item-name">{{ item!.name }}</div>
          <div class="item-desc">{{ item!.description }}</div>
          <div class="item-price">{{ item!.price }} 金币</div>
        </div>
        <button class="asset-action text-xs" :style="{ '--asset-button-url': `url(${generatedButtons.exchange})` }" :disabled="!canBuy(item!.price)" @click="buy(item!)">购买</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shop-panel {
  width: 740px;
  padding: 24px 20px;
  height: calc(100vh - 304px);
  overflow-y: auto;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.panel-title {
  flex: 1;
}

.gold {
  color: #ffd700;
  font-weight: bold;
}

.shopkeeper-card {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding: 10px;
  color: var(--color-text-secondary);
  font-size: 12px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.24);
  border: 1px solid rgba(200, 168, 78, 0.1);
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.shop-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.shop-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 13px;
  font-weight: bold;
}

.item-desc {
  font-size: 10px;
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-price {
  font-size: 11px;
  color: #ffd700;
  margin-top: 2px;
}
</style>
