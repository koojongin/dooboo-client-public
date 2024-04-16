export interface Monster {
  _id: string // '660460ed1a2de41704a1e097'
  armor: number // 0
  createdBy: string // '199116468372242432'
  experience: number // 5
  gold: number // 1
  hp: number // 1
  name: string // '뭔데'
  thumbnail: string // 'public/upload/monsters/6052639b-a346-4e7d-bb29-1ad88093a20d.png'
  weight: number // 55
  updatedAt: string // '2024-03-27T18:09:49.058Z'
  createdAt: string // '2024-03-27T18:09:49.058Z'

  rate?: number
}

export type MonsterListRef = {
  refresh: () => void
}

export interface UpdateMonsterDialogRef {
  refresh?: () => void
  openDialog: (monster: Monster) => void
}
