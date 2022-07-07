import { Stop } from './Types'
import { InfoDialog } from './Info'
import { toTimeStr } from './Helpers'
import RefreshIcon from '@mui/icons-material/Refresh';

type UpcomingHeaderProps = {
    stop: Stop | undefined;
    lastUpdateTime: Date | undefined;
}

function UpcomingHeaderRow({stop, lastUpdateTime} : UpcomingHeaderProps) { 
    if (!stop || !lastUpdateTime)
        return <p>Select a station on the map or dropdown to get started!</p>
    else
        return <p>
          Upcoming trains/buses at
          <span className='bold'> {stop.label}</span>.
          Last updated at {toTimeStr(lastUpdateTime)}.
        </p>
}

type HeaderProps = { 
    stop: Stop | undefined;
    lastUpdateTime: Date | undefined;
    fetchArrivals: (a: Stop) => void;
}

export function HeaderRow({stop, lastUpdateTime, fetchArrivals} : HeaderProps) { 
    return <div className='Header'>
    <UpcomingHeaderRow stop={stop} lastUpdateTime={lastUpdateTime}></UpcomingHeaderRow>
    <div className='refresh'>
      <InfoDialog></InfoDialog>
      {/* <button className='buttonHeader' onClick={() => { FetchData(stop); }}><InfoOutlinedIcon></InfoOutlinedIcon></button> */}
      <button className='buttonHeader' onMouseOver={() => { 
        if (stop) fetchArrivals(stop); 
        }}><RefreshIcon></RefreshIcon></button>
    </div>
  </div>

}