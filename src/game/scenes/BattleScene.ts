import Phaser from 'phaser'
import { useGameStore } from '@/stores/game'
import { useUIStore } from '@/stores/ui'
import { ITEMS, SKILLS } from '@/data/gameData'
import { itemLabels } from '@/data/displayData'
import type { SkillDef } from '@/types/game'
import { audioManager } from '@/game/audio/audioManager'
import { skillIconPath } from '@/assets/art-direction/icon-paths'
import { generatedBattleUiButtons } from '@/assets/art-direction/generated-paths'
import {
  battleEffectForSkill,
  battlePortraitForMonster,
  battleEffectSources,
  battleTextureSources,
  type BattleEffectKey,
  type BattleTextureKey,
} from '@/game/scenes/battleVisuals'
import {
  calculateMonsterDamage,
  calculatePlayerDamage,
  effectiveMonsterStat,
  effectivePlayerStat,
  playerAttackIntervalMs,
  secondsRemaining,
  skillCooldownMs,
  skillEffectText,
  type TimedEffect,
} from '@/game/utils/realtimeBattleRules'
import {
  canDropSpiritRing,
  spiritRingItemForLevel,
  spiritRingLabelWithYear,
  spiritRingYearForMonsterLevel,
} from '@/game/utils/spiritRingDrops'

type BattleDrop = { itemId: string; year?: number }

export interface BattleMonster {
  id: string
  name: string
  level: number
  maxHp: number
  hp: number
  atk: number
  def: number
  expReward: number
  goldReward: number
  textureKey: string
  portraitUrl?: string
  dropTable: { itemId: string; chance: number }[]
}

export interface BattleMonsterDef {
  id: string
  name: string
  level: number
  hp: number
  atk: number
  def: number
  exp: number
  gold: number
  textureKey: string
  dropTable?: { itemId: string; chance: number }[]
}

interface SkillSlotUi {
  icon?: Phaser.GameObjects.Image
  cooldownMask: Phaser.GameObjects.Graphics
  cooldownLabel: Phaser.GameObjects.Text
  hotkeyLabel: Phaser.GameObjects.Text
}

interface AttackButtonUi {
  cooldownMask: Phaser.GameObjects.Graphics
  cooldownLabel: Phaser.GameObjects.Text
}

interface MonsterSkill {
  id: string
  name: string
  cooldown: number
  damageMultiplier: number
}

const battleSkillIconSources = Object.fromEntries(
  SKILLS.map((skill) => [`skill_icon_${skill.id}`, skillIconPath(skill.id)]),
) as Record<string, string>

const battleUiButtonSources = {
  ui_attack: generatedBattleUiButtons.attack,
  ui_auto: generatedBattleUiButtons.auto,
  ui_escape: generatedBattleUiButtons.escape,
}

const commonDrops = [
  { itemId: 'hp_potion_s', chance: 0.28 },
  { itemId: 'mp_potion_s', chance: 0.24 },
  { itemId: 'qingling_stone', chance: 0.18 },
]

const rareDrops = [
  { itemId: 'hp_potion_m', chance: 0.28 },
  { itemId: 'mp_potion_m', chance: 0.24 },
  { itemId: 'bone_fragment', chance: 0.14 },
]

