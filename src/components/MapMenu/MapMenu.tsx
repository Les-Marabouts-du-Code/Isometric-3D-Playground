import React from 'react';
import { TileLayer, Rectangle, PathProps } from 'react-leaflet';
import {
  LatLngLiteral,
  LatLngBoundsExpression,
  LeafletEvent,
  DragEndEvent
} from 'leaflet';
import CustomMap from '../CustomMap/CustomMap';

interface IMapArea {
  latitude: number;
  longitude: number;
  width: number;
  height: number;
}

interface IMapAreaFile extends IMapArea {
  file: string;
}

interface IMapInitialSettings extends LatLngLiteral {
  zoom: number;
}

type MapMenuProps = {
  lat?: number;
  lng?: number;
  areas: IMapAreaFile[];
  onClickCallback: (file: string) => void;
};

const defaultPosition: LatLngLiteral = {
  lat: 51.5,
  lng: -0.09
};
const defaultZoom: number = 5

const getBoundsFromMapArea = (area: IMapArea): LatLngBoundsExpression => {
  return [
    [area.latitude, area.longitude],
    [area.latitude - area.height, area.longitude + area.width]
  ];
};

const getMapInitialSettings = (): IMapInitialSettings => {
  const mapSettingsString: string = localStorage.getItem('mapSettings') || ''
  let mapSettings: IMapInitialSettings
  try {
    mapSettings = JSON.parse(mapSettingsString)
  } catch(e) {
    mapSettings = {
      zoom: defaultZoom, 
      ...defaultPosition, 
    }
  }
  return mapSettings
}

const storeMapCurrentSettings = (settings: IMapInitialSettings) => {
  localStorage.setItem('mapSettings', JSON.stringify(settings))
}

export default function MapMenu(props: MapMenuProps) {
  const { zoom: initialZoom, ...initialPosition } = getMapInitialSettings()

  const pathProps: PathProps = {
    fillColor: '#ffffff',
    stroke: true,
    weight: 4,
    color: '#d03030'
  };

  const onClick = (file: string) => () => {
    props.onClickCallback(file);
  };

  const onMapSettingsUpdate = (event: LeafletEvent | DragEndEvent) => {
    storeMapCurrentSettings({
      zoom: event.target._zoom, 
      ...event.target._renderer._center
    })
  };

  return (
    <>
      <CustomMap
        className="map-component"
        center={initialPosition}
        zoom={initialZoom}
        onzoomend={onMapSettingsUpdate}
        ondragend={onMapSettingsUpdate}
      >
        {props.areas.map((area, index) => (
          <Rectangle
            key={`rectangle_${index}`}
            bounds={getBoundsFromMapArea(area)}
            {...pathProps}
            onClick={onClick(area.file)}
          ></Rectangle>
        ))}
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </CustomMap>
    </>
  );
}
