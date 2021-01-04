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
  private width = 50;
  private size = 30;
  private cubeGroup: Phaser.GameObjects.Group;
  private centerX = window.innerWidth / 4;
  private centerY = window.innerHeight / 4;
  private lastPointerCoordinates: { x: number; y: number } = { x: NaN, y: NaN };

  /**
   * Color Settings
   */
  private lowColor: Color;
  private highColor: Color;
  private colorChanged: boolean = false;

  public mapData: SpacePoint[] = [];
  public minHeight: number = 0;
  public maxHeight: number = 0;
  private mapDataJSON: any = {};

  constructor({
    data, 
    lowColor, 
    highColor
  }: {
    data: JSON, 
    lowColor: string | null,
    highColor: string | null
  }) {
    super({
      key: 'HeightMapScene'
    });

    if (highColor) {
      this.highColor = Color.fromHexa(highColor);
    } else {
      this.highColor = new Color(255, 255, 128);
    }

    if (lowColor) {
      this.lowColor = Color.fromHexa(lowColor);
    } else {
      this.lowColor = new Color(179, 179, 255);
    }

    this.cubeGroup = new Phaser.GameObjects.Group(this);

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
    this.minHeight = minHeight;
    this.maxHeight = maxHeight;
    const n = gridData.length;
    let row: Cube[] = [];
    for (let i = 0; i < n; i++) {
      const singleGridData = gridData[i];
      const { x, y } = singleGridData;
      const depth = (this.width * 2) / 4;
      const halfDepth = depth / 2;
      const halfWidth = this.width / 2;
      const height = singleGridData.height;
      const t = (height - this.minHeight) / (this.maxHeight - this.minHeight);
      const color = this.lowColor.lerpTo(this.highColor, t);

      var tx = (x - y) * halfWidth * 0.6;
      var ty = (x + y) * halfDepth * 0.6;

      let cube = new Cube(
        new Phaser.Geom.Point(this.centerX + tx, this.centerY + ty),
        0,
        this.size,
        this.lowColor,
        this
      );

      cube.setDepth(this.centerY + ty);
      row.push(cube);
      this.cubeGroup.add(cube);
      this.add.existing(cube);

      const reverseIndex = n - 1 - i;
      this.tweens.add({
        targets: cube,
        height: singleGridData.height,
        ease: 'Sine.easeOut',
        duration: 1500 + 10 * reverseIndex,
        delay: reverseIndex * 2,
        onUpdate: (args) => {
          const animationProgress = args.elapsed / args.duration;
          this.updateCubeColor(cube, this.lowColor, color, animationProgress);
        }
      });
    }

    this.input.on('pointermove', (o_pointer: Phaser.Input.Pointer) => {
      if (!o_pointer.primaryDown) {
        return;
      }

      if (
        !isNaN(this.lastPointerCoordinates.x) &&
        !isNaN(this.lastPointerCoordinates.y)
      ) {
        this.cameras.main.scrollX -=
          o_pointer.position.x - this.lastPointerCoordinates.x;
        this.cameras.main.scrollY -=
          o_pointer.position.y - this.lastPointerCoordinates.y;
      }

      const {
        tagName
      }: { tagName: string } = o_pointer.manager.activePointer.downElement;

      if (tagName.match(/^canvas$/i)) {
        this.lastPointerCoordinates.x = o_pointer.position.x;
        this.lastPointerCoordinates.y = o_pointer.position.y;
      }
    });

    this.input.on('pointerup', (o_pointer: Phaser.Input.Pointer) => {
      this.lastPointerCoordinates.x = NaN;
      this.lastPointerCoordinates.y = NaN;
    });
  }

  handleColorChange(lowColor: string, highColor: string) {
    this.colorChanged = true;
    this.lowColor = Color.fromHexa(lowColor);
    this.highColor = Color.fromHexa(highColor);
  }

  updateCubeColor(
    cube: Cube,
    startColor: Color,
    endColor: Color,
    rate: number
  ) {
    if (rate >= 1) {
      return;
    }
    const newColor = startColor.lerpTo(endColor, rate);
    cube.colorize(newColor);
  }

  private updateColor() {
    this.cubeGroup.children.iterate((child) => {
      const cube: Cube = child as Cube;
      const delta =
        (cube.height - this.minHeight) / (this.maxHeight - this.minHeight);
      const color = this.lowColor.lerpTo(this.highColor, delta);
      cube.colorize(color);
    });
  }

  update(time: number): void {
    if (this.colorChanged) {
      this.updateColor();
      this.colorChanged = false;
    }
  }
}
