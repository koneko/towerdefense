import * as PIXI from 'pixi.js';
import Master, { Foundation } from './classes/Bastion';

(async () => {
    const app = new PIXI.Application();
    const aspectRatio = 4 / 3;
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
    const width = Math.min(maxWidth * 0.75, maxHeight * aspectRatio);
    const height = width / aspectRatio;
    Foundation.WindowWidth = width;
    Foundation.WindowHeight = height;

    await app.init({
        width: width,
        height: height,
        backgroundColor: 'white',
        sharedTicker: true,
        preference: 'webgl',
    });

    document.body.appendChild(app.canvas);
    window.addEventListener('resize', () => {
        const newWidth = Math.min(window.innerWidth * 0.75, window.innerHeight * aspectRatio);
        const newHeight = newWidth / aspectRatio;
        Foundation.WindowWidth = newWidth;
        Foundation.WindowHeight = newHeight;
        app.renderer.resize(newWidth, newHeight);
    });
    new Master();
    // await Assets.LoadAssets();
    // const game = new Game(app.screen);
    // app.stage.addChild(game.container);
    // window.addEventListener("resize", () => {
    //   app.renderer.resize(window.innerWidth, window.innerHeight);
    //   game.setBounds(0, 0, app.screen.width, app.screen.height);
    // });
})();
