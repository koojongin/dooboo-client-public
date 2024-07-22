import { Item } from './item.interface'
import { MongooseDocument, Pagination } from '@/interfaces/common.interface'
import { CardDeck, GatchaCard } from '@/interfaces/gatcha.interface'
import { ActiveSkill } from '@/services/skill/skill'
import { CharacterSkill } from '@/interfaces/skill.interface'

export interface CalculateData {
  damageOfPhysical: number
  damageOfCold: number
  damageOfFire: number
  damageOfLightning: number
  totalSpeed: number
  totalAddedHp: number
  totalAddedMp: number
  totalWeaponTypeFlatDamage: number
  totalMpConsumption: number
  totalIncreasedAll: number
  totalIncreasedPhysical: number
  totalIncreasedFire: number
  totalIncreasedCold: number
  totalIncreasedLightning: number
  totalIncreasedAxe: number
  totalIncreasedSword: number
  totalIncreasedDagger: number
  totalIncreasedBow: number
  totalIncreasedBlunt: number
  totalIncreasedSpear: number
  totalIncreasedGun: number
  totalIncreasedCannon: number
  totalIncreasedClaw: number
  totalIncreasedCriticalMultiplier: number
  totalIncreasedCriticalRate: number
  totalIncreasedDamageWithMeleeSkill: number
  totalIncreasedAreaOfEffect: number
  totalIncreasedDamageOfPhysicalWithSkill: number
  totalIncreasedDamageOfColdWithSkill: number
  totalIncreasedDamageOfLightningWithSkill: number
  totalIncreasedDamageOfFireWithSkill: number
  totalIncreasedProjectileDamageWithSkill: number
  totalIncreasedDamageWithAttackSkill: number
  totalIncreasedDamageWithSpellSkill: number
  totalTrinityIncreasedElementalDamage: number
  totalTrinityIncreasedDamageOfFire: number
  totalTrinityIncreasedDamageOfCold: number
  totalTrinityIncreasedDamageOfLightning: number
  totalTrinityIncreasedDamageOfPhysical: number
  totalIncreasedBowmanDamage: number
  totalIncreasedRogueDamage: number
  totalIncreasedWarriorDamage: number
  totalAddedManaCost: number
  totalMoreDamage: number
  totalMoreHitCount: number
  totalMoreDuration: number
  totalStr: number
  totalDex: number
  totalLuk: number
  totalPierce: number
  totalConvertRateStrToCriticalMultiplier: number
  totalConvertRateDexToCriticalMultiplier: number
  totalConvertRateLukToCriticalMultiplier: number
  totalAddedRecoveryHpOnKill: number
  totalAddedRecoveryMpOnKill: number
  totalRegenerateMp: number
  totalRegenerateHp: number
  totalAttackSpeed: number
  totalMoreProjectiles: number
  totalLessProjectileDamage: number

  totalArmor: number
  totalAddedArmor: number
  totalIncreasedArmor: number

  totalIncreasedStr: number
  totalIncreasedDex: number
  totalIncreasedLuk: number

  totalIncreasedHp: number
  totalIncreasedMp: number

  totalIncreasedResistanceOfPhysical: number
  totalIncreasedResistanceOfCold: number
  totalIncreasedResistanceOfFire: number
  totalIncreasedResistanceOfLightning: number
  totalIncreasedResistanceOfAll: number

  addedDamageOfAxe: number
  addedDamageOfSword: number
  addedDamageOfDagger: number
  addedDamageOfBow: number
  addedDamageOfBlunt: number
  addedDamageOfSpear: number
  addedDamageOfGun: number
  addedDamageOfCannon: number
  addedDamageOfClaw: number
}
export interface CharacterStat {
  calculationData: CalculateData
  criticalMultiplier: number // 10
  criticalRate: number // 5
  damageOfPhysical: number // 10
  damageOfFire: number // 10
  damageOfCold: number // 10
  damageOfLightning: number // 10

  totalIncreasedPhysical: number
  totalIncreasedFire: number
  totalIncreasedCold: number
  totalIncreasedLightning: number

  addedHp: number
  totalIncreasedHp: number

  str: number
  dex: number
  luk: number

  speed: number

  damage: number
  hp: number
  mp: number

  armor: number

  hpRecoveryOnKill: number
  mpRecoveryOnKill: number
  mpRegenerate: number
  hpRegenerate: number

  attackSpeed: number
  pierce: number
  lessProjectileDamage: number

  moreProjectiles: number
  moreAreaOfEffect: number
  moreHitCount: number
  moreDuration: number
  mpConsumption: number

  damageOfPhysicalWithSkill: number
  damageOfColdWithSkill: number
  damageOfLightningWithSkill: number
  damageOfFireWithSkill: number
  damageOfAttackWithSkill: number
  damageOfSpellWithSkill: number

  characterSkill: { activeSkill: string }
  activeSkill: ActiveSkill
}

export interface MeResponse {
  user: User
  character: Character
  nextExp: number
  stat: CharacterStat
  equippedItems: Item[]
  deck: CardDeck
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
    totalDamage: number
    weapon?: any
    activeSkill: ActiveSkill
  }
}

export interface RankListResponse extends Pagination {
  characters: Array<Character & { activeSkill?: ActiveSkill }>
}
export interface RankOfDamageListResponse extends Pagination {
  ranks: Array<RankLog & { activeSkill?: ActiveSkill }>
}
