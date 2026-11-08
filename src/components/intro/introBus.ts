/** Event bridge so any "Request an intro" control opens the intro panel. */
const EVENT = 'intro:open';

export function openIntro() {
    window.dispatchEvent(new CustomEvent(EVENT));
}

export function onIntroOpen(fn: () => void) {
    window.addEventListener(EVENT, fn);
    return () => window.removeEventListener(EVENT, fn);
}
