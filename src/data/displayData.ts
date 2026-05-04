import type { BoneSlot, Faction, Quality, SpiritSeries } from '@/types/game'

export const factionLabels: Record<Faction | 'public', string> = {
  wuhundian: '武魂殿',
  tiandou: '天斗帝国',
  xingluo: '星罗帝国',
  public: '公共区域',
}

export const factionDescriptions: Record<Faction, string> = {
  wuhundian: '大陆中心势力，资源充足，适合追求强势成长。',
  tiandou: '北方帝国，底蕴深厚，适合稳扎稳打。',
  xingluo: '南方帝国，尚武成风，适合挑战高压战斗。',
}

export const seriesLabels: Record<SpiritSeries, string> = {
  strength: '强攻系',
  agility: '敏攻系',
  intelligence: '控制系',
}

export const qualityLabels: Record<Quality, string> = {
  white: '普通',
  green: '精良',
  blue: '稀有',
  purple: '史诗',
  orange: '传说',
  red: '神话',
}

export const boneSlotLabels: Record<BoneSlot, string> = {
  head: '头部魂骨',
  torso: '躯干魂骨',
  leftArm: '左臂魂骨',
  rightArm: '右臂魂骨',
  leftLeg: '左腿魂骨',
  rightLeg: '右腿魂骨',
  external: '外附魂骨',
}

export const mapLabels: Record<string, string> = {
  miluo_lake: '迷罗湖',
  xingdou_outer: '星斗外围',
  shengtianya: '圣天崖',
  tongtian_cave: '通天洞',
  xingdou_edge: '星斗边缘',
  tasi_grassland: '塔斯草原',
  xingdou_center: '星斗中心',
  tianqing_lake: '天青湖',
  slaughter_city: '杀戮之都',
  haotian_sect: '昊天宗',
  seagod_island: '海神岛',
  ice_forest: '冰封森林',
}

export const itemLabels: Record<string, { name: string; desc: string }> = {
  hp_potion_s: { name: '初级回血药', desc: '恢复 80 点生命值，适合日常狩猎。' },
  hp_potion_m: { name: '中级回血药', desc: '恢复 200 点生命值，适合挑战精英魂兽。' },
  hp_potion_l: { name: '高级回血药', desc: '恢复 500 点生命值，适合高难度战斗。' },
  mp_potion_s: { name: '初级回魂药', desc: '恢复 60 点魂力。' },
  mp_potion_m: { name: '中级回魂药', desc: '恢复 150 点魂力。' },
  mp_potion_l: { name: '高级回魂药', desc: '恢复 400 点魂力。' },
  scroll_s1: { name: '低级附魂石', desc: '使用后第一魂环年限 +100，需要先拥有第一魂环。' },
  scroll_m1: { name: '中级附魂石', desc: '使用后第一魂环年限 +500，需要先拥有第一魂环。' },
  forget_stone: { name: '忘魂石', desc: '重置魂环技能选择。' },
  moon_stone: { name: '月光石', desc: '用于真身与高阶魂技突破。' },
  qingling_stone: { name: '青灵石', desc: '基础锻造材料。' },
  deep_sea_silver: { name: '深海银母', desc: '中阶锻造材料。' },
  fierce_gunpowder: { name: '烈焰火药', desc: '暗器与爆发类装备材料。' },
  bodhi_leaf: { name: '菩提叶', desc: '高阶锻造与炼化材料。' },
  ancient_scroll: { name: '上古秘卷', desc: '魂骨合成与高阶强化材料。' },
  domain_shard: { name: '领域碎晶', desc: '用于领域类能力强化。' },
  spirit_pill: { name: '灵力丹', desc: '补充双生武魂灵力。' },
  ring_random: { name: '随机魂环', desc: '使用后获得一份随机魂环资源。' },
  bone_fragment: { name: '魂骨碎片', desc: '收集后可合成随机魂骨。' },
  god_fragment: { name: '神位碎片', desc: '极稀有的神位传承材料。' },
  exp_potion_s: { name: '初级经验药水', desc: '使用后获得 500 经验。' },
  exp_potion_m: { name: '中级经验药水', desc: '使用后获得 2000 经验。' },
  exp_potion_l: { name: '高级经验药水', desc: '使用后获得 8000 经验。' },
  allheal_potion: { name: '全面恢复药水', desc: '完全恢复生命与魂力。' },
  atk_scroll: { name: '攻击卷轴', desc: '短时间提升攻击能力。' },
  def_scroll: { name: '防御卷轴', desc: '短时间提升防御能力。' },
  lucky_charm: { name: '幸运符', desc: '提升稀有掉落概率。' },
}

export const commonSpiritNames: Record<string, string> = {
  haotian_hammer: '昊天锤',
  bluetyrant_dragon: '蓝电霸王龙',
  qisha_sword: '七杀剑',
  white_tiger: '邪眸白虎',
  golden_dragon: '黄金圣龙',
  titan_ape: '泰坦巨猿',
  darkgold_bear: '暗金恐爪熊',
  blood_axe: '血魂斧',
  soft_bone_rabbit: '柔骨兔',
  hell_cat: '幽冥灵猫',
  six_wing_angel: '六翼天使',
  fire_phoenix: '火凤凰',
  ghost_cat: '鬼灵猫',
  wind_leopard: '风影豹',
  lightning_falcon: '电光隼',
  bluesilver_emperor: '蓝银皇',
  bluesilver_grass: '蓝银草',
  nine_heart_hibiscus: '九心海棠',
  nine_treasure_glaze: '九宝琉璃塔',
  seven_treasure_glaze: '七宝琉璃塔',
  snake_staff: '蛇杖',
  mystic_turtle: '玄武龟',
  sugar_bean: '糖豆',
}

export const skillTypeLabels: Record<string, string> = {
  damage: '伤害',
  buff: '增益',
  debuff: '削弱',
  heal: '治疗',
  control: '控制',
}

export function displayName(id: string, fallback: string): string {
  return commonSpiritNames[id] ?? itemLabels[id]?.name ?? fallback
}

export function statLabel(key: string): string {
  const labels: Record<string, string> = {
    str: '力量',
    agi: '敏捷',
    int: '智力',
    vit: '体质',
    atk: '攻击',
    def: '防御',
    maxHp: '生命',
    mp: '魂力',
    critRate: '暴击',
    dodgeRate: '闪避',
    atkSpeed: '攻速',
  }
  return labels[key] ?? key
}
