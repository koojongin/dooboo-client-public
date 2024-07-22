import { MongooseDocument, Pagination } from '@/interfaces/common.interface'
import { Monster } from './monster.interface'
import { Character } from '@/interfaces/user.interface'
import { BattleLog } from '@/interfaces/battle.interface'
import { DbMap } from '@/interfaces/map.interface'

export interface GameDamageTotalResult {
  damaged: number
  elapsed: number
  maxElapsed: number
}

export interface CharacterRaid extends MongooseDocument {
  logs: {
    [key: string]: {
      damage: number
      mapId: string
      map: DbMap
    }
  }
}
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
  requiredLevel: number
  mapId: string
  map: DbMap
  damage: {
    [key: string]: number
  }
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

export interface ListRaidRewardResponse extends Pagination {
  raidRewards: RaidReward[]
}

export interface RaidReward extends MongooseDocument {
  expiredAt: Date
  isRewarded: boolean
  raidId: string
  ranks: any[]
  isTopRanked: boolean
  raid: Raid
}
