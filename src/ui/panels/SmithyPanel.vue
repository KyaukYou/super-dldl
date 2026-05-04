<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useGameStore } from '@/stores/game'
import { itemIconPath, systemIconPath } from '@/assets/art-direction/icon-paths'
import { generatedButtons, generatedItemPath } from '@/assets/art-direction/generated-paths'
import GameIcon from '@/ui/components/GameIcon.vue'

type SmithyTab = 'forge' | 'bone' | 'enhance'

const uiStore = useUIStore()
const gameStore = useGameStore()
const char = computed(() => gameStore.character)
const activeTab = ref<SmithyTab>('forge')

const smithyTabs: { key: SmithyTab; label: string; icon: string }[] = [
  { key: 'forge', label: '暗器打造', icon: itemIconPath('ancient_scroll') },
  { key: 'bone', label: '魂骨合成', icon: systemIconPath('bone') },
  { key: 'enhance', label: '装备强化', icon: systemIconPath('smithy') },
]

const forgeItems = [
  {
    resultItemId: 'atk_scroll',
    name: '普通困兽网',
    icon: itemIconPath('qingling_stone'),
    cost: [
      { item: 'qingling_stone', qty: 5, icon: itemIconPath('qingling_stone'), label: '青灵石' },
      { item: 'fierce_gunpowder', qty: 2, icon: itemIconPath('fierce_gunpowder'), label: '烈火药' },
    ],
    gold: 100,
    desc: '捕捉低级魂兽',
  },
  {
    resultItemId: 'def_scroll',
    name: '高级招魂幡',
    icon: itemIconPath('deep_sea_silver'),
    cost: [
      { item: 'deep_sea_silver', qty: 3, icon: itemIconPath('deep_sea_silver'), label: '深海银母' },
      { item: 'bodhi_leaf', qty: 1, icon: itemIconPath('bodhi_leaf'), label: '菩提叶' },
    ],
    gold: 300,
    desc: '捕捉中级魂兽',
  },
  {
    resultItemId: 'lucky_charm',
    name: '丧魂爪',
    icon: itemIconPath('domain_shard'),
    cost: [
      { item: 'ancient_scroll', qty: 2, icon: itemIconPath('ancient_scroll'), label: '上古密卷' },
      { item: 'domain_shard', qty: 3, icon: itemIconPath('domain_shard'), label: '领域残片' },
    ],
    gold: 500,
    desc: '伤害无视领域',
  },
  {
    resultItemId: 'ring_random',
    name: '观音泪',
    icon: itemIconPath('moon_stone'),
    cost: [
      { item: 'deep_sea_silver', qty: 5, icon: itemIconPath('deep_sea_silver'), label: '深海银母' },
      { item: 'bodhi_leaf', qty: 3, icon: itemIconPath('bodhi_leaf'), label: '菩提叶' },
    ],
    gold: 800,
    desc: '终极暗器',
  },
]

function hasMaterials(item: typeof forgeItems[0]): boolean {
  return item.cost.every(c => {
    const inv = gameStore.inventory.find(i => i.itemId === c.item)
    return inv && inv.quantity >= c.qty
  }) && !!char.value && char.value.gold >= item.gold
}

function ownedCount(itemId: string) {
  return gameStore.inventory.find(i => i.itemId === itemId)?.quantity ?? 0
}

function forge(item: typeof forgeItems[0]) {
  if (!hasMaterials(item)) return
  for (const c of item.cost) gameStore.removeItem(c.item, c.qty)
  gameStore.addGold(-item.gold)
  gameStore.addItem(item.resultItemId, 1)
}
</script>

