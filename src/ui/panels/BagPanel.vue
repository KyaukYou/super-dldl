<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore } from '@/stores/game'
import { useUIStore } from '@/stores/ui'
import { ITEMS } from '@/data/gameData'
import { itemLabels, qualityLabels } from '@/data/displayData'
import type { Quality, ItemDef } from '@/types/game'
import { itemIconPath, systemIconPath } from '@/assets/art-direction/icon-paths'
import { generatedButtons } from '@/assets/art-direction/generated-paths'
import { spiritRingLabelWithYear } from '@/game/utils/spiritRingDrops'
import { inventoryUsageHints } from '@/game/utils/inventoryHints'
import { BONE_CRAFT_RECIPES, inventoryItemCount } from '@/game/utils/soulBoneCrafting'
import GameIcon from '@/ui/components/GameIcon.vue'

const gameStore = useGameStore()
const uiStore = useUIStore()

const inventory = computed(() => gameStore.inventory)
const char = computed(() => gameStore.character)

const activeTab = ref<'all' | 'material' | 'potion' | 'bone' | 'spirit_ring' | 'special'>('all')
const selectedItemIdx = ref<number | null>(null)

const bagTabs = [
  { key: 'all', label: '全部' },
  { key: 'material', label: '材料' },
  { key: 'potion', label: '药品' },
  { key: 'bone', label: '魂骨' },
  { key: 'spirit_ring', label: '魂环' },
  { key: 'special', label: '特殊' },
] as const

function normalizeItem(def: ItemDef | undefined) {
  if (!def) return undefined
  const label = itemLabels[def.id]
  return {
    ...def,
    name: label?.name ?? def.name,
    description: label?.desc ?? def.description,
  }
}

function getItemDef(itemId: string) {
  return normalizeItem(ITEMS.find((item) => item.id === itemId))
}

function itemDisplayName(itemId: string, year?: number) {
  if (itemId.startsWith('spirit_ring_')) return spiritRingLabelWithYear(itemId, year)
  return getItemDef(itemId)?.name ?? itemId
}

function qualityClass(quality: Quality) {
  return `quality-${quality}`
}

const filteredItems = computed(() => {
  const items = inventory.value.map((inv, idx) => ({
    ...inv,
    idx,
    def: getItemDef(inv.itemId),
    displayName: itemDisplayName(inv.itemId, inv.year),
  }))
  if (activeTab.value === 'all') return items
  return items.filter((item) => item.def?.type === activeTab.value)
})

function selectItem(idx: number) {
  selectedItemIdx.value = selectedItemIdx.value === idx ? null : idx
}

function isSpiritStone(itemId: string) {
  return itemId === 'scroll_s1' || itemId === 'scroll_m1'
}

function closeSelectedIfNeeded(idx: number) {
  if (selectedItemIdx.value === idx) selectedItemIdx.value = null
}

function useItem(idx: number) {
  const item = inventory.value[idx]
  if (!item || !char.value) return
  const def = getItemDef(item.itemId)
  if (!def) return

  if (def.type === 'potion') {
    gameStore.usePotionItem(item.itemId)
  } else if (isSpiritStone(item.itemId)) {
    if (gameStore.useSpiritStone(item.itemId)) {
      uiStore.pushLog('system', `${itemDisplayName(item.itemId)}已使用，第一魂环年限提升。`)
    } else {
      uiStore.pushLog('hint', '当前没有可强化的第一魂环。')
    }
    closeSelectedIfNeeded(idx)
    return
  } else if (def.type === 'spirit_ring') {
    if (gameStore.openRingChoiceFromItem(item.itemId, item.year)) {
      closeSelectedIfNeeded(idx)
    }
    return
  } else if (item.itemId === 'bone_fragment' || item.itemId === 'ancient_scroll') {
    const recipeId = item.itemId === 'bone_fragment' ? 'bone_fragment_random' : 'ancient_scroll_random'
    const result = gameStore.craftSoulBone(recipeId)
    if (result.ok) {
      uiStore.pushLog('system', `合成成功，获得并装备：${result.boneName}`)
      closeSelectedIfNeeded(idx)
    } else if (result.reason === 'slot') {
      uiStore.pushLog('hint', '当前魂骨位已满，无法继续合成。')
    } else if (result.reason === 'materials') {
      uiStore.pushLog('hint', '材料数量不足，无法合成魂骨。')
    } else {
      uiStore.pushLog('hint', '没有找到可合成的魂骨。')
    }
    return
  } else {
    return
  }

  gameStore.saveGame()
  closeSelectedIfNeeded(idx)
}

