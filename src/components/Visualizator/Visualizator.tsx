import React, { useRef, useEffect, useState } from 'react';
import IsoGame from './lib/IsoGame';
import { HeightMapScene } from './lib/scenes/heightMapScene';

const Visualizator = () => {
  const [vizualizatorEl, setVisualizatorElement] = useState('display-el');
  const [game, setGame] = useState<IsoGame>();
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setheight] = useState(window.innerHeight);

  useEffect(() => {
    setGame(
      new IsoGame({
        width,
        height,
        parent: vizualizatorEl,
        scene: [HeightMapScene],
        input: {
          keyboard: true,
          mouse: true,
          touch: false,
          gamepad: true
        }
      })
    );
  }, [width, height, vizualizatorEl]);
  return <div id="display-el"></div>;
};

export default Visualizator;
