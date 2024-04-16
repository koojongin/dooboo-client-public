import { Monster } from '@/interfaces/monster.interface'

export interface DbMap {
  _id?: string
  name: string
  monsters?: Monster[]
  mosterIds?: Monster[] | string[]
}
export interface GetMapResponse {
  maps: DbMap[]
}
