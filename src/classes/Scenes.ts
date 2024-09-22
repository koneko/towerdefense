import * as PIXI from "pixi.js";

export function makeSceneFromType(type: SceneType) {
  if (type == SceneType.MainMenu) {
    return new MainMenu();
  }
  if (type == SceneType.MissionSelect) {
    return new MissionSelect();
  }
}

export enum SceneType {
  MainMenu,
  MissionSelect,
}

export class BaseScene {
  public type: SceneType = null;
  public destroy(): boolean {
    return true; // return when destroyed
  }
}

export class MainMenu extends BaseScene {
  public type: SceneType = SceneType.MainMenu;
  public;
}

export class MissionSelect extends BaseScene {
  public type: SceneType = SceneType.MissionSelect;
}
