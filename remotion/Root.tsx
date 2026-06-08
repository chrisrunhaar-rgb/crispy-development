import {Composition} from 'remotion';
import {AltitudesAnim} from '../components/Animations/AltitudesAnim';
import {LogoReveal} from '../components/Animations/LogoReveal';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="AltitudesAnim"
        component={AltitudesAnim}
        durationInFrames={165}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="LogoReveal"
        component={LogoReveal}
        durationInFrames={120}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
