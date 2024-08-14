class Explosion {
  constructor(scene, x, y, min = 5, max = 7) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.lights = Array(Phaser.Math.Between(min, max))
      .fill(0)
      .map((_, i) => {
        this.scene.anims.create({
          key: "explosion",
          frames: this.scene.anims.generateFrameNumbers(this.name, {
            start: 0,
            end: 4,
          }),
          frameRate: 5,
          repeat: -1,
        });
      });
    this.init();
  }

  init() {
    this.scene.tweens.add({
      targets: this.lights,
      duration: Phaser.Math.Between(600, 1000),
      scaleX: { from: 2, to: 0 },
      scaleY: { from: 2, to: 0 },
    });
  }
}

export default Explosion;
