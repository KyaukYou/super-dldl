import type { InventoryItem } from '@/types/game'
import { spiritRingColorForYear, spiritRingLabel } from './spiritRingDrops'

const RING_TIER_LABELS = {
  white: '十年',
  yellow: '百年',
  purple: '千年',
  black: '万年',
  red: '十万年',
} as const

export interface InventoryUsageHint {
  title: string
  text: string
}

export function inventoryUsageHints(item: InventoryItem | null | undefined): InventoryUsageHint[] {
  if (!item) return []

  if (item.itemId === 'bone_fragment') {
    const required = 3
    const owned = item.quantity
    const missing = Math.max(0, required - owned)
    return [
      { title: '合成规则', text: `${required}个魂骨碎片可合成1个随机魂骨。` },
      { title: '当前进度', text: missing > 0 ? `已收集${owned}/${required}，还差${missing}个。` : `已收集${owned}/${required}，材料已足够。` },
      { title: '使用方式', text: '在背包详情里直接点击“合成魂骨”，会自动装备到空魂骨位。' },
    ]
  }

  if (item.itemId === 'ancient_scroll') {
    return [
      { title: '用途', text: '高阶魂骨打造材料，可直接合成1件高阶随机魂骨。' },
      { title: '使用方式', text: '在背包详情里点击“合成高阶魂骨”，会自动装备到空魂骨位。' },
    ]
  }

  if (item.itemId === 'ring_random') {
    return [
      { title: '用途', text: '随机魂环礼包类道具，不等同于可直接吸收的魂环。' },
      { title: '提示', text: '真正可吸收的魂环会显示具体年份，并在详情里出现“吸收魂环”。' },
    ]
  }

  if (item.itemId.startsWith('spirit_ring_')) {
    const year = typeof item.year === 'number' && item.year > 0 ? Math.floor(item.year) : null
    const tier = year ? RING_TIER_LABELS[spiritRingColorForYear(year)] : spiritRingLabel(item.itemId).replace('魂环', '')
    return [
      { title: '魂环年份', text: year ? `${year}年，对应${tier}魂环。` : `默认按${tier}魂环处理。` },
      { title: '吸收入口', text: '背包详情中点击“吸收魂环”，然后选择要绑定的魂技。' },
    ]
  }

  return []
}
