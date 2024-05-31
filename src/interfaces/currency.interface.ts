import { MongooseDocument } from '@/interfaces/common.interface'

export interface CurrencyResponse {
  gold: number
  diamond: number
  currency: Currency
}

export interface Currency extends MongooseDocument {
  raidPiece: {
    [key: string]: number
  }
  diamond: number
}
