

export default class EnemyGenerator {
    constructor(scene) {
        this.scene = scene;
        this.waveEnemies = [];
        this.generate();
        this.activeWave = false;
        this.waves = 0;
    }

    generate() {
        if (this.scene.number === 3) {
            this.scene.time.delayedCall(2000, () => this.dracoAppears(), null, this);
        } else {
            this.generateEvent1 = this.scene.time.addEvent({
                delay: 5000,
                callback: () => this.orderedWave(),
                callbackScope: this,
                loop: true,
            });
            if (this.scene.number === 2) {
                this.generateEvent2 = this.scene.time.addEvent({
                    delay: 5000,
                    callback: () => this.wave(),
                    callbackScope: this,
                    loop: true,
                });
            }
        }
    }

    dracoAppears() {
        const draco = new Enemy(
            this.scene,
            Phaser.Math.Between(200, 600),
            200,
            "draco",
            0,
            20
        );

        const { x, y } = draco;
        const bossDialogue = this.add.image(x, y, "bossDialogue");

        this.tweens.add({
            targets: bossDialogue,
            y: bossDialogue.y - 100,
            alpha: { start: 0, end: 1 },
            duration: 3000,
            ease: "Power1",
            onComplete: function () {
                bossDialogue.destroy();
            }
        });
        this.scene.enemyGroup.add(draco);
    }

    stop() {
        clearInterval(this.generationIntervalId);
        this.scene.enemyGroup.children.entries.forEach((enemy) => {
            if (enemy === null || !enemy.active) return;
            enemy.destroy();
        });
    }

    finishScene() {
        this.generateEvent1.destroy();
        if (this.scene.number > 1) this.generateEvent2.destroy();
        this.scene.endScene();
    }

    createPath






}