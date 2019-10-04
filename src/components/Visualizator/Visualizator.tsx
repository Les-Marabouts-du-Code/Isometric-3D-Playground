import React, { useEffect, useState, useCallback } from 'react';
import Phaser from 'phaser';
import IsoGame from './lib/IsoGame';
import { HeightMapScene } from './lib/scenes/heightMapScene';

interface IVisualizatorProps {
  mapData: JSON | undefined;
}
const Visualizator = (props: IVisualizatorProps) => {
  const getWindowWidth = () => window.innerWidth;
  const getWindowHeight = () => window.innerHeight;

  // eslint-disable-next-line
  const [vizualizatorEl, setVisualizatorElement] = useState('display-el');
  const [width, setWidth] = useState(getWindowWidth());
  const [height, setHeight] = useState(getWindowHeight());

  const [game, setGame] = useState<IsoGame>();

  // const { mapData } = props;
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    setGame(
      new IsoGame({
        parent: vizualizatorEl,
        scene: [HeightMapScene],
        scale: {
          parent: vizualizatorEl,
          mode: Phaser.Scale.NONE,
          width,
          height
        }
      })
    );

    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line
  }, []);

  const handleResize = useCallback(() => {
    setWidth(getWindowWidth());
    setHeight(getWindowHeight());
  }, []);

  useEffect(() => {
    if (game) {
      game.scale.resize(width, height);
    }
  }, [width, height, game]);

  return <div id="display-el"></div>;
};

export default Visualizator;
