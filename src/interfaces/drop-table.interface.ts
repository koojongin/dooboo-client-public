import { MongooseDocument, Pagination } from '@/interfaces/common.interface'
import { BaseMisc, BaseWeapon } from '@/interfaces/item.interface'

export interface DropTableItem extends MongooseDocument {
  itemId?: string
  item?: BaseWeapon | BaseMisc | any
  iType: 'BaseWeapon' | string
  roll: number
  amount: number
  isTopRankReward: boolean
}
export interface DropTable extends MongooseDocument {
  items: DropTableItem[]
  monsterId: string
  monster?: any
}
export interface DropTableListResponseDto extends Pagination {
  dropTables: DropTable[]
}
export interface DropTableResponseDto extends Pagination {
  dropTable: DropTable
}

export enum BaseItemType {
  'BaseWeapon' = 'BaseWeapon',
  'BaseMisc' = 'BaseMisc',
  'BaseDefenceGear' = 'BaseDefenceGear',
}