function sellOne(idx: number) {
  const item = inventory.value[idx]
  if (!item) return
  const def = getItemDef(item.itemId)
  if (!def) return
  gameStore.addGold(def.sellPrice)
  gameStore.removeItem(item.itemId, 1, item.year)
  closeSelectedIfNeeded(idx)
}

function sellAllSelected(idx: number) {
  const item = inventory.value[idx]
  if (!item) return
  const def = getItemDef(item.itemId)
  if (!def) return
  gameStore.addGold(def.sellPrice * item.quantity)
  gameStore.removeItem(item.itemId, item.quantity, item.year)
  closeSelectedIfNeeded(idx)
}

function sortItems() {
  const qualityRank: Record<Quality, number> = { red: 6, orange: 5, purple: 4, blue: 3, green: 2, white: 1 }
  gameStore.inventory.sort((a, b) => {
    const defA = getItemDef(a.itemId)
    const defB = getItemDef(b.itemId)
    const qualityDiff = (qualityRank[defB?.quality ?? 'white'] ?? 0) - (qualityRank[defA?.quality ?? 'white'] ?? 0)
    if (qualityDiff !== 0) return qualityDiff
    return (defA?.name ?? a.itemId).localeCompare(defB?.name ?? b.itemId)
  })
  gameStore.saveGame()
}

function onDragStart(event: DragEvent, itemId: string) {
  if (!gameStore.canAssignToQuickSlot(itemId)) return
  event.dataTransfer?.setData('application/x-dldl-item', itemId)
  event.dataTransfer?.setData('text/plain', itemId)
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'copy'
}

const selectedInvItem = computed(() => {
  if (selectedItemIdx.value === null) return null
  return inventory.value[selectedItemIdx.value] ?? null
})

const selectedDef = computed(() => {
  if (!selectedInvItem.value) return null
  const def = getItemDef(selectedInvItem.value.itemId)
  if (!def) return null
  return { ...def, name: itemDisplayName(selectedInvItem.value.itemId, selectedInvItem.value.year) }
})

const selectedUsageHints = computed(() => inventoryUsageHints(selectedInvItem.value))

const ringChoiceDisabled = computed(() => {
  if (!selectedDef.value || selectedDef.value.type !== 'spirit_ring') return false
  return !gameStore.hasOpenRingSlot()
})

const spiritStoneDisabled = computed(() => {
  if (!selectedInvItem.value || !isSpiritStone(selectedInvItem.value.itemId)) return false
  return (char.value?.rings.length ?? 0) === 0
})

const selectedCraftRecipe = computed(() => {
  if (!selectedInvItem.value) return null
  if (selectedInvItem.value.itemId === 'bone_fragment') return BONE_CRAFT_RECIPES.bone_fragment_random
  if (selectedInvItem.value.itemId === 'ancient_scroll') return BONE_CRAFT_RECIPES.ancient_scroll_random
  return null
})

const craftDisabledReason = computed(() => {
  if (!selectedCraftRecipe.value || !char.value) return ''
  if (inventoryItemCount(inventory.value, selectedCraftRecipe.value.sourceItemId) < selectedCraftRecipe.value.requiredQuantity) {
    return '材料不足'
  }
  if (Object.values(char.value.equippedBones).every(Boolean)) return '魂骨位已满'
  return ''
})

function spiritStoneEffectText(itemId: string) {
  if (itemId === 'scroll_s1') return '使用后第一魂环年限 +100'
  if (itemId === 'scroll_m1') return '使用后第一魂环年限 +500'
  return ''
}
</script>

