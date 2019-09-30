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
  private width = 50;
  private minHeight = 0;
  private maxHeight = 60;
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

  private cursors: any;

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
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create(): void {
    for (let y = 0; y < this.gridHeight; y++) {
      let row = [];
      for (let x = 0; x < this.gridWidth; x++) {
        const depth = (this.width * 2) / 4;
        const halfDepth = depth / 2;
        const halfWidth = this.width / 2;
        const height =
          Math.random() * (this.maxHeight - this.minHeight) + this.minHeight;
        const t = (height - this.minHeight) / (this.maxHeight - this.minHeight);
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

        // var tile = this.add.isobox(
        //   this.centerX + tx,
        //   this.centerY + ty,
        //   this.size,
        //   height,
        //   color.toHex(),
        //   color.darken(30).toHex(),
        //   color.darken(15).toHex()
        // );
        let cube = new Cube(
          new Phaser.Geom.Point(this.centerX + tx, this.centerY + ty),
          height,
          this.size,
          color,
          this
        );
        this.add.existing(cube);
        cube.setDepth(this.centerY + ty);
        cube
          .setInteractive()
          .on(
            'pointerdown',
            (pointer: any, localX: number, localY: number, event: any) => {
              console.log('click');
            }
          );
        row.push(cube);
      }
      this.land.push(row);
    }
  }

  move_camera_by_pointer(o_pointer: Phaser.Input.Pointer) {
    if (!o_pointer.upTime) {
      return;
    }
    if (o_pointer.isDown) {
      if (this.cameras.main) {
        this.cameras.main.x += this.cameras.main.x - o_pointer.position.x;
        this.cameras.main.y += this.cameras.main.y - o_pointer.position.y;
      }
      // this.o_mcamera = o_pointer.position.clone();
    }
    if (o_pointer.primaryDown) {
      // this.o_mcamera = null;
    }
  }
  update(time: number): void {
    // console.log(time);
  }
}
