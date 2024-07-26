import Enemy from "./enemy";

export default class EnemyGenerator {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    this.waveEnemies = [];
    this.generate();
    this.activeWave = false;
    this.waves = 0;
  }

  generate() {
    if (this.scene.number === 3) {
      this.scene.time.delayedCall(2000, () => this.dracoAppears(), null, this);
    } else {
      this.generateEvent1 = this.scene.time.addEvent({
        delay: 7000,
        callback: () => this.orderedWave(),
        callbackScope: this,
        loop: true,
      });
      this.generateEvent2 = this.scene.time.addEvent({
        delay: 15000,
        callback: () => this.wave(),
        callbackScope: this,
        loop: true,
      });
      // if (this.scene.number === 2) {
      //   this.generateEvent2 = this.scene.time.addEvent({
      //     delay: 5000,
      //     callback: () => this.wave(),
      //     callbackScope: this,
      //     loop: true,
      //   });
      // }
    }
  }

  dracoAppears() {
    const draco = new Enemy(
      this.scene,
      Phaser.Math.Between(200, 600),
      200,
      "draco",
      0,
      20
    );

    const { x, y } = draco;
    const bossDialogue = this.add.image(x, y, "bossDialogue");

    this.tweens.add({
      targets: bossDialogue,
      y: bossDialogue.y - 100,
      alpha: { start: 0, end: 1 },
      duration: 3000,
      ease: "Power1",
      onComplete: function () {
        bossDialogue.destroy();
      },
    });
    this.scene.enemyGroup.add(draco);
  }

  stop() {
    clearInterval(this.generationIntervalId);
    this.scene.enemyGroup.children.entries.forEach((enemy) => {
      if (enemy === null || !enemy.active) return;
      enemy.destroy();
    });
  }

  finishScene() {
    this.generateEvent1.destroy();
    if (this.scene.number > 1) this.generateEvent2.destroy();
    this.scene.endScene();
  }

  orderedWave(difficulty = 3) {
    const x = Phaser.Math.Between(64, this.scene.width - 200);
    const y = Phaser.Math.Between(-100, 0);
    const minus = Phaser.Math.Between(-1, 1) > 0 ? 1 : -1;

    Array(difficulty)
      .fill()
      .forEach((_, i) => this.addOrder(i, x, y, minus));
  }

  wave(difficulty = 3) {
    this.createPath();
    const x = Phaser.Math.Between(64, this.scene.width - 200);
    const y = Phaser.Math.Between(-100, 0);
    const minus = Phaser.Math.Between(-1, 1) > 0 ? 1 : -1;

    Array(difficulty)
      .fill()
      .forEach((_, i) => this.addToWave(i));
    this.activeWave = true;
  }

  add() {
    const enemy = new Enemy(
      this.scene,
      Phaser.Math.Between(32, this.scene.width - 32),
      0
    );
    this.scene.enemyGroup.add(enemy);
  }

  addOrder(i, x, y, minus) {
    const offset = minus * 70;

    this.scene.enemyGroup.add(
      new Enemy(this.scene, x + i * 70, i * y + offset, "zombie", 0, 100)
    );
  }

  addToWave(i) {
    const enemy = new Enemy(
      this.scene,
      Phaser.Math.Between(32, this.scene.width - 32),
      0,
      "zombie"
    );
    this.scene.tweens.add({
      targets: enemy,
      z: 1,
      ease: "Linear",
      duration: 12000,
      repeat: -1,
      delay: i * 2000,
    });
    this.scene.enemyWaveGroup.add(enemy);
  }

  createPath() {
    this.waves++;
    if (this.waves === 3) this.finishScene();

    // Seleciona aleatoriamente um dos quatro cantos para a origem dos inimigos
    const corners = [
      { x: 0, y: 0 },
      { x: this.scene.width, y: 0 },
      { x: 0, y: this.scene.height },
      { x: this.scene.width, y: this.scene.height },
    ];
    const startCorner = corners[Phaser.Math.Between(0, corners.length - 1)];
    this.path = new Phaser.Curves.Path(startCorner.x, startCorner.y);

    // Define um vetor de destino (inicialmente o centro da tela, você pode mudar isso)
    const target = new Phaser.Math.Vector2(
      this.scene.width / 2,
      this.scene.height / 2
    );
    this.path.lineTo(target.x, target.y);

    this.graphics = this.scene.add.graphics();
    this.graphics.lineStyle(0, 0xffffff, 0);
  }

  update() {
    console.log("Updating EnemyGenerator");

    if (this.path) {
      this.path.draw(this.graphics);

      this.scene.enemyWaveGroup.children.entries.forEach((enemy) => {
        if (enemy === null || !enemy.active) return;
        let t = enemy.z;
        let vec = enemy.getData("vector");
        this.path.getPoint(t, vec);
        enemy.setPosition(vec.x, vec.y);
        enemy.setDepth(enemy.y);
      });

      if (this.activeWave && this.checkIfWaveDestroyed()) {
        console.log("Wave destroyed");
        this.activeWave = false;
        this.scene.spawnGun();
        this.path.destroy();
      }
    }

    this.scene.enemyGroup.children.entries.forEach((enemy) => {
      if (
        enemy === null ||
        !enemy.active ||
        enemy.y > this.scene.height + 100
      ) {
        console.log(`Destroying enemy at (${enemy.x}, ${enemy.y})`);
        enemy.destroy();
      }
      enemy.update();
    });
  }

  checkIfWaveDestroyed() {
    const enemies = this.scene.enemyWaveGroup.getChildren();
    const activeEnemies = enemies.filter((enemy) => enemy.active);

    console.log(`Total enemies: ${enemies.length}`);
    console.log(`Active enemies: ${activeEnemies.length}`);

    enemies.forEach((enemy, index) => {
      console.log(
        `Enemy ${index}: active=${enemy.active}, x=${enemy.x}, y=${enemy.y}`
      );
    });

    return activeEnemies.length === 0;
  }
}
