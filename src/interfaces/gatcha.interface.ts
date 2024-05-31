export interface GatchaCard {
  thumbnail: string
  level: number
  starForce: number
  weight: number
  name: string
  options: CardOption[]
}

export interface CardOption {
  name: string
  value: number
  level: number
  desc: string
}
