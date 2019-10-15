import React, { useState, useEffect, useCallback } from 'react';
import './App.scss';
import styled from 'styled-components';
import Visualizator from '../Visualizator/Visualizator';
import MapMenu from '../MapMenu/MapMenu';
import config from '../../config/infos.json';
import OptionSelector from '../OptionSelector/OptionSelector';

const ButtonToIsometric = styled.button`
  top: 1em;
  right: 1em;
`;
const ButtonToMapSelector = styled.button`
  top: 1em;
  left: 1em;
`;

type Props = {};

export default function App(props: Props) {
  const [activeFile, setActiveFile] = useState(config[0].file);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [mapData, setMapData] = useState<JSON | undefined>(undefined);
  const [displayMapMenu, setDisplayMapMenu] = useState(false);
  const [mapVisits, setMapVisits] = useState(0);

  const handleMapMenuClick = useCallback(file => {
    setActiveFile(file);
    setDisplayMapMenu(false);
  }, []);

  useEffect(() => {
    if (displayMapMenu) {
      return () => {
        setMapVisits(mapVisits + 1);
      };
    }
  }, [displayMapMenu, mapVisits]);

  return (
    <>
      {displayMapMenu && (
        <>
          <ButtonToIsometric
            className="switch-view"
            onClick={() => setDisplayMapMenu(false)}
          >
            Isometric 3d View &gt;
          </ButtonToIsometric>
          <MapMenu
            areas={config}
            onClickCallback={handleMapMenuClick}
          ></MapMenu>
        </>
      )}
      {!displayMapMenu && (
        <>
          <ButtonToMapSelector
            className="switch-view inverted"
            onClick={() => {
              setDisplayMapMenu(true);
            }}
          >
            &lt; Map
          </ButtonToMapSelector>

          <Visualizator mapData={mapData} />
        </>
      )}
    </>
  );
}
