import { createHmac } from 'crypto'
import { AES } from 'crypto-js'
import { DataQueue } from '@/game/scenes/objects/GamePlayer'

const SECRET_KEY = 'dbs4321'
const ENCRYPTION_KEY = 'awliejrila'
export const pickByRate = (rate: number) => {
  const compensateValue = 10000
  return (
    Math.floor(Math.random() * ((100 + 1) * compensateValue)) <=
    compensateValue * rate
  )
}

export const pickByRoll = (roll: number) => {
  if (roll <= 0) return true
  const result = parseInt(String(Math.random() * roll), 10) + 1 === 1
  return result
}

export const createSignedPacket = (data: DataQueue, gameKey: string) => {
  const payload = { ...data, gameKey, timestamp: new Date().getTime() }
  const encryptedPayload = AES.encrypt(
    JSON.stringify(payload),
    ENCRYPTION_KEY,
  ).toString()
  const signature = createHmac('sha256', SECRET_KEY)
    .update(encryptedPayload)
    .digest('hex')
  return { encryptedPayload, signature }
}
