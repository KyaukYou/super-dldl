<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useUIStore } from '@/stores/ui'
import { useGameStore } from '@/stores/game'
import { skillIconPath, systemIconPath } from '@/assets/art-direction/icon-paths'
import {
  generatedButtons,
  generatedNpcPortraits,
  generatedSectImages,
} from '@/assets/art-direction/generated-paths'
import GameIcon from '@/ui/components/GameIcon.vue'

type SectTab = 'info' | 'members' | 'skills' | 'wars'
type SectMember = { name: string; role: string; level: number; power: number; online: boolean; isPlayer?: boolean }

const uiStore = useUIStore()
const gameStore = useGameStore()
const char = computed(() => gameStore.character)
const activeTab = ref<SectTab>('info')

const sectTabs: { key: SectTab; label: string }[] = [
  { key: 'info', label: '信息' },
  { key: 'members', label: '成员' },
  { key: 'skills', label: '技能' },
  { key: 'wars', label: '宗门战' },
]

const tabImages: Record<SectTab, string> = {
  info: generatedSectImages.mainHall,
  members: generatedSectImages.recruitmentOrder,
  skills: generatedSectImages.trainingGround,
  wars: generatedSectImages.warBanner,
}

const memberPortraits = [
  generatedNpcPortraits.sectMaster,
  generatedNpcPortraits.sectElder,
  generatedSectImages.totem,
  generatedSectImages.contributionBadge,
]

function createDefaultSect() {
  return {
    name: '天斗星辉宗',
    level: 3,
    exp: 1800,
    expToNext: 3600,
    contribution: 180,
    announcement: '本周宗门目标：完成宗门试炼，提升宗门守护技能。',
  }
}

const saved = localStorage.getItem('sect-state')
const sect = reactive(saved ? { ...createDefaultSect(), ...JSON.parse(saved) } : createDefaultSect())

watch(sect, () => localStorage.setItem('sect-state', JSON.stringify(sect)), { deep: true })

const members = computed<SectMember[]>(() => {
  const player = char.value ? { name: char.value.name, role: '弟子', level: char.value.level, power: char.value.stats.combatPower, online: true, isPlayer: true } : null
  return [
    { name: '雪清河', role: '宗主', level: 85, power: 88500, online: true },
    { name: '凌霜', role: '长老', level: 72, power: 60300, online: true },
    { name: '岩山', role: '护法', level: 66, power: 55800, online: false },
    { name: '烬羽', role: '精英', level: 48, power: 26000, online: true },
    ...(player ? [player] : []),
  ]
})

const sectSkills = reactive([
  { id: 'guard', name: '宗门守护', level: 2, effect: '全体防御提升', icon: skillIconPath('divine_shield') },
  { id: 'soul', name: '魂力共鸣', level: 1, effect: '任务经验奖励提升', icon: skillIconPath('soul_shield') },
  { id: 'war', name: '战意激昂', level: 1, effect: '竞技挑战奖励提升', icon: skillIconPath('war_cry') },
])

const wars = reactive([
  { opponent: '武魂殿巡查队', time: '周六 20:00', result: '胜', score: '3:1' },
  { opponent: '星罗猛虎宗', time: '上周六 20:00', result: '负', score: '1:3' },
])

const sectProgress = computed(() => `${Math.min(100, Math.floor((sect.exp / sect.expToNext) * 100))}%`)

function donate() {
  if (!char.value || char.value.gold < 100) return
  char.value.gold -= 100
  sect.contribution += 30
  sect.exp += 120
  if (sect.exp >= sect.expToNext) {
    sect.exp -= sect.expToNext
    sect.level += 1
    sect.expToNext = Math.floor(sect.expToNext * 1.35)
  }
  gameStore.saveGame()
}

function upgradeSectSkill(index: number) {
  if (sect.contribution < 80) return
  sect.contribution -= 80
  sectSkills[index]!.level += 1
}

function signupSectWar() {
  sect.announcement = '你已完成宗门战报名，周六 20:00 将由 AI 队友自动补位参战。'
  sect.contribution += 20
}
</script>

