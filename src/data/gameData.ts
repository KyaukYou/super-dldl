import type {
  Faction, SpiritDef, SkillDef, MapDef, ItemDef, BoneDef,
} from '@/types/game'
import {
  boneIconPath,
  itemIconPath,
  skillIconPath,
  spiritIconPath,
} from '@/assets/art-direction/icon-paths'

// ============================================================
// 阵营
// ============================================================
export const FACTIONS: { id: Faction; name: string; desc: string }[] = [
  { id: 'wuhundian', name: '武魂殿', desc: '大陆中心，势力最强' },
  { id: 'tiandou', name: '天斗帝国', desc: '大陆北部，底蕴深厚' },
  { id: 'xingluo', name: '星罗帝国', desc: '大陆南部，尚武之风' },
]

// ============================================================
// 武魂表 —— 105+ 种，覆盖力量/敏捷/智力三系
// 每个武魂有唯一天赋、独特基础属性
// 来源：斗罗大陆1-4部原著 + e侠页游 + 贴吧补全
// ============================================================
export const SPIRITS: SpiritDef[] = [

  // ==================== 力量系 (35种) ====================
  // 特点：高攻击、高血量、高护甲，技能威力大

  { id: 'haotian_hammer',   name: '昊天锤',       series: 'strength', innatePower: 10, talent: '技能威力极大幅度增加，天下第一器武魂', baseStats: { str: 24, agi: 6, int: 4, vit: 16 } },
  { id: 'bluetyrant_dragon',name: '蓝电霸王龙',   series: 'strength', innatePower: 10, talent: '每十级身体局部龙化，雷霆之力翻倍，大陆第一兽武魂', baseStats: { str: 22, agi: 8, int: 6, vit: 14 } },
  { id: 'qisha_sword',      name: '七杀剑',       series: 'strength', innatePower: 9, talent: '极大幅度增加攻击力，剑气震八方，攻击封号斗罗', baseStats: { str: 25, agi: 7, int: 5, vit: 12 } },
  { id: 'white_tiger',      name: '邪眸白虎',     series: 'strength', innatePower: 9, talent: '超强前排防御，提升抗性，攻防一体', baseStats: { str: 20, agi: 7, int: 5, vit: 18 } },
  { id: 'golden_dragon',    name: '黄金圣龙',     series: 'strength', innatePower: 9, talent: '三龙合一之神级武魂，光属性龙威压制', baseStats: { str: 21, agi: 9, int: 7, vit: 15 } },
  { id: 'titan_ape',        name: '泰坦巨猿',     series: 'strength', innatePower: 8, talent: '体型巨大，力大无穷，重力控制领域', baseStats: { str: 23, agi: 5, int: 4, vit: 20 } },
  { id: 'darkgold_bear',    name: '暗金恐爪熊',   series: 'strength', innatePower: 8, talent: '撕天裂地，恐怖攻击范围，力量与暴击兼备', baseStats: { str: 22, agi: 8, int: 4, vit: 16 } },
  { id: 'blood_axe',        name: '血魂斧',       series: 'strength', innatePower: 7, talent: '致命一击概率大幅增加，奇迹图腾优势', baseStats: { str: 21, agi: 7, int: 5, vit: 14 } },
  { id: 'moon_blade',       name: '月刃',         series: 'strength', innatePower: 7, talent: '力量系利器，致命一击，灵动而不失威猛', baseStats: { str: 20, agi: 9, int: 5, vit: 12 } },
  { id: 'armored_rhino',    name: '板甲犀牛',     series: 'strength', innatePower: 7, talent: '防御之王，板甲护体，浴血奋战核心', baseStats: { str: 15, agi: 4, int: 4, vit: 24 } },
  { id: 'redgold_lion',     name: '赤金狮',       series: 'strength', innatePower: 7, talent: '黄金狮王血脉，王者威严，攻防俱佳', baseStats: { str: 19, agi: 8, int: 5, vit: 15 } },
  { id: 'blood_tiger',      name: '血虎',         series: 'strength', innatePower: 7, talent: '嗜血狂暴，生命越低攻击越高', baseStats: { str: 21, agi: 7, int: 4, vit: 14 } },
  { id: 'diamond_mammoth',  name: '钻石猛犸',     series: 'strength', innatePower: 7, talent: '钻石般坚硬防御，冰属性范围冲击', baseStats: { str: 18, agi: 4, int: 4, vit: 22 } },
  { id: 'big_ape',          name: '巨猿',         series: 'strength', innatePower: 6, talent: '力大无穷，血厚防高', baseStats: { str: 20, agi: 5, int: 3, vit: 18 } },
  { id: 'earth_king',       name: '大地之王',     series: 'strength', innatePower: 6, talent: '土系力量，岩浆之力，控制与伤害兼顾', baseStats: { str: 19, agi: 5, int: 5, vit: 17 } },
  { id: 'iron_bull',        name: '铁角牛',       series: 'strength', innatePower: 6, talent: '铁角冲撞，防御坚韧，反击伤害', baseStats: { str: 17, agi: 4, int: 3, vit: 20 } },
  { id: 'golden_croc',      name: '黄金鳄',       series: 'strength', innatePower: 6, talent: '黄金鳄王，咬合力惊人，水陆双栖', baseStats: { str: 20, agi: 5, int: 4, vit: 17 } },
  { id: 'hungry_bear',      name: '饥饿狂熊',     series: 'strength', innatePower: 6, talent: '按血量排序有优势，狂暴时战力飙升', baseStats: { str: 18, agi: 4, int: 4, vit: 19 } },
  { id: 'flame_lion',       name: '火焰狮',       series: 'strength', innatePower: 6, talent: '火焰狮王，烈焰附体，灼烧伤害', baseStats: { str: 18, agi: 7, int: 5, vit: 15 } },
  { id: 'war_tiger',        name: '战虎',         series: 'strength', innatePower: 6, talent: '战场猛虎，越战越勇，持续作战能力强', baseStats: { str: 19, agi: 6, int: 4, vit: 16 } },
  { id: 'demon_tiger',      name: '暗魔邪神虎',   series: 'strength', innatePower: 8, talent: '邪神之力，黑暗属性，兼具力量的邪恶顶级武魂', baseStats: { str: 22, agi: 8, int: 6, vit: 15 } },
  { id: 'copper_bull',      name: '铜牛',         series: 'strength', innatePower: 5, talent: '铜皮铁骨，坚实可靠', baseStats: { str: 17, agi: 4, int: 3, vit: 20 } },
  { id: 'tremor_axe',       name: '震天斧',       series: 'strength', innatePower: 6, talent: '开天辟地之威，范围震击', baseStats: { str: 21, agi: 5, int: 3, vit: 15 } },
  { id: 'white_earth_dragon',name:'白家地龙',     series: 'strength', innatePower: 5, talent: '地龙血脉，土系防御', baseStats: { str: 16, agi: 4, int: 3, vit: 18 } },
  { id: 'cyclops',          name: '独眼巨人',     series: 'strength', innatePower: 6, talent: '独眼之力，精神与物理双重打击', baseStats: { str: 19, agi: 3, int: 6, vit: 17 } },
  { id: 'tyrant_dragon',    name: '霸王龙',       series: 'strength', innatePower: 7, talent: '远古霸王，纯粹力量碾压', baseStats: { str: 23, agi: 5, int: 3, vit: 16 } },
  { id: 'black_dragon',     name: '金眼黑龙王',   series: 'strength', innatePower: 9, talent: '黑暗龙王，龙族至尊之一，毁灭之力', baseStats: { str: 22, agi: 7, int: 7, vit: 15 } },
  { id: 'frenzy_rhino',     name: '狂犀',         series: 'strength', innatePower: 5, talent: '狂怒冲锋，势不可挡', baseStats: { str: 18, agi: 5, int: 3, vit: 18 } },
  { id: 'fearsome_bull',    name: '饕餮神牛',     series: 'strength', innatePower: 7, talent: '饕餮血脉，吞噬之力', baseStats: { str: 20, agi: 4, int: 5, vit: 17 } },
  { id: 'scaled_beast',     name: '麟甲兽',       series: 'strength', innatePower: 6, talent: '麒麟血脉稀薄分支，鳞甲防御', baseStats: { str: 17, agi: 5, int: 4, vit: 19 } },
  { id: 'gale_rhino',       name: '火云犀甲牛',   series: 'strength', innatePower: 6, talent: '火云犀甲，烈焰防御，反伤灼烧', baseStats: { str: 16, agi: 6, int: 4, vit: 18 } },
  { id: 'ghost_tiger',      name: '鬼虎',         series: 'strength', innatePower: 6, talent: '幽冥虎族，暗影之力，突袭利器', baseStats: { str: 19, agi: 8, int: 4, vit: 13 } },
  { id: 'explosive_dragon', name: '独角爆龙',     series: 'strength', innatePower: 7, talent: '独角爆破，龙息烈焰', baseStats: { str: 21, agi: 6, int: 5, vit: 14 } },
  { id: 'big_rhino',        name: '板甲巨犀',     series: 'strength', innatePower: 6, talent: '巨型犀牛，坚不可摧', baseStats: { str: 16, agi: 3, int: 3, vit: 23 } },
  { id: 'golden_armor_dragon',name:'黄金龙',      series: 'strength', innatePower: 8, talent: '黄金龙族，元素亲和，龙威浩荡', baseStats: { str: 20, agi: 7, int: 6, vit: 15 } },

  // ==================== 敏捷系 (35种) ====================
  // 特点：高闪避、高暴击、高攻速，灵动飘逸

  { id: 'soft_bone_rabbit', name: '柔骨兔',       series: 'agility', innatePower: 9, talent: '近身缠斗之王，无敌金身，八段摔', baseStats: { str: 8, agi: 24, int: 6, vit: 10 } },
  { id: 'hell_cat',         name: '幽冥灵猫',     series: 'agility', innatePower: 8, talent: '幽冥属性，极速刺杀，暴击出众', baseStats: { str: 9, agi: 23, int: 5, vit: 9 } },
  { id: 'six_wing_angel',   name: '六翼天使',     series: 'agility', innatePower: 10, talent: '神级武魂，神圣属性，全能均衡，天使领域', baseStats: { str: 14, agi: 20, int: 12, vit: 12 } },
  { id: 'fire_phoenix',     name: '火凤凰',       series: 'agility', innatePower: 9, talent: '百鸟之王，浴火重生，凤凰领域', baseStats: { str: 12, agi: 22, int: 8, vit: 10 } },
  { id: 'ghost_cat',        name: '鬼灵猫',       series: 'agility', innatePower: 7, talent: '敏捷度极高，暴击和闪避出众', baseStats: { str: 6, agi: 25, int: 5, vit: 8 } },
  { id: 'wind_leopard',     name: '风豹',         series: 'agility', innatePower: 7, talent: '疾风之速，撕裂攻击，移速加成', baseStats: { str: 10, agi: 22, int: 4, vit: 10 } },
  { id: 'lightning_falcon', name: '电光隼',       series: 'agility', innatePower: 7, talent: '电光石火，鹰眼锁定，必中要害', baseStats: { str: 9, agi: 23, int: 5, vit: 9 } },
  { id: 'starfish',         name: '海星',         series: 'agility', innatePower: 6, talent: '增加回避概率和眩晕免疫', baseStats: { str: 5, agi: 20, int: 8, vit: 12 } },
  { id: 'lone_wolf',        name: '独狼',         series: 'agility', innatePower: 6, talent: '孤高之狼，按闪避排序有优势，单体爆发', baseStats: { str: 10, agi: 21, int: 4, vit: 10 } },
  { id: 'swift_swallow',    name: '尖尾雨燕',     series: 'agility', innatePower: 7, talent: '空中霸主，极致速度，闪避之王', baseStats: { str: 7, agi: 24, int: 5, vit: 9 } },
  { id: 'lightning_rabbit', name: '闪电兔',       series: 'agility', innatePower: 6, talent: '疾电之速，弹跳惊人', baseStats: { str: 7, agi: 23, int: 5, vit: 10 } },
  { id: 'storm_wolf',       name: '疾风魔狼',     series: 'agility', innatePower: 7, talent: '疾风双头，风暴之力，狼群领袖', baseStats: { str: 11, agi: 21, int: 5, vit: 10 } },
  { id: 'ghost_panther',    name: '鬼影豹皇',     series: 'agility', innatePower: 8, talent: '鬼影重重，豹皇之速，暗杀之王', baseStats: { str: 10, agi: 23, int: 5, vit: 9 } },
  { id: 'monkey',           name: '灵猴',         series: 'agility', innatePower: 5, talent: '灵动跳跃，闪避极高', baseStats: { str: 8, agi: 22, int: 5, vit: 10 } },
  { id: 'flash_bird',       name: '闪鸟',         series: 'agility', innatePower: 6, talent: '闪烁瞬移，出其不意', baseStats: { str: 6, agi: 23, int: 6, vit: 9 } },
  { id: 'purple_falcon',    name: '紫玉隼',       series: 'agility', innatePower: 6, talent: '紫玉之羽，剧毒撕裂', baseStats: { str: 9, agi: 22, int: 5, vit: 9 } },
  { id: 'pink_lady',        name: '粉红娘娘',     series: 'agility', innatePower: 5, talent: '魅惑迷幻，毒素攻击', baseStats: { str: 6, agi: 21, int: 7, vit: 10 } },
  { id: 'wind_bell',        name: '风铃鸟',       series: 'agility', innatePower: 5, talent: '风铃之声，音波攻击，扰乱心神', baseStats: { str: 5, agi: 20, int: 8, vit: 10 } },
  { id: 'shadow',           name: '暗影',         series: 'agility', innatePower: 7, talent: '暗影之力，黑夜主宰，隐身刺杀', baseStats: { str: 8, agi: 22, int: 6, vit: 9 } },
  { id: 'bat_king',         name: '吸血蝙蝠王',   series: 'agility', innatePower: 6, talent: '吸血回复，超声波探测，夜行王者', baseStats: { str: 9, agi: 21, int: 6, vit: 10 } },
  { id: 'swift_wolf',       name: '迅狼',         series: 'agility', innatePower: 6, talent: '迅捷如风，团队协作', baseStats: { str: 10, agi: 21, int: 4, vit: 10 } },
  { id: 'silver_wolf',      name: '银月狼王',     series: 'agility', innatePower: 7, talent: '银月之力，狼王威严', baseStats: { str: 11, agi: 21, int: 5, vit: 10 } },
  { id: 'three_eye_fox',    name: '三眼魔狐',     series: 'agility', innatePower: 7, talent: '三眼之力，幻术与速度兼备', baseStats: { str: 8, agi: 20, int: 8, vit: 9 } },
  { id: 'lightning_marten', name: '闪电貂',       series: 'agility', innatePower: 6, talent: '闪电之速，剧毒獠牙', baseStats: { str: 7, agi: 23, int: 5, vit: 9 } },
  { id: 'ghost_wolf',       name: '幽冥狼',       series: 'agility', innatePower: 6, talent: '幽冥气息，隐形潜行', baseStats: { str: 9, agi: 22, int: 5, vit: 9 } },
  { id: 'thunder_eagle',    name: '雷鹰',         series: 'agility', innatePower: 7, talent: '雷霆之鹰，空中霸主，雷电急速', baseStats: { str: 10, agi: 22, int: 5, vit: 9 } },
  { id: 'purple_lion',      name: '紫影狮',       series: 'agility', innatePower: 6, talent: '紫影重重，狮王速度', baseStats: { str: 12, agi: 20, int: 4, vit: 10 } },
  { id: 'jade_monkey',      name: '碧海灵猿',     series: 'agility', innatePower: 6, talent: '碧海灵巧，水陆双栖', baseStats: { str: 9, agi: 21, int: 5, vit: 10 } },
  { id: 'colorful_cat',     name: '七彩猫',       series: 'agility', innatePower: 5, talent: '七彩幻影，迷惑敌人', baseStats: { str: 6, agi: 22, int: 6, vit: 9 } },
  { id: 'bee_hummingbird',  name: '剑喙蜂鸟',     series: 'agility', innatePower: 5, talent: '蜂鸟之速，剑喙穿刺', baseStats: { str: 7, agi: 23, int: 4, vit: 9 } },
  { id: 'phantom',          name: '魅影',         series: 'agility', innatePower: 6, talent: '虚幻之影，魅惑心神', baseStats: { str: 6, agi: 22, int: 7, vit: 9 } },
  { id: 'soul_swallow',     name: '追魂燕',       series: 'agility', innatePower: 6, talent: '追魂夺命，锁定追击', baseStats: { str: 8, agi: 22, int: 5, vit: 9 } },
  { id: 'sacred_angel',     name: '神圣天使',     series: 'agility', innatePower: 9, talent: '神圣之光，净化邪恶，天使族裔', baseStats: { str: 12, agi: 19, int: 13, vit: 12 } },
  { id: 'light_phoenix',    name: '光明凤凰',     series: 'agility', innatePower: 8, talent: '光明之焰，圣洁涅槃', baseStats: { str: 10, agi: 21, int: 10, vit: 11 } },
  { id: 'dark_soul_tiger',  name: '六翼魔虎',     series: 'agility', innatePower: 7, talent: '六翼魔虎，暗黑飞行，魔性速度', baseStats: { str: 13, agi: 20, int: 6, vit: 10 } },

  // ==================== 智力系 (35种) ====================
  // 特点：高魂技伤害、控制能力强、治疗/辅助

  { id: 'bluesilver_emperor',name:'蓝银皇',       series: 'intelligence', innatePower: 9, talent: '控制之王，蓝银领域，所有控制技能效果增益', baseStats: { str: 6, agi: 7, int: 24, vit: 10 } },
  { id: 'bluesilver_grass', name: '蓝银草',       series: 'intelligence', innatePower: 3, talent: '初始武魂，坚韧不屈，可进化为蓝银皇', baseStats: { str: 5, agi: 4, int: 14, vit: 8 } },
  { id: 'nine_heart_hibiscus',name:'九心海棠',    series: 'intelligence', innatePower: 8, talent: '绝对治疗，回复能力极强，治疗系第一武魂', baseStats: { str: 4, agi: 5, int: 25, vit: 13 } },
  { id: 'nine_treasure_glaze',name:'九宝琉璃塔',  series: 'intelligence', innatePower: 9, talent: '天下第一辅助武魂，百分比全属性增幅', baseStats: { str: 4, agi: 6, int: 25, vit: 11 } },
  { id: 'seven_treasure_glaze',name:'七宝琉璃塔', series: 'intelligence', innatePower: 7, talent: '七宝增幅，辅助利器', baseStats: { str: 4, agi: 5, int: 22, vit: 10 } },
  { id: 'snake_staff',      name: '蛇杖',         series: 'intelligence', innatePower: 7, talent: '眩晕技能时间大幅增加，技能伤害效果增益', baseStats: { str: 6, agi: 5, int: 23, vit: 11 } },
  { id: 'mystic_turtle',    name: '玄龟',         series: 'intelligence', innatePower: 7, talent: '护甲大倍数提高，攻击力减弱，束缚免疫', baseStats: { str: 8, agi: 3, int: 21, vit: 20 } },
  { id: 'sugar_bean',       name: '糖豆',         series: 'intelligence', innatePower: 6, talent: '食物系，加血和加魂力技能效果增益', baseStats: { str: 5, agi: 5, int: 24, vit: 11 } },
  { id: 'sunflower',        name: '太阳花',       series: 'intelligence', innatePower: 9, talent: '免疫一切控制！智力系神级防御被动', baseStats: { str: 5, agi: 7, int: 23, vit: 10 } },
  { id: 'bread',            name: '面包',         series: 'intelligence', innatePower: 6, talent: '食物系，生命和魂力回复速度类技能有奇效', baseStats: { str: 4, agi: 5, int: 22, vit: 12 } },
  { id: 'mars_star',        name: '火星',         series: 'intelligence', innatePower: 6, talent: '星体武魂，攻击力按百分比提升，加攻击类技能增益', baseStats: { str: 6, agi: 5, int: 23, vit: 10 } },
  { id: 'dream_shatter',    name: '残梦',         series: 'intelligence', innatePower: 6, talent: '眩晕技能效果大幅提升，护甲降低', baseStats: { str: 4, agi: 5, int: 24, vit: 9 } },
  { id: 'orange_gem',       name: '橙宝石',       series: 'intelligence', innatePower: 6, talent: '护甲按百分比提升，技能伤害效果增益', baseStats: { str: 5, agi: 5, int: 23, vit: 11 } },
  { id: 'ocean_gem',        name: '海蓝宝石',     series: 'intelligence', innatePower: 5, talent: '护甲按百分比提升，普通伤害效果大幅增益', baseStats: { str: 4, agi: 5, int: 22, vit: 12 } },
  { id: 'flame_thorn',      name: '赤炎荆棘',     series: 'intelligence', innatePower: 7, talent: '降低被眩晕时间，智力大幅提升，反伤效果', baseStats: { str: 6, agi: 5, int: 23, vit: 12 } },
  { id: 'carrot',           name: '萝卜',         series: 'intelligence', innatePower: 5, talent: '食物系，对所有影响人物属性的技能效果提升', baseStats: { str: 5, agi: 5, int: 21, vit: 10 } },
  { id: 'sky_green_vine',   name: '天青藤',       series: 'intelligence', innatePower: 6, talent: '缠绕免疫，缠绕技能效果大幅提升', baseStats: { str: 5, agi: 5, int: 22, vit: 11 } },
  { id: 'yellow_gem',       name: '黄宝石',       series: 'intelligence', innatePower: 5, talent: '护甲按百分比提升，加力量技能效果大幅增益', baseStats: { str: 6, agi: 4, int: 21, vit: 12 } },
  { id: 'twin_rings',       name: '一对圆环',     series: 'intelligence', innatePower: 6, talent: '攻击力按百分比加成，闪避概率加大', baseStats: { str: 5, agi: 8, int: 22, vit: 9 } },
  { id: 'silver_needle',    name: '银针',         series: 'intelligence', innatePower: 5, talent: '加血加魂力技能有奇效，普通伤害下降', baseStats: { str: 4, agi: 6, int: 22, vit: 10 } },
  { id: 'luo_sanpao',       name: '罗三炮',       series: 'intelligence', innatePower: 5, talent: '魂力之盾时间大幅提高，防御型智力武魂', baseStats: { str: 5, agi: 6, int: 20, vit: 14 } },
  { id: 'sausage',          name: '香肠',         series: 'intelligence', innatePower: 7, talent: '食物系至尊，各类食物魂技效果大幅强化', baseStats: { str: 4, agi: 5, int: 23, vit: 11 } },
  { id: 'biluo_snake',      name: '碧磷蛇皇',     series: 'intelligence', innatePower: 8, talent: '剧毒之王，持续毒素伤害，毒性魂技效果翻倍', baseStats: { str: 7, agi: 7, int: 23, vit: 12 } },
  { id: 'death_spider',     name: '死亡蛛皇',     series: 'intelligence', innatePower: 9, talent: '死亡领域，蛛皇毒噬，暗属性智力顶级武魂', baseStats: { str: 8, agi: 6, int: 24, vit: 13 } },
  { id: 'medusa',           name: '美杜莎',       series: 'intelligence', innatePower: 8, talent: '石化凝视，蛇发女妖，控制与伤害并存', baseStats: { str: 6, agi: 7, int: 23, vit: 11 } },
  { id: 'sky_python',       name: '天青牛蟒',     series: 'intelligence', innatePower: 9, talent: '天青之力，迟钝领域，控制与辅助', baseStats: { str: 10, agi: 6, int: 22, vit: 15 } },
  { id: 'ghost_vine',       name: '鬼藤',         series: 'intelligence', innatePower: 6, talent: '鬼藤缠绕，吸血寄生，控制型植物武魂', baseStats: { str: 5, agi: 6, int: 21, vit: 11 } },
  { id: 'wondrous_chrysanthemum',name:'奇茸通天菊',series:'intelligence', innatePower:7, talent:'仙草武魂，通天之能，攻防一体', baseStats:{ str:7, agi:6, int:22, vit:12 } },
  { id: 'biluo_nine_flower',name:'碧磷九绝花',   series: 'intelligence', innatePower: 7, talent: '九绝奇毒，九种毒素效果', baseStats: { str: 5, agi: 5, int: 23, vit: 11 } },
  { id: 'snow_lotus',       name: '雪莲',         series: 'intelligence', innatePower: 6, talent: '冰雪净化，治疗增益', baseStats: { str: 4, agi: 5, int: 22, vit: 12 } },
  { id: 'octagon_ice',      name: '八角玄冰草',   series: 'intelligence', innatePower: 7, talent: '极致之冰，冻结万物', baseStats: { str: 5, agi: 6, int: 23, vit: 10 } },
  { id: 'ruyi_plate',       name: '如意盘',       series: 'intelligence', innatePower: 6, talent: '如意随心，反弹伤害，多功能辅助', baseStats: { str: 5, agi: 5, int: 21, vit: 13 } },
  { id: 'sea_god',          name: '海神',         series: 'intelligence', innatePower: 10, talent: '海神之力，海洋领域，神级武魂', baseStats: { str: 12, agi: 8, int: 24, vit: 14 } },
  { id: 'angel_god',        name: '天使神',       series: 'intelligence', innatePower: 10, talent: '天使之神，神圣净化，神级武魂', baseStats: { str: 8, agi: 10, int: 25, vit: 13 } },
  { id: 'god_of_cook',      name: '食神',         series: 'intelligence', innatePower: 9, talent: '食物系终极武魂，治疗和增益效果翻倍', baseStats: { str: 5, agi: 6, int: 24, vit: 12 } },
].map((spirit) => ({
  ...spirit,
  icon: spiritIconPath(spirit.id),
})) as SpiritDef[]

