import { MongooseDocument, Pagination } from '@/interfaces/common.interface'

export interface MyStashListResponse extends Pagination {
  stashes: Stash[]
}

export interface MyStashResponse extends Pagination {
  stash: Stash
}
export interface Stash extends MongooseDocument {
  slots: number
  items: any[]
}
