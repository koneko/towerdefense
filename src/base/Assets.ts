import * as PIXI from "pixi.js";
import { MissionDefinition } from "./Definitions";

export default class Assets {
  public static async LoadAssets() {
    console.log("Loading Texture Assets");
    Assets.ButtonTexture = await PIXI.Assets.load({
      src: "/assets/gui/button_02.png",
    });
    console.log("Loading Missions");
    await this.LoadMissions();
  }

  private static async LoadMissions() {
    Assets.Missions = [
      await this.LoadMission("/assets/missions/mission_01.json"),
    ];
  }

  private static async LoadMission(missionUrl: string) {
    const res = await fetch(missionUrl);
    const mission = await res.json();
    return mission;
  }

  public static ButtonTexture: PIXI.Texture;

  public static Missions: MissionDefinition[];
}
