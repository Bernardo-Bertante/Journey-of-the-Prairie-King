import Phaser from 'phaser';

export default class Tree extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'tree');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setSize(this.width, this.height);
        this.setImmovable(true);
        this.init();
    }

    init() {
        this.anims.create({
            key: 'treeSwing',
            frames: this.anims.generateFrameNumbers('tree', { start: 0, end: 1 }),
            frameRate: 4,
            repeat: -1
        });

        this.play('treeSwing');
    }
}
