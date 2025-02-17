import * as PIXI from 'pixi.js';
import GameMaster, { Engine } from './classes/Bastion';
import Assets from './classes/Assets';
import { MainScene } from './scenes/Main';
import { GameScene } from './scenes/Game';
import { AnimationManager } from './classes/game/AnimationManager';
import NotificationManager from './classes/game/NotificationManager';
import GameUIConstants from './classes/GameUIConstants';
import KeyboardManager from './classes/game/KeyboardManager';
import DebrisManager from './classes/game/DebrisManager';

(async () => {
    const app = new PIXI.Application();
    Engine.app = app;
    await app.init({
        width: 1920, // Base width
        height: 1080, // Base height
        resolution: 1,
        autoDensity: true,
        backgroundColor: 0xffffff,
        sharedTicker: true,
    });

    document.body.appendChild(app.canvas);

    function resize() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const scaleX = windowWidth / app.screen.width;
        const scaleY = windowHeight / app.screen.height;
        const scale = Math.min(scaleX, scaleY);

        const gameWidth = Math.round(app.screen.width * scale);
        const gameHeight = Math.round(app.screen.height * scale);

        const marginHorizontal = (windowWidth - gameWidth) / 2;
        const marginVertical = (windowHeight - gameHeight) / 2;

        app.canvas.style.width = `${gameWidth}px`;
        app.canvas.style.height = `${gameHeight}px`;
        app.canvas.style.marginLeft = `${marginHorizontal}px`;
        app.canvas.style.marginTop = `${marginVertical}px`;
        app.canvas.style.marginRight = `0`;
        app.canvas.style.marginBottom = `0`;
        app.canvas.style.display = 'block';
    }
    Engine.latestCommit = await fetch('./latest_commit').then((res) => res.text());
    window.addEventListener('resize', resize);

    resize();
    await Assets.LoadAssets();
    GameUIConstants.init();
    KeyboardManager.init();
    new GameMaster();
    Engine.AnimationManager = new AnimationManager();
    Engine.NotificationManager = new NotificationManager();
    Engine.DebrisManager = new DebrisManager();
    globalThis.Engine = Engine;
    PIXI.Ticker.shared.add((ticker) => {
        Engine.NotificationManager.update(ticker.elapsedMS);
        Engine.AnimationManager.update(ticker.elapsedMS);
        Engine.DebrisManager.update(ticker.elapsedMS);
    });
    app.canvas.addEventListener('pointermove', function (event) {
        Engine.MouseX = ((event.clientX - app.canvas.offsetLeft) / app.canvas.offsetWidth) * 1920;
        Engine.MouseY = ((event.clientY - app.canvas.offsetTop) / app.canvas.offsetHeight) * 1080;
    });
    Engine.GameMaster.changeScene(new MainScene());
    let params = new URLSearchParams(location.href);
    if (params.entries().next().value[1] == 'game') Engine.GameMaster.changeScene(new GameScene('The Turn'));

    if (Engine.latestCommit != 'DEVELOPMENT')
        window.onbeforeunload = () => {
            return 'You are about to leave.';
        };
    else Engine.TestSuite();

    let gamePausedDueToBlur = false;

    window.addEventListener('blur', () => {
        if (Engine.GameScene && !Engine.GameScene.isPaused) {
            Engine.GameScene.PauseGame();
            gamePausedDueToBlur = true;
        }
    });
    window.addEventListener('focus', () => {
        if (Engine.GameScene && gamePausedDueToBlur && Engine.GameScene.isPaused) {
            gamePausedDueToBlur = false;
            Engine.GameScene.UnpauseGame();
        }
    });
})();
