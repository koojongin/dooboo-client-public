import { GetMapResponse } from '@/interfaces/map.interface'
import { MeResponse } from '@/interfaces/user.interface'
// eslint-disable-next-line import/no-cycle
import { GamePlayer } from '@/game/scenes/objects/GamePlayer'
// eslint-disable-next-line import/no-cycle
import { GameStatusBox } from '@/game/scenes/objects/GameStatus'
// eslint-disable-next-line import/no-cycle
import { GameSoundManager } from '@/game/scenes/objects/GameSoundManager'
import { SkillMeResponse } from '@/interfaces/skill.interface'
import { GetRaidResponse } from '@/services/api/api.raid'

export interface VirtualJoystickPlugin extends Phaser.Plugins.ScenePlugin {
  add(
    scene: Phaser.Scene,
    config: {
      x: number
      y: number
      radius: number
      base: Phaser.GameObjects.GameObject
      thumb: Phaser.GameObjects.GameObject
      dir?: string
      forceMin?: number
      enable?: boolean
    },
  ): any
}
export interface FightScene extends Phaser.Scene {
  player: GamePlayer
  resultOfMap: GetMapResponse
  resultOfMe: MeResponse
  resultOfSkill: SkillMeResponse
  resultOfRaid?: GetRaidResponse

  monsterGroup: Phaser.GameObjects.Group
  weaponGroup: Phaser.GameObjects.Group
  dropItemGroup: Phaser.GameObjects.Group
  statusBox: GameStatusBox
  soundManager: GameSoundManager

  loadMapResource: () => void
  resetPlayerQueueData: () => void
  applyStackedQueue: () => void

  isFulledInventory: boolean

  isScareCrowMode: boolean
  isRaidMode: boolean

  stopGame: () => void
  elapsedTime: number
}
