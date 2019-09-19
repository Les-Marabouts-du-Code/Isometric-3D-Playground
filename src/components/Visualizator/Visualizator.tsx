import React, { useRef, useEffect, useState } from 'react';
import IsoGame from './lib/IsoGame';
import { HeightMapScene } from './lib/scenes/heightMapScene';

const Visualizator = () => {
  const [vizualizatorEl, setVisualizatorElement] = useState('display-el');
  const [game, setGame] = useState<IsoGame>();
  const [width, setWidth] = useState(800);
  const [height, setheight] = useState(600);

  useEffect(() => {
    setGame(
      new IsoGame({
        width,
        height,
        parent: vizualizatorEl,
        scene: [HeightMapScene]
      })
    );
  }, [width, height, vizualizatorEl]);
  return <div id="display-el"></div>;
};

export default Visualizator;
