// eslint-disable-next-line import/no-cycle
import { FightScene } from '@/game/scenes/interfaces/scene.interface'

export class GameHealthBar {
  scene!: FightScene

  hpBar!: any

  hpText!: Phaser.GameObjects.Text

  constructor(scene: FightScene) {
    this.scene = scene
    this.init()
  }

  init() {
    const hpBackground = this.scene.add.graphics()
    hpBackground
      .fillStyle(Phaser.Display.Color.ValueToColor('#4b0320').color, 1)
      .fillRect(10, 10, 200, 20)

    this.hpBar = this.scene.add.graphics()
    this.hpText = this.scene.add
      .text(200 / 2 + 10, 20 / 2 + 10, this.getHpText(), {
        fontSize: '16px',
        color: '#ffffff',
      })
      .setOrigin(0.5, 0.5)
    this.updateHp()
  }

  updateHp() {
    if (!this.scene.player) return
    this.hpBar.clear()
    this.hpBar.fillStyle(Phaser.Display.Color.ValueToColor('#ff8181').color)
    this.hpBar.fillRect(10, 10, this.scene.player.currentHp * 2, 20)
    this.hpText.setText(this.getHpText())
  }

  getHpText() {
    return `${this.scene.player.currentHp}`
  }
}
