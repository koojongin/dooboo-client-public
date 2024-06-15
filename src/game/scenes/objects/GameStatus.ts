import { FightScene } from '@/game/scenes/interfaces/scene.interface'
import { GameHealthBar } from '@/game/scenes/objects/GameHealthBar'
import { GameSkillBox } from '@/game/scenes/objects/GameSkillBox'

export class GameStatusBox {
  scene!: FightScene

  hpBar!: GameHealthBar

  skillBoxes!: GameSkillBox[]

  constructor(scene: FightScene) {
    this.scene = scene
    this.init()
  }

  init() {
    this.hpBar = new GameHealthBar(this.scene)
    this.skillBoxes = []

    this.skillBoxes.push(new GameSkillBox(this.scene))
  }

  update(time: number, delta: number) {
    this.skillBoxes.forEach((skillBox) => {
      skillBox.update(time, delta)
    })
  }
}
