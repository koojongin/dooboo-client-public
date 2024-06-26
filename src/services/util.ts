import moment from 'moment'
import 'moment/locale/ko'
import parse from 'html-react-parser'
import { Item } from '@/interfaces/item.interface'
import { JobKind } from '@/interfaces/job.interface'
import { skillTranslate } from '@/services/skill/skill.translate'
import { cardTranslate } from '@/services/card/card.translate'
import { cardOptionTranslate } from '@/services/card/card.option.translate'
import { skillTagTranslate } from '@/services/skill/skill.tag.translate'

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

export const toMMDDHHMMSSvDot = (date: string | Date) => {
  return moment(date).format('MM.DD HH:mm:ss')
}

export const toMMDDHHMM = (date: string | Date) => {
  return moment(date).format('MM/DD HH:mm')
}

export const toHHMM = (date: string | Date) => {
  return moment(date).format('HH:mm')
}
export const toHHMMSS = (date: string | Date) => {
  return moment(date).format('HH:mm:ss')
}

export const getItemByType = (item: Item) => {
  switch (item.iType) {
    case 'weapon':
      return item.weapon
      break

    case 'misc':
      return item.misc
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
    case 'select:Exist':
      parsedText = '예'
      break
    case 'select:NotExist':
      parsedText = '아니오'
      break
    case 'select:All':
      parsedText = '모두'
      break

    // convert
    case 'convert:damageOfPhysical':
      parsedText = '물리'
      break
    case 'convert:damageOfFire':
      parsedText = '화염'
      break
    case 'convert:damageOfCold':
      parsedText = '냉기'
      break
    case 'convert:damageOfLightning':
      parsedText = '번개'
      break
    /// //////////////////////////////////////////////
    case 'iCategory:etc':
      parsedText = '기타'
      break
    case 'iCategory:consume':
      parsedText = '소비'
      break

    case 'iType:weapon':
      parsedText = '무기'
      break
    case 'iType:misc':
      parsedText = '기타'
      break
    /// ////////////////
    case 'menu:weapon':
      parsedText = '무기'
      break
    case 'menu:misc':
      parsedText = '기타'
      break
    case 'map:Normal':
      parsedText = '일반'
      break
    case 'map:Raid':
      parsedText = '레이드'
      break
    case 'etc':
      parsedText = '기타'
      break
    case 'consume':
      parsedText = '소비'
      break
    case 'menu:MessageLog':
      parsedText = '쪽지'
      break
    case 'menu:EnhancedLog':
      parsedText = '강화 기록'
      break
    case 'menu:All':
      parsedText = '전체'
      break
    case 'menu:Running':
      parsedText = '진행중'
      break
    case 'menu:Completed':
      parsedText = '완료'
      break

    case 'job:warrior':
      parsedText = '전사'
      break
    case 'job:bowman':
      parsedText = '궁수'
      break
    case 'job:rogue':
      parsedText = '도적'
      break
    case 'job:novice':
      parsedText = '초보자'
      break

    case 'dagger-mastery':
      parsedText = '단검 마스터리'
      break
    case 'sword-mastery':
      parsedText = '검 마스터리'
      break
    case 'claw-mastery':
      parsedText = '아대 마스터리'
      break
    case 'spear-mastery':
      parsedText = '창 마스터리'
      break
    case 'axe-mastery':
      parsedText = '도끼 마스터리'
      break
    case 'blunt-mastery':
      parsedText = '둔기 마스터리'
      break
    case 'bow-mastery':
      parsedText = '활 마스터리'
      break
    case 'gun-mastery':
      parsedText = '권총 마스터리'
      break
    case 'cannon-mastery':
      parsedText = '대포 마스터리'
      break

    case 'add-str':
      parsedText = '추가 힘'
      break
    case 'add-dex':
      parsedText = '추가 민첩'
      break
    case 'add-luk':
      parsedText = '추가 행운'
      break
    case 'add-critical-rate':
      parsedText = '치명타 확률 증가'
      break
    case 'add-critical-multiplier':
      parsedText = '치명타 배율 증가'
      break
    case 'power-strike':
      parsedText = '파워 스트라이크'
      break

    /// //////////////
    case 'trade-sort:created':
      parsedText = '등록순'
      break
    case 'trade-sort:price':
      parsedText = '가격순'
      break
    case 'trade-sort:grade':
      parsedText = '등급순'
      break
    case 'trade-sort:item-level':
      parsedText = '아이템 레벨순'
      break
    /// ///////////////////////////
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
    case 'gun':
      parsedText = '권총'
      break
    case 'cannon':
      parsedText = '대포'
      break
    case 'claw':
      parsedText = '아대'
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
    case 'primordial':
      parsedText = '태초'
      break

    /// /////////////////////////////////////////////////////
    case 'INCREASED_ATTACK_SPEED':
      parsedText = '공격 속도 증가(%)'
      break
    case 'REGENERATE_MANA':
      parsedText = '초당 마나회복(+)'
      break
    case 'ADDED_MANA_ON_KILL':
      parsedText = '처치시 MP 회복(+)'
      break
    case 'ADDED_LIFE_ON_KILL':
      parsedText = '처치 시 HP 회복(+)'
      break
    case 'ADDED_MANA':
      parsedText = 'MP 추가(+)'
      break
    case 'REDUCTION_MANA_COST':
      parsedText = '스킬의 MP 소모량 감소'
      break
    case 'REDUCTION_REQUIRED_EQUIPPED_LEVEL':
      parsedText = '착용 레벨 감소'
      break
    case 'INCREASED_DAMAGE':
      parsedText = '피해 증가(%)'
      break
    case 'INCREASED_DAMAGE_WITH_ROGUE':
      parsedText = '도적 피해 증가(%)'
      break
    case 'INCREASED_DAMAGE_WITH_WARRIOR':
      parsedText = '전사 피해 증가(%)'
      break
    case 'INCREASED_DAMAGE_WITH_BOWMAN':
      parsedText = '궁수 피해 증가(%)'
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
    case 'ADDED_DAMAGE_WITH_GUN':
      parsedText = '권총 피해 추가(+)'
      break
    case 'ADDED_DAMAGE_WITH_CANNON':
      parsedText = '대포 피해 추가(+)'
      break
    case 'ADDED_DAMAGE_WITH_CLAW':
      parsedText = '아대 피해 추가(+)'
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
    case 'INCREASED_DAMAGE_WITH_GUN':
      parsedText = '권총 피해 증가(%)'
      break
    case 'INCREASED_DAMAGE_WITH_CANNON':
      parsedText = '대포 피해 증가(%)'
      break
    case 'INCREASED_DAMAGE_WITH_CLAW':
      parsedText = '아대 피해 증가(%)'
      break
    default:
      break
  }
  parsedText = cardTranslate(parsedText)
  parsedText = cardOptionTranslate(parsedText)
  parsedText = skillTranslate(parsedText)
  parsedText = skillTagTranslate(parsedText)
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
    case 'primordial':
      color = '#2ebe29'
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

export function toFixedWithFloat(value: number, fixedValue = 2) {
  if (!value) return value
  return parseFloat(value.toFixed(fixedValue))
}

export function formatNumber(number: number) {
  if (!number) return number
  // Use the toLocaleString method to add suffixes to the number
  return number.toLocaleString('ko-KR', {
    // add suffixes for thousands, millions, and billions
    // the maximum number of decimal places to use
    maximumFractionDigits: 2,
    // specify the abbreviations to use for the suffixes
    notation: 'compact',
    compactDisplay: 'short',
  })
}

export function getJobIconUrl(job: string) {
  if (job === JobKind.Bowman) return '/images/job/icon_job_bowman.webp'
  if (job === JobKind.Warrior) return '/images/job/icon_job_warrior.webp'
  if (job === JobKind.Rogue) return '/images/job/icon_job_rogue.webp'
  return '/images/job/icon_job_novice.png'
}
export function getJobIconBgColor(job: string) {
  if (job === JobKind.Bowman) return '#3b8839'
  if (job === JobKind.Warrior) return '#e84b4b'
  if (job === JobKind.Rogue) return '#525bee'
  return '#444040'
}

export function isExistLoginToken() {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('token')
}
