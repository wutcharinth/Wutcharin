/** Tiny event bridge so any surface can open the ⌘K console. */
const EVENT = 'console:open';

export function openConsole() {
    window.dispatchEvent(new CustomEvent(EVENT));
}

export function onConsoleOpen(fn: () => void) {
    window.addEventListener(EVENT, fn);
    return () => window.removeEventListener(EVENT, fn);
}

export const isMac = () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
