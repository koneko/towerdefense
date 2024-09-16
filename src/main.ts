import * as PIXI from "pixi.js";

(async () => {
  const app = new PIXI.Application();
  await app.init({
    width: 640,
    height: 360,
    resizeTo: document.body,
  });

  document.body.appendChild(app.canvas);
})();
