import * as PIXI from 'pixi.js';
import { Engine } from './Bastion';
export default class GameUIConstants {
    public static SidebarRect: PIXI.Rectangle;
    public static ChangeRoundButtonRect: PIXI.Rectangle;
    public static MaximumPlayerNameLength = 20;

    public static init() {
        GameUIConstants.SidebarRect = new PIXI.Rectangle(
            Engine.app.canvas.width - 360,
            0,
            360,
            Engine.app.canvas.height
        );
        GameUIConstants.ChangeRoundButtonRect = new PIXI.Rectangle(50, Engine.app.canvas.height - 100, 310, 100);
    }
}
