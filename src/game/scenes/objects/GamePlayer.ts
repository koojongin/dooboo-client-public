import { OnCollisionSprite } from '@/game/scenes/interfaces/onCollision'
// eslint-disable-next-line import/no-cycle
import { FightScene } from '@/game/scenes/interfaces/scene.interface'
// eslint-disable-next-line import/no-cycle
import { GameWeapon } from '@/game/scenes/objects/GameWeapon'
import { AnimationKey, Resource } from '@/game/scenes/enums/enum'
import { ItemTypeKind, Weapon } from '@/interfaces/item.interface'
import { DropTableItem } from '@/interfaces/drop-table.interface'
import { SkillKind } from '@/interfaces/skill.interface'
import { formatNumber } from '@/services/util'
import { BA_COLOR, BA_FAMILY } from '@/constants/constant'
import { GameStrike } from '@/game/scenes/objects/skills/GameStrike'

let mpTimer = 0
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

  weapon?: Weapon

  queue: DataQueue = { experience: 0, gold: 0, items: [] }

  attackMotions = [AnimationKey.Swingpf, AnimationKey.Stabtf]

  activeSkill!: { name: SkillKind; mp: number }
  // { name: SkillKind.ThrowWeapon, mp: 100 },

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
    this.activeSkill = { name: this.scene.resultOfSkill.activeSkill, mp: 20 }
    // this.activeSkill = { name: SkillKind.Strike, mp: 20 }
    // this.activeSkill = { name: SkillKind.ThrowWeapon, mp: 20 }
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
    this.anims.timeScale = 2
    this.cursor = this.scene.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as CursorKeys
    this.anims.play(AnimationKey.Stand1)
    this.playOnceAttackAnimation()

    const weaponItem = (this.scene.resultOfMe.equippedItems || []).find(
      (item) => item.iType === ItemTypeKind.Weapon,
    )
    if (weaponItem) {
      this.weapon = weaponItem.weapon
    }
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
    if (
      this.scene.player.currentMp < this.scene.resultOfMe.stat.mpConsumption
    ) {
      return
    }

    if (this.activeSkill.name === SkillKind.Strike) {
      this.strike()
    }

    if (this.activeSkill.name === SkillKind.ThrowWeapon) {
      this.spawnWeapon.call(this)
    }
  }

  strike() {
    const ps = new GameStrike(this.scene, this.x, this.y)
  }

  onCollisionWithDropItem() {}

  update(time: number, delta: number) {
    mpTimer += delta

    this.setVelocity(0)
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

    if (this.onReadyAttack) {
      this.playOnceAttackAnimation()
    }

    if (this.currentMp < this.maxMp) {
      // this.currentMp += this.scene.resultOfMe.stat.mpRegenerate
      this.currentMp = Math.min(
        this.currentMp +
          (delta / 1000) * this.scene.resultOfMe.stat.mpRegenerate,
        this.maxMp,
      )
      this.scene.statusBox.mpBar.update()
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
    this.currentHp -= damage
    if (this.currentHp <= 0) {
      this.currentHp = this.maxHp
      const convertedScene: any = this.scene
      convertedScene.resetMonster()
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
  }
}