export const REGION_MONSTERS: Record<string, BattleMonsterDef[]> = {
  miluo_lake: [
    { id: 'face_spider', name: '人面魔蛛', level: 12, hp: 300, atk: 25, def: 10, exp: 150, gold: 30, textureKey: 'monster_spider', dropTable: commonDrops },
    { id: 'ghost_spider', name: '幽影毒蛛', level: 13, hp: 360, atk: 30, def: 12, exp: 180, gold: 34, textureKey: 'monster_spider', dropTable: commonDrops },
    { id: 'mist_deer', name: '迷雾灵鹿', level: 14, hp: 420, atk: 32, def: 14, exp: 210, gold: 38, textureKey: 'monster_deer', dropTable: commonDrops },
    { id: 'fire_rhino', name: '火云犀甲牛', level: 15, hp: 600, atk: 35, def: 18, exp: 300, gold: 50, textureKey: 'monster_rhino', dropTable: rareDrops },
    { id: 'rot_tree', name: '朽木树妖', level: 18, hp: 800, atk: 40, def: 22, exp: 450, gold: 60, textureKey: 'monster_tree', dropTable: rareDrops },
  ],
  xingdou_outer: [
    { id: 'spirit_deer', name: '通灵灵鹿', level: 16, hp: 500, atk: 28, def: 14, exp: 250, gold: 40, textureKey: 'monster_deer', dropTable: commonDrops },
    { id: 'wind_wolf', name: '疾风狼', level: 17, hp: 560, atk: 38, def: 16, exp: 280, gold: 45, textureKey: 'monster_wolf', dropTable: commonDrops },
    { id: 'bamboo_serpent', name: '曼陀罗蛇', level: 18, hp: 620, atk: 42, def: 17, exp: 320, gold: 48, textureKey: 'monster_serpent', dropTable: commonDrops },
    { id: 'pope_guard', name: '斗魂守卫', level: 20, hp: 900, atk: 45, def: 25, exp: 500, gold: 70, textureKey: 'monster_guard', dropTable: rareDrops },
  ],
  shengtianya: [
    { id: 'nine_jade', name: '九节翡翠', level: 22, hp: 1000, atk: 50, def: 28, exp: 600, gold: 80, textureKey: 'monster_serpent', dropTable: rareDrops },
    { id: 'long_beak_crane', name: '雷魂鹤', level: 25, hp: 1300, atk: 55, def: 30, exp: 700, gold: 90, textureKey: 'monster_crane', dropTable: rareDrops },
    { id: 'stone_lizard', name: '冰甲龙蜥', level: 26, hp: 1450, atk: 58, def: 38, exp: 760, gold: 96, textureKey: 'monster_rhino', dropTable: commonDrops },
  ],
  tongtian_cave: [
    { id: 'golden_tiger', name: '烈焰虎', level: 32, hp: 2000, atk: 70, def: 40, exp: 1000, gold: 130, textureKey: 'monster_tiger', dropTable: rareDrops },
    { id: 'shadow_bat', name: '深渊蝠王', level: 33, hp: 1800, atk: 86, def: 32, exp: 1080, gold: 145, textureKey: 'monster_bat', dropTable: commonDrops },
    { id: 'flying_marshal', name: '魂师统领', level: 35, hp: 2500, atk: 80, def: 45, exp: 1300, gold: 160, textureKey: 'monster_guard', dropTable: rareDrops },
  ],
  xingdou_edge: [
    { id: 'pope_guard2', name: '精英守卫', level: 38, hp: 3500, atk: 90, def: 50, exp: 1800, gold: 200, textureKey: 'monster_guard', dropTable: rareDrops },
    { id: 'fire_rhino2', name: '冰甲玄龟', level: 40, hp: 4000, atk: 100, def: 55, exp: 2200, gold: 250, textureKey: 'monster_rhino', dropTable: rareDrops },
    { id: 'dark_panther', name: '暗焰豹', level: 41, hp: 3600, atk: 118, def: 44, exp: 2300, gold: 265, textureKey: 'monster_tiger', dropTable: commonDrops },
  ],
  tasi_grassland: [
    { id: 'flying_marshal2', name: '精英魂师统领', level: 45, hp: 5500, atk: 130, def: 65, exp: 3000, gold: 350, textureKey: 'monster_guard', dropTable: rareDrops },
    { id: 'underworld_guard', name: '洞窟魔熊', level: 48, hp: 6500, atk: 150, def: 70, exp: 3800, gold: 420, textureKey: 'monster_boss', dropTable: rareDrops },
    { id: 'storm_bull', name: '冰甲龙王', level: 49, hp: 7000, atk: 155, def: 75, exp: 4000, gold: 450, textureKey: 'monster_rhino', dropTable: commonDrops },
  ],
  xingdou_center: [
    { id: 'eagle_demon', name: '雷魂鹰魔', level: 55, hp: 10000, atk: 220, def: 90, exp: 6000, gold: 600, textureKey: 'monster_crane', dropTable: rareDrops },
    { id: 'blood_spider_king', name: '噬魂蛛王', level: 58, hp: 12500, atk: 250, def: 96, exp: 7200, gold: 720, textureKey: 'monster_spider', dropTable: rareDrops },
  ],
  tianqing_lake: [
    { id: 'titan_ape', name: '赤焰巨猿', level: 65, hp: 20000, atk: 350, def: 130, exp: 12000, gold: 1000, textureKey: 'monster_red_flame_ape', dropTable: rareDrops },
    { id: 'sky_python', name: '黑水龙', level: 68, hp: 25000, atk: 380, def: 140, exp: 15000, gold: 1200, textureKey: 'monster_blackwater_dragon', dropTable: rareDrops },
  ],
  slaughter_city: [
    { id: 'holy_phoenix', name: '赤焰凤影', level: 75, hp: 40000, atk: 500, def: 180, exp: 25000, gold: 2000, textureKey: 'monster_red_flame_ape', dropTable: rareDrops },
    { id: 'blood_guard', name: '杀戮血卫', level: 78, hp: 43000, atk: 540, def: 190, exp: 28000, gold: 2200, textureKey: 'monster_guard', dropTable: rareDrops },
  ],
  haotian_sect: [
    { id: 'fuyao', name: '洞窟魔熊', level: 85, hp: 60000, atk: 700, def: 220, exp: 40000, gold: 3000, textureKey: 'monster_boss', dropTable: rareDrops },
    { id: 'hammer_guardian', name: '宗门守卫', level: 88, hp: 68000, atk: 760, def: 240, exp: 46000, gold: 3400, textureKey: 'monster_guard', dropTable: rareDrops },
  ],
  seagod_island: [
    { id: 'sea_dragon', name: '黑水海龙', level: 92, hp: 76000, atk: 820, def: 280, exp: 56000, gold: 4200, textureKey: 'monster_blackwater_dragon', dropTable: rareDrops },
    { id: 'deep_whale', name: '深海魔鲸', level: 95, hp: 92000, atk: 920, def: 320, exp: 70000, gold: 5200, textureKey: 'monster_boss', dropTable: rareDrops },
  ],
  ice_forest: [
    { id: 'ice_tiger', name: '冰霜烈虎', level: 92, hp: 74000, atk: 800, def: 275, exp: 54000, gold: 4100, textureKey: 'monster_tiger', dropTable: rareDrops },
    { id: 'snow_crane', name: '雪羽雷雕', level: 94, hp: 82000, atk: 860, def: 300, exp: 62000, gold: 4800, textureKey: 'monster_crane', dropTable: rareDrops },
  ],
}
function toBattleMonster(monster: BattleMonsterDef): BattleMonster {
  return {
    id: monster.id,
    name: monster.name,
    level: monster.level,
    maxHp: monster.hp,
    hp: monster.hp,
    atk: monster.atk,
    def: monster.def,
    expReward: monster.exp,
    goldReward: monster.gold,
    textureKey: monster.textureKey,
    portraitUrl: battlePortraitForMonster(monster.id, monster.textureKey),
    dropTable: monster.dropTable ?? [],
  }
}

function createArenaMonster(opponent: { name: string; level: number; power: number; textureKey?: string }): BattleMonster {
  const level = Math.max(1, opponent.level)
  const maxHp = Math.max(420, Math.floor(opponent.power * 0.9))
  const textureKey = opponent.textureKey ?? 'monster_guard'
  return {
    id: 'arena_ai',
    name: opponent.name,
    level,
    maxHp,
    hp: maxHp,
    atk: Math.max(24, Math.floor(opponent.power / 45)),
    def: Math.max(10, Math.floor(opponent.power / 90)),
    expReward: 360 + level * 12,
    goldReward: 120 + level * 5,
    textureKey,
    portraitUrl: battlePortraitForMonster('arena_ai', textureKey),
    dropTable: [{ itemId: 'bone_fragment', chance: 0.08 }],
  }
}

export class BattleScene extends Phaser.Scene {
  private monster!: BattleMonster
  private playerSprite!: Phaser.GameObjects.Sprite
  private monsterSprite!: Phaser.GameObjects.Sprite
  private statusText?: Phaser.GameObjects.Text
  private autoBattleImage?: Phaser.GameObjects.Image
  private normalAttackUi?: AttackButtonUi
  private hpBarUpdaters: Array<() => void> = []
  private skillSlotUis: SkillSlotUi[] = []
  private skillKeys: Record<string, Phaser.Input.Keyboard.Key> = {}
  private skillCooldownEnds = new Map<number, number>()
  private monsterSkillCooldownEnds = new Map<string, number>()
  private effects: TimedEffect[] = []
  private monsterSkills: MonsterSkill[] = []
  private battleMode: 'hunt' | 'arena' = 'hunt'
  private battleOver = false
  private exitingBattle = false
  private autoBattle = false
  private playerNextActionAt = 0
  private monsterNextActionAt = 0
  private playerLockedUntil = 0
  private monsterLockedUntil = 0
  private monsterControlledUntil = 0
  private battleClock = 0
  private onVictory?: () => void
  private onDefeat?: () => void

