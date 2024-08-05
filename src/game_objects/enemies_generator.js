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
      this.startEnemyGeneration();
    }
  }

  startEnemyGeneration() {
    this.generateEvent1 = this.scene.time.addEvent({
      delay: 6000,
      callback: () => this.generateEnemiesFromCardinals(),
      callbackScope: this,
      loop: true,
    });
  }

  resetEnemyGeneration(player) {
    this.player = player;
    this.generatingEnemies = true;
    this.startEnemyGeneration();
  }

  stopEnemyGeneration() {
    if (this.generateEvent1) {
      this.generateEvent1.remove(false);
    }
    if (this.generateEvent2) {
      this.generateEvent2.remove(false);
    }
    this.generatingEnemies = false;
  }

  generateEnemiesFromCardinals() {
    const corners = [
      { x: this.scene.width, y: this.scene.height / 2 },
      { x: this.scene.width / 2, y: 0 },
      { x: 0, y: this.scene.height / 2 },
      { x: this.scene.width / 2, y: this.scene.height },
    ];

    corners.forEach((corner) => {
      const enemy = new Enemy(this.scene, corner.x, corner.y, "zombie");
      this.scene.enemyGroup.add(enemy);
    });
  }

  dracoAppears() {
    const draco = new Enemy(
      this.scene,
      this.scene.center_width,
      500,
      "draco",
      0,
      0
    );

    this.scene.enemyGroup.add(draco);

    const { x, y } = draco;
    this.dracoDialogue(x, y);

    this.scene.time.delayedCall(
      5000,
      () => {
        this.dessapear(draco);
      },
      null,
      this
    );

    this.scene.time.delayedCall(
      6000,
      () => {
        const newDraco = new Enemy(this.scene, 150, 500, "draco", 0, 0);
        this.scene.enemyGroup.add(newDraco);
        newDraco.startPatternMovement();
      },
      null,
      this
    );
  }

  dessapear(existingDraco) {
    existingDraco.destroy();
    const explosion = this.scene.add
      .circle(existingDraco.x, existingDraco.y, 5)
      .setStrokeStyle(20, 0xffffff);
    this.scene.tweens.add({
      targets: explosion,
      alpha: { from: 1, to: 0.3 },
      duration: 250,
      onComplete: () => {
        explosion.destroy();
      },
    });
  }

  dracoDialogue(x, y) {
    this.bossDialogue = this.scene.add.image(x, y, "bossDialogue");

    this.scene.tweens.add({
      targets: this.bossDialogue,
      y: y - 40,
      alpha: { from: 0, to: 1 },
      duration: 5000,
      ease: "Power1",
      onComplete: () => {
        this.bossDialogue.destroy();
      },
    });
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

  update() {
    this.scene.enemyGroup.children.entries.forEach((enemy) => {
      if (
        enemy === null ||
        !enemy.active ||
        enemy.y > this.scene.height + 100
      ) {
        enemy.destroy();
      } else {
        if (enemy.name === "draco") {
          enemy.update();
        } else {
          this.followPlayer(enemy);
          enemy.update();
        }
      }
    });
  }

  followPlayer(enemy) {
    if (this.player.death && this.scene.number < 3) {
      this.scene.enemyGroup.children.entries.forEach((enemy) => {
        if (enemy === null || !enemy.active) return;
        enemy.destroy();
      });
    } else {
      this.scene.physics.moveToObject(enemy, this.player, 60);
    }
  }
}
