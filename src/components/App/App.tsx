import React, { useState } from "react";
import "./App.scss";
import styled from "styled-components";
import { Link, Redirect, Route, useHistory } from "react-router-dom";
import Visualizator from "../Visualizator/Visualizator";
import MapMenu from "../MapMenu/MapMenu";
import config from "../../config/infos.json";
import { LoadJSON } from "../../data/LoadJSON";

const ButtonToIsometric = styled.button`
  top: 1em;
  right: 1em;
`;
const ButtonToMapSelector = styled.button`
  top: 1em;
  left: 1em;
`;

const pathToFiles = "./data/";

const ROUTES = {
  ROOT: "/",
  MAP: "/map",
  ISOMETRIC: "/isometric"
};

type Props = {};

export default function App(props: Props) {
  const [mapData, setMapData] = useState<JSON>();
  const history = useHistory();

  console.log({ history });

  const IfVisualizator = (props: { data: JSON | undefined }) => {
    if (props.data) {
      return <Visualizator mapData={props.data}></Visualizator>;
    } else {
      return <></>;
    }
  };

  const handleMapMenuClick = (file: string) => {
    const loadJSON = new LoadJSON(pathToFiles + file);
    loadJSON.load(onLoadComplete, onLoadError);
  };

  const onLoadError = (message: string) => {};

  const onLoadComplete = (data: JSON) => {
    setMapData((prev) => {
      if (prev !== data) {
        return data;
      }
    });
    history.push(ROUTES.ISOMETRIC);
  };

  return (
    <>
      <Route exact path={ROUTES.ROOT}>
        <Redirect to={ROUTES.MAP} />
      </Route>
      <Route exact path={ROUTES.MAP}>
        <Link to={ROUTES.ISOMETRIC}>
          <ButtonToIsometric className="switch-view">
            Isometric 3d View &gt;
          </ButtonToIsometric>
        </Link>
        <MapMenu areas={config} onClickCallback={handleMapMenuClick}></MapMenu>
      </Route>
      <Route exact path={ROUTES.ISOMETRIC}>
        <Link to={ROUTES.MAP}>
          <ButtonToMapSelector className="switch-view inverted">
            &lt; Map
          </ButtonToMapSelector>
        </Link>
        <IfVisualizator data={mapData}></IfVisualizator>
      </Route>
    </>
  );
}
