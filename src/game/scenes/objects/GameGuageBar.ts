// eslint-disable-next-line import/no-cycle
import { FightScene } from '@/game/scenes/interfaces/scene.interface'

export class GameGaugeBar {
  scene!: FightScene

  bar!: any

  text!: Phaser.GameObjects.Text

  x!: number

  y!: number

  width!: number

  height!: number

  bgColor!: string

  color!: string

  getValue!: any

  getLabel?: () => string

  maxValue!: number

  constructor(
    scene: FightScene,
    {
      x,
      y,
      width,
      height,
      bgColor,
      color,
      getValue,
      maxValue,
      getLabel,
    }: {
      x: number
      y: number
      width: number
      height: number
      bgColor: string
      color: string
      getValue: any
      maxValue?: number
      getLabel?: () => string
    },
  ) {
    this.scene = scene
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.bgColor = bgColor
    this.color = color
    this.getValue = getValue
    this.maxValue = maxValue || getValue()
    this.getLabel = getLabel
    this.init()
  }

  init() {
    const background = this.scene.add.graphics()
    background
      .fillStyle(Phaser.Display.Color.ValueToColor(this.bgColor).color, 1)
      .fillRect(this.x, this.y, this.width, this.height)

    this.bar = this.scene.add.graphics()
    this.text = this.scene.add
      .text(this.width / 2 + this.x, this.height / 2 + this.y, this.getText(), {
        fontSize: '16px',
        color: '#ffffff',
      })
      .setOrigin(0.5, 0.5)
    this.update()
  }

  update() {
    if (!this.scene.player) return
    this.bar.clear()
    this.bar.fillStyle(Phaser.Display.Color.ValueToColor(this.color).color)

    const percentedWidth = (this.getValue() / this.maxValue) * this.width
    this.bar.fillRect(this.x, this.y, percentedWidth, this.height)
    this.text.setText(this.getText())
  }

  getText() {
    return this.getLabel ? this.getLabel() : `${Math.floor(this.getValue())}`
  }
}
