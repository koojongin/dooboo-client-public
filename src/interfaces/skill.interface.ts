import { ActiveSkill } from '@/services/skill/skill'

export interface ISkill {
  desc: string
  learn?: number
  max: number
  src: string
  name: string
}

export interface SkillMeResponse {
  job: string
  point?: {
    remain: number
    total: number
  }
  skills: ISkill[]
  tree: {
    [key: string]: ISkill
  }
  activeSkill: SkillKind
  activeSkills: ActiveSkill[]
}
export enum SkillKind {
  SwordMastery = 'sword-mastery',
  SpearMastery = 'spear-mastery',
  AxeMastery = 'axe-mastery',
  BluntMastery = 'blunt-mastery',
  AddStr = 'add-str',
  AddDex = 'add-dex',
  AddLuk = 'add-luk',
  AddCriticalRate = 'add-critical-rate',
  AddCriticalMultiplier = 'add-critical-multiplier',
  PowerStrike = 'power-strike',
  ThrowWeapon = 'throw-weapon',
  Strike = 'strike',
  IceShuriken = 'ice-shuriken',
  FireWall = 'fire-wall',
}

export const SKILL_ROGUE = [
  {
    name: SkillKind.SwordMastery,
    src: '/images/skills/swordman/strike.webp',
    desc: '검 착용시 피해 1% 증가',
  },
]

export const SKILLS_SWORDMAN = [
  {
    name: SkillKind.SpearMastery,
    src: '/images/skills/swordman/spear-mastery.png',
    desc: '창 착용시 피해 3% 증가',
    max: 20,
  },
  {
    name: SkillKind.AxeMastery,
    src: '/images/skills/swordman/axe-mastery.png',
    desc: '도끼 착용시 피해 3% 증가',
    max: 20,
  },
  {
    name: SkillKind.BluntMastery,
    src: '/images/skills/swordman/blunt-mastery.png',
    desc: '둔기 착용시 피해 3% 증가',
    max: 20,
  },
  {
    name: SkillKind.AddStr,
    src: '/images/skills/add-stat.png',
    desc: '힘 +10',
    max: 5,
  },
  {
    name: SkillKind.AddDex,
    src: '/images/skills/add-stat.png',
    desc: '민첩 +10',
    max: 5,
  },
  {
    name: SkillKind.AddLuk,
    src: '/images/skills/add-stat.png',
    desc: '행운 +10',
    max: 5,
  },
  {
    name: SkillKind.AddCriticalMultiplier,
    src: '/images/skills/critical-rate.png',
    desc: '치명타 확률 +1%',
    max: 10,
  },
  {
    name: SkillKind.AddCriticalRate,
    src: '/images/skills/critical-multiplier.png',
    desc: '치명타 배율 +5%',
    max: 10,
  },
  {
    name: SkillKind.PowerStrike,
    src: '/images/skills/swordman/power-strike.png',
    desc: 'MP를 소비하여 장착한 무기로 적에게 일격을 가한다.',
    max: 20,
  },
]

export interface ServerSkill {
  name: string
}

export interface CharacterSkill {
  [key: string]: {
    learn: number
    max: number
  }
}
