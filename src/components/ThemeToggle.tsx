import { Sun, Moon } from 'lucide-react';
import { useTheme, toggleTheme } from '../lib/theme';

/**
 * Dark/light switch. Mono-labelled to match the system's control language.
 */
export default function ThemeToggle({ className = '' }: { className?: string }) {
    const theme = useTheme();
    const isLight = theme === 'light';
    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
            data-cursor="toggle"
            className={`group inline-flex items-center justify-center h-8 w-8 rounded-full border border-hairline text-text-mute hover:text-text-strong hover:border-hairline-strong transition-colors cursor-hover ${className}`}
        >
            {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
        </button>
    );
}