  constructor() {
    super({ key: 'BattleScene' })
  }

  init(data: {
    monsterId?: string
    region?: string
    arenaOpponent?: { name: string; level: number; power: number; textureKey?: string }
    onVictory?: () => void
    onDefeat?: () => void
  }) {
    if (data.arenaOpponent) {
      this.monster = createArenaMonster(data.arenaOpponent)
      this.battleMode = 'arena'
    } else {
      const regionMonsters = REGION_MONSTERS[data.region ?? 'miluo_lake'] ?? REGION_MONSTERS.miluo_lake!
      const def = regionMonsters.find((monster) => monster.id === data.monsterId) ?? regionMonsters[0]!
      this.monster = toBattleMonster(def)
      this.battleMode = 'hunt'
    }

    this.skillCooldownEnds.clear()
    this.monsterSkillCooldownEnds.clear()
    this.effects = []
    this.skillSlotUis = []
    this.skillKeys = {}
    this.battleOver = false
    this.exitingBattle = false
    this.autoBattle = false
    this.battleClock = 0
    this.playerNextActionAt = 0
    this.monsterNextActionAt = 1800
    this.playerLockedUntil = 0
    this.monsterLockedUntil = 0
    this.monsterControlledUntil = 0
    this.monsterSkills = this.buildMonsterSkills()
    this.onVictory = data.onVictory
    this.onDefeat = data.onDefeat
  }

  preload() {
    for (const [key, url] of Object.entries(battleTextureSources)) {
      if (!this.textures.exists(key)) this.load.image(key, url)
    }
    for (const [key, url] of Object.entries(battleEffectSources)) {
      if (!this.textures.exists(key)) this.load.image(key, url)
    }
    for (const [key, url] of Object.entries(battleSkillIconSources)) {
      if (!this.textures.exists(key)) this.load.image(key, url)
    }
    for (const [key, url] of Object.entries(battleUiButtonSources)) {
      if (!this.textures.exists(key)) this.load.image(key, url)
    }
  }

