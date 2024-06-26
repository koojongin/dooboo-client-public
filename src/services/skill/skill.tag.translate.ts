import { SkillTag } from '@/services/skill/skill-tag.enum'

export const skillTagTranslate = (text: string) => {
  const keyName = 'skill-tag'
  if (text === `${keyName}:${SkillTag.RangedAttack}`) return '원거리 공격'
  if (text === `${keyName}:${SkillTag.MeleeAttack}`) return '근접 공격'
  if (text === `${keyName}:${SkillTag.Physical}`) return '물리'
  if (text === `${keyName}:${SkillTag.Lightning}`) return '번개'
  if (text === `${keyName}:${SkillTag.Cold}`) return '냉기'
  if (text === `${keyName}:${SkillTag.Fire}`) return '화염'
  if (text === `${keyName}:${SkillTag.Projectile}`) return '투사체'
  return text
}
