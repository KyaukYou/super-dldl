<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useGameStore } from '@/stores/game'
import { useUIStore, type UiLogChannel } from '@/stores/ui'
import { ITEMS, SKILLS } from '@/data/gameData'
import { itemLabels } from '@/data/displayData'
import { skillIconPath, itemIconPath } from '@/assets/art-direction/icon-paths'
import GameIcon from '@/ui/components/GameIcon.vue'
import { audioManager } from '@/game/audio/audioManager'

const gameStore = useGameStore()
const uiStore = useUIStore()
const char = computed(() => gameStore.character)
const logContainer = ref<HTMLDivElement | null>(null)

const logTabs: Array<{ key: UiLogChannel | 'all'; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'system', label: '系统' },
  { key: 'hint', label: '提示' },
  { key: 'world', label: '世界' },
  { key: 'battle', label: '战斗' },
]

const channelLabels: Record<UiLogChannel, string> = {
  system: '系统',
  hint: '提示',
  world: '世界',
  battle: '战斗',
}

const skillSlots = computed(() => {
  if (!char.value) return []
  return Array.from({ length: 9 }, (_, i) => {
    const ring = char.value!.rings[i]
    const skill = ring?.skillId ? SKILLS.find((item) => item.id === ring.skillId) : null
    return {
      slot: i + 1,
      hasSkill: !!skill,
      name: skill?.name ?? '',
      icon: ring?.skillId ? skillIconPath(ring.skillId) : '',
      quality: skill ? 'purple' : 'white',
    }
  })
})

const quickSlots = computed(() => gameStore.quickSlots.map((slot, index) => {
  const itemId = slot.itemId
  const inv = itemId ? gameStore.inventory.find((item) => item.itemId === itemId) : null
  const def = itemId ? ITEMS.find((item) => item.id === itemId) : null
  const label = itemId ? itemLabels[itemId] : null
  return {
    slot: index + 1,
    itemId,
    icon: itemId ? itemIconPath(itemId) : '',
    name: label?.name ?? def?.name ?? '',
    count: inv?.quantity ?? 0,
    quality: def?.quality ?? 'white',
  }
}))

const visibleLogs = computed(() => {
  if (uiStore.activeLogChannel === 'all') return uiStore.logs
  return uiStore.logs.filter((log) => log.channel === uiStore.activeLogChannel)
})

watch(visibleLogs, async () => {
  await nextTick()
  if (logContainer.value) logContainer.value.scrollTop = logContainer.value.scrollHeight
}, { deep: true })

function useQuickSlot(slotIndex: number) {
  const slot = gameStore.quickSlots[slotIndex]
  if (!slot?.itemId) return
  const used = gameStore.useQuickSlot(slotIndex)
  if (!used) {
    uiStore.pushLog('hint', '该快捷物品当前无法使用。')
    return
  }
  audioManager.playItem()
  uiStore.pushLog('system', `快捷使用：${itemLabels[slot.itemId]?.name ?? slot.itemId}`)
}

function onDropQuickSlot(event: DragEvent, slotIndex: number) {
  const itemId = event.dataTransfer?.getData('application/x-dldl-item') || event.dataTransfer?.getData('text/plain')
  if (!itemId) return
  if (!gameStore.assignQuickSlot(slotIndex, itemId)) {
    uiStore.pushLog('hint', '只有药品可以拖入快捷栏。')
    return
  }
  audioManager.playClick()
  uiStore.pushLog('system', `已设置快捷栏 ${slotIndex + 1}：${itemLabels[itemId]?.name ?? itemId}`)
}

function clearQuickSlot(slotIndex: number) {
  gameStore.clearQuickSlot(slotIndex)
  audioManager.playClick()
}
</script>

