import { SkillKind } from '@/interfaces/skill.interface'
import { SkillTag } from '@/services/skill/skill-tag.enum'

export interface ActiveSkill {
  name: SkillKind
  icon: string
  desc: string
  tags: SkillTag[]
}
export const activeSkills = [
  {
    name: SkillKind.ThrowWeapon,
    icon: '/game-resources/skills/throw-weapon.webp',
    desc: '무기를 각 1000%의 피해로 3개 투척합니다. MP를 20 소비합니다.',
    tags: [SkillTag.RangedAttack, SkillTag.Physical, SkillTag.Projectile],
  },
  {
    name: SkillKind.Strike,
    icon: '/game-resources/skills/strike.webp',
    desc: '작은 반경 내의 모든 몬스터를 1000%의 피해로 타격합니다. MP를 20 소비합니다.',
    tags: [SkillTag.MeleeAttack, SkillTag.Lightning],
  },
]
