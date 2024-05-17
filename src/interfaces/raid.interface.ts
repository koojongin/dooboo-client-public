import { MongooseDocument } from '@/interfaces/common.interface'
import { Monster } from './monster.interface'
import { Character } from '@/interfaces/user.interface'
import { BattleLog } from '@/interfaces/battle.interface'

export interface RaidMonster {
  monster?: Monster
  currentHp: number
  monsterId: string
}
export interface Raid extends MongooseDocument {
  expiredAt: Date
  monsters: RaidMonster[]
  name: string
  raidLogs?: RaidLog[]
}

export interface RaidLog extends MongooseDocument {
  owner: Character
  totalDamage: number
  snapshot: BattleLog[]
}

export interface MergedRaidLog {
  totalDamage: number
  owner: Character
  raidLogs: RaidLog[]
  lastBattledAt: Date | string
}
