import * as PIXI from 'pixi.js';
import Master, { Foundation } from './classes/Bastion';

(async () => {
    const app = new PIXI.Application();
    const aspectRatio = Foundation.AspectRatio;
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
    const width = Math.min(maxWidth * 0.75, maxHeight * aspectRatio);
    const height = width / aspectRatio;
    Foundation.WindowWidth = width;
    Foundation.WindowHeight = height;
    Foundation._PIXIApp = app;

    await app.init({
        width: width,
        height: height,
        backgroundColor: 'white',
        sharedTicker: true,
        preference: 'webgl',
    });

    document.body.appendChild(app.canvas);
    let master = new Master();
    master.RefreshStage();
    window.addEventListener('resize', () => {
        const newWidth = Math.min(window.innerWidth * 0.75, window.innerHeight * aspectRatio);
        const newHeight = newWidth / aspectRatio;
        Foundation.WindowWidth = newWidth;
        Foundation.WindowHeight = newHeight;
        app.renderer.resize(newWidth, newHeight);
        master.RefreshStage();
    });
})();
