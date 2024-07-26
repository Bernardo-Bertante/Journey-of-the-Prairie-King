import Explosion from "./explosion";
import EnemyShot from "./enemy_shot";

const TYPES = {
  zombie: { points: 400, lives: 1 },
  draco: { points: 10000, lives: 20 },
};

class Enemy extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, name = "zombie", velocityX = 0, velocityY = 0) {
    super(scene, x, y, name);
    console.log(`Creating enemy: ${name} at (${x}, ${y})`);
    this.name = name;
    this.points = TYPES[name].points;
    this.lives = TYPES[name].lives;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.setCircle(8);
    this.setScale(2);
    this.body.setVelocityX(velocityX);
    this.body.setVelocityY(velocityY);
    this.setData("vector", new Phaser.Math.Vector2());
    if (this.name === "draco") {
      this.setDracoShot();
    }
    this.init();
  }

  setDracoShot() {
    this.patternIndex = 0;
    this.pattern = Phaser.Utils.Array.NumberArrayStep(-300, 300, 50);
    this.pattern = this.pattern.concat(
      Phaser.Utils.Array.NumberArrayStep(300, -300, -50)
    );
    this.scene.tweens.add({
      targets: this,
      duration: 2000,
      y: { from: this.y, to: this.y + Phaser.Math.Between(100, -100) },
      x: { from: this.x, to: this.x + Phaser.Math.Between(100, -100) },
      yoyo: true,
      repeat: -1,
    });
  }

  init() {
    this.scene.anims.create({
      key: this.name,
      frames: this.scene.anims.generateFrameNumbers(this.name),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.play(this.name, true);
    this.direction = -1;
  }

  update() {
    if (this.name === "draco" && Phaser.Math.Between(1, 6) > 5) {
      this.dracoShot();
    } else if (Phaser.Math.Between(1, 101) > 100) {
      if (!this.scene || !this.scene.player) return;
      //this.scene.playAudio("");
    }
  }

  dracoShot() {
    if (!this.scene || this.scene.player) return;

    //this.scene.playAudio("dracoShot");
    let shot = new EnemyShot(
      this.scene,
      this.x,
      this.y,
      "enemy",
      this.name,
      this.pattern[this.patternIndex],
      300
    );
    this.scene.enemyShots.add(shot);
    this.patternIndex =
      this.patternIndex + 1 === this.pattern.length ? 0 : ++this.patternIndex;
  }

  dead() {
    console.log(`Enemy ${this.name} is dead`);
    if (this.name === "draco") {
      this.scene.cameras.main.shake(500);
    }

    const explosion = this.scene.add
      .circle(this.x, this.y, 5)
      .setStrokeStyle(20, 0xffffff);
    this.showPoints(this.points);
    this.scene.tweens.add({
      targets: explosion,
      alpha: { from: 1, to: 0.3 },
      duration: 250,
      onComplete: () => {
        explosion.destroy();
      },
    });

    new Explosion(this.scene, this.x, this.y);
    if (this.name === "draco") {
      this.scene.number = 3; //?????
      this.scene.playAudio("explosion");
      this.scene.endScene();
    }
    this.setActive(false); // Marcando como inativo
    this.setVisible(false); // Tornando invisível
    this.destroy(); // Destruindo o objeto
  }

  showPoints(score, color = 0xff0000) {
    let text = this.scene.add
      .bitmapText(
        this.x + 20,
        this.y - 30,
        "stardewValley",
        "+" + score,
        15,
        color
      )
      .setOrigin(0.5);

    this.scene.tweens.add({
      targets: text,
      duration: 800,
      alpha: { from: 1, to: 0 },
      y: { from: this.y - 20, to: this.y - 80 },
      onComplete: () => {
        text.destroy();
      },
    });
  }
}

export default Enemy;
