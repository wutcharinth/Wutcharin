declare module 'lenis' {
    export default class Lenis {
        constructor(options?: any);
        raf(time: number): void;
        destroy(): void;
        start(): void;
        stop(): void;
    }
}

declare module 'maath/random/dist/maath-random.esm';
