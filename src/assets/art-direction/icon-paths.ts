const iconUrls = import.meta.glob('/src/assets/icons/**/*.png', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>

const generatedItemUrls = import.meta.glob('/src/assets/generated/items/*.png', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>

export const ICON_BASE = '/src/assets/icons'
const GENERATED_ITEM_BASE = '/src/assets/generated/items'

function iconUrl(path: string): string {
  return iconUrls[path] ?? path
}

const PLACEHOLDER_COLORS: Record<string, string> = {
  world_map: '#44cc44',
  character: '#ffd700',
  bag: '#ff8844',
  spirit: '#b44aff',
  skill: '#4488ff',
  bone: '#ffcc44',
  arena: '#ff6644',
  sect: '#cc88ff',
  quest: '#ffd700',
  rank: '#44aaff',
  settings: '#9a8e7a',
  codex: '#44cc88',
  smithy: '#ff8844',
  shop: '#ffd700',
  academy: '#44aaff',
  lock: '#666666',
  map_pin: '#ff4a4a',
  boss: '#ff4444',
  city: '#ffd700',
}

function placeholderSvg(iconId: string, char: string): string {
  const color = PLACEHOLDER_COLORS[iconId] ?? '#c8a84e'
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="12" fill="${color}" fill-opacity="0.22"/>
      <rect x="3" y="3" width="58" height="58" rx="10" fill="none" stroke="${color}" stroke-width="2" stroke-opacity="0.5"/>
      <text x="32" y="44" text-anchor="middle" font-size="28" fill="${color}" font-weight="bold" font-family="sans-serif">${char}</text>
    </svg>`
  )}`
}

const SPIRIT_RING_ICON_COLORS: Record<string, { stroke: string; glow: string; core: string }> = {
  ring_random: { stroke: '#d8a7ff', glow: '#7a3cff', core: '#fff4c2' },
  spirit_ring_white: { stroke: '#f2f2f2', glow: '#cfd8dc', core: '#ffffff' },
  spirit_ring_yellow: { stroke: '#ffd447', glow: '#d79a12', core: '#fff2a6' },
  spirit_ring_purple: { stroke: '#b56bff', glow: '#6c35d8', core: '#f0d7ff' },
  spirit_ring_black: { stroke: '#2a2f3a', glow: '#9aa4b8', core: '#d7dce8' },
  spirit_ring_red: { stroke: '#ff4a4a', glow: '#a80717', core: '#ffd0d0' },
}

function spiritRingItemSvg(id: string): string {
  const color = SPIRIT_RING_ICON_COLORS[id]
  if (!color) return ''
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
      <defs>
        <radialGradient id="bg" cx="50%" cy="45%" r="58%">
          <stop offset="0%" stop-color="${color.core}" stop-opacity="0.28"/>
          <stop offset="62%" stop-color="${color.glow}" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#050812" stop-opacity="0.9"/>
        </radialGradient>
        <filter id="softGlow" x="-45%" y="-45%" width="190%" height="190%">
          <feGaussianBlur stdDeviation="2.8" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <rect width="64" height="64" rx="12" fill="url(#bg)"/>
      <ellipse cx="32" cy="32" rx="22" ry="13" fill="none" stroke="${color.glow}" stroke-width="8" stroke-opacity="0.22" filter="url(#softGlow)"/>
      <ellipse cx="32" cy="32" rx="22" ry="13" fill="none" stroke="${color.stroke}" stroke-width="5.5" stroke-linecap="round"/>
      <ellipse cx="32" cy="32" rx="15" ry="8.2" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-opacity="0.5"/>
      <path d="M16 31c4-8 28-11 36-1" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-opacity="0.72"/>
    </svg>`
  )}`
}

const SYSTEM_CHARS: Record<string, string> = {
  world_map: 'M',
  character: 'C',
  bag: 'B',
  spirit: 'W',
  skill: 'S',
  bone: 'G',
  arena: 'A',
  sect: 'Z',
  quest: 'Q',
  rank: 'R',
  settings: 'O',
  codex: 'D',
  smithy: 'F',
  shop: '$',
  academy: 'X',
  city: 'C',
  lock: 'L',
  map_pin: 'P',
  boss: '!',
}

export function spiritIconPath(id: string): string {
  return iconUrl(`${ICON_BASE}/spirit/spirit_${id}.png`)
}

export function skillIconPath(id: string): string {
  const path = `${ICON_BASE}/skill/skill_${id}.png`
  return iconUrls[path] ?? placeholderSvg('skill', id.slice(0, 1).toUpperCase())
}

export function boneIconPath(id: string): string {
  const path = `${ICON_BASE}/bone/bone_${id}.png`
  return iconUrls[path] ?? placeholderSvg('bone', 'G')
}

export function itemIconPath(id: string): string {
  const generatedPath = `${GENERATED_ITEM_BASE}/item_${id}.png`
  if (generatedItemUrls[generatedPath]) return generatedItemUrls[generatedPath]
  const path = `${ICON_BASE}/item/item_${id}.png`
  return iconUrls[path] ?? (spiritRingItemSvg(id) || placeholderSvg(id, id.slice(0, 1).toUpperCase()))
}

export function systemIconPath(id: string): string {
  const path = `${ICON_BASE}/system/ui_${id}.png`
  const char = SYSTEM_CHARS[id] ?? id.slice(0, 1).toUpperCase()
  return iconUrls[path] ?? placeholderSvg(id, char)
}

export function qualityFramePath(quality: string): string {
  const path = `${ICON_BASE}/frames/frame_quality_${quality}.png`
  return iconUrls[path] ?? ''
}
