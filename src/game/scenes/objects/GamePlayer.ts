import _ from 'lodash'
import { OnCollisionSprite } from '@/game/scenes/interfaces/onCollision'
import { Monster } from '@/interfaces/monster.interface'
// eslint-disable-next-line import/no-cycle
import { FightScene } from '@/game/scenes/interfaces/scene.interface'
// eslint-disable-next-line import/no-cycle
import { GameWeapon } from '@/game/scenes/objects/GameWeapon'
import { AnimationKey, Resource } from '@/game/scenes/enums/enum'

export interface CursorKeys {
  up: Phaser.Input.Keyboard.Key
  down: Phaser.Input.Keyboard.Key
  left: Phaser.Input.Keyboard.Key
  right: Phaser.Input.Keyboard.Key
}
export class GamePlayer
  extends Phaser.Physics.Arcade.Sprite
  implements OnCollisionSprite
{
  onReadyAttack!: boolean

  isSpread!: boolean

  scene!: FightScene

  speed = 30

  maxHp!: number

  currentHp!: number

  cursor!: CursorKeys

  constructor(scene: FightScene, x: number, y: number, key: string) {
    // need a wrapper Class to properly set the Matter World
    super(scene, x, y, key)
    this.scene = scene
    this.scene.add.existing(this)
    this.scene.physics.add.existing(this)
    this.setOrigin(0.5)
    this.setActive(true)
    this.onReadyAttack = true
    this.isSpread = false
    this.setDisplaySize(48, 68)
    this.setFlip(true, false)
    this.init()
  }

  init() {
    this.setCollideWorldBounds(true)
    this.setImmovable(true)
    this.currentHp = this.scene.resultOfMe.stat.hp
    this.maxHp = this.scene.resultOfMe.stat.hp
    this.scene.cache.json
      .get(Resource.SwingAnimationPath)
      .anims.forEach((anim: any) => {
        this.anims.create(anim)
      })
    this.on(
      Phaser.Animations.Events.ANIMATION_REPEAT,
      (anim: any) => {
        this.anims.stop()
        this.anims.play(AnimationKey.Stand1)
        if (anim.key === AnimationKey.Stabtf) {
          console.log('여길안와?')
          this.attack()
        }
      },
      this.scene,
    )
    this.anims.timeScale = 2
    this.cursor = this.scene.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as CursorKeys
    this.anims.play(AnimationKey.Stand1)
    this.playOnceAttackAnimation()
  }

  onCollision(target: OnCollisionSprite) {
    // console.log(target)
  }

  playOnceAttackAnimation() {
    if (
      this.scene.weaponGroup.getLength() < 100 &&
      this.scene.monsterGroup.getLength() > 0
    ) {
      this.onReadyAttack = false
      if (this.anims.currentAnim?.key === AnimationKey.Stabtf) {
        // 공속 너무빨라서 애니메이션 끝나기전에 호출되면 강제 공격
        this.attack()
      } else {
        this.play(AnimationKey.Stabtf)
      }
    }
  }

  attack() {
    if (!this.isSpread) {
      this.spawnWeapon.call(this)
    } else {
      const { turn } = this.scene.resultOfMe.stat
      _.range(turn).forEach((value, index) => {
        const weapon = this.spawnWeapon()
        const { speed } = weapon
        const radian = Phaser.Math.DegToRad(45 - (90 / turn) * index)
        const velocity = {
          x: Math.cos(radian) * speed,
          y: Math.sin(radian) * speed,
        }
        weapon.setVelocity(velocity.x, velocity.y)
      })
    }
  }

  update() {
    if (this.onReadyAttack) {
      this.playOnceAttackAnimation()
    }

    this.setVelocity(0)

    // 키 입력에 따라 속도 설정
    if (this.cursor.left.isDown) {
      this.setVelocityX(-this.speed)
    } else if (this.cursor.right.isDown) {
      this.setVelocityX(this.speed)
    }

    if (this.cursor.up.isDown) {
      this.setVelocityY(-this.speed)
    } else if (this.cursor.down.isDown) {
      this.setVelocityY(this.speed)
    }
  }

  spawnWeapon(): GameWeapon {
    const weapon = new GameWeapon(
      this.scene,
      this.x,
      this.y,
      'weapon',
      this.scene.weaponGroup,
    )
    weapon.init()
    return weapon
  }

  onDamaged(damage: number) {
    this.currentHp -= damage
    if (this.currentHp <= 0) {
      this.currentHp = this.maxHp
      const convertedScene: any = this.scene
      convertedScene.resetMonster()
    }
    this.scene.statusBox.hpBar.updateHp()
  }
}
