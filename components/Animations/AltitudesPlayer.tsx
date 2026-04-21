"use client";

import { Player } from "@remotion/player";
import { AltitudesAnim } from "./AltitudesAnim";

export default function AltitudesPlayer() {
  return (
    <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 40px rgba(11,20,40,0.5)" }}>
      <Player
        component={AltitudesAnim}
        compositionWidth={1280}
        compositionHeight={720}
        durationInFrames={165}
        fps={30}
        style={{ width: "100%", aspectRatio: "16/9" }}
        autoPlay
        controls
        loop
        clickToPlay
        showVolumeControls={false}
      />
    </div>
  );
}
