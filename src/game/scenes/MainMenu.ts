import { GameObjects, Scene } from 'phaser'

import { EventBus } from '../EventBus'
import { GetMapResponse } from '@/interfaces/map.interface'
import { GameConfig } from '@/game/scenes/enums/enum'
import { GetRaidResponse } from '@/services/api/api.raid'

export class MainMenu extends Scene {
  background!: GameObjects.Image

  title!: GameObjects.Text

  resultOfMap?: GetMapResponse

  resultOfRaid?: GetRaidResponse

  constructor() {
    super('MainMenu')
  }

  preload() {
    this.load.image('sky-bg', '/game-resources/skybg.png')
  }

  create() {
    this.add
      .image(0, 0, 'sky-bg')
      // .setDisplaySize(GameConfig.Width, GameConfig.Height)
      .setOrigin(0, 0)
    this.title = this.add
      .text(
        this.sys.game.canvas.width / 2,
        this.sys.game.canvas.height / 2,
        '전투 시작',
        {
          fontFamily: 'BlueArchive',
          fontSize: 38,
          fontStyle: 'bold',
          color: '#245a7e',
          stroke: '#fff',
          strokeThickness: 4,
          align: 'center',
        },
      )
      .setOrigin(0.5)
      .setDepth(100)
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_OVER, () => {
        this.title.setTint(0xfffff)
      })
      .on(Phaser.Input.Events.POINTER_OUT, () => {
        this.title.clearTint()
      })
      .on(Phaser.Input.Events.POINTER_UP, () => {
        this.changeScene()
      })

    this.add
      .text(
        this.sys.game.canvas.width / 2,
        this.sys.game.canvas.height / 2 + 60,
        '전투중 사망시 체력을 모두 회복하며 부활하고,\n모든 필드 몬스터가 초기화됩니다.',
        {
          fontFamily: 'BlueArchive',
          fontSize: 18,
          fontStyle: 'bold',
          color: '#cb2759',
          stroke: '#fff',
          strokeThickness: 4,
          align: 'center',
        },
      )
      .setOrigin(0.5)
      .setDepth(100)
    EventBus.emit('current-scene-ready', this)
    this.onCreateAfter()
  }

  onCreateAfter() {
    if (this.resultOfRaid) {
      this.changeScene()
    }
  }

  changeScene() {
    console.log(this.resultOfMap)
    if (!this.resultOfMap) {
      return
    }
    this.scene.start('Game', {
      resultOfMap: this.resultOfMap,
      resultOfRaid: this.resultOfRaid,
    })
  }
}
