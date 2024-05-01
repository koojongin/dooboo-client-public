import moment from 'moment'
import 'moment/locale/ko'
import parse from 'html-react-parser'
import { Item } from '@/interfaces/item.interface'

export const toRangeString = (range: number[]) => {
  const [start, end] = range
  return `${start} ~ ${end}`
}

export const toYYYYMMDDHHMMSS = (date: string | Date) => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

export const ago = (date: string | Date) => {
  return moment(date).fromNow()
}

export const toMMDDHHMMSS = (date: string | Date) => {
  return moment(date).format('MM/DD HH:mm:ss')
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

export const toEmojiPath = (path: string) => {
  return `/images/emoji/${path}`
}

export const translate = (text: string) => {
  let parsedText = text
  switch (text) {
    case 'axe':
      parsedText = '도끼'
      break
    case 'sword':
      parsedText = '검'
      break
    case 'dagger':
      parsedText = '단검'
      break
    case 'bow':
      parsedText = '활'
      break
    case 'blunt':
      parsedText = '둔기'
      break
    case 'spear':
      parsedText = '창'
      break
    case 'normal':
      parsedText = '일반'
      break
    case 'magic':
      parsedText = '마법'
      break
    case 'rare':
      parsedText = '희귀'
      break
    case 'epic':
      parsedText = '서사'
      break

    /// /////////////////////////////////////////////////////
    case 'INCREASED_DAMAGE':
      parsedText = '피해 증가(%)'
      break
    case 'INCREASED_PHYSICAL_DAMAGE':
      parsedText = '물리 피해 증가(%)'
      break
    case 'INCREASED_COLD_DAMAGE':
      parsedText = '냉기 피해 증가(%)'
      break
    case 'INCREASED_FIRE_DAMAGE':
      parsedText = '화염 피해 증가(%)'
      break
    case 'INCREASED_LIGHTNING_DAMAGE':
      parsedText = '번개 피해 증가(%)'
      break
    case 'ADDED_PHYSICAL_DAMAGE':
      parsedText = '물리 피해 추가(+)'
      break
    case 'ADDED_COLD_DAMAGE':
      parsedText = '냉기 피해 추가(+)'
      break
    case 'ADDED_FIRE_DAMAGE':
      parsedText = '화염 피해 추가(+)'
      break
    case 'ADDED_LIGHTNING_DAMAGE':
      parsedText = '번개 피해 추가(+)'
      break
    case 'ADDED_DAMAGE_WITH_AXE':
      parsedText = '도끼 피해 추가(+)'
      break
    case 'ADDED_DAMAGE_WITH_SWORD':
      parsedText = '검 피해 추가(+)'
      break
    case 'ADDED_DAMAGE_WITH_DAGGER':
      parsedText = '단검 피해 추가(+)'
      break
    case 'ADDED_DAMAGE_WITH_BOW':
      parsedText = '활 피해 추가(+)'
      break
    case 'ADDED_DAMAGE_WITH_BLUNT':
      parsedText = '둔기 피해 추가(+)'
      break
    case 'ADDED_DAMAGE_WITH_SPEAR':
      parsedText = '창 피해 추가(+)'
      break
    case 'INCREASED_DAMAGE_WITH_AXE':
      parsedText = '도끼 피해 증가(%)'
      break
    case 'INCREASED_DAMAGE_WITH_SWORD':
      parsedText = '검 피해 증가(%)'
      break
    case 'INCREASED_DAMAGE_WITH_DAGGER':
      parsedText = '단검 피해 증가(%)'
      break
    case 'INCREASED_DAMAGE_WITH_BOW':
      parsedText = '활 피해 증가(%)'
      break
    case 'INCREASED_DAMAGE_WITH_BLUNT':
      parsedText = '둔기 피해 증가(%)'
      break
    case 'INCREASED_DAMAGE_WITH_SPEAR':
      parsedText = '창 피해 증가(%)'
      break
    default:
      break
  }

  return parsedText
}

export const toColorByGrade = (grade: string) => {
  let color = '#fff'
  switch (grade) {
    case 'normal':
      color = '#ece0e0'
      break
    case 'magic':
      color = '#0082ff'
      break
    case 'rare':
      color = '#fdd125'
      break
    case 'epic':
      color = '#6000d2'
      break
    default:
      break
  }
  return color
}

export const parseHtml = (content: string) => {
  return parse(content)
}

export function dataURLtoFile(dataurl: string, filename: string) {
  const arr = dataurl.split(',')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  // eslint-disable-next-line no-plusplus
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], filename, { type: mime })
}
