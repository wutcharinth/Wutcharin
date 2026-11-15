/**
 * The automation figures the home page cites in more than one place
 * (the hero instrument and the Proof chapter). One source, so they agree.
 */
export const HOURS_PER_YEAR = 15000;

/**
 * Share of the yearly hours, by kind of automation (percent, sums to 100).
 * The optional third entry names what a kind replaces, e.g. traditional RPA
 * moving to agentic controlled automation.
 */
export const AUTOMATION_MIX: Array<[string, number, string?]> = [
    ['Collections ML', 40],
    ['Agentic controlled automation', 28, 'RPA'],
    ['AI agents', 22],
    ['Dashboards', 10],
];
