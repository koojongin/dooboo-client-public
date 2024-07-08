export const itemTranslate = (text: string) => {
  if (text === 'INCREASED_DAMAGE_OF_PROJECTILE_WITH_SKILL')
    return '투사체 스킬 피해 증가(%)'
  if (text === 'INCREASED_DAMAGE_OF_MELEE_WITH_SKILL')
    return '근접 스킬 피해 증가(%)'
  if (text === 'INCREASED_DAMAGE_OF_FIRE_WITH_SKILL')
    return '화염 스킬 피해 증가(%)'
  if (text === 'INCREASED_DAMAGE_OF_COLD_WITH_SKILL')
    return '냉기 스킬 피해 증가(%)'
  if (text === 'INCREASED_DAMAGE_OF_LIGHTNING_WITH_SKILL')
    return '번개 스킬 피해 증가(%)'
  if (text === 'INCREASED_DAMAGE_OF_PHYSICAL_WITH_SKILL')
    return '물리 스킬 피해 증가(%)'
  if (text === 'INCREASED_ATTACK_SPEED') return '공격 속도 증가(%)'
  if (text === 'REGENERATE_MANA') return '초당 마나회복(+)'
  if (text === 'ADDED_MANA_ON_KILL') return '처치 시 MP 회복(+)'
  if (text === 'ADDED_LIFE_ON_KILL') return '처치 시 HP 회복(+)'
  if (text === 'ADDED_MANA') return 'MP 추가(+)'
  if (text === 'ADDED_HP') return 'HP 추가(+)'
  if (text === 'REDUCTION_MANA_COST') return '스킬의 MP 소모량 감소'
  if (text === 'REDUCTION_REQUIRED_EQUIPPED_LEVEL') return '착용 레벨 감소'
  if (text === 'INCREASED_DAMAGE') return '피해 증가(%)'
  if (text === 'INCREASED_DAMAGE_WITH_ROGUE') return '도적 피해 증가(%)'
  if (text === 'INCREASED_DAMAGE_WITH_WARRIOR') return '전사 피해 증가(%)'
  if (text === 'INCREASED_DAMAGE_WITH_BOWMAN') return '궁수 피해 증가(%)'
  if (text === 'INCREASED_PHYSICAL_DAMAGE') return '물리 피해 증가(%)'
  if (text === 'INCREASED_COLD_DAMAGE') return '냉기 피해 증가(%)'
  if (text === 'INCREASED_FIRE_DAMAGE') return '화염 피해 증가(%)'
  if (text === 'INCREASED_LIGHTNING_DAMAGE') return '번개 피해 증가(%)'

  if (text === 'ADDED_STR') return '힘 추가(+)'
  if (text === 'ADDED_DEX') return '민첩 추가(+)'
  if (text === 'ADDED_LUK') return '행운 추가(+)'

  if (text === 'ADDED_PHYSICAL_DAMAGE') return '물리 피해 추가(+)'
  if (text === 'ADDED_COLD_DAMAGE') return '냉기 피해 추가(+)'
  if (text === 'ADDED_FIRE_DAMAGE') return '화염 피해 추가(+)'
  if (text === 'ADDED_LIGHTNING_DAMAGE') return '번개 피해 추가(+)'
  if (text === 'ADDED_DAMAGE_WITH_AXE') return '도끼 피해 추가(+)'
  if (text === 'ADDED_DAMAGE_WITH_SWORD') return '검 피해 추가(+)'
  if (text === 'ADDED_DAMAGE_WITH_DAGGER') return '단검 피해 추가(+)'
  if (text === 'ADDED_DAMAGE_WITH_BOW') return '활 피해 추가(+)'
  if (text === 'ADDED_DAMAGE_WITH_BLUNT') return '둔기 피해 추가(+)'
  if (text === 'ADDED_DAMAGE_WITH_SPEAR') return '창 피해 추가(+)'
  if (text === 'ADDED_DAMAGE_WITH_GUN') return '권총 피해 추가(+)'
  if (text === 'ADDED_DAMAGE_WITH_CANNON') return '대포 피해 추가(+)'
  if (text === 'ADDED_DAMAGE_WITH_CLAW') return '아대 피해 추가(+)'
  if (text === 'INCREASED_DAMAGE_WITH_AXE') return '도끼 피해 증가(%)'
  if (text === 'INCREASED_DAMAGE_WITH_SWORD') return '검 피해 증가(%)'
  if (text === 'INCREASED_DAMAGE_WITH_DAGGER') return '단검 피해 증가(%)'
  if (text === 'INCREASED_DAMAGE_WITH_BOW') return '활 피해 증가(%)'
  if (text === 'INCREASED_DAMAGE_WITH_BLUNT') return '둔기 피해 증가(%)'
  if (text === 'INCREASED_DAMAGE_WITH_SPEAR') return '창 피해 증가(%)'
  if (text === 'INCREASED_DAMAGE_WITH_GUN') return '권총 피해 증가(%)'
  if (text === 'INCREASED_DAMAGE_WITH_CANNON') return '대포 피해 증가(%)'
  if (text === 'INCREASED_DAMAGE_WITH_CLAW') return '아대 피해 증가(%)'
  if (text === 'INCREASED_DAMAGE_OF_ATTACK_WITH_SKILL')
    return '공격 스킬의 피해 증가(%)'
  if (text === 'INCREASED_DAMAGE_OF_SPELL_WITH_SKILL')
    return '마법 스킬의 피해 증가(%)'
  if (text === 'INCREASED_DURATION_WITH_SKILL')
    return '스킬의 지속시간 증가(ms)'

  if (text === 'INCREASED_STR') return '힘 증가(%)'
  if (text === 'INCREASED_DEX') return '민첩 증가(%)'
  if (text === 'INCREASED_LUK') return '행운 증가(%)'
  if (text === 'INCREASED_RESISTANCE_OF_PHYSICAL') return '물리 저항(+%)'
  if (text === 'INCREASED_RESISTANCE_OF_COLD') return '냉기 저항(+%)'
  if (text === 'INCREASED_RESISTANCE_OF_FIRE') return '화염 저항(+%)'
  if (text === 'INCREASED_RESISTANCE_OF_LIGHTNING') return '번개 저항(+%)'
  if (text === 'INCREASED_RESISTANCE_OF_ALL') return '모든 저항(+%)'
  if (text === 'ADDED_ARMOR') return '방어력 추가(+)'
  if (text === 'ADDED_MP') return 'MP 추가(+)'
  if (text === 'INCREASED_HP') return 'HP 증가(%)'
  if (text === 'INCREASED_MP') return 'MP 증가(%)'
  if (text === 'INCREASED_ARMOR') return '방어력 증가(%)'
  return text
}
