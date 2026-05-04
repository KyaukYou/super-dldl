import type { BoneDef, BoneSlot, InventoryItem } from '@/types/game'

export const BONE_FRAGMENT_COST = 3
export const ANCIENT_SCROLL_COST = 1

export type BoneCraftRecipeId = 'bone_fragment_random' | 'ancient_scroll_random'

export interface BoneCraftRecipe {
  id: BoneCraftRecipeId
  sourceItemId: string
  requiredQuantity: number
  resultQuality: 'green' | 'blue' | 'purple' | 'orange'
  title: string
}

export const BONE_CRAFT_RECIPES: Record<BoneCraftRecipeId, BoneCraftRecipe> = {
  bone_fragment_random: {
    id: 'bone_fragment_random',
    sourceItemId: 'bone_fragment',
    requiredQuantity: BONE_FRAGMENT_COST,
    resultQuality: 'blue',
    title: '随机魂骨',
  },
  ancient_scroll_random: {
    id: 'ancient_scroll_random',
    sourceItemId: 'ancient_scroll',
    requiredQuantity: ANCIENT_SCROLL_COST,
    resultQuality: 'purple',
    title: '高阶随机魂骨',
  },
}

export function inventoryItemCount(inventory: Pick<InventoryItem, 'itemId' | 'quantity' | 'year'>[], itemId: string): number {
  return inventory.find((item) => item.itemId === itemId && item.year === undefined)?.quantity ?? 0
}

export function firstOpenBoneSlot(equippedBones: Record<BoneSlot, string | null>): BoneSlot | null {
  const order: BoneSlot[] = ['head', 'torso', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg', 'external']
  return order.find((slot) => !equippedBones[slot]) ?? null
}

export function canCraftBoneRecipe(
  recipe: BoneCraftRecipe,
  inventory: Pick<InventoryItem, 'itemId' | 'quantity' | 'year'>[],
  equippedBones: Record<BoneSlot, string | null>,
): boolean {
  return inventoryItemCount(inventory, recipe.sourceItemId) >= recipe.requiredQuantity && firstOpenBoneSlot(equippedBones) !== null
}

export function chooseCraftedBone(
  recipe: BoneCraftRecipe,
  bones: BoneDef[],
  targetSlot: BoneSlot,
  seed: number,
): BoneDef | null {
  const candidates = bones.filter((bone) => bone.slot === targetSlot && bone.quality === recipe.resultQuality)
  const fallback = bones.filter((bone) => bone.slot === targetSlot)
  const pool = candidates.length > 0 ? candidates : fallback
  if (pool.length === 0) return null

  const normalizedSeed = Math.abs(Math.floor(seed))
  return pool[normalizedSeed % pool.length] ?? null
}
