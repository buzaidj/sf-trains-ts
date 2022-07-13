// @ts-nocheck

/* this file is for the dropdown select menu */

import './App.css'
import Select, { ActionMeta }  from 'react-select'
import { Stop } from './Types'

function onChangeFunction(fetchArrivals, setMapCenter, setMapZoom)
{
    return function onChange(stop, actionMeta) {
        switch (actionMeta.action) {
          case 'select-option':
            fetchArrivals(stop);
            setMapCenter(stop.location);
            setMapZoom(12);
            break;
          default:
            break;
        }
    }
}


export function SelectStop({stops, stop, fetchArrivals, setMapCenter, setMapZoom}) {
    return <Select
        defaultValue={stop}
        id = 'StopSelector'
        options = {stops}
        onChange = {onChangeFunction(fetchArrivals, setMapCenter, setMapZoom)}
    />
}