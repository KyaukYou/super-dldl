import {
  generatedBeastPortraitPath,
  generatedNpcPortraits,
  generatedSkillEffectPath,
  generatedSkillPath,
} from '@/assets/art-direction/generated-paths'

import charPlayerCutout from '@/assets/battle/cutouts/char_player_cutout.png?url'
import monsterDeerCutout from '@/assets/battle/cutouts/monster_deer_cutout.png?url'
import monsterRhinoCutout from '@/assets/battle/cutouts/monster_rhino_cutout.png?url'
import monsterSpiderCutout from '@/assets/battle/cutouts/monster_spider_cutout.png?url'
import monsterTreeCutout from '@/assets/battle/cutouts/monster_tree_cutout.png?url'
import monsterWolfCutout from '@/assets/battle/cutouts/monster_wolf_cutout.png?url'

export type BattleTextureKey =
  | 'char_player'
  | 'monster_bat'
  | 'monster_blackwater_dragon'
  | 'monster_boss'
  | 'monster_crane'
  | 'monster_deer'
  | 'monster_guard'
  | 'monster_red_flame_ape'
  | 'monster_rhino'
  | 'monster_serpent'
  | 'monster_spider'
  | 'monster_tiger'
  | 'monster_tree'
  | 'monster_wolf'

export type BattleEffectKey =
  | 'effect_skill_burst'
  | 'effect_skill_cast_windup'
  | 'effect_skill_hit'
  | 'skill_defense_shield'
  | 'skill_fire_slash'
  | 'skill_group_buff'
  | 'skill_healing_holy_light'
  | 'skill_ice_seal_control'
  | 'skill_phoenix_impact'
  | 'skill_sword_sweep'
  | 'skill_thunder_pierce'

export const battleTextureSources: Record<BattleTextureKey, string> = {
  char_player: charPlayerCutout,
  monster_bat: generatedBeastPortraitPath('abyss_bat_leader'),
  monster_blackwater_dragon: generatedBeastPortraitPath('blackwater_dragon'),
  monster_boss: generatedBeastPortraitPath('cave_demon_bear'),
  monster_crane: generatedBeastPortraitPath('thunder_eagle'),
  monster_deer: monsterDeerCutout,
  monster_guard: generatedNpcPortraits.arenaReferee,
  monster_red_flame_ape: generatedBeastPortraitPath('red_flame_ape'),
  monster_rhino: monsterRhinoCutout,
  monster_serpent: generatedBeastPortraitPath('mandala_serpent'),
  monster_spider: monsterSpiderCutout,
  monster_tiger: generatedBeastPortraitPath('flame_lion'),
  monster_tree: monsterTreeCutout,
  monster_wolf: monsterWolfCutout,
}

export const battleEffectSources: Record<BattleEffectKey, string> = {
  effect_skill_burst: generatedSkillEffectPath('burst'),
  effect_skill_cast_windup: generatedSkillEffectPath('cast_windup'),
  effect_skill_hit: generatedSkillEffectPath('hit'),
  skill_defense_shield: generatedSkillPath('defense_shield'),
  skill_fire_slash: generatedSkillPath('fire_slash'),
  skill_group_buff: generatedSkillPath('group_buff'),
  skill_healing_holy_light: generatedSkillPath('healing_holy_light'),
  skill_ice_seal_control: generatedSkillPath('ice_seal_control'),
  skill_phoenix_impact: generatedSkillPath('phoenix_impact'),
  skill_sword_sweep: generatedSkillPath('sword_sweep'),
  skill_thunder_pierce: generatedSkillPath('thunder_pierce'),
}

type MonsterPortraitMap = Partial<Record<string, string>>

const monsterPortraits: MonsterPortraitMap = {
  face_spider: generatedBeastPortraitPath('soul_devour_spider'),
  ghost_spider: generatedBeastPortraitPath('soul_devour_spider'),
  blood_spider_king: generatedBeastPortraitPath('soul_devour_spider'),
  mist_deer: generatedBeastPortraitPath('star_pattern_deer'),
  spirit_deer: generatedBeastPortraitPath('star_pattern_deer'),
  fire_rhino: generatedBeastPortraitPath('ice_armor_turtle'),
  fire_rhino2: generatedBeastPortraitPath('ice_armor_turtle'),
  storm_bull: generatedBeastPortraitPath('ice_armor_turtle'),
  rot_tree: generatedBeastPortraitPath('thousand_year_tree_demon'),
  wind_wolf: generatedBeastPortraitPath('ghost_wolf'),
  bamboo_serpent: generatedBeastPortraitPath('mandala_serpent'),
  nine_jade: generatedBeastPortraitPath('mandala_serpent'),
  sky_python: generatedBeastPortraitPath('blackwater_dragon'),
  sea_dragon: generatedBeastPortraitPath('blackwater_dragon'),
  long_beak_crane: generatedBeastPortraitPath('thunder_eagle'),
  eagle_demon: generatedBeastPortraitPath('thunder_eagle'),
  snow_crane: generatedBeastPortraitPath('thunder_eagle'),
  golden_tiger: generatedBeastPortraitPath('flame_lion'),
  dark_panther: generatedBeastPortraitPath('flame_lion'),
  ice_tiger: generatedBeastPortraitPath('flame_lion'),
  shadow_bat: generatedBeastPortraitPath('abyss_bat_leader'),
  titan_ape: generatedBeastPortraitPath('red_flame_ape'),
  pope_guard: generatedNpcPortraits.arenaReferee,
  pope_guard2: generatedNpcPortraits.arenaReferee,
  flying_marshal: generatedNpcPortraits.arenaReferee,
  flying_marshal2: generatedNpcPortraits.arenaReferee,
  underworld_guard: generatedNpcPortraits.sectElder,
  blood_guard: generatedNpcPortraits.sectElder,
  hammer_guardian: generatedNpcPortraits.sectMaster,
  fuyao: generatedBeastPortraitPath('cave_demon_bear'),
  deep_whale: generatedBeastPortraitPath('cave_demon_bear'),
  holy_phoenix: generatedBeastPortraitPath('red_flame_ape'),
}

export function battlePortraitForMonster(monsterId: string, textureKey: string): string {
  return monsterPortraits[monsterId]
    ?? generatedNpcPortraits.arenaReferee
    ?? textureKey
}

export function battleEffectForSkill(skillId: string, skillType: string): BattleEffectKey {
  if (skillId.includes('thunder')) return 'skill_thunder_pierce'
  if (skillId.includes('phoenix') || skillId.includes('fire')) return 'skill_phoenix_impact'
  if (skillId.includes('ice')) return 'skill_ice_seal_control'
  if (skillType === 'heal') return 'skill_healing_holy_light'
  if (skillType === 'buff') return 'skill_group_buff'
  if (skillType === 'control') return 'effect_skill_cast_windup'
  if (skillType === 'debuff') return 'skill_defense_shield'
  return 'skill_sword_sweep'
}
