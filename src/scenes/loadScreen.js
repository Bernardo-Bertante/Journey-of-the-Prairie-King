import mapJSON from "../assets/tilemap/map.json";

export default class loadScreen extends Phaser.Scene {
    constructor() {
        super({ key: "loadScreen" });
    }

    preload() {
        this.createBars();
        this.setLoadEvents();
        this.loadMap();
        this.loadFonts();
        this.loadSpritesheets();
        this.loadAudios();
        this.setRegistry();
    }

    setLoadEvents() {
        // Evento de progresso de carregamento
        this.load.on(
            "progress",
            function (value) {
                this.progressBar.clear();
                this.progressBar.fillStyle(0x800080, 1);
                this.progressBar.fillRect(
                    this.cameras.main.width / 4,
                    this.cameras.main.height / 2 - 16,
                    (this.cameras.main.width / 2) * value,
                    16
                );
            },
            this
        );

        // Evento de carregamento completo
        this.load.on(
            "complete",
            () => {
                // Adiciona um atraso de 0,5 segundos antes de iniciar a próxima cena
                setTimeout(() => {
                    this.scene.start("splash");
                }, 500);
            },
            this
        );
    }

    loadFonts() {
        this.load.bitmapFont(
            "stardewValley",
            "../assets/fonts/stardewValley.png",
            "../assets/fonts/stardewValley.xml"
        );
    }

    loadImages() {
        this.load.image("tiles", "../assets/images/enviromentAssets.png");
        this.load.image("logoStart", "../assets/images/logoStart.png");
        this.load.image("controlsInfo", "../assets/images/controlsInfo.png");
        this.load.image("theKiss", "../assets/images/theKiss.png")
        this.load.image("tree", "../assets/images/tree.png")
        this.load.image("theKiss", "../assets/images/theKiss.png")
    }

    loadMap() {
        this.load.tilemapTiledJSON("map", mapJSON);
    }

    loadAudios() {

    }

    loadSpritesheets() {
        this.load.spritesheet("player", "../assets/images/player.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
        this.load.spritesheet("zombie", "../assets/images/zombie.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
        this.load.spritesheet("gunUpgrade", "../assets/images/guns.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
        this.load.spritesheet("player", "../assets/images/player.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
        this.load.spritesheet("tree", "../assets/images/trees.png", {
            frameWidth: 16,
            frameHeight: 16,
        })
    }

    setRegistry() {
        this.registry.set("kills", 0);
        this.registry.set("gun", "rusty");
        this.registry.set("Playerlives", 0);
    }

    createBars() {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0xFF0000, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4, 20
        );
        this.progressBar = this.add.graphics();
    }
}