import { Engine } from '../Bastion';
import GameObject from '../GameObject';
import * as PIXI from 'pixi.js';
import { FadeInOut } from './AnimationManager';

export type NotificationType = 'info' | 'warn' | 'danger' | 'reward';

class Notification {
    public textObj: PIXI.Text;
    public ticksToFadeAway: number;
    public animating: boolean = false;
    public destroyed = false;
    constructor(text, type: NotificationType, x, y, ticksToFadeAway) {
        let fill = 0xffffff;
        if (type == 'info') {
            fill = 0x20b3fc;
        } else if (type == 'warn') {
            fill = 0xfcd720;
        } else if (type == 'danger') {
            fill = 0xfc0a0a;
        } else if (type == 'reward') {
            fill = 0xd65afc;
        }
        this.ticksToFadeAway = ticksToFadeAway;
        this.textObj = new PIXI.Text({
            text: text,
            style: new PIXI.TextStyle({
                fill: fill,
                fontSize: 36,
                fontWeight: 'bold',
                dropShadow: true,
                align: 'center',
            }),
            x: x,
            y: y,
            zIndex: 100,
        });
        this.textObj.anchor.set(0.5, 0.5);
        Engine.NotificationManager.container.addChild(this.textObj);
    }
    public destroy() {
        this.textObj.destroy();
        this.destroyed = true;
    }
}

export default class NotificationManager extends GameObject {
    // ? TODO: (maybe) turn it into 20 slots to avoid text rendering ontop of one another.
    private notifications: Notification[] = [];
    private ticks: number = 0;
    constructor() {
        super();
        this.bb.x = Engine.app.canvas.width / 2;
        this.bb.y = 40;
        this.copyBBToContainer();
        this.container.zIndex = 100;
        Engine.app.stage.addChild(this.container);
    }
    public Notify(text, type: NotificationType) {
        let x = 0;
        let y = this.notifications.length * 32;
        this.notifications.push(new Notification(text, type, x, y, this.ticks + 180));
    }
    public update(_) {
        this.ticks++;
        for (let i = this.notifications.length - 1; i >= 0; i--) {
            const notif = this.notifications[i];
            if (notif.destroyed) {
                this.notifications.splice(i, 1);
                continue;
            }
            if (this.ticks >= notif.ticksToFadeAway && !notif.animating) {
                notif.animating = true;
                Engine.AnimationManager.Animate(
                    new FadeInOut('out', 240, notif.textObj, () => {
                        notif.destroy();
                    })
                );
            }
        }
    }
}
