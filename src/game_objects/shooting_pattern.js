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

  shoot(x, y, gun) {
    this.shootingMethods[gun](x, y, gun);
  }

  single(x, y, gun) {
    this.scene.shots.add(new Shot(this.scene, x, y, gun, this.name));
  }

  quintus(x, y, gun) {
    this.scene.shots.add(new Shot(this.scene, x, y, gun, this.name, -300));
    this.scene.shots.add(new Shot(this.scene, x, y, gun, this.name, 300));
    this.scene.shots.add(new Shot(this.scene, x, y, gun, this.name, -300, 500));
    this.scene.shots.add(new Shot(this.scene, x, y, gun, this.name, 300, 500));
  }

  massacre(x, y, gun) {
    this.scene.shots.add(new Shot(this.scene, x, y, gun, this.name, -300));
    this.scene.shots.add(new Shot(this.scene, x, y, gun, this.name, 300));
    this.scene.shots.add(new Shot(this.scene, x, y, gun, this.name, 0, 500));
    this.scene.shots.add(new Shot(this.scene, x, y, gun, this.name, 30));
    this.scene.shots.add(new Shot(this.scene, x, y, gun, this.name, 60));
  }
}
