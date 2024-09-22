import * as PIXI from "pixi.js";

export default class Assets {
  public static async LoadAssets() {
    Assets.ButtonTexture = await PIXI.Assets.load({
      src: "/assets/gui/button_02.png",
    });
  }

  public static ButtonTexture: PIXI.Texture;
}
