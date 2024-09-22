import * as PIXI from "pixi.js";
import { Game } from "./classes/Game.ts";
import { SceneType } from "./classes/Scenes.ts";
(async () => {
  const app = new PIXI.Application();
  await app.init({
    width: 640,
    height: 360,
    resizeTo: document.body,
    backgroundColor: "white",
  });

  document.body.appendChild(app.canvas);
  globalThis.Game = new Game(SceneType.MainMenu);
})();
