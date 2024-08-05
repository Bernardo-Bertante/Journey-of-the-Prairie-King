import Phaser from "phaser";
import Tree from "../game_objects/trees";
import Guns from "../game_objects/guns";
import Player from "../game_objects/player";
import EnemyGenerator from "../game_objects/enemies_generator";

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game" });
    this.player = null;
    this.enemyGroup = null;

    this.enemies = null;
    this.kills = 0;
    this.killsText = null;
    this.gunsGroup = null;

    this.timeElapsed = 0;
    this.timerEvent = null;
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

    // this.lights.enable();
    // this.lights.setAmbientColor(0x555555);

    this.createMap();
    this.createTreeAnimations();
    this.createTrees();

    this.addKills();
    this.addPlayer();
    this.addEnemies();
    this.addGuns();
    this.addShots();
    // this.loadAudios();
    this.addColliders();

    if (this.number < 3) {
      this.timerEvent = this.time.addEvent({
        delay: 28000,
        callback: this.endScene,
        callbackScope: this,
      });
    }
  }

  createMap() {
    if (this.number === undefined) {
      console.error("Level number is undefined");
      return;
    }
    // Associates the tilemap with the tileset
    this.map = this.make.tilemap({ key: "map" + this.number });
    const tileset = this.map.addTilesetImage("assets", "tiles");

    // Create the main layers of the game
    this.groundLayer = this.map.createStaticLayer("groundLayer", tileset, 0, 0);

    this.treeAnimLayer = this.map.createStaticLayer(
      "treeAnimLayer",
      tileset,
      0,
      0
    );

    this.objectColliderLayer = this.map.createStaticLayer(
      "objectColliderLayer",
      tileset,
      0,
      0
    );

    this.objectColliderLayer.setCollisionByProperty({ "collider": true });

    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;

    // Get the dimensions of the map
    const mapWidth = this.map.widthInPixels;
    const mapHeight = this.map.heightInPixels;

    // Apply the scale factor
    const scaleFactor = 2;
    const scaledMapWidth = mapWidth * scaleFactor;
    const scaledMapHeight = mapHeight * scaleFactor;

    // Calculates the central coordinates adjusted
    const centerX = (gameWidth - scaledMapWidth) / 2;
    const centerY = (gameHeight - scaledMapHeight) / 2;

    this.groundLayer.setScale(scaleFactor);
    this.objectColliderLayer.setScale(scaleFactor);
    this.treeAnimLayer.setScale(scaleFactor);

    this.groundLayer.setPosition(centerX, centerY);
    this.objectColliderLayer.setPosition(centerX, centerY);
    this.treeAnimLayer.setPosition(centerX, centerY);

    const debugGraphics = this.add.graphics().setAlpha(0.75);
    this.objectColliderLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    });
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

  spawnGun(enemy) {
    const { x, y } = enemy;
    this.revolver = new Guns(this, x, y);
    this.gunsGroup.add(this.revolver);
  }

  addKills() {
    this.kills = {
      player: {},
    };

    this.kills["player"]["killsText"] = this.add
      .bitmapText(
        80,
        30,
        "stardewValley",
        String(this.registry.get("kills_player")).padStart(6, "0"),
        40
      )
      .setOrigin(0.5)
      .setScrollFactor(0);
  }

  addPlayer() {
    this.players = this.add.group();
    this.player = new Player(this, this.center_width, this.center_height);
    this.players.add(this.player);

    // Inicialize o registro de kills para o jogador
    const playerName = this.player.name;
    if (!this.registry.has("kills_" + playerName)) {
      this.registry.set("kills_" + playerName, 0);
    }

    // Atualize a exibição inicial dos kills
    this.updateKills(playerName, 0);
  }

  addShots() {
    //this.shotsLayer = this.add.layer();
    this.shots = this.add.group();
  }

  addEnemies() {
    this.enemyGroup = this.add.group();
    this.enemyShots = this.add.group();
    this.enemies = new EnemyGenerator(this, this.player);
  }

  addGuns() {
    this.available = ["backToHell", "hollyOne"];
    this.gunsGroup = this.add.group();
  }

  addColliders() {
    this.physics.add.collider(this.players, this.objectColliderLayer);

    // this.physics.add.overlap(
    //   this.players,
    //   this.objectColliderLayer,
    //   (player, tile) => {
    //     console.log("Overlap detected!", tile);
    //   },
    //   null,
    //   this
    // );

    this.physics.add.collider(
      this.players,
      this.enemyGroup,
      this.crashEnemy,
      () => {
        return true;
      },
      this
    );

    this.physics.add.overlap(
      this.shots,
      this.enemyGroup,
      this.destroyEnemy,
      () => {
        return true;
      },
      this
    );

    this.physics.add.overlap(
      this.players,
      this.enemyShots,
      this.hitPlayer,
      () => {
        return true;
      },
      this
    );

    this.physics.add.collider(
      this.players,
      this.gunsGroup,
      this.pickGun,
      () => {
        return true;
      },
      this
    );
    this.physics.world.on("worldbounds", this.onWorldBounds);
  }

  onWorldBounds(body, t) {
    const name = body.gameObject.name.toString();
    if (["enemyShot", "shot"].includes(name)) {
      body.gameObject.destroy();
    }
  }

  hitPlayer(player, shot) {
    if (player.blinking) return;

    this.players.remove(this.player);
    player.dead();
    //this.playAudio("explosion");
    shot.destroy();
    this.time.delayedCall(1000, () => this.respawnPlayer(), null, this);
  }

  destroyEnemy(shot, enemy) {
    enemy.lives--;
    this.tweens.add({
      targets: enemy,
      duration: 400,
      tint: { from: 0x000000, to: 0xffffff },
    });

    this.updateKills(shot.playerName, 0);
    this.tweens.add({ targets: enemy, y: "-=1", yoyo: true, duration: 100 });

    shot.destroy();
    if (enemy.lives === 0) {
      this.updateKills(shot.playerName, enemy.points);
      enemy.dead();
    }

    this.random = Phaser.Math.Between(1, 30);
    if (this.random > 29 && enemy.name !== "draco") {
      this.spawnGun(enemy);
    }
  }

  crashEnemy(player, enemy) {
    if (player.blinking || enemy.name === "draco") return;
    player.dead();
    //this.playAudio("explosion");
    enemy.dead();
    this.time.delayedCall(1000, () => this.respawnPlayer(), null, this);
  }

  pickGun(player, gun) {
    //this.playAudio("stageclear1");
    this.updateGuns(player, gun);
    this.tweens.add({
      targets: player,
      duration: 200,
      alpha: { from: 0.5, to: 1 },
      scale: { from: 2.4, to: 2 },
      repeat: 3,
    });
    gun.destroy();
  }

  respawnPlayer() {
    this.player = new Player(this, this.center_width, this.center_height);
    this.player.blinking = true;
    this.players.add(this.player);
    this.tweens.add({
      targets: this.player,
      duration: 100,
      alpha: { from: 0, to: 1 },
      repeat: 10,
      onComplete: () => {
        this.player.blinking = false;
        if (this.number < 3) {
          this.enemies.resetEnemyGeneration(this.player);
        }
      },
    });
  }

  loadAudios() {
    this.audios = {
      shot: this.sound.add("shot"),
      foeshot: this.sound.add("foeshot"),
      explosion: this.sound.add("explosion"),
      foexplosion: this.sound.add("foexplosion"),
      foedestroy: this.sound.add("foedestroy"),
      stageclear1: this.sound.add("stageclear1"),
      stageclear2: this.sound.add("stageclear2"),
      boss: this.sound.add("boss"),
    };
  }

  // playAudio(key) {
  //   this.audio[key].play();
  // }

  update(time, delta) {
    if (this.player) this.player.update();
    if (this.enemies) this.enemies.update();
    this.timeElapsed += delta;
  }

  endScene() {
    this.time.delayedCall(
      1000,
      () => {
        this.finishScene();
      },
      null,
      this
    );
  }

  finishScene() {
    this.game.sound.stopAll();
    this.scene.stop("game");
    const scene = this.number === 3 ? "outro" : "transition";
    this.scene.start(scene, {
      next: "game",
      name: "STAGE",
      number: this.number + 1,
    });
  }

  updateGuns(player, gun) {
    player.gun = this.available[this.currentGun];
    this.currentGun =
      this.currentGun + 1 === this.available.length
        ? this.currentGun
        : this.currentGun + 1;
    this.registry.set("currentGun", this.currentGun);
  }

  updateKills(playerName, kills = 0) {
    if (!this.registry.has("kills_" + playerName)) {
      this.registry.set("kills_" + playerName, 0);
    }

    const score = +this.registry.get("kills_" + playerName) + kills;

    this.registry.set("kills_" + playerName, score);

    if (this.kills[playerName] && this.kills[playerName]["killsText"]) {
      this.kills[playerName]["killsText"].setText(
        String(score).padStart(6, "0")
      );

      this.tweens.add({
        targets: this.kills[playerName]["killsText"],
        duration: 200,
        tint: { from: 0x0000ff, to: 0xffffff },
        scale: { from: 1.2, to: 1 },
        repeat: 2,
      });
    } else {
      console.warn(`Kills text for player ${playerName} not found.`);
    }
  }
}
