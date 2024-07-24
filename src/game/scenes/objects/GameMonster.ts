import _ from 'lodash'
import { OnCollisionSprite } from '@/game/scenes/interfaces/onCollision'
import { Monster } from '@/interfaces/monster.interface'
// eslint-disable-next-line import/no-cycle
import { FightScene } from '@/game/scenes/interfaces/scene.interface'
// eslint-disable-next-line import/no-cycle
import { pickByRoll } from '@/game/util'
import { EventBus } from '@/game/EventBus'
import { GameEvent, SoundKey } from '@/game/scenes/enums/enum'
// eslint-disable-next-line import/no-cycle
import { GameWeapon } from '@/game/scenes/objects/GameWeapon'
import createKey from '@/services/key-generator'

export class GameMonster
  extends Phaser.Physics.Arcade.Sprite
  implements OnCollisionSprite
{
  tag = 'GameMonster'

  id!: string

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
    this.id = createKey()
    this.speed = this.mData.speed
    this.setCollideWorldBounds(true)
    this.setBounce(10, 10)
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
    this.scene.player.onDamaged(this.mData.collisionDamage)
    this.scene.player.onDamaged(this.mData.collisionTrueDamage, true)
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

  onDamaged(target: GameWeapon) {
    target.onCollisionWithMonster(this)
  }

  dead() {
    if (!this.active) return
    const isExistDropCondition = (this.mData.drop?.items || []).length > 0
    if (isExistDropCondition && !this.scene.isFulledInventory) {
      if (this.scene.isScareCrowMode || this.scene.isRaidMode) return
      this.mData.drop?.items.forEach((dropItem) => {
        const isPicked = pickByRoll(dropItem.roll)
        if (isPicked) {
          this.scene.player.queue.items.push(dropItem)
          this.scene.soundManager.play(SoundKey.WeaponDrop)
        }
      })
    }
    // this.maskGraphics.clear()
    // this.clearMask(true)
    const { hpRecoveryOnKill, mpRecoveryOnKill } = this.scene.resultOfMe.stat
    if (hpRecoveryOnKill) {
      this.scene.player.currentHp = Math.min(
        this.scene.player.currentHp + hpRecoveryOnKill,
        this.scene.player.maxHp,
      )
      this.scene.statusBox.hpBar.update()
    }
    if (mpRecoveryOnKill) {
      this.scene.player.currentMp = Math.min(
        this.scene.player.currentMp + mpRecoveryOnKill,
        this.scene.player.maxMp,
      )
      this.scene.statusBox.mpBar.update()
    }
    this.scene.player.queue.experience += this.mData.experience
    this.scene.player.queue.gold += this.mData.gold
    this.scene.statusBox.expBar.update()
    EventBus.emit(GameEvent.MonsterDead)

    if (this.scene.isScareCrowMode) return
    if (this.scene.resultOfMap.map.name === 'TEST') {
      this.scene.applyStackedQueue()
    }
    if (this.scene.isRaidMode) {
      return
    }
    this.destroy()
  }
}
