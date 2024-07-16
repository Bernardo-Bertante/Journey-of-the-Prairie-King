import Explosion from "./explosion";
import ShootingPatterns from "./shooting_pattern";

class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, name = "player", gun = "rusty") {
    super(scene, x, y, name);
    this.name = name;
    this.gun = gun;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);
    this.body.setAllowGravity(false);
    this.body.setCircle(26);
    //this.body.setOffset(6, 9);
    this.power = 0;
    this.blinking = false;
    this.shootingPatterns = new ShootingPatterns(this.scene, this.name);
    this.init();
    this.setControls();
  }

  init() {
    this.scene.anims.create({
      key: this.name + "idle",
      frames: this.scene.anims.generateFrameNumbers(this.name, {
        start: 5,
        end: 6,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.scene.anims.create({
      key: this.name + "walkFoward",
      frames: this.scene.anims.generateFrameNumbers(this.name, {
        start: 2,
        end: 3,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.scene.anims.create({
      key: this.name + "walkBackward",
      frames: this.scene.anims.generateFrameNumbers(this.name, {
        start: 0,
        end: 1,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.scene.anims.create({
      key: this.name + "right",
      frames: this.scene.anims.generateFrameNumbers(this.name, {
        start: 7,
        end: 8,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.scene.anims.create({
      key: this.name + "left",
      frames: this.scene.anims.generateFrameNumbers(this.name, {
        start: 9,
        end: 10,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.scene.anims.create({
      key: this.name + "win",
      frames: this.scene.anims.generateFrameNumbers(this.name, {
        start: 4,
        end: 4,
      }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.play(this.name, true);
    this.upDelta = 0;
  }

  setControls() {
    this.SPACE = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.cursor = this.scene.input.keyboard.createCursorKeys();
    this.cursor = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.W
    );
    this.cursor = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.A
    );
    this.cursor = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );
    this.cursor = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.D
    );
  }

  shoot() {
    //this.scene.playAudio("shot");
    this.shootingPatterns.shoot(this.x, this.y, this.gun);
  }

  update() {
    if (this.death) return;
    if (this.cursor.left.isDown) {
      this.x -= 5;
      this.anims.play(this.name + "left", true);
    } else if (this.cursor.right.isDown) {
      this.x += 5;
      this.anims.play(this.name + "right", true);
    } else if (this.cursor.down.isDown) {
      this.y += 5;
      this.anims.play(this.name + "walkFoward", true);
    } else if (this.cursor.up.isDown) {
      this.y -= 5;
      this.anims.play(this.name + "walkBackward", true);
    } else {
      this.anims.play(this.name + "idle", true);
    }

    if (Phaser.Input.Keyboard.JustDown(this.SPACE)) {
      this.shoot();
    }
  }

  showKills(score, color = 0xff0000) {
    let text = this.scene.add
      .bitmapText(
        this.x + 20,
        this.y - 30,
        "stardewValley",
        score,
        20,
        0xfffd37
      )
      .setOrigin(0.5);
    this.scene.tweens.add({
      targets: text,
      duration: 2000,
      alpha: { from: 1, to: 0 },
      y: { from: text.y - 10, to: text.y - 100 },
    });
  }

  dead() {
    const explosion = this.scene.add
      .circle(this.x, this.y, 10)
      .setStrokeStyle(40, 0xffffff);
    this.scene.tweens.add({
      targets: explosion,
      radius: { from: 10, to: 200 },
      alpha: { from: 1, to: 0.3 },
      duration: 300,
      onComplete: () => {
        explosion.destroy();
      },
    });
    this.scene.cameras.main.shake(500);
    this.death = true;
    new Explosion(this.scene, this.x, this.y, 40);
    super.destroy();
  }
}
