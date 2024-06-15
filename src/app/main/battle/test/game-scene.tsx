'use client'

import { useRef, useState } from 'react'
import { IRefPhaserGame, PhaserGame } from '@/game/PhaserGame'
import { MainMenu } from '@/game/scenes/MainMenu'
import { FightScene } from '@/game/scenes/interfaces/scene.interface'
import { formatNumber } from '@/services/util'

export default function GameSceneComponent() {
  // The sprite can only be moved in the MainMenu Scene
  const [canMoveSprite, setCanMoveSprite] = useState(true)
  const [scene, setScene] = useState<Phaser.Scene | FightScene>()

  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef<IRefPhaserGame | null>(null)
  const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 })

  const changeScene = () => {
    if (phaserRef.current) {
      const currentScene = phaserRef.current.scene as MainMenu

      if (currentScene) {
        currentScene.changeScene()
      }
    }
  }

  const currentScene = (_scene: Phaser.Scene) => {
    setCanMoveSprite(_scene?.scene?.key !== 'MainMenu')
  }

  return (
    <div className="flex">
      <PhaserGame
        ref={phaserRef}
        currentActiveScene={currentScene}
        setScene={setScene}
      />
      <div>
        {/* <button className="button" onClick={changeScene}>
            Change Scene
          </button> */}
        <div>임의 테스트 세팅중...</div>
        <div>기존의 턴은 무기가 최대로 발사 될 수 있는 양</div>
        {scene?.scene.key === 'Game' && (
          <div>
            <div>
              {(() => {
                const { statusBox, player, resultOfMe } = scene as FightScene
                return (
                  <div>
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        resultOfMe.stat.turn *= 2
                        setScene(undefined)
                        setTimeout(() => {
                          setScene(scene)
                        }, 1)
                      }}
                    >
                      턴 늘려 / {resultOfMe.stat.turn}
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        player.isSpread = !player.isSpread
                        setScene(undefined)
                        setTimeout(() => {
                          setScene(scene)
                        }, 1)
                      }}
                    >
                      방사형 {player.isSpread ? 'o' : 'x'}
                    </div>

                    {statusBox.skillBoxes[0] && (
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          const aps = [2000, 1500, 1000, 500, 250]
                          const currentSpeedIndex = aps.findIndex(
                            (speed) =>
                              speed === statusBox.skillBoxes[0].skillCooldown,
                          )
                          statusBox.skillBoxes[0].skillCooldown =
                            aps[currentSpeedIndex + 1] || aps[0]
                          setScene(undefined)
                          setTimeout(() => {
                            setScene(scene)
                          }, 1)
                        }}
                      >
                        공속 테스트 - 초당
                        {formatNumber(
                          1000 / statusBox.skillBoxes[0].skillCooldown,
                        )}
                        회
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
