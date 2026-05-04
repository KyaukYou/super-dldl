<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Faction } from '@/types/game'
import { SERIES_NAMES } from '@/types/game'
import { SPIRITS } from '@/data/gameData'
import { displayName, factionDescriptions, factionLabels } from '@/data/displayData'
import { useGameStore } from '@/stores/game'
import { backgroundPaths } from '@/assets/art-direction/background-paths'
import { systemIconPath } from '@/assets/art-direction/icon-paths'
import GameIcon from '@/ui/components/GameIcon.vue'

const emit = defineEmits<{
  created: []
}>()

const gameStore = useGameStore()

const step = ref<1 | 2 | 3>(1)
const charName = ref('')
const selectedFaction = ref<Faction | null>(null)
const selectedSpiritId = ref<string | null>(null)
const refreshCount = ref(15)

const factions: Array<{ id: Faction; icon: string; name: string; desc: string }> = [
  { id: 'tiandou', icon: systemIconPath('sect'), name: factionLabels.tiandou, desc: factionDescriptions.tiandou },
  { id: 'xingluo', icon: systemIconPath('arena'), name: factionLabels.xingluo, desc: factionDescriptions.xingluo },
  { id: 'wuhundian', icon: systemIconPath('spirit'), name: factionLabels.wuhundian, desc: factionDescriptions.wuhundian },
]

const currentSpirit = computed(() => {
  if (!selectedSpiritId.value) return null
  return SPIRITS.find((spirit) => spirit.id === selectedSpiritId.value) ?? null
})

const currentSpiritName = computed(() => {
  if (!currentSpirit.value) return ''
  return displayName(currentSpirit.value.id, currentSpirit.value.name)
})

const canConfirm = computed(() => (
  charName.value.trim().length > 0 && selectedFaction.value !== null && selectedSpiritId.value !== null
))

function refreshSpirit() {
  if (refreshCount.value <= 0) return
  refreshCount.value -= 1
  const idx = Math.floor(Math.random() * SPIRITS.length)
  selectedSpiritId.value = SPIRITS[idx]!.id
}

function quickTest() {
  selectedFaction.value = 'tiandou'
  selectedSpiritId.value = 'haotian_hammer'
  charName.value = '唐小满'
  finishCreate()
}

function selectFaction(faction: Faction) {
  selectedFaction.value = faction
  step.value = 2
  refreshSpirit()
}

function goBack() {
  if (step.value === 2) {
    step.value = 1
    selectedFaction.value = null
    selectedSpiritId.value = null
    refreshCount.value = 15
  } else if (step.value === 3) {
    step.value = 2
  }
}

function confirmSpirit() {
  if (!selectedSpiritId.value) return
  step.value = 3
}

function finishCreate() {
  const name = charName.value.trim()
  if (!name || !selectedFaction.value || !selectedSpiritId.value) return
  gameStore.createCharacter(name, selectedFaction.value, selectedSpiritId.value)
  emit('created')
}
</script>

