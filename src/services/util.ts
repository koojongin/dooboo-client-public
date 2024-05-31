import moment from 'moment'
import 'moment/locale/ko'
import parse from 'html-react-parser'
import { Item } from '@/interfaces/item.interface'
import { JobKind } from '@/interfaces/job.interface'

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
    case 'card:option:ElementalTrinityOfLightning':
      parsedText = '삼위일체 - 번개 피해 증가(%)'
      break
    case 'card:option:ElementalTrinityOfCold':
      parsedText = '삼위일체 - 냉기 피해 증가(%)'
      break
    case 'card:option:ElementalTrinityOfFire':
      parsedText = '삼위일체 - 화염 피해 증가(%)'
      break
    case 'card:option:ElementalTrinity':
      parsedText = '삼위일체 - 원소 피해 증가(%)'
      break

    case 'card:option:IncreasedAllDamage':
      parsedText = '피해 증가(%)'
      break
    case 'card:option:IncreasedLightningDamage':
      parsedText = '번개 피해 증가(%)'
      break
    case 'card:option:IncreasedColdDamage':
      parsedText = '냉기 피해 증가(%)'
      break
    case 'card:option:IncreasedFireDamage':
      parsedText = '화염 피해 증가(%)'
      break
    case 'card:option:IncreasedPhysicalDamage':
      parsedText = '물리 피해 증가(%)'
      break
    case 'card:option:IncreasedBowmanDamage':
      parsedText = '궁수 피해 증가(%)'
      break
    case 'card:option:IncreasedWarriorDamage':
      parsedText = '전사 피해 증가(%)'
      break
    case 'card:option:IncreasedRogueDamage':
      parsedText = '도적 피해 증가(%)'
      break
    case 'card:option:IncreasedPowerStrikeDamage':
      parsedText = '파워 스트라이크 피해 증가(%)'
      break
    case 'card:option:IncreasedPowerStrikeActivationRate':
      parsedText = '파워 스트라이크 발동 확률 증가(%)'
      break
    case 'card:option:AddedPowerStrikeMpConsumption':
      parsedText = '파워 스트라이크 마나 소모량'
      break
    case 'card:option:IncreasedCriticalRate':
      parsedText = '치명타 확률(%)'
      break
    case 'card:option:IncreasedCriticalMultiplier':
      parsedText = '치명타 배율(%)'
      break
    case 'card:option:IncreasedOddTurnDamage':
      parsedText = '홀수 턴 피해 증가(%)'
      break
    case 'card:option:IncreasedEvenTurnDamage':
      parsedText = '짝수 턴 피해 증가(%)'
      break
    case 'card:option:AddedLightningDamage':
      parsedText = '번개 피해 추가(+)'
      break
    case 'card:option:AddedColdDamage':
      parsedText = '냉기 피해 추가(+)'
      break
    case 'card:option:AddedFireDamage':
      parsedText = '화염 피해 추가(+)'
      break
    case 'card:option:AddedPhysicalDamage':
      parsedText = '물리 피해 추가(+)'
      break
    case 'card:option:AddedMp':
      parsedText = 'Mp 추가'
      break
    case 'card:option:AddedHp':
      parsedText = 'Hp 추가'
      break
    case 'card:option:AddedTurn':
      parsedText = '추가 공격'
      break
    case 'card:option:AddedStr':
      parsedText = '힘'
      break
    case 'card:option:AddedDex':
      parsedText = '민첩'
      break
    case 'card:option:AddedLuk':
      parsedText = '행운'
      break

    /// ////////////////
    case 'card:hanako-swimsuit':
      parsedText = '수영복 하나코'
      break
    case 'card:chise-swimsuit':
      parsedText = '수영복 치세'
      break
    case 'card:eimi-swimsuit':
      parsedText = '수영복 에이미'
      break
    case 'card:azusa-swimsuit':
      parsedText = '수영복 아즈사'
      break

    case 'card:chinatsu':
      parsedText = '치나츠'
      break
    case 'card:atsuko':
      parsedText = '아츠코'
      break
    case 'card:ako':
      parsedText = '아코'
      break
    case 'card:akane':
      parsedText = '아카네'
      break
    case 'card:asuna':
      parsedText = '아스나'
      break
    case 'card:chihiro':
      parsedText = '치히로'
      break

    case 'card:airi':
      parsedText = '에이리'
      break
    case 'card:noa':
      parsedText = '노아'
      break
    case 'card:minori':
      parsedText = '미노리'
      break
    case 'card:saten-ruiko':
      parsedText = '사텐 루이코'
      break
    case 'card:renge':
      parsedText = '렌게'
      break
    case 'card:tsubaki':
      parsedText = '츠바키'
      break

    case 'card:mutsuki':
      parsedText = '무츠키'
      break
    case 'card:miyako':
      parsedText = '미야코'
      break
    case 'card:sakurako':
      parsedText = '사쿠라코'
      break
    case 'card:haruna':
      parsedText = '하루나'
      break
    case 'card:kirino':
      parsedText = '키리노'
      break
    case 'card:izumi':
      parsedText = '이즈미'
      break
    case 'card:sena':
      parsedText = '세나'
      break
    case 'card:neru':
      parsedText = '네루'
      break
    case 'card:koyuki':
      parsedText = '코유키'
      break
    case 'card:kikyou':
      parsedText = '키쿄우'
      break
    case 'card:tsukuyo':
      parsedText = '츠쿠요'
      break
    case 'card:saori':
      parsedText = '사오리'
      break
    case 'card:shimiko':
      parsedText = '시미코'
      break
    case 'card:marina':
      parsedText = '마리나'
      break
    case 'card:mari':
      parsedText = '마리'
      break
    case 'card:aru':
      parsedText = '아루'
      break

    case 'card:wakamo':
      parsedText = '와카모'
      break

    case 'card:shokuhou-misaki':
      parsedText = '쇼쿠호 미사키'
      break

    case 'card:shiroko':
      parsedText = '시로코'
      break

    case 'card:hoshino':
      parsedText = '호시노'
      break

    case 'card:mashiro':
      parsedText = '마시로'
      break

    case 'card:misaka-mikoto':
      parsedText = '미사카 미코토'
      break

    case 'card:miku':
      parsedText = '미쿠'
      break

    case 'card:kaho':
      parsedText = '카호'
      break

    case 'card:kayoko':
      parsedText = '카요코'
      break

    case 'card:megu':
      parsedText = '메구'
      break

    case 'card:kaede':
      parsedText = '카에데'
      break

    case 'card:iroha':
      parsedText = '이로하'
      break

    case 'card:kotama':
      parsedText = '코타마'
      break

    case 'card:saki':
      parsedText = '사키'
      break

    case 'card:yuzu':
      parsedText = '유즈'
      break

    case 'card:chise':
      parsedText = '치세'
      break

    case 'card:hare':
      parsedText = '하레'
      break

    case 'card:haruka':
      parsedText = '하루카'
      break

    case 'card:tsurugi':
      parsedText = '츠루기'
      break

    case 'card:serina':
      parsedText = '세리나'
      break

    case 'card:serika':
      parsedText = '세리카'
      break

    case 'card:nodoka':
      parsedText = '노도카'
      break

    case 'card:tomoe':
      parsedText = '토모에'
      break
    case 'card:kotori':
      parsedText = '코토리'
      break
    case 'card:yoshimi':
      parsedText = '요시미'
      break
    case 'card:akari':
      parsedText = '아카리'
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

export const pickByRate = (rate: number) => {
  const compensateValue = 10000
  return (
    Math.floor(Math.random() * ((100 + 1) * compensateValue)) <=
    compensateValue * rate
  )
}
