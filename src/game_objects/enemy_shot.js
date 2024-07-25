class EnemyShot extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, playerName, velocityX = 0, velocityY = -300) {
    super(scene, x, y);
    this.name = "enemyShot";
    this.playerName = playerName;
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
    this.scene.anims.create({
      key: "bulletAnim",
      frames: this.scene.anims.generateFrameNumbers(this.name, {
        start: 1,
        end: 1,
      }),
      frameRate: 1,
      repeat: -1,
    });

    this.anims.play("bulletAnim", true);

    this.scene.tweens.add({
      targets: this,
      duration: 200,
      rotation: 5,
      repeat: -1,
    });
    this.scene.tweens.add({
      targets: this,
      duration: 200,
      intensity: { from: 0.3, to: 0.7 },
      repeat: -1,
    });
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
