import { OnCollisionSprite } from '@/game/scenes/interfaces/onCollision'
// eslint-disable-next-line import/no-cycle
import {
  FightScene,
  VirtualJoystickPlugin,
} from '@/game/scenes/interfaces/scene.interface'
// eslint-disable-next-line import/no-cycle
import { GameWeapon } from '@/game/scenes/objects/GameWeapon'
import { AnimationKey, GameEvent, Resource } from '@/game/scenes/enums/enum'
import { ItemTypeKind, Weapon } from '@/interfaces/item.interface'
import { DropTableItem } from '@/interfaces/drop-table.interface'
import { SkillKind } from '@/interfaces/skill.interface'
import { formatNumber } from '@/services/util'
import { BA_COLOR, BA_FAMILY } from '@/constants/constant'
// eslint-disable-next-line import/no-cycle
import { GameStrike } from '@/game/scenes/objects/skills/GameStrike'
// eslint-disable-next-line import/no-cycle
import { GameIceShuriken } from './skills/GameIceShuriken'
import { EventBus } from '@/game/EventBus'
import { GameFireWall } from '@/game/scenes/objects/skills/GameFireWall'

export interface CursorKeys {
  up: Phaser.Input.Keyboard.Key
  down: Phaser.Input.Keyboard.Key
  left: Phaser.Input.Keyboard.Key
  right: Phaser.Input.Keyboard.Key
}

export interface DataQueue {
  experience: number
  gold: number
  items: DropTableItem[]
  damaged: number
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

  maxMp!: number

  currentMp!: number

  cursor!: CursorKeys

  joystick!: any

  weapon?: Weapon

  queue: DataQueue = { experience: 0, gold: 0, items: [], damaged: 0 }

  attackMotions = [AnimationKey.Swingpf, AnimationKey.Stabtf]

  activeSkill!: { name: SkillKind }

  constructor(scene: FightScene, x: number, y: number, key: string) {
    // need a wrapper Class to properly set the Matter World
    super(scene, x, y, key)
    this.scene = scene
    this.scene.add.existing(this)
    this.scene.physics.add.existing(this)
    this.setOrigin(0.5)
    this.setActive(true)
    this.onReadyAttack = false
    this.isSpread = false
    this.setDisplaySize(48, 68)
    this.setFlip(true, false)
    this.init()
  }