  create() {
    const w = this.cameras.main.width
    const h = this.cameras.main.height
    const gameStore = useGameStore()
    const stats = gameStore.character?.stats

    this.children.removeAll()
    this.tweens.killAll()
    this.time.removeAllEvents()
    this.hpBarUpdaters = []
    audioManager.playBattleBgm()
    this.logBattle('遭遇 ' + this.monster.name + '，战斗开始。')

    this.createBackdrop(w, h)
    this.addTitle(w)
    this.addMonsterHeader(w)
    if (stats) this.addPlayerHeader(gameStore, stats)
    this.addCombatants(w, h)
    this.createSkillBar()
    this.bindSkillKeys()
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.handleSceneShutdown, this)
    this.cameras.main.fadeIn(220, 10, 10, 10)
  }

  update(_time: number, delta: number) {
    if (this.battleOver || this.exitingBattle) return
    this.battleClock += delta
    this.effects = this.effects.filter((effect) => effect.expiresAt > this.battleClock)
    this.handleSkillKeys()
    if (this.autoBattle) {
      this.tryAutoSkill()
      this.tryAutoAttack()
    }
    this.tryMonsterAction()
    this.refreshSkillBarState()
    this.refreshStatus()
  }

  private createBackdrop(w: number, h: number) {
    this.add.image(w / 2, h / 2, 'bg_battle_xingdou_outer').setDisplaySize(w, h).setDepth(-100)
    this.add.rectangle(w / 2, h / 2, w, h, 0x05070d, 0.34).setDepth(-90)
    this.add.rectangle(w / 2, h - 74, w, 148, 0x05070d, 0.5).setDepth(-40)
    const floor = this.add.graphics().setDepth(-35)
    floor.fillGradientStyle(0x1d2534, 0x1d2534, 0x060910, 0x060910, 0.34, 0.34, 0.78, 0.78)
    floor.fillRect(0, h - 210, w, 210)
    this.statusText = this.add.text(w / 2, h - 116, '手动战斗：点击普通攻击或魂技出手', {
      fontFamily: 'Microsoft YaHei',
      fontSize: '16px',
      color: '#f6e1a1',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(20)
  }

  private addTitle(w: number) {
    this.add.text(w / 2, 20, this.battleMode === 'arena' ? '斗魂场挑战' : '魂兽狩猎', {
      fontFamily: 'Microsoft YaHei',
      fontSize: '18px',
      color: '#ffd700',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5)
  }

  private addMonsterHeader(w: number) {
    this.add.text(w / 2, 56, this.monster.name + '  Lv.' + this.monster.level, {
      fontFamily: 'Microsoft YaHei',
      fontSize: '27px',
      color: '#ff7474',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5)
    this.createHPBar(w / 2 - 190, 88, 380, 18, () => this.monster.hp, () => this.monster.maxHp, 0xff4444)
  }

  private addPlayerHeader(gameStore: ReturnType<typeof useGameStore>, stats: NonNullable<ReturnType<typeof useGameStore>['character']>['stats']) {
    this.add.text(20, 7, (gameStore.character?.name ?? '玩家') + '  Lv.' + (gameStore.character?.level ?? 1), {
      fontFamily: 'Microsoft YaHei',
      fontSize: '16px',
      color: '#4aff7a',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 3,
    })
    this.createHPBar(20, 28, 220, 14, () => stats.hp, () => stats.maxHp, 0xe53e3e)
    this.createHPBar(20, 48, 220, 11, () => stats.mp, () => stats.maxMp, 0x4299e1)
  }

  private addCombatants(w: number, h: number) {
    const playerX = Math.max(185, Math.floor(w * 0.27))
    const monsterX = Math.min(w - 195, Math.floor(w * 0.72))
    const baselineY = h - 218

    this.playerSprite = this.add.sprite(playerX, baselineY, 'char_player').setOrigin(0.5, 0.86).setDepth(8)
    this.fitSprite(this.playerSprite, 98, 150)
    this.styleSprite(this.playerSprite, false)

    const isLarge = this.monster.textureKey === 'monster_blackwater_dragon'
      || this.monster.textureKey === 'monster_boss'
      || this.monster.textureKey === 'monster_red_flame_ape'
    this.monsterSprite = this.add.sprite(monsterX, baselineY, this.monster.textureKey as BattleTextureKey || 'monster_spider')
      .setOrigin(0.5, 0.86)
      .setFlipX(true)
      .setDepth(8)
    this.fitSprite(this.monsterSprite, isLarge ? 148 : 122, isLarge ? 138 : 118)
    this.styleSprite(this.monsterSprite, true)

    this.tweens.add({ targets: this.playerSprite, y: baselineY - 5, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.inOut' })
    this.tweens.add({ targets: this.monsterSprite, y: baselineY - 6, duration: 1700, yoyo: true, repeat: -1, ease: 'Sine.inOut' })
  }

  private fitSprite(sprite: Phaser.GameObjects.Sprite, maxWidth: number, maxHeight: number) {
    const source = sprite.texture.getSourceImage() as HTMLImageElement | HTMLCanvasElement | undefined
    const width = Math.max(1, source?.width ?? sprite.width)
    const height = Math.max(1, source?.height ?? sprite.height)
    sprite.setScale(Math.min(maxWidth / width, maxHeight / height))
  }

  private fitImageScale(image: Phaser.GameObjects.Image, maxWidth: number, maxHeight: number): number {
    const source = image.texture.getSourceImage() as HTMLImageElement | HTMLCanvasElement | undefined
    const width = Math.max(1, source?.width ?? image.width)
    const height = Math.max(1, source?.height ?? image.height)
    return Math.min(maxWidth / width, maxHeight / height)
  }

  private styleSprite(sprite: Phaser.GameObjects.Sprite, flipSide: boolean) {
    sprite.setTint(0xfafcff)
    sprite.setAngle(flipSide ? -1 : 1)
    sprite.setAlpha(0.98)
  }

  private createHPBar(x: number, y: number, width: number, height: number, getCurr: () => number, getMax: () => number, color: number) {
    const bg = this.add.graphics()
    const bar = this.add.graphics()
    const label = this.add.text(x + width / 2, y + height / 2, '', {
      fontFamily: 'Microsoft YaHei',
      fontSize: Math.max(11, height) + 'px',
      color: '#fff',
      stroke: '#000',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(10)

    const redraw = () => {
      bg.clear()
      bar.clear()
      bg.fillStyle(0x000000, 0.64)
      bg.fillRoundedRect(x, y, width, height, 3)
      const max = Math.max(1, getMax())
      const curr = Math.max(0, Math.floor(getCurr()))
      const ratio = Phaser.Math.Clamp(curr / max, 0, 1)
      bar.fillStyle(color, 1)
      bar.fillRoundedRect(x + 1, y + 1, (width - 2) * ratio, height - 2, 3)
      label.setText(curr + '/' + max)
    }
    this.hpBarUpdaters.push(redraw)
    this.events.on('update', redraw)
    redraw()
  }

  private createSkillBar() {
    const rings = useGameStore().character?.rings ?? []
    const y = this.cameras.main.height - 48
    const startX = 188
    const gap = 62

    const attackX = 84
    const attackImage = this.add.image(attackX, y, 'ui_attack').setDepth(4)
    attackImage.setScale(this.fitImageScale(attackImage, 72, 72))
    const attackMask = this.add.graphics().setDepth(6)
    const attackLabel = this.add.text(attackX, y + 20, '', {
      fontFamily: 'Microsoft YaHei',
      fontSize: '15px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(7)
    this.normalAttackUi = { cooldownMask: attackMask, cooldownLabel: attackLabel }
    this.add.rectangle(attackX, y, 64, 64, 0xffffff, 0.001)
      .setDepth(8)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => attackImage.setTint(0xfff0b8))
      .on('pointerout', () => attackImage.clearTint())
      .on('pointerdown', () => this.performPlayerAttack())

    const rightX = this.cameras.main.width - 92
    this.autoBattleImage = this.add.image(rightX, y + 4, 'ui_auto').setDepth(18)
    this.autoBattleImage.setScale(this.fitImageScale(this.autoBattleImage, 72, 72))
    this.autoBattleImage
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.autoBattleImage?.setTint(0xfff0b8))
      .on('pointerout', () => {
        this.autoBattleImage?.clearTint()
        if (!this.autoBattle) this.autoBattleImage?.setTint(0xb7b7b7)
      })
      .on('pointerdown', () => this.toggleAutoBattle())
    this.autoBattleImage.setAlpha(0.78).setTint(0xb7b7b7)

    const escapeImage = this.add.image(rightX, y - 66, 'ui_escape').setDepth(18)
    escapeImage.setScale(this.fitImageScale(escapeImage, 72, 72))
    escapeImage
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.escapeBattle())
    escapeImage.on('pointerover', () => escapeImage.setTint(0xfff0b8))
    escapeImage.on('pointerout', () => escapeImage.clearTint())
    for (let i = 0; i < 9; i++) {
      const x = startX + i * gap
      const ring = rings[i]
      const skill = ring?.skillId ? SKILLS.find((item) => item.id === ring.skillId) : null

      const frame = this.add.graphics().setDepth(3)
      frame.fillStyle(0x111122, 0.72)
      frame.fillRoundedRect(x - 24, y - 24, 48, 48, 6)
      frame.lineStyle(2, ring ? 0xc8a84e : 0x333333, 0.7)
      frame.strokeRoundedRect(x - 24, y - 24, 48, 48, 6)

      const cooldownMask = this.add.graphics().setDepth(6)
      const hotkeyLabel = this.add.text(x - 20, y - 22, String(i + 1), {
        fontFamily: 'Microsoft YaHei',
        fontSize: '10px',
        color: '#f8d98a',
      }).setDepth(7)
      const cooldownLabel = this.add.text(x, y, '', {
        fontFamily: 'Microsoft YaHei',
        fontSize: '13px',
        color: '#ffffff',
        stroke: '#000',
        strokeThickness: 3,
        fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(7)

      let icon: Phaser.GameObjects.Image | undefined
      if (skill) icon = this.add.image(x, y, `skill_icon_${skill.id}`).setDisplaySize(36, 36).setDepth(4)
      else this.add.text(x, y, '-', { fontFamily: 'Microsoft YaHei', fontSize: '10px', color: '#555' }).setOrigin(0.5)

      this.skillSlotUis.push({ icon, cooldownMask, cooldownLabel, hotkeyLabel })
      this.add.rectangle(x, y, 48, 48, 0xffffff, 0.001)
        .setDepth(8)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.castPlayerSkill(i + 1))
    }
    this.refreshSkillBarState()
  }

  private bindSkillKeys() {
    if (!this.input.keyboard) return
    const codes = [
      Phaser.Input.Keyboard.KeyCodes.ONE,
      Phaser.Input.Keyboard.KeyCodes.TWO,
      Phaser.Input.Keyboard.KeyCodes.THREE,
      Phaser.Input.Keyboard.KeyCodes.FOUR,
      Phaser.Input.Keyboard.KeyCodes.FIVE,
      Phaser.Input.Keyboard.KeyCodes.SIX,
      Phaser.Input.Keyboard.KeyCodes.SEVEN,
      Phaser.Input.Keyboard.KeyCodes.EIGHT,
      Phaser.Input.Keyboard.KeyCodes.NINE,
    ]
    for (let i = 1; i <= 9; i++) this.skillKeys[String(i)] = this.input.keyboard.addKey(codes[i - 1]!)
  }

  private handleSkillKeys() {
    for (let i = 1; i <= 9; i++) {
      const key = this.skillKeys[String(i)]
      if (key && Phaser.Input.Keyboard.JustDown(key)) this.castPlayerSkill(i)
    }
  }

  private tryAutoSkill() {
    if (!this.autoBattle || this.battleClock < this.playerLockedUntil) return
    const rings = useGameStore().character?.rings ?? []
    for (let i = 0; i < rings.length; i++) {
      const skill = rings[i]?.skillId ? SKILLS.find((item) => item.id === rings[i]!.skillId) : null
      if (!skill) continue
      if ((this.skillCooldownEnds.get(i + 1) ?? 0) <= this.battleClock && this.canPaySkill(skill)) {
        this.castPlayerSkill(i + 1, true)
        return
      }
    }
  }

  private tryAutoAttack() {
    if (this.autoBattle) this.performPlayerAttack(true)
  }

  private performPlayerAttack(silent = false) {
    if (this.battleOver || this.battleClock < this.playerNextActionAt || this.battleClock < this.playerLockedUntil) return
    const stats = useGameStore().character?.stats
    if (!stats) return
    this.playerLockedUntil = this.battleClock + 1000
    this.playerNextActionAt = this.battleClock + playerAttackIntervalMs(effectivePlayerStat(stats, this.effects, 'atkSpeed', this.battleClock))
    audioManager.playClick()
    if (!silent) this.showBattleHint('普通攻击', '#f6e1a1')
    this.time.delayedCall(420, () => this.doNormalAttack())
  }

  private tryMonsterAction() {
    if (this.battleClock < this.monsterNextActionAt || this.battleClock < this.monsterLockedUntil) return
    if (this.battleClock < this.monsterControlledUntil) return

    this.monsterLockedUntil = this.battleClock + 1650
    this.monsterNextActionAt = this.battleClock + Math.max(1800, 2800 - this.monster.level * 4)
    const skill = this.chooseMonsterSkill()
    this.time.delayedCall(560, () => {
      if (skill) this.executeMonsterSkill(skill)
      else this.enemyAttack()
    })
  }

  private castPlayerSkill(slot: number, silent = false) {
    if (this.battleOver || this.battleClock < this.playerLockedUntil) {
      if (!silent) this.showBattleHint('动作未结束', '#ffd36b')
      return
    }
    const stats = useGameStore().character?.stats
    const ring = useGameStore().character?.rings[slot - 1]
    const skill = ring?.skillId ? SKILLS.find((item) => item.id === ring.skillId) : null
    if (!stats || !skill) return
    const cooldownEnd = this.skillCooldownEnds.get(slot) ?? 0
    if (cooldownEnd > this.battleClock) {
      if (!silent) this.showBattleHint('魂技冷却 ' + secondsRemaining(cooldownEnd, this.battleClock) + ' 秒', '#ffd36b')
      return
    }
    if (stats.mp < skill.mpCost) {
      if (!silent) this.showBattleHint('魂力不足', '#6dc8ff')
      return
    }

    stats.mp -= skill.mpCost
    this.skillCooldownEnds.set(slot, this.battleClock + skillCooldownMs(skill))
    this.playerLockedUntil = this.battleClock + 2100
    this.playerNextActionAt = Math.max(this.playerNextActionAt, this.battleClock + 1800)
    useGameStore().saveGame()
    audioManager.playSkill()
    this.showSkillName(skill.name + '：' + skillEffectText(skill))
    this.logBattle('释放魂技 ' + skill.name + '，消耗 ' + skill.mpCost + ' 点魂力。')
    this.animateSkill(this.playerSprite, this.monsterSprite, skill.type, skill.id)
    this.time.delayedCall(1180, () => this.resolvePlayerSkill(skill))
  }

  private resolvePlayerSkill(skill: SkillDef) {
    if (this.battleOver) return
    const stats = useGameStore().character?.stats
    if (!stats) return
    const monsterDef = effectiveMonsterStat(this.monster.def, this.effects, 'def', this.battleClock)

    if (skill.type === 'damage') {
      const specialHpSkill = skill.id === 'blood_fight' || skill.id === 'titan_fist' || skill.id === 'massacre'
      const result = specialHpSkill
        ? { damage: Math.max(1, Math.floor((skill.id === 'massacre' ? this.monster.hp : skill.id === 'titan_fist' ? this.monster.maxHp : stats.hp) * (skill.damageMultiplier ?? 0.25) * 0.6)), crit: false }
        : calculatePlayerDamage(stats, monsterDef, this.effects, this.battleClock, skill.damageMultiplier ?? 1.6)
      this.monster.hp = Math.max(0, this.monster.hp - result.damage)
      this.showDamage(this.monsterSprite.x, this.monsterSprite.y - 58, result.damage, result.crit)
      this.logBattle(skill.name + ' 命中 ' + this.monster.name + '，造成 ' + result.damage + ' 点伤害' + (result.crit ? '，触发暴击' : '') + '。')
      this.spawnHitEffect(this.monsterSprite.x, this.monsterSprite.y - 68, result.crit)
    } else if (skill.type === 'control') {
      const duration = (skill.controlDuration ?? 2) * 1000
      this.monsterControlledUntil = Math.max(this.monsterControlledUntil, this.battleClock + duration)
      if (skill.damageMultiplier) {
        const result = calculatePlayerDamage(stats, monsterDef, this.effects, this.battleClock, skill.damageMultiplier)
        this.monster.hp = Math.max(0, this.monster.hp - result.damage)
        this.showDamage(this.monsterSprite.x, this.monsterSprite.y - 58, result.damage, result.crit)
        this.logBattle(skill.name + ' 控制 ' + this.monster.name + '，造成 ' + result.damage + ' 点伤害。')
      } else {
        this.showDamage(this.monsterSprite.x, this.monsterSprite.y - 58, 0, false, true)
        this.logBattle(skill.name + ' 控制了 ' + this.monster.name + '。')
      }
      this.spawnHitEffect(this.monsterSprite.x, this.monsterSprite.y - 68, false)
    } else if (skill.type === 'debuff' && skill.statDebuff) {
      this.effects.push({
        id: skill.id,
        owner: 'monster',
        stat: skill.statDebuff.stat,
        multiplier: skill.statDebuff.multiplier,
        expiresAt: this.battleClock + skill.statDebuff.duration * 1000,
      })
      if (skill.damageMultiplier) {
        const result = calculatePlayerDamage(stats, monsterDef, this.effects, this.battleClock, skill.damageMultiplier)
        this.monster.hp = Math.max(0, this.monster.hp - result.damage)
        this.showDamage(this.monsterSprite.x, this.monsterSprite.y - 58, result.damage, result.crit)
        this.logBattle(skill.name + ' 削弱 ' + this.monster.name + '，造成 ' + result.damage + ' 点伤害。')
      } else {
        this.showDamage(this.monsterSprite.x, this.monsterSprite.y - 58, 0, false, true)
        this.logBattle(skill.name + ' 使 ' + this.monster.name + ' 进入削弱状态。')
      }
    } else if (skill.type === 'buff' && skill.statBuff) {
      this.effects.push({
        id: skill.id,
        owner: 'player',
        stat: skill.statBuff.stat,
        multiplier: skill.statBuff.multiplier,
        expiresAt: this.battleClock + skill.statBuff.duration * 1000,
      })
      this.showDamage(this.playerSprite.x, this.playerSprite.y - 58, 0, false, false, true)
      this.logBattle(skill.name + ' 生效，' + skillEffectText(skill) + '。')
    } else if (skill.type === 'heal') {
      const heal = Math.floor(stats.maxHp * (skill.healAmount ?? 20) / 100)
      stats.hp = Math.min(stats.maxHp, stats.hp + heal)
      this.showDamage(this.playerSprite.x, this.playerSprite.y - 58, heal, false, false, true)
      this.logBattle(skill.name + ' 恢复 ' + heal + ' 点生命。')
    }

    useGameStore().saveGame()
    this.checkMonsterDeath()
  }

  private doNormalAttack() {
    if (this.battleOver) return
    const stats = useGameStore().character?.stats
    if (!stats) return
    const monsterDef = effectiveMonsterStat(this.monster.def, this.effects, 'def', this.battleClock)
    const { damage, crit } = calculatePlayerDamage(stats, monsterDef, this.effects, this.battleClock)
    this.monster.hp = Math.max(0, this.monster.hp - damage)
    this.showDamage(this.monsterSprite.x, this.monsterSprite.y - 58, damage, crit)
    this.spawnHitEffect(this.monsterSprite.x, this.monsterSprite.y - 68, crit)
    this.animateAttack(this.playerSprite, this.monsterSprite, 18)
    audioManager.playHit()
    this.logBattle('普通攻击命中 ' + this.monster.name + '，造成 ' + damage + ' 点伤害' + (crit ? '，触发暴击' : '') + '。')
    this.checkMonsterDeath()
  }

  private enemyAttack() {
    if (this.battleOver) return
    const gameStore = useGameStore()
    const stats = gameStore.character?.stats
    if (!stats) return
    const dodgeRate = effectivePlayerStat(stats, this.effects, 'dodgeRate', this.battleClock)
    if (Math.random() < Math.min(85, dodgeRate) / 100) {
      this.showDamage(this.playerSprite.x, this.playerSprite.y - 58, 0, false, true)
      this.animateAttack(this.monsterSprite, this.playerSprite, -18)
      this.logBattle(this.monster.name + ' 发起攻击，你闪避成功。')
      return
    }

    const monsterAtk = effectiveMonsterStat(this.monster.atk, this.effects, 'atk', this.battleClock)
    const playerDef = effectivePlayerStat(stats, this.effects, 'def', this.battleClock)
    const damage = calculateMonsterDamage(monsterAtk, playerDef)
    stats.hp = Math.max(0, stats.hp - damage)
    gameStore.saveGame()
    this.showDamage(this.playerSprite.x, this.playerSprite.y - 58, damage, false, true)
    this.spawnHitEffect(this.playerSprite.x, this.playerSprite.y - 68, false)
    this.animateAttack(this.monsterSprite, this.playerSprite, -18)
    audioManager.playHit()
    this.logBattle(this.monster.name + ' 普通攻击，造成 ' + damage + ' 点伤害。')
    if (stats.hp <= 0) this.playerDefeat()
  }

  private executeMonsterSkill(skill: MonsterSkill) {
    if (this.battleOver) return
    const gameStore = useGameStore()
    const stats = gameStore.character?.stats
    if (!stats) return
    this.showSkillName(skill.name)
    this.animateSkill(this.monsterSprite, this.playerSprite, 'damage', skill.id)
    const monsterAtk = effectiveMonsterStat(this.monster.atk, this.effects, 'atk', this.battleClock)
    const playerDef = effectivePlayerStat(stats, this.effects, 'def', this.battleClock)
    const damage = Math.max(6, Math.floor(calculateMonsterDamage(monsterAtk * skill.damageMultiplier, playerDef)))
    stats.hp = Math.max(0, stats.hp - damage)
    gameStore.saveGame()
    this.showDamage(this.playerSprite.x, this.playerSprite.y - 58, damage, false, true)
    this.spawnHitEffect(this.playerSprite.x, this.playerSprite.y - 68, true)
    audioManager.playSkill()
    this.logBattle(this.monster.name + ' 释放魂技 ' + skill.name + '，造成 ' + damage + ' 点伤害。')
    if (stats.hp <= 0) this.playerDefeat()
  }

  private chooseMonsterSkill(): MonsterSkill | null {
    const ready = this.monsterSkills.filter((skill) => (this.monsterSkillCooldownEnds.get(skill.id) ?? 0) <= this.battleClock)
    if (ready.length === 0 || Math.random() > (this.monster.level >= 40 ? 0.32 : 0.22)) return null
    const skill = Phaser.Utils.Array.GetRandom(ready)
    this.monsterSkillCooldownEnds.set(skill.id, this.battleClock + skill.cooldown * 1000)
    return skill
  }

  private buildMonsterSkills(): MonsterSkill[] {
    const base = this.monster.level >= 40 ? 1.55 : this.monster.level >= 20 ? 1.35 : 1.2
    return [
      { id: this.monster.id + '_feral_strike', cooldown: 7, name: '魂兽猛击', damageMultiplier: base },
      { id: this.monster.id + '_beast_roar', cooldown: 10, name: '魂兽怒吼', damageMultiplier: base + 0.25 },
    ]
  }

  private refreshSkillBarState() {
    const rings = useGameStore().character?.rings ?? []
    const stats = useGameStore().character?.stats
    const y = this.cameras.main.height - 48
    this.skillSlotUis.forEach((slotUi, index) => {
      const slot = index + 1
      const ring = rings[index]
      const skill = ring?.skillId ? SKILLS.find((item) => item.id === ring.skillId) : null
      const cooldownEnd = this.skillCooldownEnds.get(slot) ?? 0
      const remain = secondsRemaining(cooldownEnd, this.battleClock)
      const x = 188 + index * 62
      const canCast = !!skill && !!stats && stats.mp >= skill.mpCost && remain <= 0 && this.battleClock >= this.playerLockedUntil

      slotUi.cooldownMask.clear()
      slotUi.hotkeyLabel.setColor(canCast ? '#f8d98a' : '#786f62')
      slotUi.icon?.setAlpha(canCast ? 1 : 0.42)

      if (remain > 0) {
        slotUi.cooldownMask.fillStyle(0x000000, 0.62)
        slotUi.cooldownMask.fillRoundedRect(x - 24, y - 24, 48, 48, 6)
        slotUi.cooldownLabel.setText(remain + 's')
      } else if (skill && stats && stats.mp < skill.mpCost) {
        slotUi.cooldownMask.fillStyle(0x14324d, 0.48)
        slotUi.cooldownMask.fillRoundedRect(x - 24, y - 24, 48, 48, 6)
        slotUi.cooldownLabel.setText('魂力')
      } else {
        slotUi.cooldownLabel.setText('')
      }
    })
  }

  private refreshStatus() {
    const readyIn = secondsRemaining(Math.max(this.playerNextActionAt, this.playerLockedUntil), this.battleClock)
    if (this.normalAttackUi) {
      this.normalAttackUi.cooldownMask.clear()
      if (readyIn > 0) {
        this.normalAttackUi.cooldownMask.fillStyle(0x000000, 0.58)
        this.normalAttackUi.cooldownMask.fillCircle(84, this.cameras.main.height - 48, 31)
      }
      this.normalAttackUi.cooldownLabel.setText(readyIn > 0 ? readyIn + 's' : '')
    }
    if (this.monsterControlledUntil > this.battleClock) {
      this.statusText?.setText('魂兽被控制 ' + secondsRemaining(this.monsterControlledUntil, this.battleClock) + ' 秒')
    } else if (this.playerLockedUntil > this.battleClock) {
      this.statusText?.setText('当前动作执行中，请稍候')
    } else if (this.autoBattle) {
      this.statusText?.setText('自动战斗已开启，会自动普攻和释放魂技')
    } else {
      this.statusText?.setText('手动战斗：点击普通攻击或魂技出手')
    }
  }

  private canPaySkill(skill: SkillDef): boolean {
    const stats = useGameStore().character?.stats
    return !!stats && stats.mp >= skill.mpCost
  }

  private toggleAutoBattle() {
    this.autoBattle = !this.autoBattle
    audioManager.playClick()
    this.autoBattleImage?.setAlpha(this.autoBattle ? 1 : 0.78)
    if (this.autoBattle) this.autoBattleImage?.clearTint()
    else this.autoBattleImage?.setTint(0xb7b7b7)
    this.logBattle(this.autoBattle ? '自动战斗已开启。' : '已切换为手动战斗。')
  }

  private checkMonsterDeath() {
    if (this.monster.hp > 0) return
    this.monster.hp = 0
    this.battleOver = true
    this.monsterDeath()
  }

  private monsterDeath() {
    const gameStore = useGameStore()
    const character = gameStore.character
    const shouldDropSpiritRing = this.battleMode === 'hunt' && !!character && canDropSpiritRing(character.level, character.rings)
    gameStore.addExp(this.monster.expReward)
    gameStore.addGold(this.monster.goldReward)
    const drops: BattleDrop[] = []
    for (const drop of this.monster.dropTable) {
      if (Math.random() < drop.chance) {
        gameStore.addItem(drop.itemId, 1)
        drops.push({ itemId: drop.itemId })
      }
    }
    if (shouldDropSpiritRing) {
      const ringItemId = spiritRingItemForLevel(this.monster.level)
      const ringYear = spiritRingYearForMonsterLevel(this.monster.level)
      gameStore.addSpiritRingItem(ringItemId, ringYear, 1)
      drops.unshift({ itemId: ringItemId, year: ringYear })
    }

    this.tweens.add({ targets: this.monsterSprite, alpha: 0, y: this.monsterSprite.y - 44, duration: 700, ease: 'Power2' })
    const dropText = drops.length > 0 ? '\n掉落：' + drops.map((drop) => this.dropLabel(drop)).join('、') : ''
    audioManager.playVictory()
    this.logBattle('战斗胜利，获得经验 +' + this.monster.expReward + '，金币 +' + this.monster.goldReward + (drops.length > 0 ? '，掉落 ' + drops.map((drop) => this.dropLabel(drop)).join('、') : '') + '。')
    this.showResult('战斗胜利', '经验 +' + this.monster.expReward + '   金币 +' + this.monster.goldReward + dropText, this.onVictory)
  }

  private dropLabel(drop: BattleDrop): string {
    const { itemId, year } = drop
    if (itemId.startsWith('spirit_ring_')) return spiritRingLabelWithYear(itemId, year)
    return itemLabels[itemId]?.name ?? ITEMS.find((item) => item.id === itemId)?.name ?? itemId
  }

  private playerDefeat() {
    if (this.battleOver) return
    this.battleOver = true
    const gameStore = useGameStore()
    const stats = gameStore.character?.stats
    if (stats) {
      stats.hp = Math.max(1, Math.floor(stats.maxHp * 0.35))
      gameStore.saveGame()
    }
    this.tweens.add({ targets: this.playerSprite, alpha: 0.35, duration: 260 })
    audioManager.playDefeat()
    this.logBattle('战斗失败，已恢复到安全状态。')
    this.showResult('战斗失败', '已恢复到安全状态', this.onDefeat)
  }

  private showResult(title: string, subTitle: string, callback?: () => void) {
    const w = this.cameras.main.width
    this.add.rectangle(w / 2, 190, 460, 198, 0x05070d, 0.82).setDepth(95)
    this.add.text(w / 2, 138, title, {
      fontFamily: 'Microsoft YaHei',
      fontSize: '34px',
      color: title.includes('胜利') ? '#ffd700' : '#ff6b6b',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 5,
    }).setOrigin(0.5).setDepth(100)
    this.add.text(w / 2, 200, subTitle, {
      fontFamily: 'Microsoft YaHei',
      fontSize: '16px',
      color: '#f5e7bf',
      align: 'center',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(100)

    const backBtn = this.add.text(w / 2, 272, '[ 继续冒险 ]', {
      fontFamily: 'Microsoft YaHei',
      fontSize: '18px',
      color: '#c8a84e',
      stroke: '#000',
      strokeThickness: 3,
      padding: { x: 20, y: 8 },
    }).setOrigin(0.5).setDepth(100).setInteractive({ useHandCursor: true })
    backBtn.on('pointerover', () => backBtn.setColor('#ffd700'))
    backBtn.on('pointerout', () => backBtn.setColor('#c8a84e'))
    backBtn.on('pointerdown', () => this.finishBattle(callback))
  }

  private showSkillName(name: string) {
    const text = this.add.text(this.cameras.main.width / 2, 128, name, {
      fontFamily: 'Microsoft YaHei',
      fontSize: '20px',
      color: '#ffd700',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(100)
    this.tweens.add({ targets: text, alpha: 0, y: 104, duration: 1450, onComplete: () => text.destroy() })
  }

  private showDamage(x: number, y: number, value: number, isCrit: boolean, incoming = false, positive = false) {
    const label = value === 0 ? (incoming ? '闪避' : '控制') : (positive ? '+' : '-') + value + (isCrit ? ' 暴击' : '')
    const text = this.add.text(x + Math.random() * 20 - 10, y, label, {
      fontFamily: 'Microsoft YaHei',
      fontSize: isCrit ? '20px' : '15px',
      color: positive ? '#6dff8d' : value === 0 ? '#7ce7ff' : incoming ? '#ffb0a0' : isCrit ? '#ff4444' : '#ffffff',
      stroke: '#000',
      strokeThickness: 3,
      fontStyle: isCrit ? 'bold' : '',
    }).setOrigin(0.5).setDepth(100)
    this.tweens.add({ targets: text, y: y - 40, alpha: 0, duration: 1150, onComplete: () => text.destroy() })
  }

  private showBattleHint(text: string, color: string) {
    const tip = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 132, text, {
      fontFamily: 'Microsoft YaHei',
      fontSize: '16px',
      color,
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(60)
    this.tweens.add({ targets: tip, y: tip.y - 22, alpha: 0, duration: 850, onComplete: () => tip.destroy() })
  }

  private animateAttack(from: Phaser.GameObjects.Sprite, to: Phaser.GameObjects.Sprite, offset: number) {
    this.tweens.add({ targets: from, x: from.x + offset, duration: 180, yoyo: true })
    this.tweens.add({ targets: to, alpha: 0.34, duration: 120, yoyo: true, repeat: 1 })
  }

  private spawnHitEffect(x: number, y: number, critical: boolean) {
    const key: BattleEffectKey = critical ? 'effect_skill_burst' : 'effect_skill_hit'
    const effect = this.add.image(x, y, key).setDepth(65).setAlpha(0.85)
    const endScale = this.fitImageScale(effect, critical ? 96 : 76, critical ? 96 : 76)
    effect.setScale(endScale * 0.7)
    this.tweens.add({
      targets: effect,
      scale: endScale,
      alpha: 0,
      angle: critical ? 12 : -8,
      duration: critical ? 760 : 620,
      ease: 'Quad.easeOut',
      onComplete: () => effect.destroy(),
    })
  }

  private animateSkill(from: Phaser.GameObjects.Sprite, to: Phaser.GameObjects.Sprite, type: string, skillId = '') {
    this.tweens.add({ targets: from, scale: from.scale * 1.06, duration: 220, yoyo: true })
    const effectKey = battleEffectForSkill(skillId, type)
    const target = type === 'heal' || type === 'buff' ? from : to
    const effect = this.add.image(target.x, target.y - 72, effectKey).setDepth(70).setAlpha(0)
    const endScale = this.fitImageScale(effect, 132, 118)
    effect.setScale(endScale * 0.45)
    this.tweens.add({
      targets: effect,
      alpha: { from: 0, to: 0.92 },
      scale: { from: endScale * 0.45, to: endScale },
      angle: type === 'buff' || type === 'heal' ? 0 : 10,
      duration: 420,
      yoyo: true,
      hold: 620,
      onComplete: () => effect.destroy(),
    })
    if (type !== 'heal' && type !== 'buff') {
      this.tweens.add({ targets: to, x: to.x + 12, duration: 100, yoyo: true, repeat: 2 })
      this.tweens.add({ targets: to, alpha: 0.3, duration: 130, yoyo: true, repeat: 2 })
    }
  }

  private finishBattle(callback?: () => void) {
    if (this.exitingBattle) return
    this.exitingBattle = true
    this.input.enabled = false
    this.handleSceneShutdown()
    this.scene.stop('BattleScene')
    audioManager.playCityBgm()
    window.requestAnimationFrame(() => callback?.())
  }

  private escapeBattle() {
    if (this.battleOver || this.exitingBattle) return
    this.battleOver = true
    this.logBattle('你主动离开了战斗。')
    this.showResult('已脱离战斗', '本次战斗已结束，未获得奖励', this.onDefeat ?? this.onVictory)
  }

  private logBattle(text: string) {
    useUIStore().pushLog('battle', text)
  }

  private handleSceneShutdown() {
    for (const redraw of this.hpBarUpdaters) this.events.off('update', redraw)
    this.hpBarUpdaters = []
    this.skillCooldownEnds.clear()
    this.monsterSkillCooldownEnds.clear()
    this.skillKeys = {}
    this.effects = []
    this.tweens.killAll()
    this.time.removeAllEvents()
    this.input.keyboard?.removeAllKeys(true)
    this.children.removeAll(true)
  }
}
