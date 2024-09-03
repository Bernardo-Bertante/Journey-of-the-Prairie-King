import Explosion from "./explosion";
import ShootingPatterns from "./shooting_pattern";

class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, name = "player", gun = "rusty") {
    super(scene, x, y, name);
    this.name = name;
    this.gun = gun;
    this.moveX = 0;
    this.moveY = 0;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);
    this.body.setAllowGravity(false);
    this.body.setCircle(8);
    this.setScale(2);

    this.power = 0;
    this.blinking = false;
    this.shootingPatterns = new ShootingPatterns(this.scene, this.name);
    this.init();
    this.setControls();
  }

  init() {
    const animations = [
      { key: "idle", start: 5, end: 6, frameRate: 2 },
      { key: "walkForward", start: 2, end: 3, frameRate: 4 },
      { key: "walkBackward", start: 0, end: 1, frameRate: 4 },
      { key: "right", start: 7, end: 8, frameRate: 4 },
      { key: "left", start: 9, end: 10, frameRate: 4 },
      { key: "win", start: 4, end: 4, frameRate: 2 },
    ];

    animations.forEach(({ key, start, end, frameRate }) => {
      if (!this.scene.anims.exists(this.name + key)) {
        this.scene.anims.create({
          key: this.name + key,
          frames: this.scene.anims.generateFrameNumbers(this.name, {
            start,
            end,
          }),
          frameRate,
          repeat: -1,
        });
      }
    });

    this.anims.play(this.name + "walkBackward", true);
  }

  setControls() {
    this.SPACE = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  shoot() {
    // this.scene.playAudio("shot");
    const shotSpeed = 450;

    let velocityX = 0;
    let velocityY = 0;

    if (this.cursors.left.isDown || this.A.isDown) {
      velocityX = -1;
    }
    if (this.cursors.right.isDown || this.D.isDown) {
      velocityX = 1;
    }
    if (this.cursors.up.isDown || this.W.isDown) {
      velocityY = -1;
    }
    if (
      this.cursors.down.isDown ||
      this.S.isDown ||
      (this.moveX === 0) & (this.moveY === 0)
    ) {
      velocityY = 1;
    }

    // Normalização do Vetor
    const magnitude = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    if (magnitude > 0) {
      velocityX = (velocityX / magnitude) * shotSpeed;
      velocityY = (velocityY / magnitude) * shotSpeed;
    }

    this.shootingPatterns.shoot(this.x, this.y, this.gun, velocityX, velocityY);
  }

  update(timestep, delta) {
    if (this.death) return;

    const speed = 300;
    this.moveX = 0; // Inicializa a variável moveX da instância
    this.moveY = 0; // Inicializa a variável moveY da instância

    if (this.cursors.left.isDown || this.A.isDown) {
      this.moveX = -1;
    }
    if (this.cursors.right.isDown || this.D.isDown) {
      this.moveX = 1;
    }
    if (this.cursors.up.isDown || this.W.isDown) {
      this.moveY = -1;
    }
    if (this.cursors.down.isDown || this.S.isDown) {
      this.moveY = 1;
    }

    // Normalização do vetor de movimento
    const magnitude = Math.sqrt(
      this.moveX * this.moveX + this.moveY * this.moveY
    );
    if (magnitude > 0) {
      this.moveX = (this.moveX / magnitude) * speed;
      this.moveY = (this.moveY / magnitude) * speed;
    }

    // Verifica o movimento e atualiza as animações
    if (this.moveX !== 0 || this.moveY !== 0) {
      if (this.moveX > 0) {
        this.anims.play(this.name + "right", true);
      } else if (this.moveX < 0) {
        this.anims.play(this.name + "left", true);
      } else if (this.moveY > 0) {
        this.anims.play(this.name + "walkForward", true);
      } else if (this.moveY < 0) {
        this.anims.play(this.name + "walkBackward", true);
      }
    } else {
      this.anims.play(this.name + "idle", true);
    }

    // Atualiza a velocidade do corpo com base em moveX e moveY da instância
    this.body.setVelocityX(this.moveX);
    this.body.setVelocityY(this.moveY);

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
      .setStrokeStyle(20, 0xffffff);
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

export default Player;
