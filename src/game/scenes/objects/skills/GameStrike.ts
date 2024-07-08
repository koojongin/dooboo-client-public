// eslint-disable-next-line import/no-cycle
import { FightScene } from '@/game/scenes/interfaces/scene.interface'
import { AnimationKey } from '@/game/scenes/enums/enum'
// eslint-disable-next-line import/no-cycle
import { GameMonster } from '@/game/scenes/objects/GameMonster'
// eslint-disable-next-line import/no-cycle
import { pickByRate } from '@/game/util'

export class GameStrike extends Phaser.Physics.Arcade.Sprite {
  scene!: FightScene

  radius = 2

  maxHitCount = 5

  collidedMonsters: string[] = []

  constructor(scene: FightScene, x: number, y: number) {
    super(scene, x, y, AnimationKey.Strike)
    this.scene = scene
    this.scene.add.existing(this)
    this.init()
  }

  init() {
    this.maxHitCount += this.scene.resultOfMe.stat.moreHitCount
    this.setScale(
      this.radius + this.scene.resultOfMe.stat.moreAreaOfEffect / 100,
    )
    this.play(AnimationKey.Strike)
    this.setFlip(true, false)
    this.on(
      Phaser.Animations.Events.ANIMATION_REPEAT,
      (anim: any) => {
        this.destroy()
      },
      this.scene,
    )
    const found = this.findOverlappingChildren(this.scene.monsterGroup)
    this.attack(found)
  }

  attack(monsters: GameMonster[]) {
    this.scene.player.currentMp -= this.scene.resultOfMe.stat.mpConsumption
    this.scene.statusBox.mpBar.update()
    monsters.slice(0, this.maxHitCount).forEach((monster) => {
      this.attackToMonster(monster)
    })
  }

  attackToMonster(monster: GameMonster) {
    if (!monster || !monster?.active) return
    const { stat } = this.scene.resultOfMe
    const { damage, turn } = stat
    const { criticalMultiplier, criticalRate } = stat
    const isCritical = pickByRate(criticalRate)

    let totalDamage = damage

    if (isCritical) {
      totalDamage *= 1 + criticalMultiplier / 100
    }

    if (this.scene.player.weapon) {
      const selectedMap = this.scene.resultOfMap.map
      const isDamageReductionCondition =
        this.scene.player.weapon.iLevel < selectedMap.level &&
        selectedMap.level > 30
      const DAMAGE_REDUCTION_RATE = 75
      if (isDamageReductionCondition) {
        totalDamage -= totalDamage * (DAMAGE_REDUCTION_RATE / 100)
      }
    }

    const monsterData = monster as GameMonster
    totalDamage = Math.max(
      totalDamage * (1 - monsterData.mData.resist / 100),
      0,
    )

    // totalDamage *= 10
    // eslint-disable-next-line no-param-reassign
    monsterData.currentHp -= totalDamage

    const textPosition = {
      x: (this.x + monster.x) / 2,
      y: (this.y + monster.y) / 2,
    }

    if (monsterData.currentHp <= 0) {
      monsterData.dead()
    }

    this.scene.player.showDamageText(textPosition, totalDamage, isCritical)
  }

  findOverlappingChildren(group: Phaser.GameObjects.Group) {
    const overlappingChildren: GameMonster[] = []

    group.children?.iterate((child: any) => {
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          this.getBounds(),
          child.getBounds(),
        )
      ) {
        if (child?.tag === 'GameMonster') {
          overlappingChildren.push(child)
        }
      }
      return true
    })

    return overlappingChildren
  }
}
