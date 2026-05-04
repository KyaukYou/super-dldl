<script setup lang="ts">
import { useUIStore } from '@/stores/ui'
import type { PanelName } from '@/stores/ui'
import { systemIconPath } from '@/assets/art-direction/icon-paths'
import GameIcon from '@/ui/components/GameIcon.vue'

const uiStore = useUIStore()

const menuItems: { iconId: string; label: string; panel: Exclude<PanelName, null>; key: string }[] = [
  { iconId: 'world_map', label: '主城', panel: 'city', key: '' },
  { iconId: 'character', label: '角色', panel: 'character', key: 'C' },
  { iconId: 'bag', label: '背包', panel: 'bag', key: 'B' },
  { iconId: 'spirit', label: '武魂', panel: 'spirit', key: 'W' },
  { iconId: 'skill', label: '魂技', panel: 'skill', key: 'K' },
  { iconId: 'bone', label: '魂骨', panel: 'bone', key: 'G' },
  { iconId: 'arena', label: '竞技', panel: 'arena', key: '' },
  { iconId: 'sect', label: '宗门', panel: 'sect', key: 'J' },
  { iconId: 'quest', label: '任务', panel: 'quest', key: 'Q' },
  { iconId: 'rank', label: '排行', panel: 'rank', key: 'R' },
  { iconId: 'settings', label: '设置', panel: 'settings', key: '' },
]

function openMenuPanel(panel: Exclude<PanelName, null>) {
  void uiStore.openPanel(panel)
}
</script>

<template>
  <nav class="left-menu" aria-label="主菜单">
    <button
      v-for="item in menuItems"
      :key="item.panel"
      class="menu-btn"
      :class="{ active: uiStore.currentPanel === item.panel }"
      :title="item.key ? `${item.label} (${item.key})` : item.label"
      type="button"
      @click.stop="openMenuPanel(item.panel)"
    >
      <GameIcon
        class="menu-icon"
        :src="systemIconPath(item.iconId)"
        :size="48"
        quality="blue"
        :title="item.label"
        :fallback-text="item.label.slice(0, 1)"
        no-frame
      />
      <span class="label">{{ item.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.left-menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 10px 10px 12px;
  background: linear-gradient(180deg, rgba(15, 15, 17, 0.97), rgba(8, 13, 20, 0.97));
  border-right: 1px solid var(--color-border-gold-dim);
  overflow-y: auto;
  overflow-x: visible;
  scrollbar-width: thin;
  scrollbar-color: rgba(200, 168, 78, 0.35) transparent;
}

.left-menu::-webkit-scrollbar {
  width: 4px;
}

.left-menu::-webkit-scrollbar-track {
  background: transparent;
}

.left-menu::-webkit-scrollbar-thumb {
  background: rgba(200, 168, 78, 0.35);
  border-radius: 2px;
}

.left-menu::-webkit-scrollbar-thumb:hover {
  background: rgba(200, 168, 78, 0.55);
}

.menu-btn {
  width: 116px;
  min-height: 94px;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  border: 1px solid rgba(200, 168, 78, 0.12);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.18);
  transition: background 0.15s, box-shadow 0.15s, transform 0.15s;
}

.menu-btn:hover {
  background: rgba(200, 168, 78, 0.14);
  transform: translateX(1px);
}

.menu-btn.active {
  background: linear-gradient(180deg, rgba(200, 168, 78, 0.24), rgba(37, 30, 13, 0.58));
  box-shadow: inset 0 0 0 1px rgba(218, 188, 96, 0.46), 0 0 12px rgba(200, 168, 78, 0.16);
}

.menu-icon,
.label {
  pointer-events: none;
}

.label {
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1;
  white-space: nowrap;
  font-weight: 600;
}

.menu-btn.active .label {
  color: var(--color-border-gold);
}

.menu-btn:hover .label {
  color: var(--color-text-primary);
}
</style>
