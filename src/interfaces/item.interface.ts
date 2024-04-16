export interface BaseWeapon {
  createdAt: string // '2024-03-29T08:39:14.060Z'
  criticalMultiplier: number[] // [0, 0]
  criticalRate: number[] // [0, 0]
  damageOfCold: number[] // [0, 0]
  damageOfFire: number[] // [0, 0]
  damageOfLightning: number[] // [0, 0]
  damageOfPhysical: number[] // [1, 5]
  iType: string // 'weapon'
  gold: number
  name: string // '목도'
  requiredEquipmentLevel: string // 1
  thumbnail: string // 'public/upload/items/08521e812a40a8af.png'
  updatedAt: string // '2024-03-29T08:39:14.060Z'
  _id: string // '66067e322cfd9150c0fd3ba8'
}

export interface BaseWeaponListResponseDto {
  page: number // 1
  total: number // 1
  totalPages: number // 1
  weapons: BaseWeapon[]
}

export interface BaseWeaponResponseDto {
  weapon: BaseWeapon
}

export interface WeaponListResponseDto {
  page: number // 1
  total: number // 1
  totalPages: number // 1
  // weapons: Weapon[]
}
