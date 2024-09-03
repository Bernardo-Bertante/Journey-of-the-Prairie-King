class EnemyShot extends Phaser.GameObjects.Sprite {
  constructor(
    scene,
    x,
    y,
    name = "enemyShot",
    velocityX = 0,
    velocityY = -300
  ) {
    super(scene, x, y, name);
    this.name = "enemyShot";
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.setVelocityX(velocityX);
    this.body.setVelocityY(velocityY);
    this.body.setCircle(8);
    this.setScale(1.5);
    this.body.setOffset(-5, -5);
    this.body.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
    this.init();
  }

  init() {
    if (!this.scene.anims.exists("enemyBulletAnim")) {
      this.scene.anims.create({
        key: "enemyBulletAnim",
        frames: this.scene.anims.generateFrameNumbers("shot", {
          start: 2,
          end: 2,
        }),
        frameRate: 1,
        repeat: -1,
      });
    }
    this.anims.play("enemyBulletAnim", true);
  }

  shot() {
    const explosion = this.scene.add
      .circle(this.x, this.y, 5)
      .setStrokeStyle(10, 0xffffff);
    this.showPoints(50);
    this.scene.tweens.add({
      targets: explosion,
      radius: { from: 5, to: 20 },
      alpha: { from: 1, to: 0 },
      duration: 250,
      onComplete: () => {
        explosion.destroy();
      },
    });
    this.destroy();
  }

  showPoints(score, color = 0xff0000) {
    let text = this.scene.add
      .bitmapText(
        this.x + 20,
        this.y - 30,
        "stardewValley",
        "+" + score,
        40,
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

export default EnemyShot;
