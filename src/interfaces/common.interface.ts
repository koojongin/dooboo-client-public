export interface Pagination {
  page: number // 1
  total: number // 1
  totalPages: number // 1
  limit?: number
}

export interface MongooseDocument {
  createdAt?: Date | string
  updatedAt?: Date | string
  _id?: string
  id?: string
}

export const SortingType = {
  Asc: 'asc',
  Desc: 'desc',
}

export const MessageLogCategoryKind = {
  Message: 'message',
  AuctionAdd: 'auction-add',
  AuctionSold: 'auction-sold',
  AuctionPurchase: 'auction-purchase',
  AuctionRetrieve: 'auction-retrieve',
  PickupLog: 'pickup-log',
}
