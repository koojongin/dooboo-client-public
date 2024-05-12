export interface BattlePreferenceRef {
  play: (soundType: DropSoundKind) => void
}

export enum DropSoundKind {
  Weapon = 'Weapon',
  Etc = 'Etc',
}
