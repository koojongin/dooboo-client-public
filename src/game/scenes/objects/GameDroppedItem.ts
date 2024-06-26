import { FightScene } from '@/game/scenes/interfaces/scene.interface'

export class GameDroppedItem extends Phaser.Physics.Arcade.Sprite {
  scene!: FightScene

  group!: Phaser.GameObjects.Group

  constructor(
    scene: FightScene,
    x: number,
    y: number,
    key: string,
    group: Phaser.GameObjects.Group,
  ) {
    super(scene, x, y, key)
    this.scene = scene
    this.group = group
    this.group.add(this, true)
    this.init()
  }

  init() {
    this.setDisplaySize(30, 30)
    this.scene.tweens.add({
      targets: this,
      y: '+=3', // Y 축 방향으로 20 픽셀 아래로 움직임
      ease: 'Sine.easeInOut', // 이징 함수 설정
      duration: 1000, // 애니메이션 지속 시간 (ms)
      yoyo: true, // 애니메이션 완료 후 역방향으로 다시 재생
      repeat: -1, // 무한 반복
    })
  }
}
