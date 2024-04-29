let _audioManager: AudioManager
export interface AudioOfList {
  audio: HTMLAudioElement
  title: string
  play: () => void
  pause: () => void
}
export class AudioManager {
  current: AudioOfList | undefined

  subscribes: any[] = []

  list:
    | {
        [key: string]: AudioOfList
      }
    | any

  constructor(handler: (value: AudioOfList) => void) {
    // eslint-disable-next-line no-constructor-return
    if (_audioManager) return _audioManager
    this.subscribe(handler)
    this.loadResources()
    this.setCurrent(Object.values(this.list)[0] as AudioOfList)
  }

  private loadResources() {
    this.list = {
      shop: this.createAudio('/audio/bgm_store.flac'),
      inn: this.createAudio('/audio/bgm_inn.flac'),
    }
  }

  setCurrent(item: AudioOfList) {
    this.current = item
    this.subscribes.forEach((handler) => {
      handler(this.current)
    })
  }

  private createAudio(url: string, title?: string) {
    const instance: any = {
      title: title || url,
      audio: new Audio(url),
      pause() {
        this.audio.pause()
      },
    }
    instance.play = () => {
      instance.audio.play()
      this.current = instance
      this.subscribes.forEach((handler) => {
        handler(this.current)
      })
    }
    return instance
  }

  subscribe(eventHandler: (value: AudioOfList) => void) {
    this.subscribes.push(eventHandler)
  }

  pauseAll() {
    Object.values(this.list).forEach((data: any) => {
      data?.audio?.pause()
    })

    this.subscribes.forEach((handler) => {
      handler(this.current)
    })
  }
}
