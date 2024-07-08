// eslint-disable-next-line import/no-cycle
import _ from 'lodash'
// eslint-disable-next-line import/no-cycle
import { FightScene } from '@/game/scenes/interfaces/scene.interface'
import { AnimationKey, Resource } from '@/game/scenes/enums/enum'
// eslint-disable-next-line import/no-cycle
import { GameMonster } from '@/game/scenes/objects/GameMonster'
// eslint-disable-next-line import/no-cycle
import { pickByRate } from '@/game/util'
import { OnCollisionSprite } from '@/game/scenes/interfaces/onCollision'

export class GameFireWall extends Phaser.Physics.Arcade.Sprite {
  scene!: FightScene

  radius = 100

  pierce = 0

  pierced = 0

  speed = 200

  collidedMonsters: string[] = []

  group: Phaser.GameObjects.Group

  timerEvent?: Phaser.Time.TimerEvent

  projectiles = 1

  isChildObject = false

  isForkedProjectile = false

  repeatDelay = 1000

  preservedTime = 0

  duration = 3000

  constructor(
    scene: FightScene,
    x: number,
    y: number,
    group: Phaser.GameObjects.Group,
    isChildObject: boolean = false,
  ) {
    super(scene, x, y, Resource.SkillsKey, 'fire-wall')
    this.scene = scene
    this.group = group
    this.group.add(this, true)
    this.isChildObject = isChildObject
    this.setImmovable(true)
    this.init()
  }

  init() {
    this.setImmovable(true)
    this.play(AnimationKey.FireWall)
    this.setActive(true)

    const multiplyScale = 1 + this.scene.resultOfMe.stat.moreAreaOfEffect / 100

    this.setScale(2 * multiplyScale, 3 * multiplyScale)
    this.body!.setSize(this.width, this.height)

    this.duration += this.scene.resultOfMe.stat.moreDuration
    const { x, y } = this.getRandomPositionOnCircleEdge(
      this.scene.player.x,
      this.scene.player.y,
      this.radius,
    )
    this.setPosition(x, y)
    this.scene.player.currentMp -= this.scene.resultOfMe.stat.mpConsumption
    this.scene.statusBox.mpBar.update()

    this.timerEvent = this.scene.time.addEvent({
      delay: this.repeatDelay,
      callback: this.checkOverlap,
      callbackScope: this,
      loop: true,
    })
  }

  getRandomPositionOnCircleEdge(
    centerX: number,
    centerY: number,
    radius: number,
  ) {
    const angle = Phaser.Math.FloatBetween(0, 2 * Math.PI)

    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)

    return { x, y }
  }

  checkOverlap() {
    if (!this.timerEvent) return
    if (!this.scene) return
    this.preservedTime += this.repeatDelay
    this.collidedMonsters = []
    if (this.scene.monsterGroup.getLength() <= 0) return

    this.scene.monsterGroup.getChildren().forEach((monster) => {
      const gMonster = monster as GameMonster
      const isOverlapped = Phaser.Geom.Intersects.RectangleToRectangle(
        gMonster.getBounds(),
        this.scene.player.getBounds(),
      )
      if (isOverlapped) {
        this.onCollision(monster as OnCollisionSprite)
      }
    })

    if (this.preservedTime >= this.duration) {
      this.destroy()
    }
  }

  destroy() {
    if (this.timerEvent) {
      this.timerEvent.remove()
    }

    super.destroy(true)
  }

  onCollision(target: OnCollisionSprite) {
    const monsterId = (target as GameMonster).id
    if (this.collidedMonsters.includes(monsterId)) return
    // if (this.isDeadReady()) return
    this.onCollisionWithMonster(target)
    this.pierced += 1
    this.collidedMonsters.push(monsterId)
  }

  isDeadReady() {
    return this.pierce <= this.pierced && this.collidedMonsters.length > 0
  }

  onCollisionWithMonster(monster: OnCollisionSprite) {
    if (!monster || !monster?.active) return
    const { stat } = this.scene.resultOfMe
    const { damage } = stat

    const { lessProjectileDamage, criticalMultiplier, criticalRate } = stat
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
    // totalDamage *= 10

    totalDamage = Math.max(
      totalDamage * (1 - monsterData.mData.resist / 100),
      0,
    )
    // eslint-disable-next-line no-param-reassign
    monsterData.currentHp -= totalDamage

    const textPosition = {
      x: (this.x + monster.x) / 2,
      y: (this.y + monster.y) / 2 - monster.displayHeight / 2,
    }

    if (monsterData.currentHp <= 0) {
      monsterData.dead()
    }

    this.scene.player.showDamageText(textPosition, totalDamage, isCritical)
  }

  getAngle(a: Phaser.GameObjects.Sprite, b: Phaser.GameObjects.Sprite) {
    const angleRadians = Phaser.Math.Angle.Between(a.x, a.y, b.x, b.y)
    const angleDegrees = Phaser.Math.RadToDeg(angleRadians)
    return angleDegrees
  }

  findClosest(
    startObject: Phaser.GameObjects.Sprite,
    objects: Phaser.GameObjects.Sprite[],
  ) {
    let closestDistance = Infinity
    let closestObject = null

    objects.forEach((object) => {
      const distance = Phaser.Math.Distance.Between(
        startObject.x,
        startObject.y,
        object.x,
        object.y,
      )
      if (distance < closestDistance) {
        closestDistance = distance
        closestObject = object
      }
    })

    return closestObject
  }
}
