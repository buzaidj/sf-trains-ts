import './App.css'

import { IconStyle, Line, Direction, FilteringStyleFxn, Arrival, Stop } from './Types';

// functions to style BART line icons

/**
 * Creates a style js object of a background color and a text color,
 * which is white by default
 * 
 * Used for icon styling
 * 
 * @param backgroundColor 
 * @param textColor 
 * @returns a style object
 */
function style(backgroundColor: string, textColor: string = 'white'):IconStyle {
    return {
        backgroundColor: backgroundColor,
        color: textColor
    }
}

/**
 * @param s String to capitalize
 * @returns String capitalized
 */
export function capitalize(s: string) : string {
    const lower = s.toLowerCase();
    return s.charAt(0).toUpperCase() + lower.slice(1);
}

/** styles arrivals for a line  */
export function lineStyle_arrivals(line: Line) : IconStyle {
    return style(line.hexColor);
}

/** Styling  */
export const lineStyle_filtering : FilteringStyleFxn<Line> = function (filteredLines, line ) {
    if (filteredLines && !filteredLines.includes(line)) {
        return style(line.hexColor);
    }
    else {
        return { 'backgroundColor': 'gray', 'color': 'lightgray' };
    }
}

export const directionStyle_filtering : FilteringStyleFxn<Direction> = function (filteredDirections, direction){
    if (filteredDirections && !filteredDirections.includes(direction)) {
        return {'backgroundColor': 'black', 'color': 'white'};
    }
    else {
        return { 'backgroundColor': 'gray', 'color': 'lightgray' };
    }
}
    
// mapping BART data to number

/**
 * 
 * @param mins mins as retrived from the bart API
 * @returns a number representing that amount of mins
 */
export function minsFromBART(mins : string) : number {
    switch (mins.toLowerCase()) { 
        case "leaving":
            return 0;
        default:
            return parseInt(mins)? parseInt(mins): -1;
    }
}

function removeDupLines(lines: Line[]): Line[] {
    const lineCodes = new Set<string>();
    const res = [];
    for (const line of lines) {
        if (!lineCodes.has(line.lineCode)) {
            lineCodes.add(line.lineCode);
            res.push(line)
        }
    }

    return res;
}

/**
 * Map arrivals to line attributes and sort them for filtering 
 */
export function arrivalsToLineAttrs(arrivals: Arrival[]) : Line[] {
    return removeDupLines(arrivals
            .map(arr => arr.line)
            .sort((a, b) => a.lineCode.localeCompare(b.lineCode)));
}

/**
 * Map arrivals to direction attributes and sort them for filtering
 */
export function arrivalsToDirectionAttrs(arrivals: Arrival[]) : Direction[] {
    return Array.from(
        new Set(
            arrivals
                .map(arr => arr.direction)
                .sort((a, b) => a.localeCompare(b))
        ).values()
    );
}

/**
 * Returns a date as a time for the app header
 * 
 * @param date 
 * @returns 
 */
export function toTimeStr(date : Date) { return new Date(date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) }
