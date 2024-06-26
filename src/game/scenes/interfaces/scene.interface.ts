import { GetMapResponse } from '@/interfaces/map.interface'
import { MeResponse } from '@/interfaces/user.interface'
// eslint-disable-next-line import/no-cycle
import { GamePlayer } from '@/game/scenes/objects/GamePlayer'
// eslint-disable-next-line import/no-cycle
import { GameStatusBox } from '@/game/scenes/objects/GameStatus'
// eslint-disable-next-line import/no-cycle
import { GameSoundManager } from '@/game/scenes/objects/GameSoundManager'
import { SkillMeResponse } from '@/interfaces/skill.interface'

export interface FightScene extends Phaser.Scene {
  player: GamePlayer
  resultOfMap: GetMapResponse
  resultOfMe: MeResponse
  resultOfSkill: SkillMeResponse

  monsterGroup: Phaser.GameObjects.Group
  weaponGroup: Phaser.GameObjects.Group
  dropItemGroup: Phaser.GameObjects.Group
  statusBox: GameStatusBox
  soundManager: GameSoundManager

  loadMapResource: () => void
  resetPlayerQueueData: () => void
  applyStackedQueue: () => void

  isFulledInventory: boolean
}
