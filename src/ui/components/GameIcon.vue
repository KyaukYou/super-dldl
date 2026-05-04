<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Quality } from '@/types/game'
import { qualityFramePath } from '@/assets/art-direction/icon-paths'

const props = withDefaults(defineProps<{
  src?: string
  quality?: Quality | 'none'
  size?: number
  title?: string
  empty?: boolean
  fallbackText?: string
  noFrame?: boolean
}>(), {
  quality: 'none',
  size: 40,
  title: '',
  empty: false,
  fallbackText: '',
  noFrame: false,
})

const failed = ref(false)

watch(() => props.src, () => {
  failed.value = false
})

const style = computed(() => {
  const frame = !props.noFrame && props.quality !== 'none' ? qualityFramePath(props.quality) : ''
  return {
    '--icon-size': `${props.size}px`,
    '--frame-url': frame ? `url("${frame}")` : 'none',
  }
})
</script>

<template>
  <span class="game-icon" :class="[`quality-${quality}`, { empty: empty || failed || !src }]" :style="style" :title="title">
    <img v-if="src && !empty && !failed" :src="src" alt="" draggable="false" @error="failed = true" />
    <span v-else-if="fallbackText" class="fallback-text">{{ fallbackText }}</span>
  </span>
</template>

<style scoped>
.game-icon {
  width: var(--icon-size);
  height: var(--icon-size);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex: 0 0 auto;
  border-radius: 6px;
  background:
    radial-gradient(circle at 35% 22%, rgba(255,255,255,0.16), transparent 28%),
    linear-gradient(145deg, rgba(17, 22, 36, 0.96), rgba(3, 8, 15, 0.98));
  box-shadow: inset 0 0 0 1px rgba(215, 181, 88, 0.26), 0 2px 8px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.game-icon::after {
  content: '';
  position: absolute;
  z-index: 3;
  inset: 0;
  background-image: var(--frame-url);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  pointer-events: none;
}

.game-icon img {
  position: relative;
  z-index: 2;
  width: 78%;
  height: 78%;
  object-fit: contain;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.85));
}

.game-icon .fallback-text {
  position: relative;
  z-index: 4;
}

.game-icon.empty {
  opacity: 0.72;
}

.fallback-text {
  color: #d7b65a;
  font-size: calc(var(--icon-size) * 0.36);
  font-weight: 800;
  line-height: 1;
  text-shadow: 0 1px 3px #000;
}

.game-icon.quality-green { box-shadow: inset 0 0 0 1px rgba(74,255,122,0.36), 0 2px 8px rgba(0,0,0,0.5); }
.game-icon.quality-blue { box-shadow: inset 0 0 0 1px rgba(74,158,255,0.38), 0 2px 8px rgba(0,0,0,0.5); }
.game-icon.quality-purple { box-shadow: inset 0 0 0 1px rgba(180,74,255,0.42), 0 2px 8px rgba(0,0,0,0.5); }
.game-icon.quality-orange { box-shadow: inset 0 0 0 1px rgba(255,176,58,0.48), 0 2px 10px rgba(255,138,28,0.18); }
.game-icon.quality-red { box-shadow: inset 0 0 0 1px rgba(255,74,74,0.56), 0 2px 12px rgba(255,44,44,0.22); }
</style>
