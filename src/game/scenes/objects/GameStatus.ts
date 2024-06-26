// eslint-disable-next-line import/no-cycle
import { FightScene } from '@/game/scenes/interfaces/scene.interface'
// eslint-disable-next-line import/no-cycle
import { GameSkillBox } from '@/game/scenes/objects/GameSkillBox'
// eslint-disable-next-line import/no-cycle
import { GameGaugeBar } from '@/game/scenes/objects/GameGuageBar'
import { formatNumber } from '@/services/util'

export class GameStatusBox {
  scene!: FightScene

  hpBar!: GameGaugeBar

  mpBar!: GameGaugeBar

  expBar!: GameGaugeBar

  skillBoxes!: GameSkillBox[]

  data = {
    exp: 0,
  }

  constructor(scene: FightScene) {
    this.scene = scene
    this.init()
  }

  init() {
    this.hpBar = new GameGaugeBar(this.scene, {
      x: 10,
      y: 10,
      width: 200,
      height: 20,
      bgColor: '#4b0320',
      color: '#ea4481',
      getValue: () => this.scene.player.currentHp,
      getLabel: () =>
        `${this.scene.player.currentHp}/${this.scene.player.maxHp}`,
    })
    this.mpBar = new GameGaugeBar(this.scene, {
      x: 10,
      y: 30,
      width: 200,
      height: 20,
      bgColor: '#14365b',
      color: '#348ee7',
      getValue: () => this.scene.player.currentMp,
      getLabel: () =>
        `${Math.floor(this.scene.player.currentMp)}/${this.scene.player.maxMp}`,
    })
    this.expBar = new GameGaugeBar(this.scene, {
      x: 10,
      y: this.scene.sys.game.canvas.height - 30,
      width: this.scene.sys.game.canvas.width - 20,
      height: 20,
      bgColor: '#0f4420',
      color: '#32a456',
      getValue: () => this.scene.resultOfMe.character.experience,
      maxValue: this.scene.resultOfMe.nextExp,
      getLabel: () =>
        `Lv.${this.scene.resultOfMe.character.level} - ${this.scene.resultOfMe.character.experience + this.scene.player.queue.experience}/${formatNumber(this.scene.resultOfMe.nextExp)}`,
    })
    this.skillBoxes = []

    this.skillBoxes.push(new GameSkillBox(this.scene))
  }

  update(time: number, delta: number) {
    this.skillBoxes.forEach((skillBox) => {
      skillBox.update(time, delta)
    })
  }
}