<template>
  <div v-if="char" class="bag-panel panel-base">
    <button
      class="asset-close"
      type="button"
      :style="{ '--asset-button-url': `url(${generatedButtons.close})` }"
      aria-label="关闭"
      title="关闭"
      @click.stop="uiStore.closePanel()"
    />
    <div class="panel-header">
      <div class="title-wrap">
        <GameIcon :src="systemIconPath('bag')" :size="42" quality="orange" title="背包" fallback-text="包" />
        <h3 class="panel-title">背包</h3>
      </div>
    </div>

    <div class="bag-tabs">
      <button
        v-for="tab in bagTabs"
        :key="tab.key"
        class="tab"
        :class="{ active: activeTab === tab.key }"
        type="button"
        @click.stop="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="drag-tip">药品可拖到下方快捷物品栏。</div>

    <div class="bag-body">
      <div class="item-grid">
        <button
          v-for="item in filteredItems"
          :key="item.idx"
          class="item-cell"
          :class="[qualityClass(item.def?.quality ?? 'white'), { selected: selectedItemIdx === item.idx, draggable: gameStore.canAssignToQuickSlot(item.itemId) }]"
          type="button"
          :draggable="gameStore.canAssignToQuickSlot(item.itemId)"
          @dragstart="onDragStart($event, item.itemId)"
          @click.stop="selectItem(item.idx)"
        >
          <GameIcon
            :src="item.def ? itemIconPath(item.def.id) : ''"
            :quality="item.def?.quality ?? 'white'"
            :size="48"
            :title="item.def?.name"
            :fallback-text="item.def?.name?.slice(0, 1) || '物'"
          />
          <span v-if="item.quantity > 1" class="item-count">{{ item.quantity }}</span>
        </button>
        <div v-for="n in Math.max(0, 36 - filteredItems.length)" :key="`empty-${n}`" class="item-cell empty"></div>
      </div>

      <div v-if="selectedDef && selectedInvItem" class="item-detail">
        <div class="item-detail-content">
          <div class="detail-head">
            <GameIcon
              :src="itemIconPath(selectedDef.id)"
              :quality="selectedDef.quality"
              :size="60"
              :title="selectedDef.name"
              :fallback-text="selectedDef.name.slice(0, 1)"
            />
            <div>
              <div class="detail-name" :class="qualityClass(selectedDef.quality)">{{ selectedDef.name }}</div>
              <div class="detail-quality" :class="qualityClass(selectedDef.quality)">{{ qualityLabels[selectedDef.quality] }}</div>
            </div>
          </div>

          <div class="detail-desc">{{ selectedDef.description }}</div>

          <div v-if="selectedUsageHints.length" class="usage-hints">
            <div v-for="hint in selectedUsageHints" :key="hint.title" class="usage-hint">
              <span class="usage-hint-title">{{ hint.title }}</span>
              <span class="usage-hint-text">{{ hint.text }}</span>
            </div>
          </div>

          <div class="detail-info">
            <span>数量：{{ selectedInvItem.quantity }}</span>
            <span>售价：{{ selectedDef.sellPrice }} 金币</span>
          </div>

          <div v-if="selectedDef.type === 'spirit_ring' && ringChoiceDisabled" class="detail-tip">
            当前没有可吸收的空魂环位
          </div>
          <div v-if="selectedInvItem && isSpiritStone(selectedInvItem.itemId)" class="detail-tip">
            {{ spiritStoneEffectText(selectedInvItem.itemId) }}
            <span v-if="spiritStoneDisabled">，需要先吸收第一魂环</span>
          </div>
          <div v-if="selectedCraftRecipe && craftDisabledReason" class="detail-tip">
            {{ craftDisabledReason }}
          </div>
        </div>

        <div class="detail-actions">
          <button v-if="selectedDef.type === 'potion'" class="btn-dark text-xs" type="button" @click.stop="useItem(selectedItemIdx!)">使用</button>
          <button
            v-if="selectedInvItem && isSpiritStone(selectedInvItem.itemId)"
            class="btn-dark text-xs"
            type="button"
            :disabled="spiritStoneDisabled"
            @click.stop="useItem(selectedItemIdx!)"
          >
            使用
          </button>
          <button
            v-if="selectedDef.type === 'spirit_ring'"
            class="btn-dark text-xs"
            type="button"
            :disabled="ringChoiceDisabled"
            @click.stop="useItem(selectedItemIdx!)"
          >
            吸收魂环
          </button>
          <button
            v-if="selectedCraftRecipe"
            class="btn-dark text-xs"
            type="button"
            :disabled="!!craftDisabledReason"
            @click.stop="useItem(selectedItemIdx!)"
          >
            {{ selectedInvItem.itemId === 'bone_fragment' ? '合成魂骨' : '合成高阶魂骨' }}
          </button>
          <button class="btn-dark text-xs" type="button" @click.stop="sellOne(selectedItemIdx!)">出售 1 个</button>
          <button class="btn-dark text-xs" type="button" @click.stop="sellAllSelected(selectedItemIdx!)">全部出售该物品</button>
        </div>
      </div>

      <div v-else class="item-detail empty-detail">
        <span class="empty-text">点击物品查看详情</span>
      </div>
    </div>

    <div class="bag-footer">
      <span class="capacity">{{ inventory.length }}/60</span>
      <div class="footer-btns">
        <button class="btn-dark text-xs" type="button" @click.stop="sortItems">整理</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bag-panel {
  position: relative;
  width: 760px;
  height: calc(100vh - 360px);
  padding: 24px 20px;
  overflow-y: auto;
}

