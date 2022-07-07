export type IconStyle = { 
    backgroundColor: string;
    color: string;
}

export type Stop = {
    value: string; // identifier CIVC
    label: string; // station name like Civic Center 
    location: [number, number] | undefined; // lat, long
}

export type Line = {
    lineCode: string;
    hexColor: string;
}

export type Direction = string;

export type Arrival = {
    line: Line; 
    destination: string;
    direction: Direction;
    mins: number;

}

/**
 * type for styling filtered attrs depending on whether they are selected or not
 */
export type FilteringStyleFxn<T> = (filteredLines: T[], attr: T) => IconStyle;
