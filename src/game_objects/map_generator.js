export default class MapGenerator {
    constructor(scene) {
        this.scene = scene;
        this.generateMap();
    }

    generateMap() {
        // Associa o tilemap com o tileset
        this.map = this.make.tilemap({ key: "map" });
        const tileset = this.map.addTilesetImage("assets", "tiles");

        // Cria os dois principais Layers do jogo
        this.groundLayer = this.map.createStaticLayer("groundLayer", tileset, 0, 0);
        this.objectColliderLayer = this.map.createStaticLayer("objectColliderLayer", tileset, 0, 0);

        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        // Obter as dimensões originais do mapa
        const mapWidth = this.map.widthInPixels;
        const mapHeight = this.map.heightInPixels;

        // Aplicar o fator de escala
        const scaleFactor = 2;
        const scaledMapWidth = mapWidth * scaleFactor;
        const scaledMapHeight = mapHeight * scaleFactor;

        // Calcular as coordenadas centrais ajustadas
        const centerX = (gameWidth - scaledMapWidth) / 2;
        const centerY = (gameHeight - scaledMapHeight) / 2;

        // Definir o fator de escala
        this.groundLayer.setScale(scaleFactor);
        this.objectColliderLayer.setScale(scaleFactor);

        // Posicionar as camadas centralizadas
        this.groundLayer.setPosition(centerX, centerY);
        this.objectColliderLayer.setPosition(centerX, centerY);
    }
}