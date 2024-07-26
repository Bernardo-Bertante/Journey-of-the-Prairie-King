import Shot from "./shot";

export default class ShootingPatterns {
  constructor(scene, name) {
    this.scene = scene;
    this.name = name;
    this.shootingMethods = {
      rusty: this.single.bind(this),
      backToHell: this.quintus.bind(this),
      hollyOne: this.massacre.bind(this),
    };
  }

  shoot(x, y, gun = "backToHell", velocityX = 0, velocityY = 0) {
    this.shootingMethods[gun](x, y, gun, velocityX, velocityY);
  }

  single(x, y, gun, velocityX, velocityY) {
    this.scene.shots.add(
      new Shot(this.scene, x, y, gun, this.name, velocityX, velocityY)
    );
  }

  quintus(x, y, gun, velocityX, velocityY) {
    this.scene.shots.add(
      new Shot(this.scene, x, y, gun, this.name, -300, velocityY)
    );
    this.scene.shots.add(
      new Shot(this.scene, x, y, gun, this.name, 300, velocityY)
    );
    this.scene.shots.add(new Shot(this.scene, x, y, gun, this.name, -300, 500));
    this.scene.shots.add(new Shot(this.scene, x, y, gun, this.name, 300, 500));
  }

  massacre(x, y, gun, velocityX, velocityY) {
    this.scene.shots.add(
      new Shot(this.scene, x, y, gun, this.name, -300, velocityY)
    );
    this.scene.shots.add(
      new Shot(this.scene, x, y, gun, this.name, 300, velocityY)
    );
    this.scene.shots.add(new Shot(this.scene, x, y, gun, this.name, 0, 500));
    this.scene.shots.add(
      new Shot(this.scene, x, y, gun, this.name, 30, velocityY)
    );
    this.scene.shots.add(new Shot(this.scene, x, y, gun, 60, velocityY));
  }
}
