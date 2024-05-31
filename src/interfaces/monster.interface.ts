import { MongooseDocument } from '@/interfaces/common.interface'
import { DropTableItem } from '@/interfaces/drop-table.interface'

export interface Monster extends MongooseDocument {
  armor: number // 0
  experience: number // 5
  gold: number // 1
  hp: number // 1
  name: string // '뭔데'
  thumbnail: string // 'public/upload/monsters/6052639b-a346-4e7d-bb29-1ad88093a20d.png'
  weight: number // 55
  rate?: number
  level: number
  inRaid: boolean
  isHide: boolean
  drop?: { items: DropTableItem[] } & MongooseDocument
}

export type MonsterListRef = {
  refresh: () => void
}

export interface UpdateMonsterDialogRef {
  refresh?: () => void
  openDialog: (monster: Monster) => void
}
