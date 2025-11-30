declare module 'lenis' {
    export default class Lenis {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(options?: any);
        raf(time: number): void;
        destroy(): void;
        start(): void;
        stop(): void;
    }
}

declare module 'maath/random/dist/maath-random.esm';
