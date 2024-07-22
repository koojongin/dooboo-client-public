import { Monster } from '@/interfaces/monster.interface'

export interface DbMap {
  _id?: string
  name: string
  isRaid: boolean
  isHide: boolean
  monsters?: Monster[]
  mosterIds?: Monster[] | string[]
  level: number
}
export interface GetMapsResponse {
  maps: DbMap[]
}

export interface GetMapResponse {
  map: DbMap
  monsters: Monster[]
}
