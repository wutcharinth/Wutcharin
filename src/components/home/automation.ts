/**
 * The automation figures the home page cites in more than one place
 * (the hero instrument and the Proof chapter). One source, so they agree.
 */
export const HOURS_PER_YEAR = 15000;

/** Share of the yearly hours, by kind of automation (percent, sums to 100). */
export const AUTOMATION_MIX: Array<[string, number]> = [
    ['Collections ML', 40],
    ['RPA', 28],
    ['AI agents', 22],
    ['Dashboards', 10],
];
