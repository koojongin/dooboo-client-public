import { GetMapResponse } from '@/interfaces/map.interface'
import { MeResponse } from '@/interfaces/user.interface'
// eslint-disable-next-line import/no-cycle
import { GamePlayer } from '@/game/scenes/objects/GamePlayer'
// eslint-disable-next-line import/no-cycle
import { GameStatusBox } from '@/game/scenes/objects/GameStatus'

export interface FightScene extends Phaser.Scene {
  player: GamePlayer
  resultOfMap: GetMapResponse
  resultOfMe: MeResponse

  monsterGroup: Phaser.GameObjects.Group
  weaponGroup: Phaser.GameObjects.Group
  statusBox: GameStatusBox
}
