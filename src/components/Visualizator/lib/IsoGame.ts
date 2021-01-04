import Phaser from 'phaser';
import { HeightMapScene } from './scenes/heightMapScene';

export default class IsoGame extends Phaser.Game {
  public colorChanged(lowColor: string, highColor: string) {
    const scene = this.scene.getScene('HeightMapScene') as HeightMapScene;
    scene.handleColorChange(lowColor, highColor);
  }
}
