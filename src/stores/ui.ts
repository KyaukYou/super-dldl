import { defineStore } from 'pinia'
import { ref, shallowRef, type Component } from 'vue'
import { audioManager } from '@/game/audio/audioManager'

export type PanelName =
  | 'city'
  | 'character' | 'bag' | 'spirit' | 'skill'
  | 'bone' | 'codex' | 'sect' | 'quest' | 'rank'
  | 'arena' | 'worldMap' | 'shop' | 'smithy'
  | 'academy' | 'settings' | null

export type UiLogChannel = 'system' | 'hint' | 'world' | 'battle'

export interface UiLogLine {
  id: number
  channel: UiLogChannel
  text: string
  time: string
}

type PhaserGameLike = {
  scene?: {
    isActive?: (key: string) => boolean
    stop?: (key: string) => void
    start?: (key: string) => void
  }
}

let nextLogId = 1

function createLogLine(channel: UiLogChannel, text: string): UiLogLine {
  return {
    id: nextLogId++,
    channel,
    text,
    time: new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' }),
  }
}

function getPhaserGame(): PhaserGameLike | null {
  return (window as Window & { __phaserGame?: PhaserGameLike }).__phaserGame ?? null
}

function isBattleSceneActive(game: PhaserGameLike | null): boolean {
  return game?.scene?.isActive?.('BattleScene') ?? false
}

function stopBattleAndReturnToCityScene(game: PhaserGameLike | null) {
  if (!game?.scene?.stop || !game.scene.start) return
  window.requestAnimationFrame(() => {
    game.scene?.stop?.('BattleScene')
    window.requestAnimationFrame(() => {
      game.scene?.start?.('GameScene')
    })
  })
}

export const useUIStore = defineStore('ui', () => {
  const currentPanel = ref<PanelName>('city')
  const currentPanelComponent = shallowRef<Component | null>(null)
  const chatExpanded = ref(true)
  const isCreatingCharacter = ref(true)
  const activeLogChannel = ref<UiLogChannel | 'all'>('all')
  const logs = ref<UiLogLine[]>([
    createLogLine('system', '\u6b22\u8fce\u6765\u5230\u6597\u7f57\u5927\u9646\uff0c\u65b0\u7684\u5192\u9669\u5df2\u7ecf\u5f00\u59cb\u3002'),
    createLogLine('hint', '\u70b9\u51fb\u4e16\u754c\u5730\u56fe\u9009\u62e9\u9b42\u517d\uff0c\u6570\u5b57 1-9 \u53ef\u91ca\u653e\u5df2\u88c5\u5907\u9b42\u6280\u3002'),
  ])

  async function openPanel(panel: PanelName) {
    if (currentPanel.value === panel && currentPanelComponent.value) return
    audioManager.playClick()
    stopActiveBattleForPanel(panel)
    currentPanel.value = panel
    currentPanelComponent.value = panel ? await loadPanelComponent(panel) : null
    if (panel === 'city') audioManager.playCityBgm()
  }

  async function closePanel() {
    await openPanel('city')
  }

  function hidePanel() {
    audioManager.playClick()
    currentPanel.value = null
    currentPanelComponent.value = null
  }

  function stopActiveBattleForPanel(panel: PanelName) {
    const game = getPhaserGame()
    if (!isBattleSceneActive(game)) return
    pushLog('battle', panel ? '\u5df2\u79bb\u5f00\u6218\u6597\uff0c\u5f53\u524d\u6218\u6597\u7ed3\u675f\u3002' : '\u6218\u6597\u754c\u9762\u5df2\u6536\u8d77\u3002')
    stopBattleAndReturnToCityScene(game)
    audioManager.playCityBgm()
  }

  function pushLog(channel: UiLogChannel, text: string) {
    logs.value.push(createLogLine(channel, text))
    if (logs.value.length > 80) logs.value.splice(0, logs.value.length - 80)
  }

  function setLogChannel(channel: UiLogChannel | 'all') {
    activeLogChannel.value = channel
  }

  async function loadPanelComponent(panel: Exclude<PanelName, null>): Promise<Component> {
    const map: Record<string, () => Promise<{ default: Component }>> = {
      city: () => import('@/ui/panels/CityPanel.vue'),
      character: () => import('@/ui/panels/CharacterPanel.vue'),
      bag: () => import('@/ui/panels/BagPanel.vue'),
      spirit: () => import('@/ui/panels/SpiritPanel.vue'),
      skill: () => import('@/ui/panels/SkillPanel.vue'),
      bone: () => import('@/ui/panels/BonePanel.vue'),
      codex: () => import('@/ui/panels/CodexPanel.vue'),
      quest: () => import('@/ui/panels/QuestPanel.vue'),
      rank: () => import('@/ui/panels/RankPanel.vue'),
      arena: () => import('@/ui/panels/ArenaPanel.vue'),
      sect: () => import('@/ui/panels/SectPanel.vue'),
      worldMap: () => import('@/ui/panels/WorldMapPanel.vue'),
      shop: () => import('@/ui/panels/ShopPanel.vue'),
      smithy: () => import('@/ui/panels/SmithyPanel.vue'),
      academy: () => import('@/ui/panels/AcademyPanel.vue'),
      settings: () => import('@/ui/panels/SettingsPanel.vue'),
    }
    const loader = map[panel]
    if (loader) {
      const module = await loader()
      return module.default
    }
    const { defineComponent, h } = await import('vue')
    return defineComponent({
      render() {
        return h('div', { class: 'panel-base p-4 w-80' }, `${panel} \u5f00\u53d1\u4e2d...`)
      },
    })
  }

  return {
    currentPanel,
    currentPanelComponent,
    chatExpanded,
    isCreatingCharacter,
    activeLogChannel,
    logs,
    openPanel,
    closePanel,
    hidePanel,
    pushLog,
    setLogChannel,
  }
})
