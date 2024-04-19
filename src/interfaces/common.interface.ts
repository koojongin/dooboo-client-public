export interface Pagination {
  page: number // 1
  total: number // 1
  totalPages: number // 1
}

export interface MongooseDocument {
  createdAt?: Date | string
  updatedAt?: Date | string
  _id: string
  id?: string
}
