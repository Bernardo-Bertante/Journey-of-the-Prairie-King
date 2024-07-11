import Phaser from "phaser";
import MapGenerator from "../game_objects/map_generator";

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

    create() {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;




        this.map = new MapGenerator(this);





        this.cameras.main.setBackgroundColor(0x000000);
        this.lights.enable();
        this.lights.setAmbientColor(0x666666);
        this.addKills();
        this.addEnemies();
        this.addPlayer();
        this.addNewGun();
        this.addShots();
        this.loadAudios();
        this.addColliders();
    }





}