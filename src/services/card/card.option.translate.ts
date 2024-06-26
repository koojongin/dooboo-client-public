export const cardOptionTranslate = (text: string) => {
  const keyName = 'card:option'
  if (text === `${keyName}:AddedRegenerateMana`) return 'Mp 재생'
  if (text === `${keyName}:ConvertRateStrToCriticalMultiplier`)
    return '힘 - 치명타 배율 전환(%)'
  if (text === `${keyName}:ConvertRateDexToCriticalMultiplier`)
    return '민첩 - 치명타 배율 전환(%)'
  if (text === `${keyName}:ConvertRateLukToCriticalMultiplier`)
    return '행운 - 치명타 배율 전환(%)'
  if (text === `${keyName}:ElementalTrinityOfLightning`)
    return '삼위일체 - 번개 피해 증가(%)'
  if (text === `${keyName}:ElementalTrinityOfPhysical`)
    return '삼위일체 - 물리 피해 증가(%)'
  if (text === `${keyName}:ElementalTrinityOfCold`)
    return '삼위일체 - 냉기 피해 증가(%)'
  if (text === `${keyName}:ElementalTrinityOfFire`)
    return '삼위일체 - 화염 피해 증가(%)'
  if (text === `${keyName}:ElementalTrinity`)
    return '삼위일체 - 원소 피해 증가(%)'
  if (text === `${keyName}:IncreasedAllDamage`) return '피해 증가(%)'
  if (text === `${keyName}:IncreasedLightningDamage`) return '번개 피해 증가(%)'
  if (text === `${keyName}:IncreasedColdDamage`) return '냉기 피해 증가(%)'
  if (text === `${keyName}:IncreasedFireDamage`) return '화염 피해 증가(%)'
  if (text === `${keyName}:IncreasedPhysicalDamage`) return '물리 피해 증가(%)'
  if (text === `${keyName}:IncreasedBowmanDamage`) return '궁수 피해 증가(%)'
  if (text === `${keyName}:IncreasedWarriorDamage`) return '전사 피해 증가(%)'
  if (text === `${keyName}:IncreasedRogueDamage`) return '도적 피해 증가(%)'
  if (text === `${keyName}:IncreasedPowerStrikeDamage`)
    return '파워 스트라이크 피해 증가(%)'
  if (text === `${keyName}:IncreasedPowerStrikeActivationRate`)
    return '파워 스트라이크 발동 확률 증가(%)'
  if (text === `${keyName}:AddedPowerStrikeMpConsumption`)
    return '파워 스트라이크 마나 소모량'
  if (text === `${keyName}:IncreasedCriticalRate`) return '치명타 확률(%)'
  if (text === `${keyName}:IncreasedCriticalMultiplier`) return '치명타 배율(%)'
  if (text === `${keyName}:AdddedRecoveryHpOnKill`)
    return '처치 시 체력 회복(+)'
  if (text === `${keyName}:AdddedRecoveryMpOnKill`)
    return '처치 시 마나 회복(+)'
  if (text === `${keyName}:AddedLightningDamage`) return '번개 피해 추가(+)'
  if (text === `${keyName}:AddedColdDamage`) return '냉기 피해 추가(+)'
  if (text === `${keyName}:AddedFireDamage`) return '화염 피해 추가(+)'
  if (text === `${keyName}:AddedPhysicalDamage`) return '물리 피해 추가(+)'
  if (text === `${keyName}:AddedMp`) return 'Mp 추가'
  if (text === `${keyName}:AddedHp`) return 'Hp 추가'
  if (text === `${keyName}:AddedTurn`) return '추가 공격'
  if (text === `${keyName}:AddedStr`) return '힘'
  if (text === `${keyName}:AddedDex`) return '민첩'
  if (text === `${keyName}:AddedLuk`) return '행운'
  if (text === `${keyName}:HalfDamageAndMultiplyTurn`) return '절반 활성화'
  if (text === `${keyName}:AddedPierce`) return '추가 관통'
  if (text === `${keyName}:AddedPierce`) return '추가 관통'
  if (text === `${keyName}:Transcendence`) return '초월'
  if (text === `${keyName}:LesserMultipleProjectiles`) return '하위 다중 투사체'
  if (text === `${keyName}:IncreasedDamageOnMeleeSkill`)
    return '근접 공격 스킬 피해 증가'
  if (text === `${keyName}:IncreasedAreaOfEffect`)
    return '스킬의 효과 범위 증가'

  return text
}
