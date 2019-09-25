import Phaser from 'phaser';
import { Cube } from '../objects/Cube';
import Color from '../../../../lib/Isometric3DMap/utils/Color';
import MapDataToGrid from '../../../../lib/Isometric3DMap/mapdata/mapdatatogrid';
import { IIsometric3DGridInputParams } from '../../../../lib/Isometric3DMap/isometric3dgrid';

export class HeightMapScene extends Phaser.Scene {
  // private fieldSize: number;
  // private gameHeight: number;
  // private gameWidth: number;
  // private boardWidth: number;
  // private boardHeight: number;
  // private horizontalFields: number;
  // private verticalFields: number;
  // private tick: number;
  /**
   * Map Settings
   */
  private map: any;
  private params: any;

  /**
   * Color Settings
   */
  private lowColor: Color;
  private highColor: Color;

  private cubeList: any[] = [];

  constructor(inputParams: IIsometric3DGridInputParams) {
    super({
      key: 'HeightMapScene'
    });

    // this.params = inputParams.params;
    this.lowColor = new Color(255, 255, 128);
    this.highColor = new Color(179, 179, 255);
  }

  init(): void {
    // this.fieldSize = 8;
    // this.gameHeight = this.sys.canvas.height;
    // this.gameWidth = this.sys.canvas.width;
    // this.boardWidth = this.gameWidth - 2 * this.fieldSize;
    // this.boardHeight = this.gameHeight - 2 * this.fieldSize;
    // this.horizontalFields = this.boardWidth / this.fieldSize;
    // this.verticalFields = this.boardHeight / this.fieldSize;
    // this.tick = 0;
    // this.map = {
    //   data: new MapDataToGrid(this.params.data)
    // };
  }

  create(): void {
    const width = 50;
    const minHeight = 0;
    const maxHeight = 60;
    const size = 30;
    var land = [];
    const gridWidth = 100;
    const gridHeight = 100;
    var centerX = window.innerWidth / 4;
    var centerY = -100;
    for (let y = 0; y < gridHeight; y++) {
      let row = [];
      for (let x = 0; x < gridWidth; x++) {
        const depth = (width * 2) / 4;
        const halfDepth = depth / 2;
        const halfWidth = width / 2;
        const height = Math.random() * (maxHeight - minHeight) + minHeight;
        const t = (height - minHeight) / (maxHeight - minHeight);
        const color = this.lowColor.lerpTo(this.highColor, t);
        // const cube = new Cube(
        //   new Phaser.Geom.Point(
        //     (x - y) * halfWidth * 1.02 + offsetX,
        //     (x + y) * halfDepth * 1.02 + offsetY
        //   ),
        //   height,
        //   width,
        //   color,
        //   this
        // );
        // this.cubeList.push(cube);
        // this.add.isobox()

        var tx = (x - y) * halfWidth * 0.5;
        var ty = (x + y) * halfDepth * 0.5;

        var tile = this.add.isobox(
          centerX + tx,
          centerY + ty,
          size,
          height,
          color.toHex(),
          color.darken(30).toHex(),
          color.darken(15).toHex()
        );

        tile.setDepth(centerY + ty);
        tile
          .setInteractive()
          .on(
            'pointerdown',
            (pointer: any, localX: number, localY: number, event: any) => {
              console.log('click');
            }
          );
        row.push(tile);
      }
      land.push(row);
    }
  }

  update(time: number): void {
    // console.log(time);
  }
}
