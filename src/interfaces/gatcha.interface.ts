import { MongooseDocument } from '@/interfaces/common.interface'

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

export interface CardDeck extends MongooseDocument {
  cards: GatchaCard[]
  cardNames: string[]
  index: number
  isActive: boolean
  name: string
}
