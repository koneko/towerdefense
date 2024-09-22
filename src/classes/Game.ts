import { Renderer } from "./Renderer.ts";
import { BaseScene, SceneType, makeSceneFromType } from "./Scenes.ts";

export class Game {
  public Renderer: Renderer;
  public currentScene: BaseScene;
  constructor(sceneType: SceneType) {
    this.Renderer = new Renderer();
    this.changeScene(sceneType);
  }
  changeScene(sceneType): void {
    if (this.currentScene != undefined) this.currentScene.destroy();
    this.currentScene = makeSceneFromType(sceneType);
  }
}
