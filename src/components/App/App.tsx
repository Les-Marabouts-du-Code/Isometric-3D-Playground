import React, { useState, useEffect, useCallback } from 'react';
import './App.scss';
import styled from 'styled-components';
import Visualizator from '../Visualizator/Visualizator';
import MapMenu from '../MapMenu/MapMenu';
import config from '../../config/infos.json';
import { LoadJSON } from '../../data/LoadJSON';

const ButtonToIsometric = styled.button`
  top: 1em;
  right: 1em;
`;
const ButtonToMapSelector = styled.button`
  top: 1em;
  left: 1em;
`;

const pathToFiles = './data/';

type Props = {};

export default function App(props: Props) {
  const [activeFile, setActiveFile] = useState();
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [mapData, setMapData] = useState<JSON>();
  const [displayMapMenu, setDisplayMapMenu] = useState(false);
  const [mapVisits, setMapVisits] = useState(0);

  const IfVisualizator = (props: { data: JSON | undefined }) => {
    if (props.data) {
      return <Visualizator mapData={props.data}></Visualizator>;
    } else {
      return <></>;
    }
  };

  const handleMapMenuClick = useCallback(file => {
    setActiveFile(file);
    setDisplayMapMenu(false);
  }, []);

  const onLoadError = (message: string) => {};

  const onLoadComplete = (data: JSON) => {
    setMapData(prev => {
      if (prev !== data) {
        return data;
      }
    });
  };

  useEffect(() => {
    if (displayMapMenu) {
      return () => {
        setMapVisits(mapVisits + 1);
      };
    }
  }, [displayMapMenu, mapVisits]);

  useEffect(() => {
    if (typeof activeFile !== 'undefined') {
      const loadJSON = new LoadJSON(pathToFiles + activeFile);
      setMapData(undefined);
      loadJSON.load(onLoadComplete, onLoadError);
    }
  }, [activeFile]);

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
          <IfVisualizator data={mapData}></IfVisualizator>
        </>
      )}
    </>
  );
}
