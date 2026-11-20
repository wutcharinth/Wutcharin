/** Projects with a live simulation in the Work chapter. */
export const SIM_IDS = ['pidngod', 'nava-airlines', 'splitbill-ai', 'jongtoh', 'klikr'] as const;

export const hasSim = (id: string) => (SIM_IDS as readonly string[]).includes(id);
