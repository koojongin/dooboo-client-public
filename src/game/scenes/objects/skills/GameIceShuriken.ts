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

export class GameIceShuriken extends Phaser.Physics.Arcade.Sprite {
  scene!: FightScene

  radius = 70

  pierce = 0

  pierced = 0

  speed = 200

  collidedMonsters: string[] = []

  group: Phaser.GameObjects.Group

  tween?: Phaser.Tweens.Tween

  projectiles = 1

  isChildObject = false

  isForkedProjectile = false

  duration = 1000

  repeatDelay = 100

  preservedTime = 0

  timerEvent?: Phaser.Time.TimerEvent

  constructor(
    scene: FightScene,
    x: number,
    y: number,
    group: Phaser.GameObjects.Group,
    isChildObject: boolean = false,
  ) {
    super(scene, x, y, Resource.SkillsKey, 'shuriken')
    this.scene = scene
    this.group = group
    this.group.add(this, true)
    this.isChildObject = isChildObject
    this.setImmovable(true)
    this.init()
  }

  init() {
    this.duration += this.scene.resultOfMe.stat.moreDuration
    this.setImmovable(true)
    this.setMass(0)
    this.projectiles += this.scene.resultOfMe.stat.moreProjectiles
    this.pierce = this.scene.resultOfMe.stat.pierce
    this.setDisplaySize(20, 20)
    this.setActive(true)
    this.setAngularVelocity(1000)
    this.timerEvent = this.scene.time.addEvent({
      delay: this.repeatDelay,
      callback: this.checkOverlap,
      callbackScope: this,
      loop: true,
    })
    if (this.isChildObject) return
    const shurikens = [this, ..._.range(this.projectiles - 1)]
    shurikens
      .map((value) => {
        if (typeof value === 'object') return value
        return new GameIceShuriken(this.scene, this.x, this.y, this.group, true)
      })
      .forEach((shuriken, index) => {
        shuriken.rotateCircle(index / shurikens.length)
      })

    this.scene.player.currentMp -= this.scene.resultOfMe.stat.mpConsumption
    this.scene.statusBox.mpBar.update()
  }

  checkOverlap() {
    if (!this.timerEvent) return
    if (this.preservedTime >= 1000) this.collidedMonsters = []
    this.preservedTime += this.repeatDelay
    if (this.scene.monsterGroup.getLength() <= 0) return

    this.scene.monsterGroup.getChildren().forEach((monster) => {
      if (!this.scene) return
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

  rotateCircle(angle: number = 0) {
    const startAngle = Phaser.Math.PI2 * angle // 임의의 시작 각도 선택 (0부터 2π 사이)
    const rotateDuration = 1000 // 한 바퀴를 도는 데 걸리는 시간 (ms)

    this.tween = this.scene.tweens.add({
      targets: this,
      x: this.scene.player.x + this.radius * Math.cos(startAngle),
      y: this.scene.player.y + this.radius * Math.sin(startAngle),
      duration: rotateDuration,
      repeat: -1, // 무한 반복
      onUpdate: (tween) => {
        if (!this.active) return
        const { elapsed } = tween
        const currentAngle =
          startAngle + Phaser.Math.PI2 * (elapsed / rotateDuration)
        this.setPosition(
          this.scene.player.x + this.radius * Math.cos(currentAngle),
          this.scene.player.y + this.radius * Math.sin(currentAngle),
        )
      },
      onComplete: () => {
        this.destroy()
      },
    })
  }

  destroy() {
    if (this.tween) {
      this.tween.stop()
      this.tween.remove()
    }

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

    // if (!this.isForkedProjectile) {
    //   const childShuriken = new GameIceShuriken(
    //     this.scene,
    //     this.x,
    //     this.y,
    //     this.group,
    //     true,
    //   )
    //   childShuriken.isForkedProjectile = true
    //   const direction = new Phaser.Math.Vector2(
    //     childShuriken.x - this.scene.player.x,
    //     childShuriken.y - this.scene.player.y,
    //   ).normalize()
    //   childShuriken.setVelocity(
    //     direction.x * this.speed,
    //     direction.y * this.speed,
    //   )
    //   const acceleration = 10
    //   childShuriken.setAcceleration(
    //     direction.x * acceleration,
    //     direction.y * acceleration,
    //   )
    //   console.log(childShuriken.body?.velocity)
    // }
    if (this.isDeadReady()) {
      this.destroy()
    }
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
