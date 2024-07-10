export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: "game" });
        // this.player = null;
        // this.kills = 0;
        // this.killsText = null;
    }

    init(data) {
        this.name = data.name; // level name
        this.number = data.number; // level number
        this.next = data.next; // next level
        this.currentGun = +this.registry.get("currentGun"); // gun using
        this.life = data.life; // total lifes left
    }





}