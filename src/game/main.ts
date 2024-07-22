import { Game } from 'phaser'
// eslint-disable-next-line import/extensions
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js'
import { Boot } from './scenes/Boot'
import { GameOver } from './scenes/GameOver'
import { Game as MainGame } from './scenes/Game'
import { MainMenu } from './scenes/MainMenu'
import { Preloader } from './scenes/Preloader'
import { GameConfig } from '@/game/scenes/enums/enum'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  width: GameConfig.Width,
  height: GameConfig.Height,
  parent: 'game-container',
  backgroundColor: '#028af8',
  pixelArt: true,
  scene: [Boot, Preloader, MainMenu, MainGame, GameOver],
  fps: {
    target: 60, // Target frame rate
    forceSetTimeOut: true, // Force use of setTimeout to maintain FPS in background
  },
  physics: {
    default: 'arcade', // 'matter',
    arcade: {
      // debug: true,
      gravity: {
        x: 0,
        // y: 9.8,
        y: 0,
      },
    },
  },
  plugins: {
    global: [
      {
        key: 'rexVirtualJoystick',
        plugin: VirtualJoystickPlugin,
        start: true,
      },
      // ...
    ],
  },
  /* plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin, // The plugin class
        key: 'matterCollision', // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
        mapping: 'matterCollision', // Where to store in the Scene, e.g. scene.matterCollision

        // Note! If you are including the library via the CDN script tag, the plugin
        // line should be:
        // plugin: PhaserMatterCollisionPlugin.default
      },
    ],
  }, */
}

const StartGame = (parent: string) => {
  return new Game({ ...config, parent })
}

export default StartGame
