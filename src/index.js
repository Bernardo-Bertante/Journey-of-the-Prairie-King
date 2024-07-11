import Phaser from "phaser";
import mapJSON from "./assets/tilemap/map.json";
import LoadScreen from "./scenes/LoadScreen";
import Game from "./scenes/game";

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 1000,
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
    backgroundColor: '#000000',
    scene: [LoadScreen, Game]
};

const game = new Phaser.Game(config);

