import { Character, User } from '@/interfaces/user.interface'
import { MongooseDocument, Pagination } from '@/interfaces/common.interface'

export interface Board extends MongooseDocument {
  character?: Character
  characterId: string
  content: string
  reads: number
  recommends: string[]
  recommendCount: any
  title: string
  comments?: any[]
}

export interface BoardListResponse extends Pagination {
  boards: Board[]
}
