import Assets from '../base/Assets';
import Button from '../base/Button';
import { MissionDefinition } from '../base/Definitions';
import SceneBase from './SceneBase';
import * as PIXI from 'pixi.js';

export default class MissionMenuSelect extends SceneBase {
    private _buttons: Button[] = [];

    constructor(bounds: PIXI.Rectangle) {
        super(bounds);
        for (const mission of Assets.Missions) {
            this.addMission(mission);
        }
        this.addButton('Back', () => {
            this.events.emit('back');
        });
        this.draw();
    }

    protected draw() {
        this.container.removeChildren();
        const g = new PIXI.Graphics();
        g.rect(0, 0, this.bounds.width, this.bounds.height);
        g.fill(0x000000);
        this.container.addChild(g);
        let y = 50;
        for (const button of this._buttons) {
            button.setBounds(this.bounds.width / 2 - 300 / 2, y, 300, 60);
            y += 80;
            this.container.addChild(button.container);
        }
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
    }

    private addMission(mission: MissionDefinition) {
        this.addButton(mission.name, () => {
            this.events.emit('mission', mission);
        });
    }

    private addButton(caption: string, onClick: () => void) {
        const button = new Button(caption, new PIXI.Color('white'));
        button.events.on('click', onClick);
        this._buttons.push(button);
    }
}
