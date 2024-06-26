import { SkillKind } from '@/interfaces/skill.interface'

export enum JobKind {
  Bowman = 'bowman',
  Warrior = 'warrior',
  Rogue = 'rogue',
}

export type AllSkillResponse = {
  [key in JobKind]: SkillData[]
}

export type SkillData = {
  name: SkillKind
  desc: string
  max: number
  info: Array<{ value: number } & any>
  src: string
}
