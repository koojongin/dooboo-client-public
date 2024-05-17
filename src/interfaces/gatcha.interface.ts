export interface GatchaCard {
  thumbnail: string
  level: number
  starForce: number
  weight: number
  name: string
  options: CardOption[]
}

export interface CardOption {
  name: 'AddedMp'
  value: 20
  level: 1
}
