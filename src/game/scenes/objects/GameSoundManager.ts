// eslint-disable-next-line import/no-cycle
import { FightScene } from '@/game/scenes/interfaces/scene.interface'
import { SoundKey } from '@/game/scenes/enums/enum'

export class GameSoundManager {
  scene!: FightScene

  volume = 0.1

  sounds: {
    [key: SoundKey | string]:
      | Phaser.Sound.NoAudioSound
      | Phaser.Sound.HTML5AudioSound
      | Phaser.Sound.WebAudioSound
  } = {}

  constructor(scene: FightScene) {
    this.scene = scene
    this.init()
  }

  init() {
    this.sounds[SoundKey.WeaponDrop] = this.scene.sound.add(SoundKey.WeaponDrop)
    this.sounds[SoundKey.EtcDrop] = this.scene.sound.add(SoundKey.EtcDrop)
  }

  play(key: SoundKey) {
    this.sounds[key].volume = this.volume
    this.sounds[key].play()
  }
}
