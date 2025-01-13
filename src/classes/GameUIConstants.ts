import * as PIXI from 'pixi.js';
import { Engine } from './Bastion';
export default class GameUIConstants {
    public static SidebarRect;
    public static ChangeRoundButtonRect;
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
