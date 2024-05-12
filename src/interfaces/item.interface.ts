import { MongooseDocument, Pagination } from './common.interface'

export enum MiscTypeCategoryKind {
  Etc = 'etc',
}

export enum ItemGradeKind {
  Normal = 'normal',
  Magic = 'magic',
  Rare = 'rare',
  Epic = 'epic',
  Primordial = 'primordial',
  Unique = 'unique',
  Legendary = 'legendary',
}

export const WeaponType = {
  Axe: 'axe',
  Sword: 'sword',
  Dagger: 'dagger',
  Bow: 'bow',
  Blunt: 'blunt',
  Spear: 'spear',
  Gun: 'gun',
  Cannon: 'cannon',
  Claw: 'claw',
}

export interface Weapon extends MongooseDocument {
  criticalMultiplier: number //
  criticalRate: number //
  damageOfCold: number
  damageOfFire: number //
  damageOfLightning: number //
  damageOfPhysical: number //
  iType: string // 'weapon'
  iLevel: number
  gold: number
  iGrade: string
  name: string // '목도'
  requiredEquipmentLevel: number // 1
  thumbnail: string // 'public/upload/items/08521e812a40a8af.png'
  starForce: number
  maxStarForce: number
  weaponType: string
  additionalAttributes?: {
    [key: string]: number
  }
}

export interface BaseMisc extends MongooseDocument {
  category: string
  gold: number
  name: string
  thumbnail: string
  iType: string
  maxStack: number
  iGrade: string
}

export interface Misc extends MongooseDocument {
  stack: number
  baseMisc: BaseMisc
}

export interface BaseWeapon extends MongooseDocument {
  criticalMultiplier: number[] // [0, 0]
  criticalRate: number[] // [0, 0]
  damageOfCold: number[] // [0, 0]
  damageOfFire: number[] // [0, 0]
  damageOfLightning: number[] // [0, 0]
  damageOfPhysical: number[] // [1, 5]
  iType: string // 'weapon'
  gold: number
  name: string // '목도'
  requiredEquipmentLevel: number // 1
  thumbnail: string // 'public/upload/items/08521e812a40a8af.png'
  iLevel: number
  starForce: number
  maxStarForce: number
  weaponType: string

  /// //
  weight: number
}

export interface BaseWeaponListResponseDto extends Pagination {
  weapons: BaseWeapon[]
}

export interface BaseMiscListResponseDto extends Pagination {
  baseMiscs: BaseMisc[]
}

export interface BaseWeaponResponseDto {
  weapon: BaseWeapon
}

export interface WeaponListResponseDto extends Pagination {
  // weapons: Weapon[]
}

export interface SelectItemDialogRef {
  refresh?: () => void
  openDialog: (index: number) => void
}

export interface SimulateBattleDialogRef {
  refresh?: () => void
  openDialog: (auctionId: string) => void
}

export interface EnhancedResultDialogRef {
  open: () => void
}

export interface InventoryRef {
  refresh: () => void
}

export interface SelectMonsterDialogRef {
  refresh?: () => void
  openDialog: () => void
}

export enum ItemTypeKind {
  Misc = 'misc',
  Weapon = 'weapon',
}

export enum BaseItemTypeKind {
  BaseWeapon = 'BaseWeapon',
  BaseMisc = 'BaseMisc',
}
export interface Item extends MongooseDocument {
  iType: ItemTypeKind | string
  weaponId?: string
  miscId?: string
  weapon?: any
  misc?: any

  item?: any
  roll?: number

  owner?: any
}

export interface InnItem extends Item {
  isSelected: boolean
  open?: boolean
  isLatest?: boolean
  onChangeLatestItem?: (item: any, index: number) => void
}

export interface EnhancedResult {
  updatedWeapon: Weapon
  enhancedLog: {
    snapshot: Weapon
  }
  isSuccess: boolean
}
