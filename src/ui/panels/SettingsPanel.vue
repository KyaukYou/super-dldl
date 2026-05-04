<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useGameStore } from '@/stores/game'
import { systemIconPath } from '@/assets/art-direction/icon-paths'
import GameIcon from '@/ui/components/GameIcon.vue'

const uiStore = useUIStore()
const gameStore = useGameStore()

const defaults = {
  musicVolume: 50,
  sfxVolume: 70,
  uiScale: 100,
  showDamageNumbers: true,
  showMonsterHp: true,
  autoPickup: true,
  reduceMotion: false,
}

const saved = localStorage.getItem('game-settings')
const settings = reactive({ ...defaults, ...(saved ? JSON.parse(saved) : {}) })

watch(settings, () => {
  localStorage.setItem('game-settings', JSON.stringify(settings))
}, { deep: true })

function resetSettings() {
  Object.assign(settings, defaults)
}

async function exportSave() {
  const payload = localStorage.getItem('chaoyue-dalu-save') ?? '{}'
  await navigator.clipboard?.writeText(payload)
}

function deleteSave() {
  const ok = window.confirm('确定删除存档吗？所有角色进度都会清空。')
  if (!ok) return
  gameStore.deleteSave()
  void uiStore.closePanel()
  location.reload()
}
</script>

<template>
  <div class="settings-panel panel-base">
    <div class="panel-header">
      <div class="title-wrap">
        <GameIcon :src="systemIconPath('settings')" :size="34" quality="orange" title="设置" />
        <h3 class="panel-title">系统设置</h3>
      </div>
      <button class="close-btn" type="button" @click.stop="uiStore.closePanel()">关闭</button>
    </div>

    <div class="setting-group">
      <h4>音频</h4>
      <label class="setting-row">
        <span>音乐音量</span>
        <input v-model.number="settings.musicVolume" type="range" min="0" max="100" />
        <b>{{ settings.musicVolume }}%</b>
      </label>
      <label class="setting-row">
        <span>音效音量</span>
        <input v-model.number="settings.sfxVolume" type="range" min="0" max="100" />
        <b>{{ settings.sfxVolume }}%</b>
      </label>
    </div>

    <div class="setting-group">
      <h4>画面</h4>
      <label class="setting-row">
        <span>界面缩放</span>
        <input v-model.number="settings.uiScale" type="range" min="80" max="120" step="5" />
        <b>{{ settings.uiScale }}%</b>
      </label>
      <label class="toggle-row"><span>显示伤害数字</span><input v-model="settings.showDamageNumbers" type="checkbox" /></label>
      <label class="toggle-row"><span>显示魂兽血条</span><input v-model="settings.showMonsterHp" type="checkbox" /></label>
      <label class="toggle-row"><span>减少动画</span><input v-model="settings.reduceMotion" type="checkbox" /></label>
    </div>

    <div class="setting-group">
      <h4>游戏</h4>
      <label class="toggle-row"><span>自动拾取掉落</span><input v-model="settings.autoPickup" type="checkbox" /></label>
      <div class="hotkeys">
        <span>C 角色</span>
        <span>B 背包</span>
        <span>W 武魂</span>
        <span>K 魂技</span>
        <span>Q 任务</span>
      </div>
    </div>

    <div class="setting-group danger">
      <h4>存档</h4>
      <div class="action-row">
        <button class="btn-dark text-xs" type="button" @click.stop="exportSave">复制存档</button>
        <button class="btn-dark text-xs" type="button" @click.stop="resetSettings">重置设置</button>
        <button class="danger-btn text-xs" type="button" @click.stop="deleteSave">删除存档</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-panel {
  width: 740px;
  height: calc(100vh - 304px);
  padding: 24px 20px;
  overflow-y: auto;
}

.panel-header,
.title-wrap,
.setting-row,
.toggle-row,
.action-row {
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

.setting-group {
  padding: 12px 0;
  border-top: 1px solid rgba(200, 168, 78, 0.12);
}

.setting-group h4 {
  margin-bottom: 10px;
  color: var(--color-border-gold);
  font-size: 13px;
}

.setting-row {
  gap: 10px;
  margin-bottom: 8px;
}

.setting-row span {
  width: 76px;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.setting-row input {
  flex: 1;
}

.setting-row b {
  width: 42px;
  text-align: right;
  font-size: 12px;
}

.toggle-row {
  justify-content: space-between;
  margin-bottom: 8px;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.hotkeys {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.hotkeys span {
  padding: 4px 8px;
  border-radius: 4px;
  color: var(--color-border-gold);
  background: rgba(200, 168, 78, 0.1);
  font-size: 11px;
}

.action-row {
  gap: 8px;
}

.danger-btn {
  padding: 4px 10px;
  color: #ff6b6b;
  border: 1px solid rgba(255, 74, 74, 0.34);
  border-radius: 4px;
  background: rgba(255, 74, 74, 0.12);
  cursor: pointer;
}
</style>
