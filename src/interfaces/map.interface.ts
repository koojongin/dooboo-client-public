import { Monster } from '@/interfaces/monster.interface'

export interface DbMap {
  _id?: string
  name: string
  monsters?: Monster[]
  mosterIds?: Monster[] | string[]
}
export interface GetMapsResponse {
  maps: DbMap[]
}

export interface GetMapResponse {
  map: DbMap
  monsters: Monster[]
}
