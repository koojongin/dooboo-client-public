export enum EnhanceOption {
  AddStr = 'AddStr',
  AddDex = 'AddDex',
  AddLuk = 'AddLuk',
  AddArmor = 'AddArmor',
  AddHp = 'AddHp',
  AddMp = 'AddMp',
}

// export interface EnhanceOption {
//   a: number
// }
export interface IEnhanceOption {
  name: EnhanceOption
  value: {
    [key in 'ten' | 'sixty' | 'hundred' | string]: number
  }
}

export interface DefenceGearEnhanceDataResponse {
  list: IEnhanceOption[]
}
