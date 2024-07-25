import Phaser from "phaser";
import LoadScreen from "./scenes/LoadScreen";
import Game from "./scenes/game";

const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 640,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  autoRound: false,
  parent: "contenedor",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  backgroundColor: "#000000",
  scene: [LoadScreen, Game],
  // plugins: {
  //   scene: [
  //     {
  //       key: "LightPlugin",
  //       plugin: Phaser.Plugins.LightPlugin,
  //       mapping: "lights",
  //     },
  //   ],
  // },
};

const game = new Phaser.Game(config);
