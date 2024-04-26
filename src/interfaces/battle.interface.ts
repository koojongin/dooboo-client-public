import { Character, User } from '@/interfaces/user.interface'
import { Monster } from '@/interfaces/monster.interface'
import { Item } from '@/interfaces/item.interface'

export interface BattleLog {
  isCriticalHit: boolean
  damage: number
  currentHp: number
}

export interface BattleResponseDto {
  battleLogs: BattleLog[]
  battledAt: string
  character: Character
  isWin: boolean
  monster: Monster
  user: User
  drops?: Item[]
}
