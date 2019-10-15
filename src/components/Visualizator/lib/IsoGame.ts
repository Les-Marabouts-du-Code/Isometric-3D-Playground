import Phaser from 'phaser';
import { HeightMapScene } from './scenes/heightMapScene';

export default class IsoGame extends Phaser.Game {
  public colorChanged() {
    const scene = this.scene.getScene('HeightMapScene') as HeightMapScene;
    scene.handleColorChange();
  }
}
