import React, { useState } from 'react'
import { Arrival, Direction, Line, Stop, FilteringStyleFxn} from './Types'
import { lineStyle_filtering, directionStyle_filtering, arrivalsToLineAttrs, arrivalsToDirectionAttrs } from './Helpers'
import './App.css';


// the filtering menu is compised of filtering buttons that gray out/become colored again when clicked 

/**
 * filterButtonClick controls the React hook logic for changing the 
 * currenently filtered attributes when a button is clicked
 * 
 * This doesn't change the arrivals that are shown that is done seperately in the arrivals logic with another filteirng function
 * 
 * examples of such attributes are direction or line color
 * i.e. if someone only wants the yellow line north
 * 
 * @param filteredAttrs 
 * @param setFilteredAttrs 
 * @param attrClicked 
 */
function filterButtonClick<T>(filteredAttrs : T[], setFilteredAttrs : (a : T[]) => void, attrClicked : T) {
    if (!filteredAttrs.includes(attrClicked)) {
        // attrClicked is not the filtered attrs, add it 
        setFilteredAttrs(filteredAttrs.concat([attrClicked]));
    }
    else {
        // attrClicked is in the filtered attrs, remove it
        setFilteredAttrs(filteredAttrs.filter((v, _) => v !== attrClicked));
    }
}

type FilterSelectorProp<T> = {
    allAttributes : T[]; // set of all attrs
    filteredAttrs : T[]; // currently filtered "in" attrs
    setFilteredAttrs: (a: T[]) => void;

    // how to display attributes 
    attrCSSClass: string; 
    filterStyle: FilteringStyleFxn<T>;
    displaySelector: (a: T) => string;
}

/**
 * Selector in the filtering menu for particular attributes 
 * that are grouped together and can be clicked to 
 * filter the attribute out/in
 */
function FilterSelector<T>(props : FilterSelectorProp<T>) {
    return <div>
        {
            props.allAttributes.map(
                (attr) => { 
                    return <i 
                        style={props.filterStyle(props.filteredAttrs, attr)}
                        className = {props.attrCSSClass} 
                        onClick = {
                            () => filterButtonClick(props.filteredAttrs, props.setFilteredAttrs, attr)
                        }>
                            {props.displaySelector(attr)}
                        </i> 
                }
            )
        }
    </div>
}

type FilterSelectorsProp = {
    arrivals: Arrival[];
    filteredLines: Line[];
    setFilteredLines: (a : Line[]) => void;
    filteredDirections: Direction[];
    setFilteredDirections: (a : Direction[]) => void;
}

type Filter = FilterSelectorsProp & {
    stop: Stop | undefined;
}

/** Filtering menu for lines and direction */
function FilterSelectors_LineAndDirection(props: FilterSelectorsProp) {
    const lineAttrs = arrivalsToLineAttrs(props.arrivals);
    const directionAttrs = arrivalsToDirectionAttrs(props.arrivals)

    return <div className='FilterLinesAndDir'>
        <div className='Filtering'>
            <p style={{marginRight: '0.75rem'}}>Lines:</p>
            <FilterSelector<Line>
                allAttributes={lineAttrs}
                filteredAttrs={props.filteredLines}
                setFilteredAttrs={props.setFilteredLines}
                attrCSSClass='lineIconFilter'
                filterStyle={lineStyle_filtering}
                displaySelector={a => a.lineCode}
            ></FilterSelector>
        </div>
        <div className='Filtering'>
            <p style={{marginRight: '0.75rem'}}>Directions:</p>
            <FilterSelector<Direction>
                allAttributes={directionAttrs}
                filteredAttrs={props.filteredDirections}
                setFilteredAttrs={props.setFilteredDirections}
                attrCSSClass='directionIconFilter'
                filterStyle={directionStyle_filtering}
                displaySelector={a => a}
            ></FilterSelector>
        </div>
    </div>
}

export function Filter(props: Filter) {
    if (props.stop) {
        return <FilterSelectors_LineAndDirection arrivals={props.arrivals} filteredLines={props.filteredLines} filteredDirections={props.filteredDirections} setFilteredLines={props.setFilteredLines} setFilteredDirections={props.setFilteredDirections}></FilterSelectors_LineAndDirection>
    }
    else {
        return <div></div>
    }
}

/**
 * Recall filtering filters out rather than filters in in this case
 * @param arrivals 
 */
export function filterArrivals_LineAndDirection(arrivals: Arrival[], filteredLines: Line[], filteredDirections: Direction[]) : Arrival[]{
    return arrivals.filter(arr => !filteredLines.map(x => x.lineCode).includes(arr.line.lineCode) && !filteredDirections.includes(arr.direction));
}

