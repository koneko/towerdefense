import * as PIXI from "pixi.js";
import Game from "./base/Game";
(async () => {
  const app = new PIXI.Application();
  await app.init({
    width: 640,
    height: 360,
    resizeTo: document.body,
    backgroundColor: "white",
  });

  document.body.appendChild(app.canvas);
  const game = new Game(app.screen);
  app.stage.addChild(game.container);
  window.addEventListener("resize", () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    game.setBounds(0, 0, app.screen.width, app.screen.height);
  });
})();
