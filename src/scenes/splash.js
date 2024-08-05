export default class Splash extends Phaser.Scene {
  constructor() {
    super({ key: "splash" });
  }

  create() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;
    this.cameras.main.setBackgroundColor(0x000000);

    this.time.delayedCall(1000, () => this.showInstructions(), null, this);
    this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
    //this.playMusic();
    this.showTitle();
  }

  startGame() {
    if (this.theme) this.theme.stop();
    this.scene.start("transition", {
      next: "game",
      name: "STAGE",
      number: 1,
      time: 30,
    });
  }

  showTitle() {
    this.logo = this.add
      .image(this.center_width, this.center_height, "logoStart")
      .setScale(4)
      .setOrigin(0.5);
    this.tweens.add({
      targets: this.logo,
      duration: 500,
      y: {
        from: -200,
        to: 200,
      },
    });
    this.tweens.add({
      targets: this.logo,
      duration: 500,
      scale: { from: 4, to: 3.8 },
      repeat: -1,
      yoyo: true,
    });
  }

  playMusic(theme = "splash") {
    this.theme = this.sound.add(theme);
    this.theme.stop();
    this.theme.play({
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    });
  }

  showInstructions() {
    this.add
      .bitmapText(
        this.center_width,
        450,
        "stardewValley",
        "Arrows or WASD to move",
        20
      )
      .setOrigin(0.5)
      .setTint(0xffffff);

    this.add
      .bitmapText(this.center_width, 500, "stardewValley", "SPACE to shoot", 20)
      .setOrigin(0.5)
      .setTint(0xffffff);
  }
}
