/** The home story, in order. Section ids are the anchors every nav uses. */
export const CHAPTERS = [
    { id: 'top', index: '00', name: 'Arrival' },
    { id: 'proof', index: '01', name: 'Proof' },
    { id: 'principle', index: '02', name: 'Principle' },
    { id: 'work', index: '03', name: 'Work' },
    { id: 'path', index: '04', name: 'Path' },
    { id: 'contact', index: '05', name: 'Connect' },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]['id'];