// ============================================================
// 魂技表 —— 315+ 魂技，每个魂环位 3-5 个可选
// 力量/敏捷/智力三系各 9 环 × 3~5 技能
// 每个武魂的每个魂环位不会出现相同技能
// ============================================================
export const SKILLS: SkillDef[] = [

  // ==================== 力量系 第1魂环 ====================
  { id: 'miracle_totem',    name: '神迹图腾',     series: 'strength', type: 'buff',   description: '8秒内攻击力提升800%', cooldown: 30, ringSlot: 1, mpCost: 30, statBuff: { stat: 'atk', multiplier: 8.0, duration: 8 } },
  { id: 'power_surge',      name: '力量涌动',     series: 'strength', type: 'buff',   description: '6秒内攻击力提升500%，附带20%吸血', cooldown: 25, ringSlot: 1, mpCost: 25, statBuff: { stat: 'atk', multiplier: 5.0, duration: 6 } },
  { id: 'war_cry',          name: '战吼',         series: 'strength', type: 'debuff', description: '降低周围敌人防御30%，持续5秒', cooldown: 20, ringSlot: 1, mpCost: 20, statDebuff: { stat: 'def', multiplier: 0.7, duration: 5 } },
  { id: 'titan_hammer',     name: '泰坦之锤',     series: 'strength', type: 'damage', description: '昊天锤专属，造成300%攻击力伤害，附带击退', cooldown: 18, ringSlot: 1, mpCost: 25, damageMultiplier: 3.0 },
  { id: 'thunder_claw',     name: '雷霆龙爪',     series: 'strength', type: 'damage', description: '蓝电霸王龙专属，龙爪附着雷电造成250%伤害', cooldown: 16, ringSlot: 1, mpCost: 22, damageMultiplier: 2.5 },

  // ==================== 力量系 第2魂环 ====================
  { id: 'blood_fight',      name: '浴血奋战',     series: 'strength', type: 'damage', description: '使对方受到自身血量值35%的伤害', cooldown: 20, ringSlot: 2, mpCost: 30, damageMultiplier: 0.35 },
  { id: 'crushing_blow',    name: '碎裂重击',     series: 'strength', type: 'damage', description: '造成280%攻击力的单次重击', cooldown: 18, ringSlot: 2, mpCost: 22, damageMultiplier: 2.8 },
  { id: 'iron_will',        name: '钢铁意志',     series: 'strength', type: 'buff',   description: '8秒内防御翻倍，免疫控制', cooldown: 22, ringSlot: 2, mpCost: 25, statBuff: { stat: 'def', multiplier: 2.0, duration: 8 } },
  { id: 'tiger_protect',    name: '白虎护身障',   series: 'strength', type: 'buff',   description: '白虎专属，5秒内减免50%伤害并反弹20%', cooldown: 20, ringSlot: 2, mpCost: 28, statBuff: { stat: 'def', multiplier: 2.0, duration: 5 } },
  { id: 'thunder_fury',     name: '雷霆万钧',     series: 'strength', type: 'damage', description: '大面积雷电，造成220%伤害', cooldown: 20, ringSlot: 2, mpCost: 28, damageMultiplier: 2.2 },

  // ==================== 力量系 第3魂环 ====================
  { id: 'fire_eye',         name: '火眼金睛',     series: 'strength', type: 'buff',   description: '大幅提高暴击率50%，持续10秒', cooldown: 15, ringSlot: 3, mpCost: 20, statBuff: { stat: 'critRate', multiplier: 2.5, duration: 10 } },
  { id: 'berserk',          name: '狂暴',         series: 'strength', type: 'buff',   description: '10秒内攻速提升100%，攻击提升30%', cooldown: 25, ringSlot: 3, mpCost: 22, statBuff: { stat: 'atkSpeed', multiplier: 2.0, duration: 10 } },
  { id: 'thunder_smash',    name: '雷霆猛击',     series: 'strength', type: 'damage', description: '对目标及周围造成220%攻击伤害', cooldown: 16, ringSlot: 3, mpCost: 20, damageMultiplier: 2.2 },
  { id: 'tiger_vajra',      name: '白虎金刚变',   series: 'strength', type: 'buff',   description: '白虎专属，15秒内攻击和防御各+60%', cooldown: 28, ringSlot: 3, mpCost: 30, statBuff: { stat: 'atk', multiplier: 1.6, duration: 15 } },
  { id: 'thunder_rage',     name: '雷霆之怒',     series: 'strength', type: 'buff',   description: '龙化手臂，攻击和雷霆均提升100%', cooldown: 26, ringSlot: 3, mpCost: 28, statBuff: { stat: 'atk', multiplier: 2.0, duration: 10 } },

  // ==================== 力量系 第4魂环 ====================
  { id: 'death_pact',       name: '死神契约',     series: 'strength', type: 'debuff', description: '降低目标防御50%，持续8秒', cooldown: 18, ringSlot: 4, mpCost: 22, statDebuff: { stat: 'def', multiplier: 0.5, duration: 8 } },
  { id: 'soul_crush',       name: '碎魂击',       series: 'strength', type: 'damage', description: '无视40%防御造成320%攻击伤害', cooldown: 20, ringSlot: 4, mpCost: 28, damageMultiplier: 3.2 },
  { id: 'fortress',         name: '不动要塞',     series: 'strength', type: 'buff',   description: '15秒内减免50%伤害', cooldown: 28, ringSlot: 4, mpCost: 30, statBuff: { stat: 'def', multiplier: 2.0, duration: 15 } },
  { id: 'tiger_meteor',     name: '白虎流星雨',   series: 'strength', type: 'damage', description: '白虎专属，范围流星攻击280%伤害', cooldown: 22, ringSlot: 4, mpCost: 32, damageMultiplier: 2.8 },
  { id: 'dark_evil_thunder',name: '暗魔邪雷怒',   series: 'strength', type: 'damage', description: '暗魔邪神虎专属，邪雷爆裂350%伤害', cooldown: 24, ringSlot: 4, mpCost: 35, damageMultiplier: 3.5 },

  // ==================== 力量系 第5魂环 ====================
  { id: 'dragon_armor',     name: '龙甲拳',       series: 'strength', type: 'buff',   description: '防御型技能，大幅提升防御100%，持续12秒', cooldown: 22, ringSlot: 5, mpCost: 28, statBuff: { stat: 'def', multiplier: 2.0, duration: 12 } },
  { id: 'earthquake',       name: '大地震击',     series: 'strength', type: 'damage', description: '全屏范围伤害，附带1秒眩晕', cooldown: 24, ringSlot: 5, mpCost: 35, damageMultiplier: 2.4, controlDuration: 1 },
  { id: 'life_steal',       name: '嗜血',         series: 'strength', type: 'buff',   description: '12秒内攻击附带35%吸血', cooldown: 20, ringSlot: 5, mpCost: 22, statBuff: { stat: 'atk', multiplier: 1.3, duration: 12 } },
  { id: 'thunder_hell',     name: '雷霆地狱',     series: 'strength', type: 'damage', description: '范围内雷暴，持续伤害300%', cooldown: 28, ringSlot: 5, mpCost: 35, damageMultiplier: 3.0 },
  { id: 'tiger_demon',      name: '白虎魔神变',   series: 'strength', type: 'buff',   description: '白虎专属，全属性提升40%，持续15秒', cooldown: 35, ringSlot: 5, mpCost: 40, statBuff: { stat: 'atk', multiplier: 1.4, duration: 15 } },

  // ==================== 力量系 第6魂环 ====================
  { id: 'power_essence',    name: '力量要领',     series: 'strength', type: 'buff',   description: '按百分比加攻击60%，持续12秒', cooldown: 16, ringSlot: 6, mpCost: 24, statBuff: { stat: 'atk', multiplier: 1.6, duration: 12 } },
  { id: 'annihilate',       name: '歼灭',         series: 'strength', type: 'damage', description: '对单体造成550%攻击伤害', cooldown: 30, ringSlot: 6, mpCost: 40, damageMultiplier: 5.5 },
  { id: 'war_god',          name: '战神降临',     series: 'strength', type: 'buff',   description: '20秒内全属性提升50%', cooldown: 45, ringSlot: 6, mpCost: 50, statBuff: { stat: 'atk', multiplier: 1.5, duration: 20 } },
  { id: 'thunder_breath',   name: '蓝电龙吐息',   series: 'strength', type: 'damage', description: '蓝电霸王龙专属，龙息雷电400%伤害', cooldown: 28, ringSlot: 6, mpCost: 38, damageMultiplier: 4.0 },
  { id: 'tiger_massacre',   name: '白虎破灭杀',   series: 'strength', type: 'damage', description: '白虎终极单体技，500%伤害穿透', cooldown: 32, ringSlot: 6, mpCost: 42, damageMultiplier: 5.0 },

  // ==================== 力量系 第7魂环 ====================
  { id: 'rage_blood',       name: '怪力血液',     series: 'strength', type: 'buff',   description: '按血量百分比加攻击40%，持续15秒', cooldown: 20, ringSlot: 7, mpCost: 25, statBuff: { stat: 'atk', multiplier: 1.4, duration: 15 } },
  { id: 'titan_fist',       name: '泰坦之拳',     series: 'strength', type: 'damage', description: '造成目标最大生命值25%伤害', cooldown: 22, ringSlot: 7, mpCost: 35, damageMultiplier: 0.25 },
  { id: 'unyielding',       name: '不屈意志',     series: 'strength', type: 'buff',   description: '受到致命伤害时保留1点生命并无敌3秒', cooldown: 60, ringSlot: 7, mpCost: 50, statBuff: { stat: 'def', multiplier: 10.0, duration: 3 } },
  { id: 'dragon_true_body', name: '霸王龙真身',   series: 'strength', type: 'buff',   description: '化身百米巨龙，全能力三倍，持续18秒', cooldown: 60, ringSlot: 7, mpCost: 60, statBuff: { stat: 'atk', multiplier: 3.0, duration: 18 } },
  { id: 'axe_true_body',    name: '昊天真身',     series: 'strength', type: 'buff',   description: '昊天锤真身，攻击力提升200%', cooldown: 55, ringSlot: 7, mpCost: 55, statBuff: { stat: 'atk', multiplier: 3.0, duration: 15 } },

  // ==================== 力量系 第8魂环 ====================
  { id: 'laser',            name: '激光',         series: 'strength', type: 'damage', description: '直线贯穿伤害350%，对付免晕极佳', cooldown: 12, ringSlot: 8, mpCost: 18, damageMultiplier: 3.5 },
  { id: 'doom_slash',       name: '末日斩',       series: 'strength', type: 'damage', description: '全屏高额伤害450%', cooldown: 35, ringSlot: 8, mpCost: 48, damageMultiplier: 4.5 },
  { id: 'dragon_roar',      name: '龙啸',         series: 'strength', type: 'debuff', description: '龙威震慑，降低全屏敌人攻防40%', cooldown: 30, ringSlot: 8, mpCost: 38, statDebuff: { stat: 'atk', multiplier: 0.6, duration: 10 } },
  { id: 'thunder_god',      name: '雷神附体',     series: 'strength', type: 'buff',   description: '蓝电霸王龙专属，全属性大幅提升80%', cooldown: 45, ringSlot: 8, mpCost: 50, statBuff: { stat: 'atk', multiplier: 1.8, duration: 12 } },
  { id: 'sword_true_body',  name: '七杀真身',     series: 'strength', type: 'buff',   description: '化身巨人剑客，攻击力提升250%', cooldown: 55, ringSlot: 8, mpCost: 55, statBuff: { stat: 'atk', multiplier: 3.5, duration: 12 } },

  // ==================== 力量系 第9魂环 ====================
  { id: 'heavenly_blow',    name: '白虎开天击',   series: 'strength', type: 'damage', description: '白虎终极奥义，600%攻击伤害', cooldown: 45, ringSlot: 9, mpCost: 60, damageMultiplier: 6.0 },
  { id: 'dragon_descend',   name: '真龙降临',     series: 'strength', type: 'damage', description: '召唤蓝电霸王龙虚影，全屏800%伤害', cooldown: 60, ringSlot: 9, mpCost: 80, damageMultiplier: 8.0 },
  { id: 'god_demon_slash',  name: '神魔两斩',     series: 'strength', type: 'damage', description: '七杀剑终极奥义，极致的650%单体伤害', cooldown: 50, ringSlot: 9, mpCost: 65, damageMultiplier: 6.5 },
  { id: 'hammer_kill_realm',name: '杀戮结界',     series: 'strength', type: 'damage', description: '昊天锤终极奥义，范围700%伤害+2秒眩晕', cooldown: 60, ringSlot: 9, mpCost: 75, damageMultiplier: 7.0, controlDuration: 2 },
  { id: 'thunder_judge',    name: '雷霆审判',     series: 'strength', type: 'damage', description: '天雷审判，单体750%伤害，无视防御', cooldown: 55, ringSlot: 9, mpCost: 70, damageMultiplier: 7.5 },

  // ==================== 敏捷系 第1魂环 ====================
  { id: 'exhaust_domain',   name: '竭力领域',     series: 'agility', type: 'debuff', description: '降低对方全属性15%，持续10秒', cooldown: 25, ringSlot: 1, mpCost: 22, statDebuff: { stat: 'atk', multiplier: 0.85, duration: 10 } },
  { id: 'swift_shadow',     name: '疾影',         series: 'agility', type: 'buff',   description: '8秒内攻击速度提升80%', cooldown: 20, ringSlot: 1, mpCost: 18, statBuff: { stat: 'atkSpeed', multiplier: 1.8, duration: 8 } },
  { id: 'poison_sting',     name: '毒刺',         series: 'agility', type: 'damage', description: '造成170%伤害并附带中毒（每秒10%持续3秒）', cooldown: 15, ringSlot: 1, mpCost: 15, damageMultiplier: 1.7 },
  { id: 'waist_bow',        name: '腰弓',         series: 'agility', type: 'damage', description: '柔骨兔专属，近身投技造成200%伤害', cooldown: 14, ringSlot: 1, mpCost: 16, damageMultiplier: 2.0 },
  { id: 'angel_assault',    name: '天使突击',     series: 'agility', type: 'damage', description: '六翼天使专属，神圣能量拳击220%伤害', cooldown: 16, ringSlot: 1, mpCost: 20, damageMultiplier: 2.2 },

  // ==================== 敏捷系 第2魂环 ====================
  { id: 'death_strike',     name: '死神之袭',     series: 'agility', type: 'damage', description: '高爆发伤害280%攻击力', cooldown: 18, ringSlot: 2, mpCost: 22, damageMultiplier: 2.8 },
  { id: 'shadow_step',      name: '影步',         series: 'agility', type: 'buff',   description: '瞬间闪避所有攻击5秒', cooldown: 22, ringSlot: 2, mpCost: 20, statBuff: { stat: 'dodgeRate', multiplier: 10.0, duration: 5 } },
  { id: 'blade_dance',      name: '刀刃之舞',     series: 'agility', type: 'damage', description: '对目标连续攻击3次，每次120%伤害', cooldown: 16, ringSlot: 2, mpCost: 18, damageMultiplier: 3.6 },
  { id: 'charm',            name: '魅惑',         series: 'agility', type: 'control', description: '柔骨兔专属，魅惑目标2秒', cooldown: 18, ringSlot: 2, mpCost: 15, controlDuration: 2 },
  { id: 'void_wings',       name: '虚无之翼',     series: 'agility', type: 'buff',   description: '六翼天使专属，虚无状态免疫物理攻击5秒', cooldown: 25, ringSlot: 2, mpCost: 25, statBuff: { stat: 'dodgeRate', multiplier: 10.0, duration: 5 } },

  // ==================== 敏捷系 第3魂环 ====================
  { id: 'flying_swallow',   name: '凌波飞燕',     series: 'agility', type: 'buff',   description: '提升闪避率40%，持续10秒', cooldown: 14, ringSlot: 3, mpCost: 16, statBuff: { stat: 'dodgeRate', multiplier: 2.0, duration: 10 } },
  { id: 'assassinate',      name: '暗杀',         series: 'agility', type: 'damage', description: '暗影刺杀，造成400%暴击伤害', cooldown: 20, ringSlot: 3, mpCost: 25, damageMultiplier: 4.0 },
  { id: 'wind_walk',        name: '风行',         series: 'agility', type: 'buff',   description: '10秒内闪避率提升至80%', cooldown: 25, ringSlot: 3, mpCost: 22, statBuff: { stat: 'dodgeRate', multiplier: 5.0, duration: 10 } },
  { id: 'teleport',         name: '瞬移',         series: 'agility', type: 'buff',   description: '柔骨兔专属，瞬间移动至目标身旁', cooldown: 12, ringSlot: 3, mpCost: 10, statBuff: { stat: 'atkSpeed', multiplier: 1.5, duration: 3 } },
  { id: 'phoenix_fire',     name: '凤翼天翔',     series: 'agility', type: 'buff',   description: '火凤凰专属，火焰翅膀飞行，攻击+100%', cooldown: 22, ringSlot: 3, mpCost: 28, statBuff: { stat: 'atk', multiplier: 2.0, duration: 12 } },

  // ==================== 敏捷系 第4魂环 ====================
  { id: 'stealth',          name: '隐身术',       series: 'agility', type: 'buff',   description: '隐身6秒，破隐一击必定暴击', cooldown: 30, ringSlot: 4, mpCost: 28, statBuff: { stat: 'critRate', multiplier: 5.0, duration: 6 } },
  { id: 'phantom_blade',    name: '幻影刃',       series: 'agility', type: 'damage', description: '幻影分身攻击，造成320%伤害', cooldown: 22, ringSlot: 4, mpCost: 26, damageMultiplier: 3.2 },
  { id: 'venom_rain',       name: '毒雨',         series: 'agility', type: 'damage', description: '范围毒素伤害，持续掉血8秒', cooldown: 24, ringSlot: 4, mpCost: 30, damageMultiplier: 2.5 },
  { id: 'golden_body',      name: '无敌金身',     series: 'agility', type: 'buff',   description: '柔骨兔专属，3秒绝对防御免疫一切', cooldown: 40, ringSlot: 4, mpCost: 40, statBuff: { stat: 'def', multiplier: 100.0, duration: 3 } },
  { id: 'phoenix_sky_attack',name:'凤凰啸天击',   series: 'agility', type: 'damage', description: '火凤凰专属，范围眩晕+350%灼烧伤害', cooldown: 28, ringSlot: 4, mpCost: 35, damageMultiplier: 3.5, controlDuration: 1.5 },

  // ==================== 敏捷系 第5魂环 ====================
  { id: 'invisible_mask',   name: '掩面无形',     series: 'agility', type: 'buff',   description: '降低被命中概率50%，持续12秒', cooldown: 16, ringSlot: 5, mpCost: 18, statBuff: { stat: 'dodgeRate', multiplier: 3.0, duration: 12 } },
  { id: 'thousand_cuts',    name: '千刃斩',       series: 'agility', type: 'damage', description: '高速连斩5次，每次110%伤害', cooldown: 20, ringSlot: 5, mpCost: 28, damageMultiplier: 5.5 },
  { id: 'mirror_image',     name: '镜影分身',     series: 'agility', type: 'buff',   description: '召唤2个分身，分担50%伤害', cooldown: 28, ringSlot: 5, mpCost: 30, statBuff: { stat: 'def', multiplier: 2.0, duration: 10 } },
  { id: 'soft_bone_lock',   name: '柔骨锁',       series: 'agility', type: 'control', description: '柔骨兔专属，锁住目标3秒', cooldown: 20, ringSlot: 5, mpCost: 22, controlDuration: 3 },
  { id: 'phoenix_meteor',   name: '凤凰流星雨',   series: 'agility', type: 'damage', description: '火凤凰专属，大范围火流星380%伤害', cooldown: 32, ringSlot: 5, mpCost: 38, damageMultiplier: 3.8 },

  // ==================== 敏捷系 第6魂环 ====================
  { id: 'storm_slash',      name: '风暴鬼斩',     series: 'agility', type: 'damage', description: '范围伤害340%', cooldown: 20, ringSlot: 6, mpCost: 30, damageMultiplier: 3.4 },
  { id: 'shadow_kill',      name: '暗影杀',       series: 'agility', type: 'damage', description: '标记目标，8秒后爆发550%伤害', cooldown: 30, ringSlot: 6, mpCost: 35, damageMultiplier: 5.5 },
  { id: 'flash_dance',      name: '闪舞',         series: 'agility', type: 'buff',   description: '15秒内攻击必定暴击', cooldown: 45, ringSlot: 6, mpCost: 40, statBuff: { stat: 'critRate', multiplier: 10.0, duration: 15 } },
  { id: 'eight_stage_slam', name: '爆杀八段摔',   series: 'agility', type: 'damage', description: '柔骨兔终极连招，八段连击共600%伤害', cooldown: 40, ringSlot: 6, mpCost: 45, damageMultiplier: 6.0 },
  { id: 'angel_roar',       name: '天使咆哮',     series: 'agility', type: 'damage', description: '六翼天使专属，精神冲击大范围400%伤害', cooldown: 35, ringSlot: 6, mpCost: 42, damageMultiplier: 4.0 },

  // ==================== 敏捷系 第7魂环 ====================
  { id: 'cat_true_body',    name: '灵猫真身',     series: 'agility', type: 'buff',   description: '幽冥灵猫专属，全属性翻倍，持续15秒', cooldown: 55, ringSlot: 7, mpCost: 55, statBuff: { stat: 'atk', multiplier: 2.0, duration: 15 } },
  { id: 'phoenix_7head',    name: '七首火凤凰',   series: 'agility', type: 'buff',   description: '火凤凰真身，七首火凤，攻击力+200%', cooldown: 60, ringSlot: 7, mpCost: 60, statBuff: { stat: 'atk', multiplier: 3.0, duration: 18 } },
  { id: 'rabbit_true_body', name: '柔骨兔真身',   series: 'agility', type: 'buff',   description: '柔骨兔真身，分身7个自己，闪避+300%', cooldown: 50, ringSlot: 7, mpCost: 50, statBuff: { stat: 'dodgeRate', multiplier: 4.0, duration: 15 } },
  { id: 'angel_true_body',  name: '天使真身',     series: 'agility', type: 'buff',   description: '天使虚影合体，实力提升至封号斗罗级', cooldown: 60, ringSlot: 7, mpCost: 60, statBuff: { stat: 'atk', multiplier: 3.5, duration: 15 } },
  { id: 'ghost100_claw',    name: '幽冥百爪',     series: 'agility', type: 'damage', description: '幽冥灵猫连续百次爪击，共500%伤害', cooldown: 35, ringSlot: 7, mpCost: 42, damageMultiplier: 5.0 },

  // ==================== 敏捷系 第8魂环 ====================
  { id: 'ghost_fusion',     name: '幽冥影相连',   series: 'agility', type: 'buff',   description: '与影子融合，闪避+60%，持续12秒', cooldown: 28, ringSlot: 8, mpCost: 30, statBuff: { stat: 'dodgeRate', multiplier: 3.5, duration: 12 } },
  { id: 'phoenix_chain',    name: '凤凰弑心链',   series: 'agility', type: 'damage', description: '火凤凰专属，锁定目标480%伤害', cooldown: 32, ringSlot: 8, mpCost: 42, damageMultiplier: 4.8 },
  { id: 'angel_virtual',    name: '天使虚像',     series: 'agility', type: 'damage', description: '六翼天使专属，六翼散射500%伤害', cooldown: 38, ringSlot: 8, mpCost: 48, damageMultiplier: 5.0 },
  { id: 'moonlight_dance',  name: '月光',         series: 'agility', type: 'buff',   description: '柔骨兔专属，月之力提升全属性50%', cooldown: 35, ringSlot: 8, mpCost: 38, statBuff: { stat: 'atk', multiplier: 1.5, duration: 15 } },
  { id: 'phantom_possess',  name: '幽冥附体',     series: 'agility', type: 'buff',   description: '幽冥之力附体，攻击速度+150%', cooldown: 30, ringSlot: 8, mpCost: 32, statBuff: { stat: 'atkSpeed', multiplier: 2.5, duration: 12 } },

  // ==================== 敏捷系 第9魂环 ====================
  { id: 'phoenix_hellfire', name: '凤凰地狱火',   series: 'agility', type: 'damage', description: '极致火焰700%伤害，秒杀之力', cooldown: 60, ringSlot: 9, mpCost: 70, damageMultiplier: 7.0 },
  { id: 'angel_sun',        name: '太阳之力',     series: 'agility', type: 'damage', description: '六翼天使终极奥义，太阳真火650%伤害', cooldown: 55, ringSlot: 9, mpCost: 65, damageMultiplier: 6.5 },
  { id: 'rabbit_domain',    name: '柔媚领域',     series: 'agility', type: 'debuff', description: '柔骨兔终极领域，降低敌方全属性30%', cooldown: 40, ringSlot: 9, mpCost: 45, statDebuff: { stat: 'atk', multiplier: 0.7, duration: 15 } },
  { id: 'ghost_claw',       name: '幽冥神爪',     series: 'agility', type: 'damage', description: '幽冥灵猫终极技，贯穿伤害600%', cooldown: 50, ringSlot: 9, mpCost: 60, damageMultiplier: 6.0 },
  { id: 'phoenix_nirvana',  name: '凤凰涅槃',     series: 'agility', type: 'buff',   description: '浴火重生，满血复活并全属性+50%', cooldown: 120, ringSlot: 9, mpCost: 100, statBuff: { stat: 'atk', multiplier: 1.5, duration: 20 } },

  // ==================== 智力系 第1魂环 ====================
  { id: 'massacre',         name: '残杀',         series: 'intelligence', type: 'damage', description: '按目标当前生命值25%造成伤害（必备！）', cooldown: 22, ringSlot: 1, mpCost: 28, damageMultiplier: 0.25 },
  { id: 'spirit_burn',      name: '魂力燃烧',     series: 'intelligence', type: 'damage', description: '消耗自身10%蓝量造成320%攻击伤害', cooldown: 18, ringSlot: 1, mpCost: 15, damageMultiplier: 3.2 },
  { id: 'mind_barrier',     name: '心灵屏障',     series: 'intelligence', type: 'buff',   description: '8秒内减免40%伤害', cooldown: 20, ringSlot: 1, mpCost: 18, statBuff: { stat: 'def', multiplier: 1.67, duration: 8 } },
  { id: 'tangle',           name: '缠绕',         series: 'intelligence', type: 'control', description: '蓝银皇专属，蓝银草缠绕目标3秒', cooldown: 16, ringSlot: 1, mpCost: 15, controlDuration: 3 },
  { id: 'heal_sausage',     name: '恢复大香肠',   series: 'intelligence', type: 'heal',   description: '食物系，瞬间回复20%生命', cooldown: 15, ringSlot: 1, mpCost: 18, healAmount: 20 },

  // ==================== 智力系 第2魂环 ====================
  { id: 'exhaust_domain_i', name: '竭力领域',     series: 'intelligence', type: 'debuff', description: '降低对方全属性15%，持续10秒', cooldown: 25, ringSlot: 2, mpCost: 22, statDebuff: { stat: 'atk', multiplier: 0.85, duration: 10 } },
  { id: 'soul_drain',       name: '吸魂术',       series: 'intelligence', type: 'damage', description: '造成250%伤害并回复等量生命', cooldown: 18, ringSlot: 2, mpCost: 22, damageMultiplier: 2.5 },
  { id: 'ice_chain',        name: '冰链束缚',     series: 'intelligence', type: 'control', description: '冰冻目标3秒', cooldown: 20, ringSlot: 2, mpCost: 20, controlDuration: 3 },
  { id: 'parasite',         name: '寄生',         series: 'intelligence', type: 'control', description: '蓝银皇专属，种子寄生目标2.5秒', cooldown: 18, ringSlot: 2, mpCost: 18, controlDuration: 2.5 },
  { id: 'purify_sausage',   name: '解毒小腊肠',   series: 'intelligence', type: 'heal',   description: '食物系，解除负面状态并回复15%生命', cooldown: 12, ringSlot: 2, mpCost: 12, healAmount: 15 },

  // ==================== 智力系 第3魂环 ====================
  { id: 'soul_shield',      name: '魂力之盾',     series: 'intelligence', type: 'buff',   description: '吸收大量伤害的魂力护盾（最大HP40%）', cooldown: 20, ringSlot: 3, mpCost: 25, statBuff: { stat: 'def', multiplier: 3.0, duration: 8 } },
  { id: 'fire_storm',       name: '烈焰风暴',     series: 'intelligence', type: 'damage', description: '范围持续灼烧伤害280%', cooldown: 22, ringSlot: 3, mpCost: 28, damageMultiplier: 2.8 },
  { id: 'hypnosis',         name: '催眠术',       series: 'intelligence', type: 'control', description: '使目标沉睡4秒', cooldown: 25, ringSlot: 3, mpCost: 22, controlDuration: 4 },
  { id: 'spider_web',       name: '蛛网束缚',     series: 'intelligence', type: 'control', description: '蓝银皇专属，蛛网困住目标2秒+减速', cooldown: 20, ringSlot: 3, mpCost: 20, controlDuration: 2 },
  { id: 'fly_mushroom',     name: '急速飞行蘑菇肠',series:'intelligence', type:'buff',   description: '食物系，飞行能力+移速+80%', cooldown: 20, ringSlot: 3, mpCost: 22, statBuff: { stat: 'agi', multiplier: 1.8, duration: 8 } },

  // ==================== 智力系 第4魂环 ====================
  { id: 'projection',       name: '影射',         series: 'intelligence', type: 'damage', description: '分身投射，造成300%伤害', cooldown: 16, ringSlot: 4, mpCost: 22, damageMultiplier: 3.0 },
  { id: 'dark_contract',    name: '暗之契约',     series: 'intelligence', type: 'debuff', description: '降低目标攻击和智力40%', cooldown: 20, ringSlot: 4, mpCost: 25, statDebuff: { stat: 'atk', multiplier: 0.6, duration: 10 } },
  { id: 'healing_rain',     name: '治愈之雨',     series: 'intelligence', type: 'heal',   description: '持续回复自身及周围队友生命30%', cooldown: 22, ringSlot: 4, mpCost: 28, healAmount: 30 },
  { id: 'silver_cage',      name: '蓝银囚笼',     series: 'intelligence', type: 'control', description: '蓝银皇专属，大范围囚禁3秒', cooldown: 24, ringSlot: 4, mpCost: 28, controlDuration: 3 },
  { id: 'excite_sausage',   name: '亢奋粉红肠',   series: 'intelligence', type: 'buff',   description: '食物系，全属性+30%持续15秒', cooldown: 25, ringSlot: 4, mpCost: 30, statBuff: { stat: 'atk', multiplier: 1.3, duration: 15 } },

  // ==================== 智力系 第5魂环 ====================
  { id: 'invisible_mask_i', name: '掩面无形',     series: 'intelligence', type: 'buff',   description: '降低被命中概率50%，持续12秒', cooldown: 16, ringSlot: 5, mpCost: 18, statBuff: { stat: 'dodgeRate', multiplier: 3.0, duration: 12 } },
  { id: 'thunder_bolt',     name: '雷霆万钧',     series: 'intelligence', type: 'damage', description: '天雷召唤造成420%智力型伤害', cooldown: 24, ringSlot: 5, mpCost: 33, damageMultiplier: 4.2 },
  { id: 'purify',           name: '净化',         series: 'intelligence', type: 'heal',   description: '清除所有负面状态，回复30%生命', cooldown: 20, ringSlot: 5, mpCost: 22, healAmount: 30 },
  { id: 'domineer_gun',     name: '蓝银霸王枪',   series: 'intelligence', type: 'damage', description: '蓝银皇专属，单体贯穿380%伤害', cooldown: 22, ringSlot: 5, mpCost: 30, damageMultiplier: 3.8 },
  { id: 'copy_mirror_sausage',name:'复制镜像肠',  series: 'intelligence', type: 'buff',   description: '食物系，复制目标100%属性10秒', cooldown: 35, ringSlot: 5, mpCost: 38, statBuff: { stat: 'atk', multiplier: 2.0, duration: 10 } },

  // ==================== 智力系 第6魂环 ====================
  { id: 'wisdom_irrigation',name: '智慧浇灌',     series: 'intelligence', type: 'buff',   description: '智力提升60%，持续15秒', cooldown: 14, ringSlot: 6, mpCost: 20, statBuff: { stat: 'int', multiplier: 1.6, duration: 15 } },
  { id: 'soul_devour',      name: '噬魂',         series: 'intelligence', type: 'damage', description: '吸取目标魂力造成650%伤害', cooldown: 30, ringSlot: 6, mpCost: 38, damageMultiplier: 6.5 },
  { id: 'resurrection',     name: '复苏',         series: 'intelligence', type: 'heal',   description: '复活并回复满血（冷却极长）', cooldown: 120, ringSlot: 6, mpCost: 100, healAmount: 100 },
  { id: 'nihil',            name: '虚无',         series: 'intelligence', type: 'buff',   description: '进入虚无状态6秒，免疫伤害', cooldown: 45, ringSlot: 6, mpCost: 42, statBuff: { stat: 'def', multiplier: 100.0, duration: 6 } },
  { id: 'golden_fly',       name: '坚挺金苍蝇',   series: 'intelligence', type: 'buff',   description: '食物系，攻击力+100%持续20秒', cooldown: 40, ringSlot: 6, mpCost: 40, statBuff: { stat: 'atk', multiplier: 2.0, duration: 20 } },

  // ==================== 智力系 第7魂环 ====================
  { id: 'song_confusion',   name: '歌声迷离',     series: 'intelligence', type: 'control', description: '使目标混乱5秒', cooldown: 18, ringSlot: 7, mpCost: 22, controlDuration: 5 },
  { id: 'spirit_storm',     name: '魂力风暴',     series: 'intelligence', type: 'damage', description: '全屏范围智力型伤害500%', cooldown: 28, ringSlot: 7, mpCost: 42, damageMultiplier: 5.0 },
  { id: 'divine_shield',    name: '神圣护盾',     series: 'intelligence', type: 'buff',   description: '免疫一切伤害8秒', cooldown: 60, ringSlot: 7, mpCost: 55, statBuff: { stat: 'def', multiplier: 100.0, duration: 8 } },
  { id: 'bluesilver_true',  name: '蓝银真身',     series: 'intelligence', type: 'buff',   description: '蓝银皇真身·森罗万象，全属性+150%', cooldown: 55, ringSlot: 7, mpCost: 55, statBuff: { stat: 'atk', multiplier: 2.5, duration: 18 } },
  { id: 'nine_treasure_true',name:'九宝真身',     series: 'intelligence', type: 'buff',   description: '九宝琉璃塔真身，增幅效果翻倍', cooldown: 50, ringSlot: 7, mpCost: 50, statBuff: { stat: 'int', multiplier: 2.0, duration: 20 } },

  // ==================== 智力系 第8魂环 ====================
  { id: 'thousand_blades',  name: '万剑流',       series: 'intelligence', type: 'damage', description: '范围伤害480%', cooldown: 22, ringSlot: 8, mpCost: 38, damageMultiplier: 4.8 },
  { id: 'apocalypse',       name: '天罚',         series: 'intelligence', type: 'damage', description: '全屏毁灭性伤害620%', cooldown: 45, ringSlot: 8, mpCost: 55, damageMultiplier: 6.2 },
  { id: 'time_stop',        name: '时间停滞',     series: 'intelligence', type: 'control', description: '冻结全场敌人5秒', cooldown: 60, ringSlot: 8, mpCost: 55, controlDuration: 5 },
  { id: 'mirror_destroy',   name: '蓝银邪魔镜之灭',series:'intelligence', type:'damage', description:'蓝银皇专属，镜灭之光550%伤害', cooldown: 38, ringSlot: 8, mpCost: 48, damageMultiplier: 5.5 },
  { id: 'nine_sacred_light',name:'九宝神光护体',  series: 'intelligence', type: 'buff',   description: '九宝琉璃塔专属，无敌护盾5秒', cooldown: 50, ringSlot: 8, mpCost: 50, statBuff: { stat: 'def', multiplier: 100.0, duration: 5 } },

  // ==================== 智力系 第9魂环 ====================
  { id: 'azure_dragon_soul',name:'蓝银天青龙之魂',series:'intelligence', type:'damage', description:'蓝银皇终极奥义，龙魂之力700%伤害', cooldown: 60, ringSlot: 9, mpCost: 70, damageMultiplier: 7.0 },
  { id: 'nine_revive_light',name:'九宝无敌神光',  series: 'intelligence', type: 'buff',   description: '九宝琉璃塔终极技，复活神光', cooldown: 100, ringSlot: 9, mpCost: 80, statBuff: { stat: 'atk', multiplier: 2.0, duration: 20 } },
  { id: 'absolute_zero',    name: '绝对零度',     series: 'intelligence', type: 'control', description: '玄冰极致，冻结全场6秒+500%伤害', cooldown: 55, ringSlot: 9, mpCost: 58, damageMultiplier: 5.0, controlDuration: 6 },
  { id: 'death_domain',     name: '死亡领域',     series: 'intelligence', type: 'debuff', description: '死亡蛛皇领域，全属性-40%+持续掉血', cooldown: 45, ringSlot: 9, mpCost: 52, statDebuff: { stat: 'atk', multiplier: 0.6, duration: 15 } },
  { id: 'diamond_sausage',  name: '扭转乾坤钻石肠',series:'intelligence', type:'buff',   description:'食物系终极，全属性+80%持续25秒', cooldown: 60, ringSlot: 9, mpCost: 65, statBuff: { stat: 'atk', multiplier: 1.8, duration: 25 } },
].map((skill) => ({
  ...skill,
  icon: skillIconPath(skill.id),
})) as SkillDef[]

