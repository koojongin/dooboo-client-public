import { MongooseDocument, Pagination } from './common.interface'

export const WeaponType = {
  Axe: 'axe',
  Sword: 'sword',
  Dagger: 'dagger',
  Bow: 'bow',
  Blunt: 'blunt',
  Spear: 'spear',
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
  requiredEquipmentLevel: string // 1
  thumbnail: string // 'public/upload/items/08521e812a40a8af.png'
  starForce: number
  maxStarForce: number
  weaponType: string
  additionalAttributes?: {
    [key: string]: number
  }
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
  requiredEquipmentLevel: string // 1
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

export interface Item extends MongooseDocument {
  iType: 'weapon' | string
  weaponId?: string
  weapon?: any

  item?: BaseWeapon | any
  roll?: number
}

export interface InnItem extends Item {
  isSelected: boolean
}

export interface EnhancedResult {
  updatedWeapon: Weapon
  enhancedLog: {
    snapshot: Weapon
  }
  isSuccess: boolean
}
