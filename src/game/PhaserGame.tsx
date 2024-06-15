import {
  SetStateAction,
  Dispatch,
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react'
import StartGame from './main'
import { EventBus } from './EventBus'
import { FightScene } from '@/game/scenes/interfaces/scene.interface'

export interface IRefPhaserGame {
  game: Phaser.Game | null
  scene: FightScene | Phaser.Scene | null
}

interface IProps {
  currentActiveScene?: (scene_instance: Phaser.Scene) => void
  setScene: Dispatch<SetStateAction<FightScene | Phaser.Scene | undefined>>
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(
  function PhaserGame({ currentActiveScene, setScene }, ref) {
    const game = useRef<Phaser.Game | null>(null!)

    useLayoutEffect(() => {
      if (game.current === null) {
        game.current = StartGame('game-container')

        if (typeof ref === 'function') {
          ref({ game: game.current, scene: null })
        } else if (ref) {
          // eslint-disable-next-line no-param-reassign
          ref.current = { game: game.current, scene: null }
        }
      }

      return () => {
        if (game.current) {
          game.current.destroy(true)
          if (game.current !== null) {
            game.current = null
          }
        }
      }
    }, [ref])

    useEffect(() => {
      EventBus.on('current-scene-ready', (scene_instance: Phaser.Scene) => {
        if (currentActiveScene && typeof currentActiveScene === 'function') {
          setScene(scene_instance)
          currentActiveScene(scene_instance)
        }

        if (typeof ref === 'function') {
          ref({ game: game.current, scene: scene_instance })
        } else if (ref) {
          // eslint-disable-next-line no-param-reassign
          ref.current = { game: game.current, scene: scene_instance }
        }
      })
      return () => {
        EventBus.removeListener('current-scene-ready')
      }
    }, [currentActiveScene, ref])

    return <div id="game-container" />
  },
)