// ============================================================
// 魂骨表 —— 50+ 种，覆盖七部位六品质
// 来源：斗罗大陆原著 + e侠页游掉落表
// ============================================================
export const BONES: BoneDef[] = [
  // === 头骨 ===
  { id: 'b_head_wisdom',        name: '精神凝聚之智慧头骨',  slot: 'head', quality: 'orange', stats: { int: 80, mp: 500, critRate: 10 }, source: '全大陆魂师精英赛奖励' },
  { id: 'b_head_phantom',       name: '幻境智慧头骨',       slot: 'head', quality: 'purple', stats: { int: 50, mp: 300 }, source: '击败时年所得' },
  { id: 'b_head_charm',         name: '精神凝聚之魅惑头骨',  slot: 'head', quality: 'orange', stats: { int: 70, mp: 400, dodgeRate: 8 }, source: '十万年柔骨兔' },
  { id: 'b_head_mirror',        name: '镜像智慧头骨',       slot: 'head', quality: 'purple', stats: { int: 55, agi: 20 }, source: '星斗中心·镜影兽' },
  { id: 'b_head_noble',         name: '贵族头骨',           slot: 'head', quality: 'green', stats: { int: 20, mp: 80 }, source: '迷罗湖打宝' },
  { id: 'b_head_death',         name: '死亡头骨',           slot: 'head', quality: 'blue', stats: { int: 30, str: 10 }, source: '圣天涯打宝' },
  { id: 'b_head_iron_will',     name: '铁意头骨',           slot: 'head', quality: 'blue', stats: { int: 35, vit: 15 }, source: '星斗边缘打宝' },

  // === 躯干骨 ===
  { id: 'b_torso_whale',        name: '深海魔鲸王躯干骨',    slot: 'torso', quality: 'red', stats: { vit: 180, maxHp: 3000, str: 100, agi: 50, int: 50 }, source: '海神岛·深海魔鲸王' },
  { id: 'b_torso_saint',        name: '圣者躯干骨',         slot: 'torso', quality: 'purple', stats: { vit: 60, maxHp: 500, def: 30 }, source: '天青湖打宝' },
  { id: 'b_torso_iron_tree',    name: '铁树躯干骨',         slot: 'torso', quality: 'green', stats: { vit: 25, def: 10 }, source: '迷罗湖打宝' },
  { id: 'b_torso_lock',         name: '锁子躯干骨',         slot: 'torso', quality: 'blue', stats: { vit: 35, def: 15 }, source: '圣天涯打宝' },
  { id: 'b_torso_xuanming',     name: '玄冥躯干骨(卷轴)',  slot: 'torso', quality: 'blue', stats: { vit: 40, def: 20 }, source: '通天洞打宝' },
  { id: 'b_torso_restore',      name: '恢复躯干骨(卷轴)',   slot: 'torso', quality: 'purple', stats: { vit: 50, maxHp: 300, def: 20 }, source: '塔斯草原打宝' },
  { id: 'b_torso_demon_whale',  name: '深海魔鲸躯干骨(卷轴)',slot: 'torso', quality: 'orange', stats: { vit: 90, maxHp: 1200, def: 50 }, source: '天青湖打宝' },

  // === 左臂骨 ===
  { id: 'b_leftarm_titan',      name: '泰坦巨猿左臂骨',     slot: 'leftArm', quality: 'red', stats: { str: 120, atk: 300, vit: 80 }, source: '星斗大森林·泰坦巨猿' },
  { id: 'b_leftarm_rabbit',     name: '柔骨兔左臂骨',       slot: 'leftArm', quality: 'red', stats: { agi: 100, dodgeRate: 20, str: 60 }, source: '星斗大森林·柔骨兔献祭' },
  { id: 'b_leftarm_guardian',   name: '守护臂骨',           slot: 'leftArm', quality: 'blue', stats: { vit: 30, def: 15 }, source: '迷罗湖魂兽' },
  { id: 'b_leftarm_holy',       name: '圣殿臂骨(卷轴)',    slot: 'leftArm', quality: 'green', stats: { str: 20, int: 15 }, source: '圣天涯魂兽' },
  { id: 'b_leftarm_tenacious',  name: '坚韧臂骨(卷轴)',    slot: 'leftArm', quality: 'blue', stats: { str: 30, vit: 25 }, source: '通天洞打宝' },
  { id: 'b_leftarm_titan_arm',  name: '泰坦巨猿臂骨(卷轴)',slot: 'leftArm', quality: 'purple', stats: { str: 55, atk: 80 }, source: '塔斯草原打宝' },

  // === 右臂骨 ===
  { id: 'b_rightarm_sky_python',name: '天青牛蟒右臂骨',     slot: 'rightArm', quality: 'red', stats: { str: 110, agi: 70, int: 80, atk: 280 }, source: '星斗大森林·天青牛蟒' },
  { id: 'b_rightarm_flame',     name: '爆裂焚烧之火焰臂骨',  slot: 'rightArm', quality: 'orange', stats: { str: 80, atk: 180, critRate: 15 }, source: '武魂殿奖励·烈焰属性' },
  { id: 'b_rightarm_reply',     name: '回复臂骨',           slot: 'rightArm', quality: 'green', stats: { vit: 20, int: 10 }, source: '迷罗湖打宝' },
  { id: 'b_rightarm_black_king',name: '黑皇臂骨(卷轴)',    slot: 'rightArm', quality: 'blue', stats: { str: 30, atk: 40 }, source: '通天洞魂兽' },
  { id: 'b_rightarm_energy',    name: '能源臂骨(卷轴)',    slot: 'rightArm', quality: 'green', stats: { str: 20, mp: 100 }, source: '迷罗湖魂兽' },
  { id: 'b_rightarm_demon',     name: '恶魔臂骨',           slot: 'rightArm', quality: 'purple', stats: { str: 50, atk: 100, critRate: 8 }, source: '天青湖打宝' },

  // === 左腿骨 ===
  { id: 'b_leftleg_whale',      name: '邪魔虎鲸王左腿骨',    slot: 'leftLeg', quality: 'red', stats: { agi: 110, dodgeRate: 18, atkSpeed: 0.5 }, source: '海神岛·邪魔虎鲸王' },
  { id: 'b_leftleg_swift',      name: '急速前行之追风左腿骨',slot: 'leftLeg', quality: 'orange', stats: { agi: 80, dodgeRate: 12, atkSpeed: 0.35 }, source: '武魂殿奖励·速度型' },
  { id: 'b_leftleg_swallow',    name: '飞燕腿骨',           slot: 'leftLeg', quality: 'blue', stats: { agi: 30, dodgeRate: 5 }, source: '圣天涯Boss·九节翡翠' },
  { id: 'b_leftleg_secret',     name: '秘法腿骨(卷轴)',    slot: 'leftLeg', quality: 'blue', stats: { agi: 35, int: 20 }, source: '通天洞打宝' },
  { id: 'b_leftleg_empty',      name: '空明腿骨(卷轴)',    slot: 'leftLeg', quality: 'purple', stats: { agi: 50, dodgeRate: 8 }, source: '塔斯草原魂兽' },
  { id: 'b_leftleg_spider_king',name: '噬魂蛛皇腿骨(卷轴)',slot: 'leftLeg', quality: 'purple', stats: { agi: 55, dodgeRate: 10 }, source: '星斗中心打宝' },

  // === 右腿骨 ===
  { id: 'b_rightleg_bluesilver',name: '蓝银皇右腿骨',       slot: 'rightLeg', quality: 'red', stats: { agi: 100, vit: 80, dodgeRate: 15, atkSpeed: 0.4 }, source: '蓝银皇阿银传承' },
  { id: 'b_rightleg_blood',     name: '嗜血狂化之飓风右腿骨',slot: 'rightLeg', quality: 'orange', stats: { agi: 70, str: 50, atkSpeed: 0.3 }, source: '武魂殿奖励·狂化型' },
  { id: 'b_rightleg_agile',     name: '敏捷腿骨',           slot: 'rightLeg', quality: 'blue', stats: { agi: 30, dodgeRate: 5 }, source: '迷罗湖Boss·人面魔蛛' },
  { id: 'b_rightleg_speed',     name: '速度腿骨',           slot: 'rightLeg', quality: 'green', stats: { agi: 20, atkSpeed: 0.1 }, source: '星斗外围Boss·朽木树妖' },
  { id: 'b_rightleg_elf',       name: '精灵腿骨',           slot: 'rightLeg', quality: 'purple', stats: { agi: 45, dodgeRate: 8 }, source: '塔斯草原Boss' },
  { id: 'b_rightleg_charm',     name: '魅惑头骨(腿骨卷轴)', slot: 'rightLeg', quality: 'orange', stats: { agi: 60, dodgeRate: 12 }, source: '星斗中心打宝' },

  // === 外附骨 ===
  { id: 'b_ext_eight_spider',   name: '八蛛矛外附骨',       slot: 'external', quality: 'red', stats: { str: 80, agi: 80, int: 80, vit: 80, atk: 200, dodgeRate: 10 }, source: '迷罗湖·人面魔蛛皇(可进化)' },
  { id: 'b_ext_darkgold_claw',  name: '暗金恐爪外附骨',     slot: 'external', quality: 'red', stats: { str: 120, atk: 300, critRate: 25 }, source: '星斗大森林·暗金恐爪熊' },
  { id: 'b_ext_purple_wing',    name: '六翅紫光翼外附骨',   slot: 'external', quality: 'orange', stats: { agi: 90, dodgeRate: 15, atkSpeed: 0.5 }, source: '武魂殿·紫翼蛛皇' },
  { id: 'b_ext_magic_stick',    name: '魔棒外附骨',         slot: 'external', quality: 'blue', stats: { int: 30, mp: 200 }, source: '星斗外围魂兽' },
  { id: 'b_ext_revive',         name: '复苏外附骨(卷轴)',   slot: 'external', quality: 'purple', stats: { vit: 40, int: 30, mp: 300 }, source: '星斗外围魂兽' },
  { id: 'b_ext_soul_power',     name: '魂力外附骨',         slot: 'external', quality: 'purple', stats: { int: 50, mp: 400 }, source: '星斗边缘Boss' },
  { id: 'b_ext_life',           name: '生命外附骨',         slot: 'external', quality: 'orange', stats: { vit: 70, maxHp: 800 }, source: '星斗中心Boss' },
  { id: 'b_ext_spirit_realm',   name: '灵境外附骨',         slot: 'external', quality: 'orange', stats: { int: 60, mp: 500, str: 30, agi: 30 }, source: '天青湖Boss·泰坦巨猿' },

  // === 套装魂骨 ===
  { id: 'b_set_sea_leftleg',    name: '海神左腿骨',         slot: 'leftLeg', quality: 'orange', stats: { agi: 90, dodgeRate: 15, str: 50 }, source: '昊天宗Boss·芙瑶' },
  { id: 'b_set_sea_rightleg',   name: '海神右腿骨',         slot: 'rightLeg', quality: 'orange', stats: { agi: 90, dodgeRate: 15, str: 50 }, source: '杀戮之都Boss·圣魅鸳雏' },
  { id: 'b_set_devil_leftleg',  name: '罗刹左腿骨',         slot: 'leftLeg', quality: 'orange', stats: { agi: 80, str: 55, critRate: 12 }, source: '昊天宗Boss·倾裳' },
  { id: 'b_set_devil_rightleg', name: '罗刹右腿骨',         slot: 'rightLeg', quality: 'orange', stats: { agi: 80, str: 55, critRate: 12 }, source: '杀戮之都Boss·圣魅鸳雏' },
  { id: 'b_set_angel_leftleg',  name: '天使左腿骨',         slot: 'leftLeg', quality: 'orange', stats: { int: 80, agi: 70, mp: 600 }, source: '昊天宗Boss·倾裳' },
  { id: 'b_set_angel_rightleg', name: '天使右腿骨',         slot: 'rightLeg', quality: 'orange', stats: { int: 80, agi: 70, mp: 600 }, source: '杀戮之都Boss·古清兽' },
  { id: 'b_set_food_leftleg',   name: '食神左腿骨',         slot: 'leftLeg', quality: 'orange', stats: { vit: 70, int: 60, agi: 60 }, source: '昊天宗Boss·倾裳' },
  { id: 'b_set_food_rightleg',  name: '食神右腿骨',         slot: 'rightLeg', quality: 'orange', stats: { vit: 70, int: 60, agi: 60 }, source: '杀戮之都Boss·古清兽' },
].map((bone) => ({
  ...bone,
  icon: boneIconPath(bone.id),
})) as unknown as BoneDef[]

