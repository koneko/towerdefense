import Button from '../classes/gui/Button';
import Scene from './Scene';
import * as PIXI from 'pixi.js';

export class MainScene extends Scene {
    public init() {
        new Button(new PIXI.Bounds(0, 0, 200, 200));
    }
}
