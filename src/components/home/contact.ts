export const EMAIL = 'wutcharin.th@gmail.com';
export const INTRO_MAILTO = `mailto:${EMAIL}?subject=Introduction%20via%20wutcharin.com`;
export const LINKEDIN = 'https://www.linkedin.com/in/Wutcharin';
export const GITHUB = 'https://github.com/wutcharinth';
export const RESUME = '/Wutcharin_CV_2026.pdf';

export async function copyEmail() {
    try {
        await navigator.clipboard.writeText(EMAIL);
        return true;
    } catch {
        return false;
    }
}
