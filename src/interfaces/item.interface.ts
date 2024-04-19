import { MongooseDocument, Pagination } from './common.interface'

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

export interface DropTableItem {
  itemId: string
  item: any
  iType: 'BaseWeapon' | string
  roll: number
}
export interface DropTable extends MongooseDocument {
  items: DropTableItem[]
  monsterId: string
}
export interface DropTableListResponseDto extends Pagination {
  dropTables: DropTable[]
}
