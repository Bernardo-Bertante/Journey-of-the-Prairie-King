class Guns extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, name = "gunUpgrade", gun = "backToHell") {
    super(scene, x, y, name);
    this.name = name;
    this.gun = gun;
    this.scene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.setCircle(19);
    //this.body.setOffset(12, 12);
    this.body.setVelocityX(-100);
    this.init();
  }

  init() {
    this.scene.anims.create({
      key: this.name + "backToHell",
      frames: this.scene.anims.generateFrameNumbers(this.name, {
        start: 0,
        end: 0,
      }),
      frameRate: 1,
      repeat: -1,
    });
    this.scene.anims.create({
      key: this.name + "hollyOne",
      frames: this.scene.anims.generateFrameNumbers(this.name, {
        start: 1,
        end: 1,
      }),
      frameRate: 1,
      repeat: -1,
    });
    this.scene.tweens.add({
      targets: [this],
      duration: 1000,
      x: this.x,
      y: this.y,
      scale: { from: 0.9, to: 1 },
      alpha: { from: 0.8, to: 1 },
      repeat: -1,
    });

    this.anims.play(this.name + this.gun, true);
    this.body.setVelocityX(-100);
    this.direction = -1;
  }

  destroy() {
    super.destroy();
  }
}

export default Guns;
