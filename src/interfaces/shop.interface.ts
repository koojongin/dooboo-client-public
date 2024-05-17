import { MongooseDocument } from '@/interfaces/common.interface'
import { BaseMisc } from '@/interfaces/item.interface'

export interface ShopItem extends MongooseDocument {
  baseMiscId: string
  baseMisc: BaseMisc
  content: string
  name: string
}
