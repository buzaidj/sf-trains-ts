import { Arrival } from './Types'
import './App.css'
import { lineStyle_arrivals } from './Helpers'

type ArrivalProps = {
    arrivals: Arrival[];
}


type MinsProps = {
    mins: number;
}

function Mins({mins} : MinsProps) {
    switch (mins) {
        case 0:
          return <p className='mins'>Leaving <span className='arrivingNow'>now</span></p>;
        case 1:
          return <p className='mins'><span className='minsNum'>{mins}</span> min away</p>;
        default:
          return <p className='mins'><span className='minsNum'>{mins}</span> mins away</p>;
      }
}

/** Returns a row for a given arrival with props mins 
 * (an integer), lineCode (e.g. N), lineName (e.g. Judah) 
 * and direction (e.g. outbound) */
 function ArrivalRow(props : Arrival) {
    return <div className='ArrivalRow'>
      <Mins mins={props.mins}></Mins>
      <i style={lineStyle_arrivals(props.line)} className='lineIcon'>{props.line.lineCode}</i>
      <p className='lineName'>{props.destination}</p>
      <p className='direction'>{props.direction}</p>
    </div>;
}

/** A display of arriving trains */
export function Arrivals({arrivals} : ArrivalProps) {
    return <ul className='Arrivals'>{arrivals.map(
      (arr) => <li>{ArrivalRow(arr)}</li>
    )}</ul>
}