<template>
  <div v-if="char" class="smithy-panel panel-base">
    <div class="panel-header">
      <h3 class="panel-title">铁匠铺</h3>
      <button class="close-btn" type="button" @click.stop="uiStore.closePanel()">关闭</button>
    </div>

    <div class="panel-scroll-body">
    <div class="smithy-summary">
      <div class="summary-item">
        <span class="summary-label">持有金币</span>
        <span class="summary-value gold">{{ char.gold }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">锻造路线</span>
        <span class="summary-value">唐门暗器</span>
      </div>
    </div>

    <div class="smithy-tabs">
      <button
        v-for="tab in smithyTabs"
        :key="tab.key"
        class="tab"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="panel-body">
    <template v-if="activeTab === 'forge'">
      <div class="forge-list">
        <div v-for="item in forgeItems" :key="item.name" class="forge-card">
          <GameIcon :src="item.icon" :size="46" quality="purple" :title="item.name" />
          <div class="forge-info">
            <div class="forge-name">{{ item.name }}</div>
            <div class="forge-desc">{{ item.desc }}</div>
            <div class="material-list">
              <div v-for="cost in item.cost" :key="`${item.name}-${cost.item}`" class="material-chip">
                <GameIcon :src="cost.icon" :size="24" quality="blue" :title="cost.label" />
                <span>{{ cost.label }} {{ ownedCount(cost.item) }}/{{ cost.qty }}</span>
              </div>
              <span class="gold-cost">工费 {{ item.gold }}</span>
            </div>
          </div>
          <button class="asset-action text-xs" :style="{ '--asset-button-url': `url(${generatedButtons.synthesize})` }" :disabled="!hasMaterials(item)" @click="forge(item)">打造</button>
        </div>
      </div>
    </template>

    <template v-else-if="activeTab === 'bone'">
      <div class="placeholder-card">
        <GameIcon :src="generatedItemPath('ten_thousand_year_bone_fragment')" :size="48" quality="red" title="魂骨合成" />
        <div class="placeholder-copy">
          <div class="placeholder-title">魂骨合成台</div>
          <div class="placeholder-text">收集魂骨卷轴与上古密卷后，可在此熔铸更高阶魂骨。</div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="placeholder-card">
        <GameIcon :src="generatedItemPath('equipment_enhancement_sand')" :size="48" quality="orange" title="装备强化" />
        <div class="placeholder-copy">
          <div class="placeholder-title">装备强化台</div>
          <div class="placeholder-text">后续将接入强化、镶嵌与升阶，保留当前暗金系锻造界面结构。</div>
        </div>
      </div>
    </template>
    </div>
    </div>
  </div>
</template>

<style scoped>
.smithy-panel {
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

.smithy-summary {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(200, 168, 78, 0.12);
  border-radius: 6px;
}

.summary-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.summary-label,
.forge-desc,
.placeholder-text {
  font-size: 11px;
  color: var(--color-text-secondary);
}

.summary-value {
  font-size: 15px;
  font-weight: bold;
}

.summary-value.gold {
  color: #ffd700;
}

.smithy-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}

.tab {
  padding: 5px 14px;
  font-size: 12px;
  color: var(--color-text-secondary);
  border: 1px solid rgba(200, 168, 78, 0.12);
  background: rgba(8, 10, 18, 0.64);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}

.tab.active {
  color: var(--color-border-gold);
  background: rgba(200, 168, 78, 0.16);
  border-color: rgba(200, 168, 78, 0.24);
}

.forge-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.forge-card,
.placeholder-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.24);
  border: 1px solid rgba(200, 168, 78, 0.08);
  border-radius: 6px;
}

.forge-info,
.placeholder-copy {
  flex: 1;
  min-width: 0;
}

.forge-name,
.placeholder-title {
  font-size: 14px;
  font-weight: bold;
}

.forge-desc {
  margin-top: 3px;
}

.material-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.material-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px 3px 3px;
  font-size: 10px;
  color: var(--color-text-secondary);
  background: rgba(255, 255, 255, 0.04);
  border-radius: 999px;
}

.gold-cost {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  font-size: 10px;
  color: #ffd700;
  background: rgba(255, 215, 0, 0.08);
  border-radius: 999px;
}
</style>
