import * as PIXI from 'pixi.js';
import GameMaster, { Globals } from './classes/Bastion';
import Assets from './classes/Assets';
import { MainScene } from './scenes/Main';
import { GameScene } from './scenes/Game';

(async () => {
    const app = new PIXI.Application();
    const aspectRatio = Globals.AspectRatio;
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
    const width = Math.min(maxWidth * 0.75, maxHeight * aspectRatio);
    const height = width / aspectRatio;
    Globals.app = app;

    await app.init({
        width: maxWidth,
        height: maxHeight,
        backgroundColor: 'black',
        sharedTicker: true,
        preference: 'webgl',
    });
    const screenRatio = maxWidth / maxHeight;
    const scale = screenRatio < aspectRatio ? maxWidth / width : maxHeight / height;

    app.stage.scale.x = scale;
    app.stage.scale.y = scale;
    Globals.WindowWidth = maxWidth / scale;
    Globals.WindowHeight = maxHeight / scale;
    document.body.appendChild(app.canvas);
    await Assets.LoadAssets();
    new GameMaster();
    Globals.GameMaster.changeScene(new MainScene());
    let params = new URLSearchParams(location.href);
    if (params.entries().next().value[1] == 'game') Globals.GameMaster.changeScene(new GameScene('Mission 1'));
})();
