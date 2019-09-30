import Phaser from 'phaser';
import Color from '../../../../lib/Isometric3DMap/utils/Color';

export class Cube extends Phaser.GameObjects.IsoBox {
  private position: Phaser.Geom.Point;
  public width: number;
  public height: number;

  private color: Color;

  constructor(
    _position: Phaser.Geom.Point,
    _height: number,
    _width: number = 50,
    _color: Color,
    scene: Phaser.Scene
  ) {
    super(scene, _position.x, _position.y, _width, _height);
    this.position = _position;

    this.height = _height;
    this.width = _width;

    this.color = _color;

    this.colorize(this.color);
  }

  public colorize(color: Color) {
    this.setFillStyle(
      this.color.toHex(),
      this.color.darken(30).toHex(),
      this.color.darken(15).toHex()
    );
  }
}
