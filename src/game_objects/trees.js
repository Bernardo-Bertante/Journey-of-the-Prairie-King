import Phaser from "phaser";

export default class Tree extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "tree");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.setSize(this.width, this.height);
    this.setImmovable(true);
    this.setScale(2);
    this.init();
  }

  init() {
    this.play("treeSwing");
  }
}