// ============================================================
// 地图表 —— 12 张地图，含等级/阵营/Boss
// ============================================================
export const MAPS: MapDef[] = [
  { id: 'miluo_lake',      name: '迷罗湖',     minLevel: 1,  faction: 'xingluo', tilemapKey: 'map_miluo_lake',     bosses: ['face_spider', 'fire_rhino'], dropTable: [] },
  { id: 'xingdou_outer',   name: '星斗外围',   minLevel: 1,  faction: 'public',  tilemapKey: 'map_xingdou_outer',   bosses: ['spirit_deer', 'pope_guard', 'rot_tree'], dropTable: [] },
  { id: 'shengtianya',     name: '圣天涯',     minLevel: 20, faction: 'xingluo', tilemapKey: 'map_shengtianya',     bosses: ['nine_jade', 'long_beak_crane'], dropTable: [] },
  { id: 'tongtian_cave',   name: '通天洞',     minLevel: 30, faction: 'xingluo', tilemapKey: 'map_tongtian_cave',   bosses: ['golden_tiger', 'flying_marshal'], dropTable: [] },
  { id: 'xingdou_edge',    name: '星斗边缘',   minLevel: 30, faction: 'public',  tilemapKey: 'map_xingdou_edge',    bosses: ['pope_guard2', 'fire_rhino2'], dropTable: [] },
  { id: 'tasi_grassland',  name: '塔斯草原',   minLevel: 40, faction: 'xingluo', tilemapKey: 'map_tasi_grassland',  bosses: ['flying_marshal2', 'underworld_guard'], dropTable: [] },
  { id: 'xingdou_center',  name: '星斗中心',   minLevel: 50, faction: 'public',  tilemapKey: 'map_xingdou_center',  bosses: ['eagle_demon', 'fire_rhino3'], dropTable: [] },
  { id: 'tianqing_lake',   name: '天青湖',     minLevel: 60, faction: 'public',  tilemapKey: 'map_tianqing_lake',   bosses: ['titan_ape', 'sky_python'], dropTable: [] },
  { id: 'slaughter_city',  name: '杀戮之都',   minLevel: 70, faction: 'public',  tilemapKey: 'map_slaughter_city',  bosses: ['holy_phoenix', 'ancient_beast'], dropTable: [] },
  { id: 'haotian_sect',    name: '昊天宗',     minLevel: 80, faction: 'public',  tilemapKey: 'map_haotian_sect',    bosses: ['fuyao', 'qingshang'], dropTable: [] },
  { id: 'seagod_island',   name: '海神岛',     minLevel: 91, faction: 'public',  tilemapKey: 'map_seagod_island',   bosses: [], dropTable: [] },
  { id: 'ice_forest',      name: '冰封森林',   minLevel: 91, faction: 'public',  tilemapKey: 'map_ice_forest',      bosses: [], dropTable: [] },
]

