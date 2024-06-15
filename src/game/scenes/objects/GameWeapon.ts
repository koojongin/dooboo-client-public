import { OnCollisionSprite } from '@/game/scenes/interfaces/onCollision'
import { FightScene } from '@/game/scenes/interfaces/scene.interface'

export class GameWeapon
  extends Phaser.Physics.Arcade.Sprite
  implements OnCollisionSprite
{
  scene!: FightScene

  group: Phaser.GameObjects.Group

  speed = 100

  bounce = 1

  constructor(
    scene: FightScene,
    x: number,
    y: number,
    key: string,
    group: Phaser.GameObjects.Group,
  ) {
    // need a wrapper Class to properly set the Matter World

    super(scene, x, y, key)
    this.scene = scene
    this.group = group
    this.group.add(this, true)
    // this.scene.physics.add.existing(this)
    this.setDisplaySize(20, 20)
    this.setActive(true)
  }

  init() {
    this.setCollideWorldBounds(true)
    // this.setVelocity(this.speed, 0)
    // this.setAngularAcceleration(1000)
    this.setAngularVelocity(1000)
    // this.setAccelerationX(100)
    this.setBounce(1)
    this.setCircle(5)

    const { body } = this as { body: Phaser.Physics.Arcade.Body }
    body.onWorldBounds = true
  }

  onCollision(target: OnCollisionSprite) {
    target.onDamaged!(this)
    this.destroy()
  }

  onCollisionWorldBounds() {
    // this.destroy()
  }

  update() {
    const children =
      this.scene.monsterGroup.getChildren() as Phaser.GameObjects.Sprite[]
    if (children.length <= 0) return
    const closestChild = this.findClosest(this, children)
    if (closestChild && !this.scene.player.isSpread) {
      this.scene.physics.moveToObject(this, closestChild, this.speed)
    }
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
