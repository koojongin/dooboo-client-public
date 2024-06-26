import { SkillKind } from '@/interfaces/skill.interface'

export const skillTranslate = (text: string) => {
  const keyName = 'skill'
  if (text === `${keyName}:${SkillKind.Strike}`) return '스트라이크'
  if (text === `${keyName}:${SkillKind.ThrowWeapon}`) return '무기 투척'
  return text
}
