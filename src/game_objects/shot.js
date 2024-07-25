import Phaser from "phaser";

class Shot extends Phaser.GameObjects.Sprite {
  constructor(
    scene,
    x,
    y,
    gun = "rusty",
    playerName,
    velocityX = 0,
    velocityY = 0
  ) {
    super(scene, x, y);
    this.name = "shot";
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
        start: 0,
        end: 0,
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
}

export default Shot;
