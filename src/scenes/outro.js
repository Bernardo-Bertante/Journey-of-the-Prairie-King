export default class Outro extends Phaser.Scene {
  constructor() {
    super({ key: "outro" });
  }

  create() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;

    this.text = [
      this.registry.get("kills_player") +
        " lost souls were freed from Draco's power",
      "Finally, you and your wife can have an eternal life together again",
      "Her heart is yours, as she meant when she kissed you with all her soul!",
      " - press enter - ",
    ];
    this.showHistory();

    this.input.keyboard.on("keydown-ENTER", this.startSplash, this);
  }

  showHistory() {
    this.text.forEach((line, i) => {
      this.time.delayedCall(
        (i + 1) * 2000,
        () => this.showLine(line, (i + 1) * 80),
        null,
        this
      );
    });
    this.time.delayedCall(9000, () => this.showEnd(), null, this);
  }

  showLine(text, y) {
    let line = this.add
      .bitmapText(this.center_width, y, "stardewValley", text, 18)
      .setOrigin(0.5)
      .setAlpha(0);
    this.tweens.add({
      targets: line,
      duration: 2000,
      alpha: 1,
    });
  }

  showEnd() {
    this.kiss = this.add
      .image(this.center_width, 480, "theKiss")
      .setScale(4)
      .setOrigin(0.5);
    this.tweens.add({
      targets: this.logo,
      duration: 500,
      alpha: { from: 0, to: 1 },
    });
  }

  startSplash() {
    this.scene.start("splash");
  }
}
