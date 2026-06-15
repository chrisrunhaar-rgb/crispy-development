import {Composition} from 'remotion';
import {AltitudesAnim} from '../components/Animations/AltitudesAnim';
import {LogoReveal} from '../components/Animations/LogoReveal';
import {ILChallengePromo} from '../components/Animations/ILChallengePromo';
import {CrossCulturalStatement} from '../components/Animations/CrossCulturalStatement';
import {Day6HumilityPromo} from '../components/Animations/Day6HumilityPromo';
import {ILChallengePromo60} from '../components/Animations/ILChallengePromo60';
import {ModuleRevealReel} from '../components/Animations/ModuleRevealReel';

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
      <Composition
        id="ILChallengePromo"
        component={ILChallengePromo}
        durationInFrames={210}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="CrossCulturalStatement"
        component={CrossCulturalStatement}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="Day6HumilityPromo"
        component={Day6HumilityPromo}
        durationInFrames={695}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="ILChallengePromo60"
        component={ILChallengePromo60}
        durationInFrames={1800}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="ModuleRevealReel"
        component={ModuleRevealReel}
        durationInFrames={890}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          moduleName: 'LEADERSHIP ALTITUDES',
          hookLine: 'Leadership needs altitude.',
          subLine: 'Without it we get stuck in the details.',
          videoFile: 'clips/jungle_aerial_module.mp4',
        }}
      />
    </>
  );
};
