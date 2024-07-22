import { Scene } from 'phaser'
import _ from 'lodash'
import { EventBus } from '../EventBus'
import { DEFAULT_THUMBNAIL_URL } from '@/constants/constant'
import { fetchGetMySkill, fetchMe } from '@/services/api-fetch'
import toAPIHostURL from '@/services/image-name-parser'
import { GameWeapon } from '@/game/scenes/objects/GameWeapon'
import { GameMonster } from '@/game/scenes/objects/GameMonster'
import { GetMapResponse } from '@/interfaces/map.interface'
import { FightScene } from '@/game/scenes/interfaces/scene.interface'
import { OnCollisionSprite } from '@/game/scenes/interfaces/onCollision'
import { MeResponse } from '@/interfaces/user.interface'
import { GamePlayer } from '@/game/scenes/objects/GamePlayer'
import { GameStatusBox } from '@/game/scenes/objects/GameStatus'
import {
  GameConfig,
  GameEvent,
  Resource,
  SoundKey,
} from '@/game/scenes/enums/enum'
import { GameSoundManager } from '@/game/scenes/objects/GameSoundManager'
import { fetchApplyEarnedData, fetchGameLogin } from '@/services/api/api.game'
import { createSignedPacket } from '@/game/util'
import { SkillMeResponse } from '@/interfaces/skill.interface'
import { GetRaidResponse } from '@/services/api/api.raid'

const CROW_START_POINT = {
  x: 800,
  y: 400,
}
export class Game extends Scene implements FightScene {
  camera!: Phaser.Cameras.Scene2D.Camera

  weaponGroup!: Phaser.GameObjects.Group

  monsterGroup!: Phaser.GameObjects.Group

  dropItemGroup!: Phaser.GameObjects.Group

  player!: GamePlayer

  monster!: Phaser.Physics.Arcade.Sprite

  weapon!: Phaser.GameObjects.Sprite

  resultOfMap!: GetMapResponse

  resultOfRaid?: GetRaidResponse

  resultOfMe!: MeResponse

  resultOfSkill!: SkillMeResponse

  statusBox!: GameStatusBox

  soundManager!: GameSoundManager

  gameKey!: string

  isFulledInventory = false

  backgroundUpdateInterval: any

  maxMonsterPool = 100

  isScareCrowMode = false

  isRaidMode = false

