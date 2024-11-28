import * as PIXI from 'pixi.js';
import GameMaster, { environment } from './classes/Bastion';
import Assets from './classes/Assets';
import { MainScene } from './scenes/Main';
import { GameScene } from './scenes/Game';

(async () => {
    const app = new PIXI.Application();
    const aspectRatio = environment.AspectRatio;
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
    const width = Math.min(maxWidth * 0.75, maxHeight * aspectRatio);
    const height = width / aspectRatio;
    environment.WindowWidth = width;
    environment.WindowHeight = height;
    environment.app = app;

    await app.init({
        width: width,
        height: height,
        backgroundColor: 'gray',
        sharedTicker: true,
        preference: 'webgl',
    });
    document.body.appendChild(app.canvas);
    await Assets.LoadAssets();
    new GameMaster();
    environment.GameMaster.changeScene(new MainScene());
    let params = new URLSearchParams(location.href);
    if (params.entries().next().value[1] == 'game') environment.GameMaster.changeScene(new GameScene('Mission 1'));

    window.addEventListener('resize', () => {
        const newWidth = Math.min(window.innerWidth * 0.75, window.innerHeight * aspectRatio);
        const newHeight = newWidth / aspectRatio;
        environment.WindowWidth = newWidth;
        environment.WindowHeight = newHeight;
        app.renderer.resize(newWidth, newHeight);
    });
})();
