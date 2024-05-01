import { Item } from './item.interface'

export interface CharacterStat {
  criticalMultiplier: number // 10
  criticalRate: number // 5
  damageOfPhysical: number // 10
}
export interface MeResponse {
  user: User
  character: Character
  nextExp: number
  stat: CharacterStat
  equippedItems: Item[]
}

export interface User {
  nickname: string
}

export interface Character {
  createdAt: string // '2024-03-27T05:51:17.269Z'
  discordId: string // '199116468372242432'
  experience: string // 5
  level: string // 1
  gold: number
  updatedAt: string // '2024-03-28T19:19:27.689Z'
  _id: string // '6603b3d5b7868c3b327f4c53'
  user?: User
  equip?: Item
  lastBattledAt: string
  thumbnail?: string
  nickname: string
}
