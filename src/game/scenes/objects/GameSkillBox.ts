// eslint-disable-next-line import/no-cycle
import { FightScene } from '@/game/scenes/interfaces/scene.interface'

export class GameSkillBox {
  scene!: FightScene

  cooldownBox!: Phaser.GameObjects.Graphics

  cooldownElapsed!: number

  skillCooldown!: number

  x!: number

  y!: number

  size!: number

  constructor(scene: FightScene) {
    this.scene = scene
    this.init()
  }

  init() {
    this.cooldownBox = this.scene.add.graphics()

    // 스킬 쿨타임 박스 위치와 크기 설정
    this.size = 50
    this.x = 0
    this.y = this.scene.sys.game.canvas.height - this.size

    // 네모박스 스타일 설정
    this.cooldownBox.lineStyle(2, 0xffffff) // 테두리 스타일
    this.cooldownBox.fillStyle(0x000000, 0.5) // 배경 색상과 투명도
    this.cooldownBox.fillRect(this.x, this.y, this.size, this.size)

    // 텍스트 추가 (옵셔널)
    // cooldownText = this.add
    //   .text(x + size / 2, y + size / 2, '', {
    //     fontSize: '20px',
    //     color: '#ffffff',
    //   })
    //   .setOrigin(0.5)

    // 초기 쿨타임 설정
    this.skillCooldown = 1000 / this.scene.resultOfMe.stat.attackSpeed

    this.cooldownElapsed = this.skillCooldown
  }

  update(time: number, delta: number) {
    this.cooldownElapsed += delta

    // 쿨타임 텍스트 업데이트 (옵셔널)
    const remainingTime = Math.max(0, this.skillCooldown - this.cooldownElapsed)
    const cooldownPercentage = (remainingTime / this.skillCooldown) * 100
    // cooldownText.setText(`${remainingTime.toFixed(1)} ms`)

    // 네모박스 채우기 업데이트
    this.cooldownBox.clear()
    this.cooldownBox.lineStyle(2, 0xffffff) // 테두리 스타일 유지
    this.cooldownBox.fillStyle(0x000000, 0.5) // 배경 색상과 투명도 유지
    this.cooldownBox.fillRect(this.x, this.y, this.size, this.size) // 네모박스 재생성

    // 시계방향으로 채우기
    const progress = 360 * (1 - cooldownPercentage / 100)
    const startAngle = Phaser.Math.DegToRad(-90) // 12시 방향이 시작점 (-90도는 12시 방향)
    const endAngle = Phaser.Math.DegToRad(-90 + progress) // 채워진 각도 계산
    this.cooldownBox.beginPath()
    this.cooldownBox.moveTo(this.x + this.size / 2, this.y + this.size / 2) // 중심으로 이동
    this.cooldownBox.arc(
      this.x + this.size / 2,
      this.y + this.size / 2,
      this.size / 2,
      startAngle,
      endAngle,
      true,
    )
    this.cooldownBox.closePath()
    this.cooldownBox.fillPath()

    if (this.cooldownElapsed >= this.skillCooldown) {
      this.cooldownElapsed = 0
      this.scene.player.onReadyAttack = true
    }
  }
}
