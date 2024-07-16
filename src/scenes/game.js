import Phaser from "phaser";
import Tree from "../game_objects/trees";

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game" });
    // this.player = null;
    // this.kills = 0;
    // this.killsText = null;
  }

  init(data) {
    this.name = data.name; // level name
    this.number = data.number; // level number
    this.next = data.next; // next level
    this.currentGun = +this.registry.get("currentGun"); // gun using
    this.life = data.life; // total lifes left
  }

  preload() {}

  create() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;
    this.cameras.main.setBackgroundColor(0x000000);

    this.createMap();
    this.createTreeAnimations();
    this.createTrees();

    // this.addKills();
    // this.addEnemies();
    // this.addPlayer();
    // this.addNewGun();
    // this.addShots();
    // this.loadAudios();
    // this.addColliders();
  }

  createMap() {
    // Associa o tilemap com o tileset
    this.map = this.make.tilemap({ key: "map" });
    const tileset = this.map.addTilesetImage("assets", "tiles");

    // Cria os dois principais Layers do jogo
    this.groundLayer = this.map.createStaticLayer("groundLayer", tileset, 0, 0);
    this.objectColliderLayer = this.map.createStaticLayer(
      "objectColliderLayer",
      tileset,
      0,
      0
    );
    this.treeAnimLayer = this.map.createStaticLayer(
      "treeAnimLayer",
      tileset,
      0,
      0
    );

    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;

    // Obter as dimensões originais do mapa
    const mapWidth = this.map.widthInPixels;
    const mapHeight = this.map.heightInPixels;

    // Aplicar o fator de escala
    const scaleFactor = 2;
    const scaledMapWidth = mapWidth * scaleFactor;
    const scaledMapHeight = mapHeight * scaleFactor;

    // Calcular as coordenadas centrais ajustadas
    const centerX = (gameWidth - scaledMapWidth) / 2;
    const centerY = (gameHeight - scaledMapHeight) / 2;

    // Definir o fator de escala
    this.groundLayer.setScale(scaleFactor);
    this.objectColliderLayer.setScale(scaleFactor);
    this.treeAnimLayer.setScale(scaleFactor);

    this.groundLayer.setPosition(centerX, centerY);
    this.objectColliderLayer.setPosition(centerX, centerY);
    this.treeAnimLayer.setPosition(centerX, centerY);
  }

  createTreeAnimations() {
    this.anims.create({
      key: "treeSwing",
      frames: this.anims.generateFrameNumbers("tree", { start: 0, end: 1 }),
      frameRate: 1,
      repeat: -1,
    });
  }

  createTrees() {
    this.treeAnimLayer.forEachTile((tile) => {
      if (tile.index !== -1) {
        // Verifica se o tile não está vazio
        const x = tile.getCenterX();
        const y = tile.getCenterY();
        new Tree(this, x, y); // Instancia a árvore animada
      }
    });
  }
}
