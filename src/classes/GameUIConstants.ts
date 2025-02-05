import * as PIXI from 'pixi.js';
import { Engine } from './Bastion';
export default class GameUIConstants {
    public static SidebarRect: PIXI.Rectangle;
    public static ChangeRoundButtonRect: PIXI.Rectangle;
    public static EndGameDialogRect: PIXI.Rectangle;

    public static init() {
        GameUIConstants.SidebarRect = new PIXI.Rectangle(
            Engine.app.canvas.width - 360,
            0,
            360,
            Engine.app.canvas.height
        );
        GameUIConstants.ChangeRoundButtonRect = new PIXI.Rectangle(50, Engine.app.canvas.height - 100, 310, 100);
        const endGameDialogWidth = 600;
        const endGameDialogHeight = 800;
        GameUIConstants.EndGameDialogRect = new PIXI.Rectangle(
            (Engine.app.canvas.width - endGameDialogWidth) / 2,
            (Engine.app.canvas.height - endGameDialogHeight) / 2,
            endGameDialogWidth,
            endGameDialogHeight
        );
    }
}