<template>
  <div v-if="char" class="bottom-bar panel-base">
    <section class="log-panel">
      <div class="chat-tabs">
        <button
          v-for="tab in logTabs"
          :key="tab.key"
          class="tab"
          :class="{ active: uiStore.activeLogChannel === tab.key }"
          type="button"
          @click="uiStore.setLogChannel(tab.key)"
        >
          {{ tab.label }}
        </button>
      </div>
      <div ref="logContainer" class="chat-content">
        <div v-for="line in visibleLogs" :key="line.id" class="chat-line">
          <span class="time">{{ line.time }}</span>
          <span class="channel" :class="line.channel">[{{ channelLabels[line.channel] }}]</span>
          <span class="text">{{ line.text }}</span>
        </div>
      </div>
    </section>

    <section class="quick-panel">
      <div class="row-title">魂技</div>
      <div class="skill-slots">
        <button
          v-for="skill in skillSlots"
          :key="skill.slot"
          class="skill-slot"
          :class="{ empty: !skill.hasSkill }"
          :title="skill.name || `魂技槽 ${skill.slot}`"
          type="button"
        >
          <span class="slot-num">{{ skill.slot }}</span>
          <GameIcon
            v-if="skill.hasSkill"
            :src="skill.icon"
            :size="58"
            :quality="skill.quality as any"
            :title="skill.name"
            :fallback-text="skill.name.slice(0, 1)"
            no-frame
          />
        </button>
      </div>

      <div class="row-title">快捷物品</div>
      <div class="item-slots">
        <button
          v-for="item in quickSlots"
          :key="item.slot"
          class="item-slot"
          :class="{ empty: !item.itemId, disabled: !!item.itemId && item.count <= 0 }"
          :title="item.name || `快捷槽 ${item.slot}`"
          type="button"
          @click.stop="useQuickSlot(item.slot - 1)"
          @contextmenu.prevent="clearQuickSlot(item.slot - 1)"
          @dragover.prevent
          @drop.prevent="onDropQuickSlot($event, item.slot - 1)"
        >
          <span class="slot-num">{{ item.slot }}</span>
          <GameIcon
            v-if="item.itemId"
            :src="item.icon"
            :quality="item.quality as any"
            :size="52"
            :empty="item.count <= 0"
            :fallback-text="item.name.slice(0, 1)"
            no-frame
          />
          <span v-else class="empty-plus">+</span>
          <span v-if="item.itemId && item.count > 0" class="item-count">{{ item.count }}</span>
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.bottom-bar {
  display: grid;
  grid-template-columns: minmax(420px, 1fr) minmax(650px, 780px);
  gap: 12px;
  box-sizing: border-box;
  height: 200px;
  max-height: 200px;
  min-height: 200px;
  padding: 10px 12px;
  border-bottom: none;
  border-left: none;
  border-right: none;
  border-radius: 0;
  background:
    linear-gradient(0deg, rgba(20, 17, 13, 0.98), rgba(6, 12, 20, 0.96)),
    radial-gradient(circle at 72% 0%, rgba(200, 168, 78, 0.18), transparent 34%);
  overflow: hidden;
}

.log-panel,
.quick-panel {
  min-width: 0;
  min-height: 0;
}

.log-panel {
  display: flex;
  flex-direction: column;
}

.chat-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
}

.tab {
  font-size: 12px;
  color: var(--color-text-secondary);
  padding: 3px 10px;
  cursor: pointer;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 3px;
}

.tab.active {
  color: var(--color-border-gold);
  background: rgba(200, 168, 78, 0.16);
  border-color: rgba(200, 168, 78, 0.28);
}

.chat-content {
  flex: 1;
  height: 0;
  min-height: 0;
  overflow-y: auto;
  font-size: 12px;
  line-height: 1.55;
  padding-right: 6px;
}

.chat-line {
  display: flex;
  gap: 5px;
  padding: 1px 0;
  align-items: flex-start;
}

.time {
  color: rgba(255, 255, 255, 0.38);
  flex: 0 0 auto;
}

.text {
  color: var(--color-text-primary);
  min-width: 0;
}

.channel.system { color: #ffb54a; }
.channel.hint { color: #ffd700; }
.channel.world { color: #4aff7a; }
.channel.battle { color: #7cc6ff; }

.quick-panel {
  display: grid;
  grid-template-columns: 64px 1fr;
  grid-template-rows: 72px 72px;
  gap: 10px 8px;
  align-items: center;
  overflow: hidden;
}

.row-title {
  color: #f4d98a;
  font-size: 13px;
  text-align: right;
  letter-spacing: 0;
}

.skill-slots,
.item-slots {
  display: flex;
  gap: 8px;
  min-width: 0;
}

.skill-slot,
.item-slot {
  width: 64px;
  height: 64px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(200, 168, 78, 0.22);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: border-color 0.15s, box-shadow 0.15s, opacity 0.15s;
  padding: 0;
}

.skill-slot:hover:not(.empty),
.item-slot:hover:not(.empty) {
  border-color: var(--color-border-gold);
  box-shadow: 0 0 8px rgba(200, 168, 78, 0.28);
}

.skill-slot.empty,
.item-slot.empty {
  opacity: 0.42;
}

.item-slot.disabled {
  opacity: 0.5;
}

.slot-num {
  position: absolute;
  top: 2px;
  left: 5px;
  font-size: 10px;
  color: var(--color-text-secondary);
  z-index: 2;
}

.item-count {
  position: absolute;
  right: 5px;
  bottom: 3px;
  min-width: 18px;
  padding: 0 4px;
  border-radius: 999px;
  font-size: 11px;
  line-height: 16px;
  color: #fff8df;
  background: rgba(7, 10, 18, 0.94);
  border: 1px solid rgba(236, 198, 94, 0.72);
  text-shadow: 0 1px 2px #000;
  z-index: 5;
}

.empty-plus {
  color: rgba(244, 217, 138, 0.48);
  font-size: 28px;
  line-height: 1;
}
</style>
