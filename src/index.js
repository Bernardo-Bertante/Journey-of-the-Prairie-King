import Phaser from "phaser";
import LoadScreen from "./scenes/loadScreen";
import Game from "./scenes/game";
import Transition from "./scenes/transition";
import Splash from "./scenes/splash";
import Outro from "./scenes/outro";

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
  scene: [LoadScreen, Splash, Transition, Game, Outro],
};

const game = new Phaser.Game(config);