  elapsedTime = 0

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
    this.backgroundUpdateInterval = null
  }

  init({ resultOfMap, resultOfRaid }: any) {
    this.resultOfMap = resultOfMap!
    this.resultOfRaid = resultOfRaid!
  }

  async preload() {
    this.isScareCrowMode = !!this.resultOfMap.monsters.find(
      (monster) => monster.name === '허수아비',
    )
    this.isRaidMode = this.resultOfMap.map.isRaid
    const loader: any = this.plugins.get('rexawaitloaderplugin')
    loader.addToScene(this)
    const loadRex: Phaser.Loader.LoaderPlugin & { rexAwait: any } = this
      .load as any
    loadRex.rexAwait(async (resolve: any, reject: any) => {
      const [result, resultOfLogin, resultOfSkill] = await Promise.all([
        fetchMe(),
        fetchGameLogin(this.isScareCrowMode || this.isRaidMode),
        fetchGetMySkill(),
      ])
      const { character: gameCharacter } = resultOfLogin
      if (!gameCharacter.gameKey) {
        alert('에러! 관리자에게문의하세요')
        window.location.href = '/'
      }
      this.gameKey = gameCharacter.gameKey
      this.resultOfMe = result!
      this.resultOfSkill = resultOfSkill!
      const { character, equippedItems } = result
      const [weaponItem] = equippedItems.filter((item) => item.weapon)
      const thumbnailUrl = character?.thumbnail
        ? character.thumbnail
        : DEFAULT_THUMBNAIL_URL

      let weaponImageUrl

      if (weaponItem?.weapon) {
        weaponImageUrl =
          toAPIHostURL(weaponItem.weapon.thumbnail) || DEFAULT_THUMBNAIL_URL
      }
      this.load.animation(Resource.SwingAnimationPath)
      this.load.animation(Resource.SkillsAnimationPath)
      this.load.atlas(
        Resource.SwingKey,
        Resource.SwingSpriteSheetPath,
        Resource.SwingAtlasPath,
      )
      this.load.atlas(
        Resource.SkillsKey,
        Resource.SkillsSpriteSheetPath,
        Resource.SkillsAtlasPath,
      )
      this.load.atlas(
        'weapons',
        '/game-resources/weapons/weapons.png',
        '/game-resources/weapons/weapons_atlas.json',
      )
      this.load.audio(SoundKey.WeaponDrop, '/audio/item_drop.mp3')
      this.load.audio(SoundKey.EtcDrop, '/audio/etc_drop.mp3')
      this.load.image('weapon', weaponImageUrl)
      this.loadMapResource()
      resolve()
    })
  }

  loadMapResource() {
    this.resetMonster()
    const { monsters } = this.resultOfMap
    monsters.forEach((monster, index) => {
      this.load.image(
        `monster-${monster._id!}`,
        toAPIHostURL(monster.thumbnail),
      )
      monster.drop?.items.forEach((dropTableItem) => {
        const { iType, item: dItem } = dropTableItem
        this.load.image(`item-${dItem._id}`, toAPIHostURL(dItem.thumbnail))
      })
    })
    this.load.start()
  }

  create() {
    this.camera = this.cameras.main
    this.camera.setBackgroundColor(0x285264ff)
    this.weaponGroup = this.physics.add.group()
    this.monsterGroup = this.physics.add.group()
    this.dropItemGroup = this.physics.add.group()
    this.soundManager = new GameSoundManager(this)
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
        if (body.gameObject.tag === 'GameWeapon') {
          const weapon = body.gameObject as GameWeapon
          weapon.onCollisionWorldBounds()
        }
      },
      this,
    )
    this.physics.add.collider(this.monsterGroup, this.monsterGroup)
    // this.physics.add.collider(this.weaponGroup, this.weaponGroup)
    this.physics.add.overlap(
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
    this.physics.add.overlap(
      this.player,
      this.dropItemGroup,
      (player, dropItem) => {
        dropItem.destroy()
      },
    )
    this.startSpawnTimer()
    this.startQueueResolver()
    EventBus.emit('current-scene-ready', this)
  }

  startSpawnTimer() {
    let startingPoint: any
    if (this.isScareCrowMode || this.isRaidMode) {
      startingPoint = CROW_START_POINT
    }
    this.time.addEvent({
      delay: 500,
      callback: () => {
        _.range(3).forEach(() => this.spawnMonster(startingPoint))
      },
      callbackScope: this,
      repeat: -1,
    })
    _.range(3).forEach(() => this.spawnMonster(startingPoint))
  }

  startQueueResolver() {
    this.time.addEvent({
      delay: GameConfig.QueueResolveTime,
      callback: () => {
        this.applyStackedQueue()
      },
      callbackScope: this,
      repeat: -1,
    })
  }

  async applyStackedQueue() {
    const isNeedUpdateState =
      this.player.queue.experience > 0 ||
      this.player.queue.gold > 0 ||
      this.player.queue.items.length > 0
    if (isNeedUpdateState) {
      const snapshot = _.cloneDeep(this.player.queue)
      try {
        const { updated, character } = await fetchApplyEarnedData(
          createSignedPacket(this.player.queue, this.gameKey),
          { version: GameConfig.Version },
        )
        if (!updated) {
          return
        }
        this.player.queue.experience -= snapshot.experience
        this.player.queue.gold -= snapshot.gold
        this.player.queue.items = []
        this.player.queue.damaged = 0
        this.resultOfMe.character = character
        this.statusBox.expBar.update()
        EventBus.emit('event', { eventName: 'refresh' })
      } catch (error: any) {
        console.log(error)
        this.stopGame()
      }
    }
  }

  stopGame() {
    this.scene.stop()
  }

  changeScene() {
    this.scene.start('GameOver')
  }

  update(time: number, delta: number) {
    if (this.isScareCrowMode) {
      if (this.elapsedTime >= GameConfig.CROW_PRESERVE_TIME) {
        this.stopGame()
        EventBus.emit(GameEvent.OnGameStop)
        return
      }
    }

    if (this.isRaidMode) {
      if (this.elapsedTime >= GameConfig.RAID_PRESERVE_TIME) {
        this.stopGame()
        EventBus.emit(GameEvent.OnGameStop)
        return
      }
    }

    this.elapsedTime += delta
    if (!this.weaponGroup) return

    this.player.update(time, delta)
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
    if (!this.scene) return
    if (this.monsterGroup) this.monsterGroup.clear(true, true)
    if (this.weaponGroup) this.weaponGroup.clear(true, true)
  }

  spawnMonster(position?: { x: number; y: number }) {
    if (this.monsterGroup!.getLength() < this.maxMonsterPool) {
      const [randomMonster] = _.shuffle(this.resultOfMap.monsters.map((m) => m))
      const randomId = randomMonster._id
      if (this.isScareCrowMode || this.isRaidMode) {
        if (this.monsterGroup.getLength() > 0) return
      }

      if (this.resultOfMap.map.name === 'TEST') {
        if (this.monsterGroup.getLength() > 0) return
      }

      let startingPoint = {
        x: Math.random() * this.sys.game.canvas.width,
        y: Math.random() * this.sys.game.canvas.height,
      }

      if (position) {
        startingPoint = position
      }

      const monster = new GameMonster(
        this,
        startingPoint.x,
        startingPoint.y,
        `monster-${randomId}`,
        this.monsterGroup!,
        this.resultOfMap.monsters.find((m) => m._id === randomId)!,
      )
    }
  }

  resetPlayerQueueData() {
    this.player.queue.experience = 0
    this.player.queue.gold = 0
    this.player.queue.items = []
    this.player.queue.damaged = 0
  }
}