<template>
  <div class="create-screen">
    <img class="create-bg" :src="backgroundPaths.cityWuhun" alt="" />
    <div class="create-panel panel-base">
      <h1 class="panel-title">斗罗大陆</h1>

      <div class="quick-test">
        <button class="btn-dark text-sm" type="button" @click="quickTest">快速进入测试角色</button>
      </div>

      <section v-if="step === 1">
        <h2 class="step-title">选择你的阵营</h2>
        <div class="faction-grid">
          <button v-for="faction in factions" :key="faction.id" class="faction-card" type="button" @click="selectFaction(faction.id)">
            <img class="faction-icon" :src="faction.icon" alt="" />
            <span class="faction-name">{{ faction.name }}</span>
            <span class="faction-desc">{{ faction.desc }}</span>
          </button>
        </div>
      </section>

      <section v-else-if="step === 2">
        <h2 class="step-title">武魂觉醒</h2>

        <div v-if="currentSpirit" class="spirit-display">
          <GameIcon :src="currentSpirit.icon" quality="orange" :size="92" :title="currentSpiritName" />
          <div class="spirit-info">
            <div class="spirit-name">{{ currentSpiritName }}</div>
            <div class="spirit-series" :class="`series-${currentSpirit.series}`">{{ SERIES_NAMES[currentSpirit.series] }}</div>
            <div class="spirit-power">先天魂力 {{ currentSpirit.innatePower }}</div>
            <div class="spirit-talent">{{ currentSpirit.talent }}</div>
            <div class="spirit-stats">
              <span>力量 {{ currentSpirit.baseStats.str }}</span>
              <span>敏捷 {{ currentSpirit.baseStats.agi }}</span>
              <span>智力 {{ currentSpirit.baseStats.int }}</span>
              <span>体质 {{ currentSpirit.baseStats.vit }}</span>
            </div>
          </div>
        </div>

        <div class="spirit-actions">
          <button class="btn-dark" type="button" @click="goBack">返回</button>
          <button class="btn-gold" type="button" :disabled="refreshCount <= 0" @click="refreshSpirit">重新觉醒 {{ refreshCount }}</button>
          <button class="btn-gold" type="button" :disabled="!selectedSpiritId" @click="confirmSpirit">确认武魂</button>
        </div>
      </section>

      <section v-else>
        <h2 class="step-title">为角色命名</h2>
        <div class="name-input-area">
          <input v-model="charName" class="name-input" placeholder="输入角色名称" maxlength="8" @keyup.enter="finishCreate" />
          <div v-if="currentSpirit && selectedFaction" class="summary">
            <p>阵营：{{ factionLabels[selectedFaction] }}</p>
            <p>武魂：{{ currentSpiritName }}（{{ SERIES_NAMES[currentSpirit.series] }}）</p>
            <p>先天魂力：{{ currentSpirit.innatePower }}</p>
          </div>
        </div>
        <div class="spirit-actions">
          <button class="btn-dark" type="button" @click="goBack">返回</button>
          <button class="btn-gold" type="button" :disabled="!canConfirm" @click="finishCreate">进入游戏</button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.create-screen {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: #080d14;
}

.create-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.58;
}

.create-screen::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.64));
}

.create-panel {
  width: min(560px, calc(100vw - 32px));
  max-height: calc(100vh - 32px);
  padding: 30px;
  position: relative;
  z-index: 1;
  overflow: auto;
}

.panel-title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 18px;
}

.step-title {
  text-align: center;
  font-size: 18px;
  margin-bottom: 14px;
}

.quick-test {
  text-align: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(200, 168, 78, 0.2);
}

.faction-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.faction-card {
  min-height: 148px;
  background: rgba(20, 30, 56, 0.82);
  border: 1px solid rgba(200, 168, 78, 0.3);
  border-radius: 8px;
  padding: 14px 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.faction-card:hover {
  border-color: #c8a84e;
  box-shadow: 0 0 16px rgba(200, 168, 78, 0.3);
  transform: translateY(-2px);
}

.faction-icon {
  width: 42px;
  height: 42px;
  object-fit: contain;
}

.faction-name,
.spirit-name {
  color: #c8a84e;
  font-weight: bold;
  font-size: 16px;
}

.faction-desc,
.summary,
.spirit-talent {
  color: #9a8e7a;
  font-size: 12px;
  line-height: 1.6;
}

.spirit-display {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: rgba(20, 30, 56, 0.68);
  border: 1px solid rgba(200, 168, 78, 0.3);
  border-radius: 8px;
  margin-bottom: 16px;
}

.spirit-info {
  flex: 1;
  min-width: 0;
}

.series-strength { color: #ff6644; }
.series-agility { color: #44ff88; }
.series-intelligence { color: #4488ff; }

.spirit-power {
  color: #ffd700;
  font-size: 13px;
  margin-top: 4px;
}

.spirit-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  font-size: 12px;
  color: #c8bfae;
}

.spirit-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 12px;
  flex-wrap: wrap;
}

.name-input-area {
  text-align: center;
}

.name-input {
  background: rgba(20, 30, 56, 0.86);
  border: 1px solid rgba(200, 168, 78, 0.5);
  border-radius: 4px;
  color: #e8dcc8;
  font-size: 16px;
  padding: 8px 16px;
  width: min(240px, 100%);
  text-align: center;
  outline: none;
}

.summary {
  margin-top: 16px;
}

@media (max-width: 640px) {
  .create-panel {
    padding: 22px 16px;
  }

  .faction-grid {
    grid-template-columns: 1fr;
  }

  .spirit-display {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
