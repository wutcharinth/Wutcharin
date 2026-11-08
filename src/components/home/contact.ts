export const EMAIL = 'wutcharin.th@gmail.com';
export const LINKEDIN = 'https://www.linkedin.com/in/Wutcharin';
export const GITHUB = 'https://github.com/wutcharinth';
export const RESUME = '/Wutcharin_CV_2026.pdf';

const SUBJECT = 'Introduction via wutcharin.com';
const BODY = ['Hi Wutcharin,', '', 'I am [name], [role] at [company].', 'I would like to talk about [topic].', '', 'Thanks,', '[name]'].join('\n');

const q = (o: Record<string, string>) =>
    Object.entries(o)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join('&');

/** Default mail app. Does nothing on machines with no mail handler set. */
export const INTRO_MAILTO = `mailto:${EMAIL}?${q({ subject: SUBJECT, body: BODY })}`;
/** Web compose links: work without any local mail app. */
export const INTRO_GMAIL = `https://mail.google.com/mail/?${q({ view: 'cm', fs: '1', to: EMAIL, su: SUBJECT, body: BODY })}`;
export const INTRO_OUTLOOK = `https://outlook.office.com/mail/deeplink/compose?${q({ to: EMAIL, subject: SUBJECT, body: BODY })}`;

export async function copyEmail() {
    try {
        await navigator.clipboard.writeText(EMAIL);
        return true;
    } catch {
        return false;
    }
}
