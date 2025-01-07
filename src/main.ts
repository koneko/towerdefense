import * as PIXI from 'pixi.js';
import GameMaster, { Globals } from './classes/Bastion';
import Assets from './classes/Assets';
import { MainScene } from './scenes/Main';
import { GameScene } from './scenes/Game';

(async () => {
    const app = new PIXI.Application();
    Globals.app = app;
    await app.init({
        width: 1920, // Base width
        height: 1080, // Base height
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        backgroundColor: 0xffffff,
        sharedTicker: true,
    });
    document.body.appendChild(app.canvas);

    function resize() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        Globals.WindowHeight = windowHeight;
        Globals.WindowWidth = windowWidth;

        // Calculate scale factor to maintain aspect ratio
        const scaleX = windowWidth / app.screen.width;
        const scaleY = windowHeight / app.screen.height;
        const scale = Math.min(scaleX, scaleY); // Use the smaller scale to fit

        // Calculate new canvas size
        const gameWidth = Math.round(app.screen.width * scale);
        const gameHeight = Math.round(app.screen.height * scale);

        // Center the canvas
        const marginHorizontal = (windowWidth - gameWidth) / 2;
        const marginVertical = (windowHeight - gameHeight) / 2;

        // Apply styles to canvas
        app.canvas.style.width = `${gameWidth}px`;
        app.canvas.style.height = `${gameHeight}px`;
        app.canvas.style.marginLeft = `${marginHorizontal}px`;
        app.canvas.style.marginTop = `${marginVertical}px`;
        app.canvas.style.marginRight = `0`; // Prevent unnecessary margin
        app.canvas.style.marginBottom = `0`; // Prevent unnecessary margin
        app.canvas.style.display = 'block'; // Prevent inline-block spacing issues
    }

    window.addEventListener('resize', resize);
    resize();
    await Assets.LoadAssets();
    new GameMaster();
    globalThis.Globals = Globals;
    Globals.GameMaster.changeScene(new MainScene());
    let params = new URLSearchParams(location.href);
    if (params.entries().next().value[1] == 'game') Globals.GameMaster.changeScene(new GameScene('Mission 1'));
})();
