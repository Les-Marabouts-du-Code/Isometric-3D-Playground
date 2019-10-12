import Phaser from 'phaser';
import { Cube } from '../objects/Cube';
import Color from '../../../../lib/Isometric3DMap/utils/Color';
import { IIsometric3DGridInputParams } from '../../../../lib/Isometric3DMap/isometric3dgrid';
import SpacePoint from '../../../../lib/Isometric3DMap/interfaces/spacePoint.interface';
import MapDataToGrid from '../../../../lib/Isometric3DMap/mapdata/mapdatatogrid';
import { IMapGridPoint } from '../../../../lib/Isometric3DMap/interfaces/map-grid-point.interface';

interface IMinMaxHeight {
  minHeight: number;
  maxHeight: number;
}

export class HeightMapScene extends Phaser.Scene {
  /**
   * Map Settings
   */
  private map: any;
  private params: any;
  private width = 50;
  private size = 30;
  private land: any[] = [];
  private gridWidth = 100;
  private gridHeight = 100;
  private centerX = window.innerWidth / 4;
  private centerY = 200;
  private lastPointerCoordinates: { x: number; y: number } = { x: 0, y: 0 };

  /**
   * Color Settings
   */
  private lowColor: Color;
  private highColor: Color;

  private cubeList: any[] = [];

  public mapData: SpacePoint[] = [];
  private mapDataJSON: any = {};

  // private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(data: JSON) {
    super({
      key: 'HeightMapScene'
    });

    this.highColor = new Color(255, 255, 128);
    this.lowColor = new Color(179, 179, 255);

    this.mapDataJSON = data;
    this.mapData = this.mapDataJSON.results;
  }

  private getMinMaxHeight(map: IMapGridPoint[]): IMinMaxHeight {
    return map.reduce(
      (prev: IMinMaxHeight, current: IMapGridPoint) => ({
        minHeight: Math.min(prev.minHeight, current.height),
        maxHeight: Math.max(prev.maxHeight, current.height)
      }),
      { minHeight: 0, maxHeight: 0 }
    );
  }

  create(): void {
    const gridDataRaw = new MapDataToGrid(this.mapDataJSON.results);
    const gridData: IMapGridPoint[] = gridDataRaw.getGrid();

    const { minHeight, maxHeight } = this.getMinMaxHeight(gridData);

    const n = gridData.length;
    let row: any = [];
    for (let i = 0; i < n; i++) {
      const singleGridData = gridData[i];
      const { x, y } = singleGridData;
      const depth = (this.width * 2) / 4;
      const halfDepth = depth / 2;
      const halfWidth = this.width / 2;
      const height = singleGridData.height;
      const t = (height - minHeight) / (maxHeight - minHeight);
      const color = this.lowColor.lerpTo(this.highColor, t);

      var tx = (x - y) * halfWidth * 0.6;
      var ty = (x + y) * halfDepth * 0.6;

      let cube = new Cube(
        new Phaser.Geom.Point(this.centerX + tx, this.centerY + ty),
        0,
        this.size,
        color,
        this
      );

      cube.setDepth(this.centerY + ty);
      row.push(cube);
      this.add.existing(cube);

      const reverseIndex = n - 1 - i;
      this.tweens.add({
        targets: cube,
        height: singleGridData.height,
        ease: 'Sine.easeOut',
        duration: 1500 + 10 * reverseIndex,
        delay: reverseIndex * 2
      });
    }
    this.land.push(row);
  }

  move_camera_by_pointer(o_pointer: Phaser.Input.Pointer) {
    if (!o_pointer.upTime) {
      return;
    }
    if (o_pointer.primaryDown && this.cameras.main) {
      const { x, y } = this.lastPointerCoordinates;
      this.cameras.main.x += o_pointer.position.x - x;
      this.cameras.main.y += o_pointer.position.y - y;

      this.lastPointerCoordinates.x = o_pointer.position.x;
      this.lastPointerCoordinates.y = o_pointer.position.y;
    }
  }

  update(time: number): void {
    this.move_camera_by_pointer(this.input.activePointer);
  }
}
