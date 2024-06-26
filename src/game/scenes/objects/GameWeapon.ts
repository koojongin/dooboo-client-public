import _ from 'lodash'
import { OnCollisionSprite } from '@/game/scenes/interfaces/onCollision'
// eslint-disable-next-line import/no-cycle
import { FightScene } from '@/game/scenes/interfaces/scene.interface'
// eslint-disable-next-line import/no-cycle
import { GameMonster } from '@/game/scenes/objects/GameMonster'
// eslint-disable-next-line import/no-cycle
import { pickByRate } from '@/game/util'
import { SkillKind } from '@/interfaces/skill.interface'
import { formatNumber } from '@/services/util'
import { BA_COLOR, BA_FAMILY } from '@/constants/constant'

export class GameWeapon
  extends Phaser.Physics.Arcade.Sprite
  implements OnCollisionSprite
{
  tag = 'GameWeapon'

  scene!: FightScene

  group: Phaser.GameObjects.Group

  speed = 100

  bounce = 1

  pierce = 0

  pierced = 0

  collidedMonsters: string[] = []

  projectiles = 3

  isChildArrow = false

  constructor(
    scene: FightScene,
    x: number,
    y: number,
    key: string,
    group: Phaser.GameObjects.Group,
    isChildArrow: boolean = false,
  ) {
    // need a wrapper Class to properly set the Matter World

    super(scene, x, y, key)
    this.scene = scene
    this.group = group
    this.group.add(this, true)
    // this.scene.physics.add.existing(this)
    this.setImmovable(true)
    this.setDisplaySize(20, 20)
    this.setActive(true)
    this.isChildArrow = isChildArrow
    this.init()
  }

  init() {
    this.projectiles += this.scene.resultOfMe.stat.moreProjectiles
    this.setCollideWorldBounds(true)
    this.setAngularVelocity(1000)
    this.setCircle(5)
    this.pierce = this.scene.resultOfMe.stat.pierce
    const { body } = this as { body: Phaser.Physics.Arcade.Body }
    body.onWorldBounds = true
    // this.fireClosest()

    if (this.isChildArrow) return
    const children =
      this.scene.monsterGroup.getChildren() as Phaser.GameObjects.Sprite[]
    if (children.length <= 0) return
    const closestChild: Phaser.GameObjects.Sprite = this.findClosest(
      this.scene.player,
      children,
    )!
    const angle = this.getAngle(this.scene.player, closestChild)
    console.log(angle)
    ;[this, ..._.range(this.projectiles - 1)]
      .map((value) => {
        if (typeof value === 'object') return value
        return new GameWeapon(
          this.scene,
          this.x,
          this.y,
          'weapon',
          this.group,
          true,
        )
      })
      .forEach((weapon: GameWeapon, index) => {
        const nthProjectileAngle = (90 / this.projectiles) * index
        const radian = Phaser.Math.DegToRad(angle - nthProjectileAngle)

        const velocity = {
          x: Math.cos(radian) * weapon.speed,
          y: Math.sin(radian) * weapon.speed,
        }
        weapon.setVelocity(velocity.x, velocity.y)
      })
    this.scene.player.currentMp -= this.scene.resultOfMe.stat.mpConsumption
    this.scene.statusBox.mpBar.update()
  }

  update() {
    if (!this.scene) return
    if (this.body?.velocity.x === 0 && this.body.velocity.y === 0) {
      this.destroy()
    }
  }

  onCollision(target: OnCollisionSprite) {
    // target.onDamaged!(this)
    // this.destroy()
    const monsterId = (target as GameMonster).id
    if (this.collidedMonsters.includes(monsterId)) return
    // if (this.isDeadReady()) return
    this.onCollisionWithMonster(target)
    this.pierced += 1
    this.collidedMonsters.push(monsterId)
    if (this.isDeadReady()) {
      this.destroy()
    }
  }

  isDeadReady() {
    return this.pierce <= this.pierced && this.collidedMonsters.length > 0
  }

  onCollisionWorldBounds() {
    this.destroy()
  }

  onCollisionWithMonster(monster: OnCollisionSprite) {
    this.attack.call(this, monster)
  }

  attack(monster: OnCollisionSprite) {
    if (!monster || !monster?.active) return
    const { stat } = this.scene.resultOfMe
    const { damage, activeSkills } = stat

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
    totalDamage *= 10

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

  fireClosest() {
    const children =
      this.scene.monsterGroup.getChildren() as Phaser.GameObjects.Sprite[]
    if (children.length <= 0) return
    const closestChild: Phaser.GameObjects.Sprite = this.findClosest(
      this,
      children,
    )!
    if (closestChild && !this.scene.player.isSpread) {
      const angle = Phaser.Math.Angle.Between(
        this.x,
        this.y,
        closestChild.x,
        closestChild.y,
      )
      this.setVelocity(
        Math.cos(angle) * this.speed,
        Math.sin(angle) * this.speed,
      )
      // this.scene.physics.moveToObject(this, closestChild, this.speed)
    }

    if (!closestChild) this.destroy()
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