// ============================================================
// 物品表
// ============================================================
export const ITEMS: ItemDef[] = [
  { id: 'hp_potion_s',     name: '初级回血药',       quality: 'white',  type: 'potion', description: '恢复80点生命值', stackable: true, maxStack: 99, sellPrice: 10 },
  { id: 'hp_potion_m',     name: '中级回血药',       quality: 'green',  type: 'potion', description: '恢复200点生命值', stackable: true, maxStack: 99, sellPrice: 25 },
  { id: 'hp_potion_l',     name: '高级回血药',       quality: 'blue',   type: 'potion', description: '恢复500点生命值', stackable: true, maxStack: 99, sellPrice: 60 },
  { id: 'mp_potion_s',     name: '初级回蓝药',       quality: 'white',  type: 'potion', description: '恢复60点魂力值', stackable: true, maxStack: 99, sellPrice: 10 },
  { id: 'mp_potion_m',     name: '中级回蓝药',       quality: 'green',  type: 'potion', description: '恢复150点魂力值', stackable: true, maxStack: 99, sellPrice: 25 },
  { id: 'mp_potion_l',     name: '高级回蓝药',       quality: 'blue',   type: 'potion', description: '恢复400点魂力值', stackable: true, maxStack: 99, sellPrice: 60 },
  { id: 'scroll_s1',       name: '低级附魂石(1环)',  quality: 'white',  type: 'special', description: '为第1魂环增加年限', stackable: true, maxStack: 99, sellPrice: 50 },
  { id: 'scroll_m1',       name: '中级附魂石(1环)',  quality: 'green',  type: 'special', description: '为第1魂环增加较多年限', stackable: true, maxStack: 99, sellPrice: 100 },
  { id: 'forget_stone',    name: '忘魂石',           quality: 'blue',   type: 'special', description: '重置魂环，可重新选择魂技', stackable: true, maxStack: 10, sellPrice: 500 },
  { id: 'moon_stone',      name: '月光石',           quality: 'purple', type: 'special', description: '70级真身系统解绑技能', stackable: true, maxStack: 10, sellPrice: 1000 },
  { id: 'qingling_stone',  name: '青灵石',           quality: 'white',  type: 'material', description: '基础锻造材料', stackable: true, maxStack: 99, sellPrice: 5 },
  { id: 'deep_sea_silver', name: '深海银母',         quality: 'green',  type: 'material', description: '中级锻造材料', stackable: true, maxStack: 99, sellPrice: 20 },
  { id: 'fierce_gunpowder',name: '猛烈火药',         quality: 'green',  type: 'material', description: '暗器锻造材料', stackable: true, maxStack: 99, sellPrice: 15 },
  { id: 'bodhi_leaf',      name: '菩提叶',           quality: 'blue',   type: 'material', description: '高级锻造材料', stackable: true, maxStack: 99, sellPrice: 80 },
  { id: 'ancient_scroll',  name: '上古密卷',         quality: 'purple', type: 'material', description: '魂骨合成材料', stackable: true, maxStack: 99, sellPrice: 200 },
  { id: 'domain_shard',    name: '碎裂的领域石',     quality: 'purple', type: 'material', description: '领域强化材料', stackable: true, maxStack: 99, sellPrice: 150 },
  { id: 'spirit_pill',     name: '灵力丹',           quality: 'green',  type: 'special', description: '补充双生武魂灵力', stackable: true, maxStack: 99, sellPrice: 30 },
  { id: 'ring_random',     name: '随机魂环',         quality: 'purple', type: 'special', description: '使用后随机获得一个魂环+魂技', stackable: true, maxStack: 5, sellPrice: 800 },
  { id: 'spirit_ring_white',  name: '十年魂环',       quality: 'white',  type: 'spirit_ring', description: '魂兽掉落的十年魂环，可在背包中吸收并选择魂技', stackable: true, maxStack: 99, sellPrice: 120 },
  { id: 'spirit_ring_yellow', name: '百年魂环',       quality: 'green',  type: 'spirit_ring', description: '魂兽掉落的百年魂环，可在背包中吸收并选择魂技', stackable: true, maxStack: 99, sellPrice: 260 },
  { id: 'spirit_ring_purple', name: '千年魂环',       quality: 'purple', type: 'spirit_ring', description: '魂兽掉落的千年魂环，可在背包中吸收并选择魂技', stackable: true, maxStack: 99, sellPrice: 680 },
  { id: 'spirit_ring_black',  name: '万年魂环',       quality: 'orange', type: 'spirit_ring', description: '魂兽掉落的万年魂环，可在背包中吸收并选择魂技', stackable: true, maxStack: 99, sellPrice: 1600 },
  { id: 'spirit_ring_red',    name: '十万年魂环',     quality: 'red',    type: 'spirit_ring', description: '魂兽掉落的十万年魂环，可在背包中吸收并选择魂技', stackable: true, maxStack: 99, sellPrice: 5000 },
  { id: 'bone_fragment',   name: '魂骨碎片',         quality: 'blue',   type: 'bone', description: '集齐3个可合成随机魂骨', stackable: true, maxStack: 99, sellPrice: 200 },
  { id: 'god_fragment',    name: '神位碎片',         quality: 'red',    type: 'special', description: '收集7种不同碎片可兑换神位之牌', stackable: true, maxStack: 10, sellPrice: 2000 },
  { id: 'exp_potion_s',    name: '初级经验药水',     quality: 'green',  type: 'potion', description: '使用获得500经验', stackable: true, maxStack: 99, sellPrice: 50 },
  { id: 'exp_potion_m',    name: '中级经验药水',     quality: 'blue',   type: 'potion', description: '使用获得2000经验', stackable: true, maxStack: 99, sellPrice: 200 },
  { id: 'exp_potion_l',    name: '高级经验药水',     quality: 'purple', type: 'potion', description: '使用获得8000经验', stackable: true, maxStack: 99, sellPrice: 800 },
  { id: 'allheal_potion',  name: '全面恢复药水',     quality: 'orange', type: 'potion', description: 'HP和MP全恢复', stackable: true, maxStack: 20, sellPrice: 500 },
  { id: 'atk_scroll',      name: '攻击卷轴',         quality: 'blue',   type: 'special', description: '10分钟内攻击力+30%', stackable: true, maxStack: 10, sellPrice: 200 },
  { id: 'def_scroll',      name: '防御卷轴',         quality: 'blue',   type: 'special', description: '10分钟内防御力+30%', stackable: true, maxStack: 10, sellPrice: 200 },
  { id: 'lucky_charm',     name: '幸运符',           quality: 'purple', type: 'special', description: '30分钟内掉落率翻倍', stackable: true, maxStack: 5, sellPrice: 500 },
].map((item) => ({
  ...item,
  icon: itemIconPath(item.id),
})) as ItemDef[]

// ============================================================
// 经验表（每级所需经验）
// ============================================================
export function getExpToNext(level: number): number {
  return Math.floor(100 * Math.pow(1.15, level - 1))
}
