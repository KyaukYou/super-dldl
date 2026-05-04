<script setup lang="ts">
import { ref } from 'vue'
import { useUIStore } from '@/stores/ui'
import { systemIconPath } from '@/assets/art-direction/icon-paths'
import GameIcon from '@/ui/components/GameIcon.vue'

const uiStore = useUIStore()

const courses = [
  { name: '实战课程', icon: systemIconPath('arena'), stat: '攻击力', bonus: 2, level: 12, progress: 75 },
  { name: '耐力课程', icon: systemIconPath('boss'), stat: '防御力', bonus: 2, level: 10, progress: 50 },
  { name: '体能课程', icon: systemIconPath('spirit'), stat: '力量', bonus: 1, level: 8, progress: 38 },
  { name: '技巧课程', icon: systemIconPath('skill'), stat: '敏捷', bonus: 1, level: 8, progress: 38 },
  { name: '理论课程', icon: systemIconPath('codex'), stat: '理论值', bonus: 1, level: 15, progress: 100 },
]

const todayTrained = ref(0)
const maxTrain = 10
const examDone = ref(false)
const academyNotice = ref('')

function train(course: typeof courses[0]) {
  if (todayTrained.value >= maxTrain) return
  todayTrained.value++
  course.progress = Math.min(100, course.progress + 10)
}

function takeExam() {
  if (examDone.value) return
  examDone.value = true
  academyNotice.value = '每日考试完成，理论课程熟练度提升。'
  const theoryCourse = courses.find(course => course.name === '理论课程')
  if (theoryCourse) {
    theoryCourse.progress = Math.min(100, theoryCourse.progress + 15)
  }
}

function publishQuestion() {
  academyNotice.value = '出题功能需角色达到 30 级后开启。'
}
</script>

<template>
  <div class="academy-panel panel-base">
    <div class="panel-header">
      <h3 class="panel-title">斗罗学院</h3>
      <button class="close-btn" @click="uiStore.closePanel()">关闭</button>
    </div>

    <div class="panel-scroll-body">
    <div class="academy-summary">
      <div class="summary-item">
        <span class="summary-label">身份</span>
        <span class="summary-value gold">学生</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">今日修炼</span>
        <span class="summary-value">{{ todayTrained }}/{{ maxTrain }}</span>
      </div>
    </div>

    <h4 class="section-title">课程修炼</h4>
    <div class="course-list">
      <div v-for="c in courses" :key="c.name" class="course-card">
        <GameIcon :src="c.icon" :size="44" quality="blue" :title="c.name" />
        <div class="course-info">
          <div class="course-name">{{ c.name }}</div>
          <div class="course-effect">{{ c.stat }} +{{ c.bonus }}/次</div>
          <div class="course-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${c.progress}%` }"></div>
            </div>
            <span>Lv.{{ c.level }} · {{ c.progress }}%</span>
          </div>
        </div>
        <button class="btn-dark text-xs" :disabled="todayTrained >= maxTrain" @click="train(c)">修炼</button>
      </div>
    </div>

    <div class="academy-actions">
      <button class="btn-dark text-sm" :disabled="examDone" @click="takeExam">每日考试 ({{ examDone ? 1 : 0 }}/1)</button>
      <button class="btn-dark text-sm" @click="publishQuestion">出题 (需≥30级)</button>
    </div>
    <div v-if="academyNotice" class="academy-notice">{{ academyNotice }}</div>
    </div>
  </div>
</template>

<style scoped>
.academy-panel {
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

.close-btn:hover {
  color: var(--color-accent-red);
}

.academy-summary {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
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
.course-effect,
.course-progress {
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

.section-title {
  font-size: 13px;
  color: var(--color-border-gold);
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(200, 168, 78, 0.14);
}

.course-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.course-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(200, 168, 78, 0.08);
  border-radius: 6px;
}

.course-info {
  flex: 1;
  min-width: 0;
}

.course-name {
  font-size: 14px;
  font-weight: bold;
}

.course-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #c8a84e, #dbb85e);
  border-radius: 4px;
}

.academy-actions {
  display: flex;
  gap: 8px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(200, 168, 78, 0.12);
}

.academy-notice {
  margin-top: 10px;
  font-size: 11px;
  color: var(--color-text-secondary);
}
</style>
