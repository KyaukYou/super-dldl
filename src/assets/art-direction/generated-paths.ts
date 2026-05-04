const generatedUrls = import.meta.glob('/src/assets/generated/**/*.png', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>

const uiGeneratedUrls = import.meta.glob('/src/assets/ui_generated/**/*.png', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>

const GENERATED_BASE = '/src/assets/generated'
const UI_GENERATED_BASE = '/src/assets/ui_generated'

function generatedUrl(path: string): string {
  return generatedUrls[path] ?? path
}

function uiGeneratedUrl(path: string): string {
  return uiGeneratedUrls[path] ?? path
}

export function generatedButtonPath(id: string): string {
  return generatedUrl(`${GENERATED_BASE}/buttons/button_${id}.png`)
}

export function generatedBattleUiPath(id: string): string {
  return generatedUrl(`${GENERATED_BASE}/battle_ui/battle_button_${id}.png`)
}

export function generatedSectPath(id: string): string {
  return generatedUrl(`${GENERATED_BASE}/sect/sect_${id}.png`)
}

export function generatedPortraitPath(id: string): string {
  return generatedUrl(`${GENERATED_BASE}/portraits/portrait_${id}.png`)
}

export function generatedFighterPath(id: string): string {
  return generatedUrl(`${GENERATED_BASE}/fighters/fighter_${id}.png`)
}

export function generatedBeastPortraitPath(id: string): string {
  return generatedUrl(`${GENERATED_BASE}/beasts/portraits/beast_portrait_${id}.png`)
}

export function generatedBeastBattlePath(id: string): string {
  return generatedUrl(`${GENERATED_BASE}/beasts/battle/beast_battle_${id}.png`)
}

export function generatedItemPath(id: string): string {
  return generatedUrl(`${GENERATED_BASE}/items/item_${id}.png`)
}

export function generatedSkillPath(id: string): string {
  return generatedUrl(`${GENERATED_BASE}/skills/skill_${id}.png`)
}

export function generatedSkillEffectPath(id: string): string {
  return generatedUrl(`${GENERATED_BASE}/skills/effect_skill_${id}.png`)
}

export function cityLuxuryButtonPath(id: string): string {
  return uiGeneratedUrl(`${UI_GENERATED_BASE}/city_buttons_luxury/city_button_luxury_${id}.png`)
}

export const generatedButtons = {
  awaken: generatedButtonPath('awaken'),
  challenge: generatedButtonPath('challenge'),
  claimAll: generatedButtonPath('claim_all'),
  close: generatedUrl(`${GENERATED_BASE}/buttons/button_close_cutout.png`),
  deploy: generatedButtonPath('deploy'),
  enhance: generatedButtonPath('enhance'),
  exchange: generatedButtonPath('exchange'),
  exit: generatedButtonPath('exit'),
  goTo: generatedButtonPath('go_to'),
  joinSect: generatedButtonPath('join_sect'),
  register: generatedButtonPath('register'),
  synthesize: generatedButtonPath('synthesize'),
}

export const generatedBattleUiButtons = {
  attack: generatedBattleUiPath('attack'),
  auto: generatedBattleUiPath('auto'),
  escape: generatedBattleUiPath('escape'),
}

export const generatedSectImages = {
  contributionBadge: generatedSectPath('contribution_badge'),
  mainHall: generatedSectPath('main_hall'),
  missionHall: generatedSectPath('mission_hall'),
  recruitmentOrder: generatedSectPath('recruitment_order'),
  shop: generatedSectPath('shop'),
  totem: generatedSectPath('totem'),
  trainingGround: generatedSectPath('training_ground'),
  warBanner: generatedSectPath('war_banner'),
}

export const generatedNpcPortraits = {
  arenaReferee: generatedPortraitPath('arena_referee_male_01'),
  sectElder: generatedPortraitPath('sect_elder_male_01'),
  sectMaster: generatedPortraitPath('sect_master_male_01'),
  shopkeeper: generatedPortraitPath('shopkeeper_male_01'),
}

export const generatedFighters = {
  arenaReferee: generatedFighterPath('arena_referee_male_01'),
  playerSwordMaster: generatedFighterPath('sword_master_male_01'),
  shopkeeper: generatedFighterPath('shopkeeper_male_01'),
  sectElder: generatedFighterPath('sect_elder_male_01'),
  sectMaster: generatedFighterPath('sect_master_male_01'),
}

export const cityLuxuryButtons = {
  blue: cityLuxuryButtonPath('blue'),
  bronze: cityLuxuryButtonPath('bronze'),
  darkgold: cityLuxuryButtonPath('darkgold'),
  gold: cityLuxuryButtonPath('gold'),
  green: cityLuxuryButtonPath('green'),
  purple: cityLuxuryButtonPath('purple'),
  red: cityLuxuryButtonPath('red'),
  silver: cityLuxuryButtonPath('silver'),
}
