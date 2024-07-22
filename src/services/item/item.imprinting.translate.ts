export const itemImprintingOptionTranslate = (text: string) => {
  const key = 'imprinting:'
  if (text === `${key}IncreasedAttackSpeed`) return '공격 속도 증가(%)'
  if (text === `${key}IncreasedBowmanDamage`) return '궁수 피해 증가(%)'
  if (text === `${key}IncreasedWarriorDamage`) return '전사 피해 증가(%)'
  if (text === `${key}IncreasedRogueDamage`) return '도적 피해 증가(%)'
  if (text === `${key}IncreasedResistOfFireInNearly`)
    return '주변 적의 화염 저항(%)'
  if (text === `${key}IncreasedResistOfColdInNearly`)
    return '주변 적의 냉기 저항(%)'
  if (text === `${key}IncreasedResistOfLightningInNearly`)
    return '주변 적의 번개 저항(%)'
  if (text === `${key}IncreasedResistOfPhysicalInNearly`)
    return '주변 적의 물리 저항(%)'
  if (text === `${key}IncreasedHp`) return 'HP 증가(%)'
  if (text === `${key}IncreasedMp`) return 'MP 증가(%)'
  if (text === `${key}AddedProjectile`) return '투사체 추가'
  if (text === `${key}AddedPierce`) return '관통수 추가'
  if (text === `${key}AddedMaxHitCountWithMeleeSkill`)
    return '근접 스킬의 타격수 추가'
  if (text === `${key}IncreasedDamageWithSpellSkill`)
    return '마법 스킬 피해 증가(%)'
  if (text === `${key}IncreasedDamageWithMeleeSkill`)
    return '근접 스킬 피해 증가(%)'
  if (text === `${key}IncreasedDamageWithAttackSkill`)
    return '공격 스킬 피해 증가(%)'
  if (text === `${key}IncreasedDamageWithProjectileSkill`)
    return '투사체 스킬 피해 증가(%)'
  if (text === `${key}IncreasedLightningDamage`) return '번개 피해 증가(%)'
  if (text === `${key}IncreasedColdDamage`) return '냉기 피해 증가(%)'
  if (text === `${key}IncreasedFireDamage`) return '화염 피해 증가(%)'
  if (text === `${key}IncreasedPhysicalDamage`) return '물리 피해 증가(%)'
  if (text === `${key}AddedMp`) return 'HP 추가(+)'
  if (text === `${key}AddedHp`) return 'MP 추가(+)'
  if (text === `${key}IncreasedCriticalMultiplier`) return '치명타 배율 증가(%)'
  if (text === `${key}IncreasedCriticalRate`) return '치명타 확률 증가(%)'
  if (text === `${key}AddedFlatDamageBySummedPercent`)
    return '합산형 무작위 기본 피해 증가(%)'

  if (text === `${key}AddedDamageOfLightningBySummedPercent`)
    return '번개 피해 추가(+)'
  if (text === `${key}AddedDamageOfFireBySummedPercent`)
    return '화염 피해 추가(+)'
  if (text === `${key}AddedDamageOfColdBySummedPercent`)
    return '냉기 피해 추가(+)'
  if (text === `${key}AddedDamageOfPhysicalBySummedPercent`)
    return '물리 피해 추가(+)'

  if (text === `${key}IncreasedArmor`) return '방어력 증가(%)'
  if (text === `${key}AddedArmor`) return '방어력 추가(+)'
  if (text === `${key}AddedRecoveryHp`) return '초당 HP 회복량(+)'
  if (text === `${key}AddedRecoveryMp`) return '초당 MP 회복량(+)'

  return text
}
