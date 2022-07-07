import React, {useState, useEffect} from 'react';
import './App.css';

import { Stop, Arrival, Line, Direction } from './Types';
import { fetchBARTArrivals, fetchBARTStops } from './DataRetrieval'

import { HeaderRow } from './Header'
import { Map } from './Map';
import { SelectStop } from './Select';
import { Filter, filterArrivals_LineAndDirection as filterArrivals } from './Filtering'
import { Arrivals } from './Arrivals'


const REFRESH_TIME = 120000; // 2 mins  
const excludedStops = ['OAKL']

export default function App() {
    const [stop, setStop] = useState<Stop>();
    const [lastUpdateTime, setUpdateTime] = useState<Date>();
    const [arrivalList, setArrivals] = useState<Arrival[]>([]);

    const [filteredLines, setFilteredLines] = useState<Line[]>([]);
    const [filteredDirections, setFilteredDirections] = useState<Direction[]>([]);

    const [stops, setStops] = useState<Stop[]>([]);

    const [mapCenter, setMapCenter] = useState<[number, number]>([37.77, -122.356]);
    const [mapZoom, setMapZoom] = useState(11);

    function fetchArrivals(stop : Stop | undefined) { 
        if (stop)
            fetchBARTArrivals(stop, setArrivals, setUpdateTime, setStop);
    }

    function fetchStops() {
        fetchBARTStops(setStops, excludedStops);
    }


    useEffect(() => {
        fetchStops();
        // fetchArrivals(stop);
        const interval = setInterval(() => {
          setUpdateTime(new Date(Date.now()));
          fetchArrivals(stop);
        }, REFRESH_TIME);
    
        return () => clearInterval(interval);
      }, [stop])

    return (
        <div id="app">
            <header>
                <p style={{fontSize: '24px', fontWeight: 'bold', margin: 0, padding: 0}}>BART Arrivals 🚊 🌃</p>
                <HeaderRow stop={stop} lastUpdateTime={lastUpdateTime} fetchArrivals={fetchArrivals}></HeaderRow>
                <Map center={mapCenter} zoom={mapZoom} stops={stops} fetchArrivals={fetchArrivals}></Map>
                <SelectStop stops={stops} fetchArrivals={fetchArrivals} setMapCenter={setMapCenter} setMapZoom={setMapZoom}></SelectStop>
                <Filter stop={stop} arrivals={arrivalList} filteredLines={filteredLines} filteredDirections={filteredDirections} setFilteredLines={setFilteredLines} setFilteredDirections={setFilteredDirections}></Filter>
                <Arrivals arrivals={filterArrivals(arrivalList, filteredLines, filteredDirections)}></Arrivals>
            </header>
        </div>
      )

    
}

