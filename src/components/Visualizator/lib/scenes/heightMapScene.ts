import Phaser from 'phaser';
import { Cube } from '../objects/Cube';
import Color from '../../../../lib/Isometric3DMap/utils/Color';
import { IIsometric3DGridInputParams } from '../../../../lib/Isometric3DMap/isometric3dgrid';
import SpacePoint from '../../../../lib/Isometric3DMap/interfaces/spacePoint.interface';

export class HeightMapScene extends Phaser.Scene {
  /**
   * Map Settings
   */
  private map: any;
  private params: any;
  private width = 50;
  private minHeight = 0;
  private maxHeight = 0;
  private size = 30;
  private land: any[] = [];
  private gridWidth = 100;
  private gridHeight = 100;
  private centerX = window.innerWidth / 4;
  private centerY = -100;

  /**
   * Color Settings
   */
  private lowColor: Color;
  private highColor: Color;

  private cubeList: any[] = [];

  public mapData: SpacePoint[] = [];

  // private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(inputParams: IIsometric3DGridInputParams) {
    super({
      key: 'HeightMapScene'
    });

    this.lowColor = new Color(255, 255, 128);
    this.highColor = new Color(179, 179, 255);
  }

  init(): void {
    this.mapData = require('../../data.json').results;
    const { min, max } = this.getMinMaxHeight(this.mapData);

    this.minHeight = min;
    this.maxHeight = max;
  }

  private getMinMaxHeight(map: SpacePoint[]) {
    return map.reduce(
      (prev, current) => ({
        min: Math.min(prev.min, current.elevation),
        max: Math.max(prev.max, current.elevation)
      }),
      { min: 0, max: 0 }
    );
  }

  create(): void {
    for (let y = 0; y < this.gridHeight; y++) {
      let row = [];
      for (let x = 0; x < this.gridWidth; x++) {
        const depth = (this.width * 2) / 4;
        const halfDepth = depth / 2;
        const halfWidth = this.width / 2;
        let height = 0;
        if (x + y < this.mapData.length) {
          height = this.mapData[x + y].elevation;
        }
        const t = (height - this.minHeight) / (this.maxHeight - this.minHeight);
        const color = this.lowColor.lerpTo(this.highColor, t);

        var tx = (x - y) * halfWidth * 0.6;
        var ty = (x + y) * halfDepth * 0.6;

        let cube = new Cube(
          new Phaser.Geom.Point(this.centerX + tx, this.centerY + ty),
          height,
          this.size,
          color,
          this
        );

        cube.setDepth(this.centerY + ty);
        row.push(cube);
        this.add.existing(cube);
      }
      this.land.push(row);
    }
  }

  move_camera_by_pointer(o_pointer: Phaser.Input.Pointer) {
    if (!o_pointer.upTime) {
      return;
    }
    if (o_pointer.primaryDown) {
      if (this.cameras.main) {
        this.cameras.main.x += this.cameras.main.x - o_pointer.position.x;
        this.cameras.main.y += this.cameras.main.y - o_pointer.position.y;
      }
    }
  }

  update(time: number): void {
    this.move_camera_by_pointer(this.input.activePointer);
  }
}
