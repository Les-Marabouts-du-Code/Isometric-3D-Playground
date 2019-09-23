import Phaser from 'phaser';
import Color from '../../../../lib/Isometric3DMap/utils/Color';

export class Cube {
  private position: Phaser.Geom.Point;
  private width: number;
  private height: number;
  private depth: number;
  private halfWidth: number;
  private halfDepth: number;
  private color: Color;
  private topFace: Phaser.GameObjects.Polygon;
  private leftFace: Phaser.GameObjects.Polygon;
  private rightFace: Phaser.GameObjects.Polygon;

  constructor(
    _position: Phaser.Geom.Point,
    _height: number,
    _width: number = 50,
    _color: Color,
    scene: Phaser.Scene
  ) {
    this.position = _position;

    this.height = _height;
    // this.height = 0;
    this.width = _width;
    this.halfWidth = this.width / 2;
    this.depth = (this.width * 2) / 4;
    this.halfDepth = this.depth / 2;

    this.color = _color;

    this.topFace = this.getCubeTop(scene);
    this.leftFace = this.getCubeLeftSide(scene);
    this.rightFace = this.getCubeRightSide(scene);

    scene.add.existing(this.topFace);
    scene.add.existing(this.leftFace);
    scene.add.existing(this.rightFace);

    this.colorize(this.color);
  }

  public getCubeSurface(): Phaser.GameObjects.Polygon {
    return this.topFace;
  }

  public getCubeFaceList(): Phaser.GameObjects.Polygon[] {
    return [this.topFace, this.leftFace, this.rightFace];
  }

  private colorize(color: Color): void {
    this.topFace.setFillStyle(color.toHex());
    this.leftFace.setFillStyle(color.darken(30).toHex());
    this.rightFace.setFillStyle(color.darken(15).toHex());
  }

  public lighten(delta: number): void {
    this.color.brighten(delta);
  }

  private getCubeLeftSide(scene: Phaser.Scene): Phaser.GameObjects.Polygon {
    return new Phaser.GameObjects.Polygon(
      scene,
      this.position.x,
      this.position.y,
      [
        [this.position.x - this.halfWidth, this.position.y],
        [this.position.x - this.halfWidth, this.position.y - this.height],
        [this.position.x, this.position.y + this.halfDepth - this.height],
        [this.position.x, this.position.y + this.halfDepth]
      ]
    );
  }

  private getCubeRightSide(scene: Phaser.Scene): Phaser.GameObjects.Polygon {
    return new Phaser.GameObjects.Polygon(
      scene,
      this.position.x,
      this.position.y,
      [
        new Phaser.Geom.Point(
          this.position.x + this.halfWidth,
          this.position.y
        ),
        new Phaser.Geom.Point(
          this.position.x + this.halfWidth,
          this.position.y - this.height
        ),
        new Phaser.Geom.Point(
          this.position.x,
          this.position.y + this.halfDepth - this.height
        ),
        new Phaser.Geom.Point(this.position.x, this.position.y + this.halfDepth)
      ]
    );
  }

  private getCubeTop(scene: Phaser.Scene): Phaser.GameObjects.Polygon {
    return new Phaser.GameObjects.Polygon(
      scene,
      this.position.x,
      this.position.y,
      [
        new Phaser.Geom.Point(
          this.position.x - this.halfWidth,
          this.position.y - this.height
        ),
        new Phaser.Geom.Point(
          this.position.x,
          this.position.y + this.halfDepth - this.height
        ),
        new Phaser.Geom.Point(
          this.position.x + this.halfWidth,
          this.position.y - this.height
        ),
        new Phaser.Geom.Point(
          this.position.x,
          this.position.y - this.halfDepth - this.height
        )
      ]
    );
  }
}
