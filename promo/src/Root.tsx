import { Composition, Folder } from "remotion";
import { SanguAd } from "./SanguAd";
import { withBackdrop } from "./components/Backdrop";
import { HookScene } from "./scenes/HookScene";
import { BrandScene } from "./scenes/BrandScene";
import { DailyScene } from "./scenes/DailyScene";
import { VoiceScene } from "./scenes/VoiceScene";
import { ScanScene } from "./scenes/ScanScene";
import { RecapScene } from "./scenes/RecapScene";
import { PrivacyScene } from "./scenes/PrivacyScene";
import { CtaScene } from "./scenes/CtaScene";
import { SanguFilm } from "./film/SanguFilm";
import { F1Opening } from "./film/scenes/F1Opening";
import { F2Logo } from "./film/scenes/F2Logo";
import { F3Intro } from "./film/scenes/F3Intro";
import { F4Wall } from "./film/scenes/F4Wall";
import { F5Daily } from "./film/scenes/F5Daily";
import { F6Neon } from "./film/scenes/F6Neon";
import { F7Features } from "./film/scenes/F7Features";
import { F8Privacy } from "./film/scenes/F8Privacy";
import { F9Words } from "./film/scenes/F9Words";
import { F10End } from "./film/scenes/F10End";
import { SanguNight } from "./night/SanguNight";
import { N1Hook } from "./night/scenes/N1Hook";
import { N2Logo } from "./night/scenes/N2Logo";
import { N3Daily } from "./night/scenes/N3Daily";
import { N4Voice } from "./night/scenes/N4Voice";
import { N5Neon } from "./night/scenes/N5Neon";
import { N6Privacy } from "./night/scenes/N6Privacy";
import { N7End } from "./night/scenes/N7End";

const Hook = withBackdrop(HookScene);
const Brand = withBackdrop(BrandScene);
const Daily = withBackdrop(DailyScene);
const Voice = withBackdrop(VoiceScene);
const Scan = withBackdrop(ScanScene);
const Recap = withBackdrop(RecapScene);
const Privacy = withBackdrop(PrivacyScene);
const Cta = withBackdrop(CtaScene);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="SanguNight" component={SanguNight} durationInFrames={1075} fps={30} width={1920} height={1080} />
      <Folder name="SanguNight-Scenes">
        <Composition id="N1-Hook" component={N1Hook} durationInFrames={210} fps={30} width={1920} height={1080} />
        <Composition id="N2-Logo" component={N2Logo} durationInFrames={90} fps={30} width={1920} height={1080} />
        <Composition id="N3-Jatah" component={N3Daily} durationInFrames={165} fps={30} width={1920} height={1080} />
        <Composition id="N4-Catat" component={N4Voice} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="N5-Neon" component={N5Neon} durationInFrames={140} fps={30} width={1920} height={1080} />
        <Composition id="N6-Privasi" component={N6Privacy} durationInFrames={160} fps={30} width={1920} height={1080} />
        <Composition id="N7-Penutup" component={N7End} durationInFrames={130} fps={30} width={1920} height={1080} />
      </Folder>
      <Composition id="SanguAd" component={SanguAd} durationInFrames={900} fps={30} width={1080} height={1920} />
      <Folder name="SanguAd-Scenes">
        <Composition id="Hook" component={Hook} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="Brand" component={Brand} durationInFrames={90} fps={30} width={1080} height={1920} />
        <Composition id="Daily" component={Daily} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Voice" component={Voice} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Scan" component={Scan} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="Recap" component={Recap} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Privacy" component={Privacy} durationInFrames={105} fps={30} width={1080} height={1920} />
        <Composition id="Cta" component={Cta} durationInFrames={120} fps={30} width={1080} height={1920} />
      </Folder>
      <Composition id="SanguFilm" component={SanguFilm} durationInFrames={1023} fps={30} width={1920} height={1080} />
      <Folder name="SanguFilm-Scenes">
        <Composition id="F1-Pembuka" component={F1Opening} durationInFrames={132} fps={30} width={1920} height={1080} />
        <Composition id="F2-Logo" component={F2Logo} durationInFrames={84} fps={30} width={1920} height={1080} />
        <Composition id="F3-Perkenalan" component={F3Intro} durationInFrames={120} fps={30} width={1920} height={1080} />
        <Composition id="F4-Dinding" component={F4Wall} durationInFrames={96} fps={30} width={1920} height={1080} />
        <Composition id="F5-Jatah" component={F5Daily} durationInFrames={120} fps={30} width={1920} height={1080} />
        <Composition id="F6-Neon" component={F6Neon} durationInFrames={120} fps={30} width={1920} height={1080} />
        <Composition id="F7-Fitur" component={F7Features} durationInFrames={120} fps={30} width={1920} height={1080} />
        <Composition id="F8-Privasi" component={F8Privacy} durationInFrames={102} fps={30} width={1920} height={1080} />
        <Composition id="F9-Kata" component={F9Words} durationInFrames={132} fps={30} width={1920} height={1080} />
        <Composition id="F10-Penutup" component={F10End} durationInFrames={105} fps={30} width={1920} height={1080} />
      </Folder>
    </>
  );
};
