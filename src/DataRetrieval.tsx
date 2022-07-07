import { capitalize, minsFromBART } from "./Helpers"
import {Stop, Arrival} from './Types'

// stored here because it's not that percious
const bartKey = 'QBPD-5Q5V-9L3T-DWEI';

function parseBARTStops(data : any) : Stop[] {
    if (data)
      return data.root.stations.station.map((x : any) => {return Object({
          value: x.abbr,
          label: x.name
      })})
    else 
      throw Error("data is null or undefined");
}

function removeExcludedStops(stops: Stop[], excludedStops: string[]) : Stop[] {
    return stops.filter(s => !excludedStops.includes(s.value));
}

function getBARTStopsLocations(key : string, parsed_stop_data : Stop[], setStops : (a: Stop[]) => void) : void { 
    var stops : Stop[] = [];
    for (const curr_stop of parsed_stop_data) {
          fetch(`http://api.bart.gov/api/stn.aspx?cmd=stninfo&key=${key}&orig=${curr_stop.value}&json=y`)
          .then(res => res.json())
          .then(res => res.root.stations.station)
          .then(x => { curr_stop.location = [parseFloat(x.gtfs_latitude), parseFloat(x.gtfs_longitude)]; stops = stops.concat([curr_stop]); setStops(stops) })
          .catch(error => {console.log(error.message); console.log("Error in getting stops location!");});
    }

}

function fetchBARTStops_key(key : string, setStops : (a : Stop[]) => void, excludedStops: string[]) : void {
    fetch(
        `http://api.bart.gov/api/stn.aspx?cmd=stns&json=y&key=${key}`
    )
        .then(res=>res.json())
        .then(res => parseBARTStops(res))
        .then(res => removeExcludedStops(res, excludedStops))
        .then(parsed => getBARTStopsLocations(key, parsed, setStops))
        .catch(error => {console.log(error.message); alert("Error when retrieving BART stops: " + error.message);});
}

/**
 * reterive BART stops data and set it with the setStops function
 * @param setStops react hook for setting the stops
 */
export function fetchBARTStops(setStops: (a : Stop[]) => void, excludedStops: string[]): void {
    fetchBARTStops_key(bartKey, setStops, excludedStops);
}

function parseBARTArrivals(data: any) : Arrival[] {
    return data?.root.station[0].etd.map(
        (a : any) => a.estimate.map(
          (est : any) => Object(
            {
              line: {
                lineCode: capitalize(est.color),
                hexColor: est.hexcolor
              },
              destination: a.destination,
              direction: capitalize(est.direction),
              mins: minsFromBART(est.minutes)
            }
          )
        )
      ).flat().sort((a : Arrival, b : Arrival) => a.mins - b.mins)
}

function fetchBARTArrivals_key(key: string, stop: Stop, setArrivals : (a: Arrival[]) => void, setUpdateTime: (a: Date) => void, setStop : (a : Stop) => void) : void { 
    if (stop)
      fetch(
        `http://api.bart.gov/api/etd.aspx?cmd=etd&key=${ key }&orig=${ stop.value }&json=y`
      )
        .then(res => res.json())
        .then(res => { 
            setArrivals(parseBARTArrivals(res)); 
            setUpdateTime(new Date(Date.parse(res.root.date + ' ' + res.root.time)))
          })
        .then(() => setStop(stop))
        .catch(error => {console.log(error.message); alert(error.message)});
}

export function fetchBARTArrivals(stop: Stop, setArrivals : (a: Arrival[]) => void, setUpdateTime :  (a: Date) => void, setStop : (a : Stop) => void) : void {
    fetchBARTArrivals_key(bartKey, stop, setArrivals, setUpdateTime, setStop);
}