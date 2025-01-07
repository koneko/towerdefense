import Button from '../base/Button';
import SceneBase from './SceneBase';
import * as PIXI from 'pixi.js';

export default class MainMenu extends SceneBase {
    private _newGameButton: Button;
    private _settingsButton: Button;

    constructor(bounds?: PIXI.Rectangle) {
        super(bounds);
        this._newGameButton = new Button('New Game', new PIXI.Color('blue'));
        this._newGameButton.events.on('click', () => {
            this.events.emit('newGame');
        });
        this._settingsButton = new Button('Settings', new PIXI.Color('gray'));
        this._settingsButton.events.on('click', () => {
            this.events.emit('settings');
        });
        this.draw();
    }

    protected draw() {
        console.log('Creating main menu scene', this.bounds);
        this.container.removeChildren();
        const g = new PIXI.Graphics();
        g.rect(0, 0, this.bounds.width, this.bounds.height);
        g.fill(0x000000);
        this.container.addChild(g);
        this._newGameButton.setBounds(
            this.bounds.width / 2 - 300 / 2,
            this.bounds.height / 2 - 80,
            300,
            60
        );
        this._settingsButton.setBounds(
            this.bounds.width / 2 - 300 / 2,
            this.bounds.height / 2 + 20,
            300,
            60
        );
        this.container.addChild(this._newGameButton.container);
        this.container.addChild(this._settingsButton.container);
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
    }
}