<template>
  <div v-if="char" class="sect-panel panel-base">
    <div class="panel-header">
      <div class="title-wrap">
        <GameIcon :src="systemIconPath('sect')" :size="34" quality="orange" title="宗门" />
        <h3 class="panel-title">宗门</h3>
      </div>
      <button class="close-btn" type="button" aria-label="关闭" @click.stop="uiStore.closePanel()">关闭</button>
    </div>

    <div class="tabs">
      <button v-for="tab in sectTabs" :key="tab.key" class="tab" :class="{ active: activeTab === tab.key }" type="button" @click.stop="activeTab = tab.key">
        {{ tab.label }}
      </button>
    </div>

    <template v-if="activeTab === 'info'">
      <div class="sect-hero" :style="{ backgroundImage: `linear-gradient(90deg, rgba(5, 8, 14, 0.82), rgba(5, 8, 14, 0.28)), url(${tabImages.info})` }">
        <GameIcon :src="generatedSectImages.totem" :size="58" quality="orange" title="宗门图腾" />
      </div>
      <div class="sect-card">
        <GameIcon :src="generatedSectImages.contributionBadge" :size="64" quality="orange" :title="sect.name" />
        <div class="sect-main">
          <div class="sect-name">{{ sect.name }}</div>
          <div class="sect-meta">Lv.{{ sect.level }} / 成员 {{ members.length }}/50 / 在线 {{ members.filter((m) => m.online).length }}</div>
          <div class="exp-bar"><div class="exp-fill" :style="{ width: sectProgress }"></div></div>
          <div class="sect-meta">{{ sect.exp }}/{{ sect.expToNext }}</div>
        </div>
      </div>
      <div class="announcement">{{ sect.announcement }}</div>
      <div class="action-row">
        <button class="asset-action text-xs" type="button" :style="{ '--asset-button-url': `url(${generatedButtons.exchange})` }" :disabled="char.gold < 100" @click.stop="donate">捐献 100 金币</button>
        <span class="contribution">贡献 {{ sect.contribution }}</span>
      </div>
    </template>

    <template v-else-if="activeTab === 'members'">
      <div class="member-list">
        <div v-for="(m, index) in members" :key="m.name" class="member-card" :class="{ me: m.isPlayer }">
          <GameIcon :src="m.isPlayer ? systemIconPath('character') : memberPortraits[index % memberPortraits.length]" :size="38" quality="blue" :title="m.name" />
          <div class="member-main">
            <div class="member-name">{{ m.name }}</div>
            <div class="member-meta">Lv.{{ m.level }} / 战力 {{ m.power.toLocaleString() }}</div>
          </div>
          <span class="role">{{ m.role }}</span>
        </div>
      </div>
    </template>

    <template v-else-if="activeTab === 'skills'">
      <div class="skill-list">
        <div v-for="(skill, index) in sectSkills" :key="skill.id" class="skill-card">
          <GameIcon :src="skill.icon" :size="42" quality="purple" :title="skill.name" />
          <div class="skill-main">
            <div class="skill-name">{{ skill.name }} Lv.{{ skill.level }}</div>
            <div class="skill-effect">{{ skill.effect }} +{{ skill.level * 4 }}%</div>
          </div>
          <button class="asset-action text-xs" type="button" :style="{ '--asset-button-url': `url(${generatedButtons.enhance})` }" :disabled="sect.contribution < 80" @click.stop="upgradeSectSkill(index)">升级</button>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="war-next">
        <GameIcon :src="generatedSectImages.warBanner" :size="42" quality="orange" title="宗门战" />
        <div class="war-main">
          <div class="war-title">下次宗门战</div>
          <div class="war-meta">周六 20:00 / AI 队友自动补位</div>
        </div>
        <button class="asset-action text-xs" type="button" :style="{ '--asset-button-url': `url(${generatedButtons.register})` }" @click.stop="signupSectWar">报名</button>
      </div>
      <div class="war-list">
        <div v-for="war in wars" :key="war.opponent" class="war-card" :class="{ win: war.result === '胜' }">
          <div class="war-opponent">{{ war.opponent }}</div>
          <div class="war-meta">{{ war.time }} / 比分 {{ war.score }}</div>
          <div class="war-result">{{ war.result }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.sect-panel {
  width: 740px;
  height: calc(100vh - 304px);
  padding: 24px 20px;
  overflow-y: auto;
}

.panel-header,
.title-wrap,
.sect-card,
.member-card,
.skill-card,
.war-next,
.action-row {
  display: flex;
  align-items: center;
}

.panel-header {
  justify-content: space-between;
  margin-bottom: 12px;
}

.title-wrap,
.sect-card,
.member-card,
.skill-card,
.war-next {
  gap: 10px;
}

.tabs {
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

.sect-card,
.announcement,
.member-card,
.skill-card,
.war-next,
.war-card {
  padding: 10px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.24);
  border: 1px solid rgba(200, 168, 78, 0.1);
}

.sect-hero {
  min-height: 128px;
  display: flex;
  align-items: center;
  padding: 14px;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid rgba(200, 168, 78, 0.18);
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.sect-main,
.member-main,
.skill-main,
.war-main {
  flex: 1;
  min-width: 0;
}

.sect-name,
.member-name,
.skill-name,
.war-title,
.war-opponent {
  font-weight: 800;
}

.sect-meta,
.announcement,
.member-meta,
.skill-effect,
.war-meta,
.contribution {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.exp-bar {
  height: 8px;
  margin: 8px 0 4px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.45);
}

.exp-fill {
  height: 100%;
  background: linear-gradient(90deg, #c8a84e, #44ff88);
}

.announcement {
  margin: 10px 0;
}

.action-row {
  justify-content: space-between;
}

.member-list,
.skill-list,
.war-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.member-card.me {
  border-color: rgba(255, 215, 0, 0.38);
}

.role {
  padding: 3px 8px;
  border-radius: 999px;
  color: var(--color-border-gold);
  background: rgba(200, 168, 78, 0.12);
  font-size: 11px;
}

.war-next {
  margin-bottom: 10px;
}

.war-card {
  position: relative;
}

.war-result {
  position: absolute;
  right: 12px;
  top: 12px;
  font-weight: 900;
  color: #ff6b6b;
}

.war-card.win .war-result {
  color: #44ff88;
}
</style>
