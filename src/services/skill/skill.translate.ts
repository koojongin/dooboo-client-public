import { SkillKind } from '@/interfaces/skill.interface'

export const skillTranslate = (text: string) => {
  const keyName = 'skill'
  if (text === `${keyName}:${SkillKind.Strike}`) return '스트라이크'
  if (text === `${keyName}:${SkillKind.ThrowWeapon}`) return '무기 투척'
  if (text === `${keyName}:${SkillKind.IceShuriken}`) return '냉기 표창'
  if (text === `${keyName}:${SkillKind.FireWall}`) return '화염벽'

  if (text === `${keyName}:dagger-mastery`) return '단검 마스터리'
  if (text === `${keyName}:sword-mastery`) return '검 마스터리'
  if (text === `${keyName}:claw-mastery`) return '아대 마스터리'
  if (text === `${keyName}:spear-mastery`) return '창 마스터리'
  if (text === `${keyName}:axe-mastery`) return '도끼 마스터리'
  if (text === `${keyName}:blunt-mastery`) return '둔기 마스터리'
  if (text === `${keyName}:bow-mastery`) return '활 마스터리'
  if (text === `${keyName}:gun-mastery`) return '권총 마스터리'
  if (text === `${keyName}:cannon-mastery`) return '대포 마스터리'

  if (text === `${keyName}:dagger-booster`) return '단검 부스터'
  if (text === `${keyName}:sword-booster`) return '검 부스터'
  if (text === `${keyName}:claw-booster`) return '아대 부스터'
  if (text === `${keyName}:spear-booster`) return '창 부스터'
  if (text === `${keyName}:axe-booster`) return '도끼 부스터'
  if (text === `${keyName}:blunt-booster`) return '둔기 부스터'
  if (text === `${keyName}:bow-booster`) return '활 부스터'
  if (text === `${keyName}:gun-booster`) return '권총 부스터'
  if (text === `${keyName}:cannon-booster`) return '대포 부스터'

  if (text === `${keyName}:add-str`) return '추가 힘'
  if (text === `${keyName}:add-dex`) return '추가 민첩'
  if (text === `${keyName}:add-luk`) return '추가 행운'
  if (text === `${keyName}:add-critical-rate`) return '치명타 확률 증가'
  if (text === `${keyName}:add-critical-multiplier`) return '치명타 배율 증가'

  if (text === `${keyName}:added-hp`) return 'HP 추가'
  if (text === `${keyName}:added-mp`) return 'MP 추가'
  if (text === `${keyName}:added-regenerate-hp-on-kill`)
    return '처치 시 HP 회복'
  if (text === `${keyName}:added-regenerate-mp-on-kill`)
    return '처치 시 MP 회복'
  if (text === `${keyName}:added-regenerate-hp`) return 'HP 재생량 추가'
  if (text === `${keyName}:added-regenerate-mp`) return 'MP 재생량 추가'
  if (text === `${keyName}:increased-damage-of-lightning-with-skill`)
    return '번개 스킬 강화'
  if (text === `${keyName}:increased-damage-of-cold-with-skill`)
    return '냉기 스킬 강화'
  if (text === `${keyName}:increased-damage-of-fire-with-skill`)
    return '화염 스킬 강화'
  if (text === `${keyName}:increased-damage-of-physical-with-skill`)
    return '물리 스킬 강화'
  return text
}