.asset-close {
  position: sticky;
  top: 0;
  float: right;
  z-index: 5;
  width: 56px;
  height: 56px;
  border: none;
  background: var(--asset-button-url) center / contain no-repeat;
  background-color: transparent;
  cursor: pointer;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.36));
}

.panel-header,
.bag-tabs,
.bag-footer {
  display: flex;
  align-items: center;
}

.panel-header,
.bag-footer {
  justify-content: space-between;
}

.panel-header {
  margin-bottom: 12px;
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bag-tabs {
  gap: 6px;
  margin-bottom: 8px;
}

.tab {
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid rgba(200, 168, 78, 0.2);
  background: rgba(0, 0, 0, 0.18);
  color: var(--color-text-secondary);
  cursor: pointer;
}

.tab.active {
  color: #f6d88c;
  border-color: rgba(200, 168, 78, 0.5);
  background: rgba(200, 168, 78, 0.12);
}

.drag-tip {
  margin-bottom: 12px;
  font-size: 12px;
  color: #f2d28c;
}

.bag-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 250px;
  gap: 16px;
}

.item-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 10px;
}

.item-cell {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(5, 8, 14, 0.72);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.item-cell.draggable {
  border-color: rgba(200, 168, 78, 0.3);
}

.item-cell.selected {
  outline: 2px solid rgba(200, 168, 78, 0.7);
}

.item-cell.empty {
  opacity: 0.25;
  cursor: default;
}

.item-count {
  position: absolute;
  right: 4px;
  bottom: 3px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #fff8df;
  background: rgba(7, 10, 18, 0.92);
  border: 1px solid rgba(236, 198, 94, 0.72);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.45);
  z-index: 12;
  pointer-events: none;
}

.item-detail {
  min-height: 420px;
  padding: 16px;
  border-radius: 8px;
  background: rgba(5, 8, 14, 0.6);
  border: 1px solid rgba(200, 168, 78, 0.14);
  display: flex;
  flex-direction: column;
}

.item-detail-content {
  flex: 1;
  min-height: 0;
}

.empty-detail {
  display: grid;
  place-items: center;
}

.detail-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.detail-name {
  font-size: 18px;
  font-weight: 700;
}

.detail-quality,
.detail-desc,
.detail-info,
.detail-tip,
.empty-text {
  color: var(--color-text-secondary);
}

.detail-desc {
  line-height: 1.6;
  margin-bottom: 12px;
}

.detail-info {
  display: grid;
  gap: 6px;
  margin-bottom: 12px;
}

.usage-hints {
  display: grid;
  gap: 8px;
  margin-bottom: 12px;
}

.usage-hint {
  padding: 8px 10px;
  border: 1px solid rgba(200, 168, 78, 0.18);
  border-radius: 6px;
  background: rgba(200, 168, 78, 0.07);
}

.usage-hint-title,
.usage-hint-text {
  display: block;
}

.usage-hint-title {
  margin-bottom: 3px;
  color: #f6d88c;
  font-size: 12px;
  font-weight: 700;
}

.usage-hint-text {
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.5;
}

.detail-tip {
  margin-bottom: 12px;
  font-size: 12px;
}

.detail-actions,
.footer-btns {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.detail-actions {
  padding-top: 12px;
  margin-top: auto;
  border-top: 1px solid rgba(200, 168, 78, 0.12);
}

.bag-footer {
  margin-top: 14px;
}

.capacity {
  color: var(--color-text-primary);
  font-size: 14px;
}
</style>