  init() {
    this.speed = this.scene.resultOfMe.stat.speed
    this.activeSkill = { name: this.scene.resultOfSkill.activeSkill }
    console.log(this.activeSkill)
    this.setCollideWorldBounds(true)
    this.setImmovable(true)
    this.currentMp = this.scene.resultOfMe.stat.mp
    this.maxMp = this.scene.resultOfMe.stat.mp
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
        if (this.attackMotions.includes(anim.key)) {
          this.attack()
        }
      },
      this.scene,
    )
    this.anims.timeScale = 2 + this.scene.resultOfMe.stat.attackSpeed
    this.cursor = this.scene.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as CursorKeys

    this.joystick = (
      this.scene.plugins.get('rexVirtualJoystick') as VirtualJoystickPlugin
    )
      .add(this.scene, {
        x: 100,
        y: 500,
        radius: 50,
        base: this.scene.add.circle(0, 0, 50, 0x888888),
        thumb: this.scene.add.circle(0, 0, 25, 0xcccccc),
        dir: '8dir',
        forceMin: 10,
        enable: true,
      })
      .on('update', this.dumpJoyStickState, this)
    this.anims.play(AnimationKey.Stand1)

    const weaponItem = (this.scene.resultOfMe.equippedItems || []).find(
      (item) => item.iType === ItemTypeKind.Weapon,
    )
    if (weaponItem) {
      this.weapon = weaponItem.weapon
    }
  }

  dumpJoyStickState() {
    const cursorKeys = this.joystick.createCursorKeys()
    this.cursor.up.isDown = cursorKeys.up.isDown
    this.cursor.down.isDown = cursorKeys.down.isDown
    this.cursor.left.isDown = cursorKeys.left.isDown
    this.cursor.right.isDown = cursorKeys.right.isDown
  }

  onCollision(target: OnCollisionSprite) {
    // console.log(target)
  }

  attack() {
    if (
      this.scene.player.currentMp < this.scene.resultOfMe.stat.mpConsumption
    ) {
      return
    }

    if (this.activeSkill.name === SkillKind.Strike) {
      const ps = new GameStrike(this.scene, this.x, this.y)
    }

    if (this.activeSkill.name === SkillKind.ThrowWeapon) {
      this.spawnWeapon.call(this)
    }

    if (this.activeSkill.name === SkillKind.FireWall) {
      const ps = new GameFireWall(
        this.scene,
        this.x,
        this.y,
        this.scene.weaponGroup,
      )
    }

    if (this.activeSkill.name === SkillKind.IceShuriken) {
      const shuriken = new GameIceShuriken(
        this.scene,
        this.x,
        this.y,
        this.scene.weaponGroup,
      )
    }
  }

  onCollisionWithDropItem() {}

  update(time: number, delta: number) {
    this.setVelocity(0)
    const { stat } = this.scene.resultOfMe
    if (
      this.onReadyAttack &&
      this.currentMp >= stat.mpConsumption &&
      this.anims.currentAnim?.key !== AnimationKey.Stabtf &&
      this.scene.monsterGroup.getLength() > 0 &&
      this.scene.weaponGroup.getLength() <= 200
    ) {
      this.anims.play(AnimationKey.Stabtf)
      this.onReadyAttack = false
    }
    const currentAnimKey = this.anims.currentAnim?.key
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

    if (currentAnimKey !== AnimationKey.Stabtf) {
      const onMove = this.body!.velocity.x !== 0 || this.body!.velocity.y !== 0
      if (onMove && currentAnimKey !== AnimationKey.Walk2) {
        this.anims.play(AnimationKey.Walk2)
      }
      if (!onMove && currentAnimKey !== AnimationKey.Stand1) {
        this.anims.play(AnimationKey.Stand1)
      }
    }

    // if (this.onReadyAttack) {
    //   this.playOnceAttackAnimation()
    // }

    if (this.currentMp < this.maxMp) {
      // this.currentMp += this.scene.resultOfMe.stat.mpRegenerate
      this.currentMp = Math.min(
        this.currentMp +
          (delta / 1000) * this.scene.resultOfMe.stat.mpRegenerate,
        this.maxMp,
      )
      this.scene.statusBox.mpBar.update()
    }

    if (this.currentHp < this.maxHp) {
      this.currentHp = Math.min(
        this.currentHp +
          (delta / 1000) * this.scene.resultOfMe.stat.hpRegenerate, // this.scene.resultOfMe.stat.mpRegenerate,
        this.maxHp,
      )
      this.scene.statusBox.hpBar.update()
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
    return weapon
  }

  onDamaged(damage: number) {
    this.currentHp -= Math.max(0, damage - this.scene.resultOfMe.stat.armor)
    if (this.currentHp <= 0) {
      this.currentHp = this.maxHp
      const convertedScene: any = this.scene
      convertedScene.resetMonster()
      this.queue.damaged = 0
      EventBus.emit(GameEvent.PlayerDead)
    }
    this.scene.statusBox.hpBar.update()
  }

  showDamageText(
    textPosition: { x: number; y: number },
    totalDamage: number,
    isCritical: boolean,
  ) {
    const collisionText = this.scene.add.text(
      textPosition.x,
      textPosition.y,
      `${formatNumber(totalDamage)}`,
      {
        fontFamily: BA_FAMILY,
        fontSize: isCritical ? '16px' : '10px',
        color: isCritical ? '#ef1134' : BA_COLOR,
        strokeThickness: 1,
        stroke: '#ffffff',
      },
    )

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

    this.queue.damaged += totalDamage
    EventBus.emit(GameEvent.OnDamagedMonster)
  }
}
