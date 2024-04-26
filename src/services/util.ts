import moment from 'moment'
import { Item } from '@/interfaces/item.interface'

export const toRangeString = (range: number[]) => {
  const [start, end] = range
  return `${start} ~ ${end}`
}

export const toYYYYMMDDHHMMSS = (date: string | Date) => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

export const toMMDDHHMM = (date: string | Date) => {
  return moment(date).format('MM/DD HH:mm')
}

export const toHHMM = (date: string | Date) => {
  return moment(date).format('HH:mm')
}

export const getItemByType = (item: Item) => {
  switch (item.iType) {
    case 'weapon':
      return item.weapon
      break
    default:
      throw new Error('Unknown Item Type')
      break
  }
}

export const getTokenByLocalStorage = () => {
  return localStorage.getItem('token') || ''
}
