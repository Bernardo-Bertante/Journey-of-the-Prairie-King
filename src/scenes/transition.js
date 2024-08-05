export default class Transition extends Phaser.Scene {
  constructor() {
    super({ key: "transition" });
  }

  init(data) {
    this.name = data.name;
    this.number = data.number;
    this.next = data.next;
  }

  create() {
    const messages = [
      "In a random night, a heartless Dracula came to your \nhouse seeking life! Your wife was the chosen one to have\nher heart taken away!",
      "After a long time, you finally reach a refreshing river. \nNo time to rest! The enemies are coming!",
      "Suddenly, you see the end of the line on the near horizon. \nNow it's do or die! Thinking about your love gives you hope\nto reach the end!",
    ];

    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;
    //this.sound.add("stageclear2").play();
    this.add
      .bitmapText(
        this.center_width,
        this.center_height - 50,
        "stardewValley",
        messages[this.number - 1],
        20
      )
      .setOrigin(0.5);

    //this.playMusic("music" + (this.number !== 4 ? this.number : 1));
    this.time.delayedCall(5000, () => this.loadNext(), null, this);
  }

  loadNext() {
    this.scene.start(this.next, {
      name: this.name,
      number: this.number,
      time: this.time,
    });
  }

  playMusic(theme = "music1") {
    this.theme = this.sound.add(theme);
    this.theme.play({
      mute: false,
      volume: 0.4,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    });
  }
}
