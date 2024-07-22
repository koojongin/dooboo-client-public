import { MongooseDocument, Pagination } from '@/interfaces/common.interface'
import { Character } from '@/interfaces/user.interface'
import { DefenceGear, Misc, Weapon } from '@/interfaces/item.interface'

export interface Auction extends MongooseDocument {
  gold: number
  iType: string
  weapon?: Weapon
  weaponId?: string

  defenceGear?: DefenceGear
  defenceGearId?: string

  misc?: Misc
  miscId?: string

  owner: Character
}

export interface AuctionListResponse extends Pagination {
  auctions: Auction[]
}
