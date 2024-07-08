// eslint-disable-next-line import/no-cycle
import { SkillKind } from '@/interfaces/skill.interface'
import { SkillTag } from '@/services/skill/skill-tag.enum'

export interface ActiveSkill {
  name: SkillKind
  icon: string
  desc: string
  tags: SkillTag[]
  mp: number
  damageData: { Multiplier: number; maxHitCount: number }
}
