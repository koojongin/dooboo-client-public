import { Scene } from 'phaser'
import _ from 'lodash'
import { EventBus } from '../EventBus'
import { DEFAULT_THUMBNAIL_URL } from '@/constants/constant'
import { fetchMe } from '@/services/api-fetch'
import toAPIHostURL from '@/services/image-name-parser'
import { GameWeapon } from '@/game/scenes/objects/GameWeapon'
import { fetchGetMap } from '@/services/api-admin-fetch'
import { GameMonster } from '@/game/scenes/objects/GameMonster'
import { GetMapResponse } from '@/interfaces/map.interface'
import { FightScene } from '@/game/scenes/interfaces/scene.interface'
import { OnCollisionSprite } from '@/game/scenes/interfaces/onCollision'
import { MeResponse } from '@/interfaces/user.interface'
import { BaseItemType } from '@/interfaces/drop-table.interface'
import { GamePlayer } from '@/game/scenes/objects/GamePlayer'
import { GameStatusBox } from '@/game/scenes/objects/GameStatus'
import { Resource } from '@/game/scenes/enums/enum'

export class Game extends Scene implements FightScene {
  camera!: Phaser.Cameras.Scene2D.Camera

  weaponGroup!: Phaser.GameObjects.Group

  monsterGroup!: Phaser.GameObjects.Group

  player!: GamePlayer

  monster!: Phaser.Physics.Arcade.Sprite

  weapon!: Phaser.GameObjects.Sprite

  resultOfMap!: GetMapResponse

  resultOfMe!: MeResponse

  statusBox!: GameStatusBox

  constructor() {
    super({
      key: 'Game',
      pack: {
        files: [
          {
            type: 'plugin',
            key: 'rexawaitloaderplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexawaitloaderplugin.min.js',
            start: true,
          },
        ],
      },
    })
  }

  async preload() {
    const loader: any = this.plugins.get('rexawaitloaderplugin')
    loader.addToScene(this)
    const loadRex: Phaser.Loader.LoaderPlugin & { rexAwait: any } = this
      .load as any
    loadRex.rexAwait(async (resolve: any, reject: any) => {
      const [result, resultOfMap] = await Promise.all([
        fetchMe(),
        // fetchGetMap('6606127d0d5ab353bd8ec30a'),
        // fetchGetMap('66507bb6c36a564cdec260e2'),
        fetchGetMap('66502fa9380485e8ea649441'),
      ])
      this.resultOfMap = resultOfMap!
      this.resultOfMe = result!
      const { map: rMap, monsters } = resultOfMap
      const { character, equippedItems } = result
      const [item] = equippedItems || []
      let thumbnailUrl = character?.thumbnail
        ? character.thumbnail
        : DEFAULT_THUMBNAIL_URL

      if (item?.weapon) {
        thumbnailUrl =
          toAPIHostURL(item.weapon.thumbnail) || DEFAULT_THUMBNAIL_URL
      }
      this.load.animation(Resource.SwingAnimationPath)
      this.load.atlas(
        'swing',
        '/game-resources/motion/swing/swing.png',
        '/game-resources/motion/swing/swing_atlas.json',
      )
      this.load.atlas(
        'weapons',
        '/game-resources/weapons/weapons.png',
        '/game-resources/weapons/weapons_atlas.json',
      )
      this.load.image('weapon', thumbnailUrl)
      monsters.forEach((monster, index) => {
        this.load.image(`monster${index}`, toAPIHostURL(monster.thumbnail))
        monster.drop?.items.forEach((dropTableItem) => {
          const { iType, item: dItem } = dropTableItem
          this.load.image(`item-${dItem._id}`, toAPIHostURL(dItem.thumbnail))
        })
      })
      resolve()
    })
  }

  create() {
    this.camera = this.cameras.main
    this.camera.setBackgroundColor(0x285264ff)
    this.weaponGroup = this.physics.add.group()
    this.monsterGroup = this.physics.add.group()
    this.player = new GamePlayer(
      this,
      this.camera.width / 2,
      this.camera.height / 2,
      'swing',
    )
    this.statusBox = new GameStatusBox(this)

    this.physics.world.setBoundsCollision(true)

    this.physics.world.on(
      'worldbounds',
      (body: any) => {
        if (body.gameObject.constructor.name === 'GameWeapon') {
          const weapon = body.gameObject as GameWeapon
          weapon.onCollisionWorldBounds()
        }
      },
      this,
    )
    this.physics.add.collider(this.monsterGroup, this.monsterGroup)
    // this.physics.add.collider(this.weaponGroup, this.weaponGroup)
    this.physics.add.collider(
      this.monsterGroup,
      this.weaponGroup,
      (a: any, b: any) => {
        a.onCollision(b as OnCollisionSprite)
        b.onCollision(a as OnCollisionSprite)
      },
      undefined,
      this,
    )
    this.physics.add.collider(
      this.player,
      this.monsterGroup,
      (player, monster: any) => {
        monster.onCollisionWithPlayer(player as OnCollisionSprite)
      },
    )
    this.startSpawnTimer()
    EventBus.emit('current-scene-ready', this)
  }

  startSpawnTimer() {
    this.time.addEvent({
      delay: 100, // 1초 주기
      callback: () => {
        this.spawnMonster()
      },
      callbackScope: this,
      repeat: -1,
    })
    this.spawnMonster.call(this)
  }

  changeScene() {
    this.scene.start('GameOver')
  }

  update(time: number, delta: number) {
    if (!this.weaponGroup) return

    this.player.update()
    // eslint-disable-next-line no-restricted-syntax
    for (const child of this.weaponGroup.getChildren()) {
      child.update()
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const child of this.monsterGroup!.getChildren()) {
      child.update()
    }

    this.statusBox.update(time, delta)
  }

  resetMonster() {
    this.monsterGroup.clear(true, true)
    this.weaponGroup.clear(true, true)
  }

  spawnMonster(x = 250, y = 250) {
    if (this.monsterGroup!.getLength() < 10) {
      const randomIndex = Math.floor(
        Math.random() * this.resultOfMap.monsters.length,
      )
      const monster = new GameMonster(
        this,
        Math.random() * this.sys.game.canvas.width,
        Math.random() * this.sys.game.canvas.height,
        `monster${randomIndex}`,
        this.monsterGroup!,
        this.resultOfMap.monsters[randomIndex],
      )
    }
  }
}
