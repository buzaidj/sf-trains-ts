// @ts-nocheck

import 'leaflet/dist/leaflet.css';
import { MapContainer } from 'react-leaflet/MapContainer';
import { TileLayer } from 'react-leaflet/TileLayer';
import { useMap } from 'react-leaflet/hooks';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Stop} from './Types'

function ChangeViewMap({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

function MarkerFromStop(props) {
    return <Marker position={props.stop.location} icon={new Icon({ iconUrl: markerIconPng })}>
        <Popup closeOnClick={true}>
            {props.stop.label} <br />
            <button style={{ textDecoration: 'underline' }} onClick={
                () => {
                    props.FetchData(props.stop);
                }
            }>Select this stop</button>
        </Popup>
    </Marker>
}

function MarkersFromStops(props) {
    var markers = [];
    for (var stop of props.stops) {
        markers.push(<MarkerFromStop stop={stop} FetchData={props.FetchData}></MarkerFromStop>);
    }
    return <div>{markers}</div>
}

type MapProps = {
    center: [number, number],
    zoom: number,
    stops: Stop[];
    fetchArrivals: (a: Stop) => void;
}


export function Map(props : MapProps) {
    const center = props.center;
    const zoom = props.zoom;
    const stops = props.stops;
    const fetchArrivals = props.fetchArrivals;
    return (
        <MapContainer className="Map" center={center} zoom={zoom} scrollWheelZoom={false}>
            <ChangeViewMap center={center} zoom={zoom} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <div>
                <MarkersFromStops stops={stops} FetchData={fetchArrivals}></MarkersFromStops>
            </div>
        </MapContainer>
    )
}
