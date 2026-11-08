import { useEffect, useState } from 'react';

const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Bangkok',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
});

/** Live Bangkok wall-clock time, "HH:MM", ticking on the minute. */
export function useBangkokTime() {
    const [now, setNow] = useState(() => fmt.format(new Date()));
    useEffect(() => {
        let timer = 0;
        const schedule = () => {
            const ms = 60_000 - (Date.now() % 60_000) + 50;
            timer = window.setTimeout(() => {
                setNow(fmt.format(new Date()));
                schedule();
            }, ms);
        };
        schedule();
        return () => window.clearTimeout(timer);
    }, []);
    return now;
}
