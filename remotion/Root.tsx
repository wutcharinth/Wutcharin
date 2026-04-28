import { Composition } from 'remotion';
import { MidnightConsole } from './MidnightConsole';

export const RemotionRoot = () => {
    return (
        <Composition
            id="MidnightConsole"
            component={MidnightConsole}
            durationInFrames={360}
            fps={30}
            width={1920}
            height={1080}
        />
    );
};
