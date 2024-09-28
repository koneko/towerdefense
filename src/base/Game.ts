import MainMenu from "../scenes/MainMenu";
import MissionMenuSelect from "../scenes/MissionSelectMenu";
import GameScene from "../scenes/GameScene";
import GameObject from "./GameObject";
import * as PIXI from "pixi.js";
import Scene from "../scenes/Base";

export default class Game extends GameObject {
  private _currentScene: Scene | null = null;
  public ticker: PIXI.Ticker | null = null;

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
      this.setScene(new GameScene(this.bounds));
    });
    missionSelectScene.events.on("back", () => {
      this.onMainMenu();
    });
    this.setScene(missionSelectScene);
  };

  private onSettings = () => {
    console.log("Settings");
  };

  private setScene(scene: Scene) {
    if (this._currentScene) {
      this.container.removeChild(this._currentScene.container);
    }
    this._currentScene = scene;
    console.log(this._currentScene.constructor);
    this.container.addChild(scene.container);
    if (this._currentScene.constructor.name == "GameScene") {
      // dont change GameScene name XD
      this.ticker = new PIXI.Ticker();
      this.ticker.maxFPS = 60;
      this.ticker.minFPS = 30;
      this.ticker.add(this.update);
      console.log(this._currentScene);
      this.ticker.start();
    } else {
      if (this.ticker != null) {
        this.ticker.stop();
        this.ticker.destroy();
      }
    }
  }

  private update(time) {
    this._currentScene.update();
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
