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
    </>
  );
};
