import { Item } from './item.interface'
import { MongooseDocument, Pagination } from '@/interfaces/common.interface'
import { GatchaCard } from '@/interfaces/gatcha.interface'

export interface CharacterStat {
  criticalMultiplier: number // 10
  criticalRate: number // 5
  damageOfPhysical: number // 10
  damageOfFire: number // 10
  damageOfCold: number // 10
  damageOfLightning: number // 10

  str: number
  dex: number
  luk: number

  damage: number
  // damageEven: number
  // damageOdd: number

  hp: number
  mp: number

  turn: number

  powerStrike: {
    mpConsumption: number // -10
    damage: number // 50
    rate: number // 0
  }

  hpRecoveryOnKill: number
  mpRecoveryOnKill: number
  mpRegenerate: number
  attackSpeed: number
  pierce: number
  moreProjectiles: number
  lessProjectileDamage: number
  moreAreaOfEffect: number
  mpConsumption: number

  activeSkills: {
    name: string // 'power-strike'
    src: string // '/images/skills/swordman/power-strike.png'
    desc: string // 'MP를 소비하여 장착한 무기로 적에게 일격을 가한다.'
    learn: number // 20
    max: number // 20
    mp: number // 90
    rate: number // 50
    value: number // 80
  }[]
}

export interface MeResponse {
  user: User
  character: Character
  nextExp: number
  stat: CharacterStat
  equippedItems: Item[]
  deck: CardDeck
}

export interface CardDeck {
  cards: GatchaCard[]
  cardNames: string[]
}

export interface User {
  nickname: string
}

export interface Character {
  createdAt: string // '2024-03-27T05:51:17.269Z'
  discordId: string // '199116468372242432'
  experience: number // 5
  level: number // 1
  gold: number
  updatedAt: string // '2024-03-28T19:19:27.689Z'
  _id: string // '6603b3d5b7868c3b327f4c53'
  user?: User
  equip?: Item
  lastBattledAt: string
  lastEarnedAt: string
  thumbnail?: string
  nickname: string
  job: string
  gameKey: string
}

export interface RankLog extends MongooseDocument {
  owner: any
  snapshot: {
    battleLogs: any[]
    totalDamage: number
    averageDamage: number
    weapon?: any
  }
}

export interface RankListResponse extends Pagination {
  characters: Character[]
}
export interface RankOfDamageListResponse extends Pagination {
  ranks: RankLog[]
}
