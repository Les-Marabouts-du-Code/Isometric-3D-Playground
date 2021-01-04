import React, { useEffect, useState, useCallback } from 'react';
import Phaser from 'phaser';
import IsoGame from './lib/IsoGame';
import { HeightMapScene } from './lib/scenes/heightMapScene';
import OptionSelector from '../OptionSelector/OptionSelector';

interface IVisualizatorProps {
  mapData: JSON;
}
const Visualizator = (props: IVisualizatorProps) => {
  const getWindowWidth = () => window.innerWidth;
  const getWindowHeight = () => window.innerHeight;

  // eslint-disable-next-line
  const [vizualizatorEl, setVisualizatorElement] = useState('display-el');
  const [width, setWidth] = useState(getWindowWidth());
  const [height, setHeight] = useState(getWindowHeight());

  const localHighColor = localStorage.getItem('isp_highColor');
  const localLowColor = localStorage.getItem('isp_lowColor');
  const [game, setGame] = useState<IsoGame>();

  // TODO: { data, lowColor, highColor }
  const scene = new HeightMapScene({
    data: props.mapData, 
    lowColor: localLowColor, 
    highColor: localHighColor
  });

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (game) {
      return;
    }
    setGame(
      new IsoGame({
        parent: vizualizatorEl,
        scene,
        scale: {
          parent: vizualizatorEl,
          mode: Phaser.Scale.NONE,
          width,
          height
        }
      })
    );
  }, [props.mapData]);

  const handleResize = useCallback(() => {
    setWidth(getWindowWidth());
    setHeight(getWindowHeight());
  }, []);

  useEffect(() => {
    if (game) {
      game.canvas.width = width;
      game.canvas.height = height;
      game.scale.resize(width, height);
    }
  }, [width, height, game]);

  function handleColorChange(lowColor: string, highColor: string) {
    if(game) {
      game.colorChanged(lowColor, highColor)
    }
  }

  return (
    <>
      <div id="display-el"></div>
      {game && (
        <OptionSelector
          onColorChange={handleColorChange}
        />
      )}
    </>
  );
};

export default Visualizator;
