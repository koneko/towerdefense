import MainMenu from "../scenes/MainMenu";
import MissionMenuSelect from "../scenes/MissionSelectMenu";
import GameObject from "./GameObject";
import * as PIXI from "pixi.js";

export default class Game extends GameObject {
  private _currentScene: GameObject | null = null;

  constructor(bounds: PIXI.Rectangle) {
    super(bounds);
    this.onMainMenu();
  }

  private onMainMenu() {
    const mainScene = new MainMenu(this.bounds);
    mainScene.events.on("newGame", this.onNewGame);
    mainScene.events.on("settings", this.onSettings);
    this.setScene(mainScene);
  }

  private onNewGame = () => {
    console.log("New Game");
    const missionSelectScene = new MissionMenuSelect(this.bounds);
    missionSelectScene.events.on("mission", (mission) => {
      console.log("Mission selected", mission);
    });
    missionSelectScene.events.on("back", () => {
      this.onMainMenu();
    });
    this.setScene(missionSelectScene);
  };

  private onSettings = () => {
    console.log("Settings");
  };

  private setScene(scene: GameObject) {
    if (this._currentScene) {
      this.container.removeChild(this._currentScene.container);
    }
    this._currentScene = scene;
    this.container.addChild(scene.container);
    this.drawScene();
  }

  protected triggerBoundsChanged(): void {
    this.drawScene();
  }

  private drawScene() {
    if (this._currentScene) {
      this._currentScene.setBounds(0, 0, this.bounds.width, this.bounds.height);
    }
  }
}
