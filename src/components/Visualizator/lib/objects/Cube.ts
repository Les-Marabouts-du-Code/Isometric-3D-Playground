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

  constructor(
    _position: Phaser.Geom.Point,
    _height: number,
    _width: number = 50,
    _color: Color,
    scene: Phaser.Scene
  ) {
    this.position = _position;

    this.height = _height;
    this.width = _width;
    this.halfWidth = this.width / 2;
    this.depth = (this.width * 2) / 4;
    this.halfDepth = this.depth / 2;

    this.color = _color;

    this.buildCube(scene);
  }

  private buildCube(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();

    const cubeTop = this.getCubeTop();
    graphics.fillStyle(this.color.toHex());
    graphics.fillPoints(cubeTop.points, true);

    const cubeLeftSide = this.getCubeLeftSide();
    graphics.fillStyle(this.color.darken(30).toHex());
    graphics.fillPoints(cubeLeftSide.points, true);

    const cubeRightSide = this.getCubeRightSide();
    graphics.fillStyle(this.color.darken(15).toHex());
    graphics.fillPoints(cubeRightSide.points, true);
  }

  private getCubeLeftSide(): Phaser.Geom.Polygon {
    return new Phaser.Geom.Polygon([
      new Phaser.Geom.Point(this.position.x - this.halfWidth, this.position.y),
      new Phaser.Geom.Point(
        this.position.x - this.halfWidth,
        this.position.y - this.height
      ),
      new Phaser.Geom.Point(
        this.position.x,
        this.position.y + this.halfDepth - this.height
      ),
      new Phaser.Geom.Point(this.position.x, this.position.y + this.halfDepth)
    ]);
  }

  private getCubeRightSide(): Phaser.Geom.Polygon {
    return new Phaser.Geom.Polygon([
      new Phaser.Geom.Point(this.position.x + this.halfWidth, this.position.y),
      new Phaser.Geom.Point(
        this.position.x + this.halfWidth,
        this.position.y - this.height
      ),
      new Phaser.Geom.Point(
        this.position.x,
        this.position.y + this.halfDepth - this.height
      ),
      new Phaser.Geom.Point(this.position.x, this.position.y + this.halfDepth)
    ]);
  }

  private getCubeTop(): Phaser.Geom.Polygon {
    return new Phaser.Geom.Polygon([
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
    ]);
  }
}
