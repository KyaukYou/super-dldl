<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Quality } from '@/types/game'

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
  return {
    '--icon-size': `${props.size}px`,
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
  background: transparent;
  box-shadow: none;
  overflow: hidden;
}

.game-icon img {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.55));
}

.game-icon .fallback-text {
  position: relative;
  z-index: 4;
}

.game-icon.empty {
  opacity: 0.72;
  background:
    radial-gradient(circle at 35% 22%, rgba(255,255,255,0.16), transparent 28%),
    linear-gradient(145deg, rgba(17, 22, 36, 0.96), rgba(3, 8, 15, 0.98));
  box-shadow: inset 0 0 0 1px rgba(215, 181, 88, 0.22), 0 2px 8px rgba(0, 0, 0, 0.42);
}

.fallback-text {
  color: #d7b65a;
  font-size: calc(var(--icon-size) * 0.36);
  font-weight: 800;
  line-height: 1;
  text-shadow: 0 1px 3px #000;
}

.game-icon.quality-green img { filter: drop-shadow(0 0 6px rgba(74,255,122,0.18)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.55)); }
.game-icon.quality-blue img { filter: drop-shadow(0 0 6px rgba(74,158,255,0.2)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.55)); }
.game-icon.quality-purple img { filter: drop-shadow(0 0 6px rgba(180,74,255,0.2)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.55)); }
.game-icon.quality-orange img { filter: drop-shadow(0 0 6px rgba(255,176,58,0.24)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.55)); }
.game-icon.quality-red img { filter: drop-shadow(0 0 7px rgba(255,74,74,0.26)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.55)); }
</style>
