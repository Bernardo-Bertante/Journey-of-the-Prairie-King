const GUNS = {
  rusty: { color: 0xaf8057, radius: 16, intensity: 0.4 },
  backToHell: { color: 0xfff6d5, radius: 16, intensity: 0.4 },
  hollyOne: { color: 0xffffff, radius: 16, intensity: 0.4 },
};

class Shot extends Phaser.GameObjects.PointLight {
  constructor(
    scene,
    x,
    y,
    gun = "rusty",
    playerName,
    velocityX = 0,
    velocityY = -500
  ) {
    const { color, radius, intensity } = GUNS[gun];
    super(scene, x, y, color, radius, intensity);
    this.name = "shot";
    this.playerName = playerName;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.setVelocityX(velocityX);
    this.body.setVelocityY(velocityY);
    this.body.setCircle(10);
    // this.body.setOffset(6, 9);
    this.body.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
    this.init();
  }

  init() {
    this.scene.tweens.add({
      targets: this,
      duration: 200,
      intensity: { from: 0.3, to: 0.7 },
      repeat: -1,
    });
  }
}

export default Shot;
