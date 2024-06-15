import { GameObjects, Scene } from 'phaser'

import { EventBus } from '../EventBus'

export class MainMenu extends Scene {
  background!: GameObjects.Image

  logo!: GameObjects.Image

  title!: GameObjects.Text

  logoTween!: Phaser.Tweens.Tween | null

  constructor() {
    super('MainMenu')
  }

  create() {
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

    EventBus.emit('current-scene-ready', this)
  }

  changeScene() {
    if (this.logoTween) {
      this.logoTween.stop()
      this.logoTween = null
    }

    this.scene.start('Game')
  }
}
