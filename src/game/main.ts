import { AUTO, Game } from 'phaser'
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin'
import { Boot } from './scenes/Boot'
import { GameOver } from './scenes/GameOver'
import { Game as MainGame } from './scenes/Game'
import { MainMenu } from './scenes/MainMenu'
import { Preloader } from './scenes/Preloader'
//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  width: 1080,
  height: 800,
  parent: 'game-container',
  backgroundColor: '#028af8',
  pixelArt: true,
  scene: [Boot, Preloader, MainMenu, MainGame, GameOver],
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
