import _ from 'lodash'
import { OnCollisionSprite } from '@/game/scenes/interfaces/onCollision'
import { Monster } from '@/interfaces/monster.interface'
import { FightScene } from '@/game/scenes/interfaces/scene.interface'
import { pickByRate, pickByRoll } from '@/game/util'
import { BA_COLOR, BA_FAMILY } from '@/constants/constant'
import { formatNumber } from '@/services/util'

export class GameMonster
  extends Phaser.Physics.Arcade.Sprite
  implements OnCollisionSprite
{
  scene!: FightScene

  group!: Phaser.GameObjects.Group

  mData!: Monster

  speed = 30

  maxHp!: number

  currentHp!: number

  mask!: Phaser.Display.Masks.GeometryMask

  maskGraphics!: Phaser.GameObjects.Graphics

  constructor(
    scene: FightScene,
    x: number,
    y: number,
    key: string,
    group: Phaser.GameObjects.Group,
    mData: Monster,
  ) {
    // need a wrapper Class to properly set the Matter World
    super(scene, x, y, key)
    this.scene = scene
    this.group = group
    this.mData = mData
    this.setDisplaySize(24, 24)
    this.setActive(true)

    // this.maskGraphics = this.scene.add.graphics()
    // this.maskGraphics.fillStyle(0xffffff) // White color
    // this.maskGraphics.fillCircle(this.x, this.y, this.displayWidth / 2)
    // this.mask = this.maskGraphics.createGeometryMask()
    // this.setMask(this.mask)
    this.group.add(this, true)
    this.init()
  }

  init() {
    this.setCollideWorldBounds(true)
    // this.setVelocity(-this.speed, 0)
    this.setBounce(10, 10)
    // this.setImmovable(false)
    this.currentHp = this.mData.hp
    this.maxHp = this.mData.hp
    this.scene.physics.moveToObject(this, this.scene.player, this.speed * 5)
  }

  onCollision(target: OnCollisionSprite) {
    // console.log(target)
  }

  onCollisionWithPlayer(target: OnCollisionSprite) {
    const dx = this.x - target.x
    const dy = this.y - target.y

    const distance = Math.sqrt(dx * dx + dy * dy)

    // 충돌 방향 벡터 단위화
    const destinationX = dx / distance
    const destinationY = dy / distance

    // 움직이는 스프라이트를 반대 방향으로 튕겨나가게 설정
    const bounceDistance = 50
    this.x += destinationX * bounceDistance
    this.y += destinationY * bounceDistance

    // 스프라이트의 속도 설정 (옵션)
    const bounceSpeed = 10
    this.setVelocity(destinationX * bounceSpeed, destinationY * bounceSpeed)
    this.scene.player.onDamaged(10)
  }

  update() {
    if (
      !Phaser.Geom.Intersects.RectangleToRectangle(
        this.scene.player.getBounds(),
        this.getBounds(),
      )
    ) {
      this.scene.physics.moveToObject(this, this.scene.player, this.speed)
    }

    /* const radius = this.displayWidth / 2
    this.maskGraphics.clear()
    this.maskGraphics.fillStyle(0xffffff)
    this.maskGraphics.fillCircle(this.x, this.y, radius)
    this.mask = this.maskGraphics.createGeometryMask() */
  }

  onDamaged(target: OnCollisionSprite) {
    const { stat } = this.scene.resultOfMe
    const { damage, turn } = stat
    const data = {
      repeated: 0,
    }
    this.scene.time.addEvent({
      delay: 50, // 1초 주기
      callback: () => {
        if (!this.scene) return
        this.attack(target, data)
      },
      callbackScope: this,
      repeat: turn - 1, // 5회 반복 (0부터 시작하므로 4)
    })
    this.attack.call(this, target, data)
  }

  attack(
    target: OnCollisionSprite,
    data: { repeated: number } = { repeated: 0 },
  ) {
    const { stat } = this.scene.resultOfMe
    const { damage, turn } = stat
    const { criticalMultiplier, criticalRate } = stat
    const isCritical = pickByRate(criticalRate)
    let totalDamage = damage
    if (isCritical) {
      totalDamage += damage * (criticalMultiplier / 100)
    }
    const collisionText = this.scene.add.text(
      (this.x + target.x) / 2,
      (this.y + target.y) / 2 - target.displayHeight / 2 - data.repeated * 15,
      `${formatNumber(totalDamage)}`,
      {
        fontFamily: BA_FAMILY,
        fontSize: isCritical ? '16px' : '10px',
        color: isCritical ? '#ef1134' : BA_COLOR,
        strokeThickness: 1,
        stroke: '#ffffff',
      },
    )

    // 텍스트 애니메이션 설정
    this.scene.tweens.add({
      targets: collisionText,
      y: collisionText.y - 50, // Y축으로 50px 위로 이동
      alpha: 0, // 투명도 0으로 설정
      duration: 2000, // 애니메이션 지속 시간 2초
      ease: 'Power1',
      onComplete() {
        collisionText.destroy() // 애니메이션 완료 후 텍스트 제거
      },
    })

    this.currentHp -= totalDamage
    // eslint-disable-next-line no-param-reassign
    data.repeated += 1
    if (this.currentHp <= 0) this.dead()
  }

  dead() {
    if ((this.mData.drop?.items || []).length > 0) {
      const [dropItem] = _.shuffle(this.mData.drop?.items)
      const isPicked = pickByRoll(dropItem.roll)
      if (isPicked) {
        const { item } = dropItem
        this.scene.add.sprite(this.x, this.y, `item-${item._id}`)
      }
    }
    // this.maskGraphics.clear()
    // this.clearMask(true)
    this.destroy()
  }
}
