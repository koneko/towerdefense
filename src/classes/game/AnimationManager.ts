import * as PIXI from 'pixi.js';

class Animateable {
    public finished: boolean = false;
    protected callbackFn: Function;

    public Finish() {
        this.finished = true;
    }

    public update(ms) {
        if (this.finished) return this.callbackFn();
    }
}

export class FadeInOut extends Animateable {
    public fadeType: 'in' | 'out';
    public fadeTime: number;
    public pixiObject: PIXI.Container;
    private ticks: number = 0;

    constructor(type: 'in' | 'out', timeInFrames: number, object: PIXI.Container, callbackFn: Function) {
        super();
        this.fadeType = type;
        this.fadeTime = timeInFrames;
        this.pixiObject = object;
        this.callbackFn = callbackFn;
        if (type == 'in') {
            this.pixiObject.alpha = 0;
        } else {
            this.pixiObject.alpha = 1;
        }
    }

    public update(ms) {
        super.update(ms);
        this.ticks++;
        if (this.fadeType == 'in') {
            this.pixiObject.alpha = this.ticks / this.fadeTime;
        } else {
            this.pixiObject.alpha -= 1 / this.fadeTime;
        }
        console.log(this.pixiObject.alpha);
        if (this.ticks >= this.fadeTime) this.Finish();
    }
}

export class Tween extends Animateable {
    public tweenTime: number;
    public pixiObject: PIXI.Container;
    private goalX: number;
    private goalY: number;
    private ticks: number = 0;

    constructor(timeInFrames: number, object: PIXI.Container, fromX, fromY, goalX, goalY, callbackFn: Function) {
        super();
        this.tweenTime = timeInFrames;
        this.pixiObject = object;
        this.callbackFn = callbackFn;
        this.goalX = goalX;
        this.goalY = goalY;
        this.pixiObject.x = fromX;
        this.pixiObject.y = fromY;
    }

    public update(ms) {
        super.update(ms);
        this.ticks++;
        const objX = this.pixiObject.x;
        const objY = this.pixiObject.y;
        // TODO: fix this by the time you get to using it, it moves the obj too fast and wrong
        if (objX != this.goalX) {
            let diff = this.goalX - objX;
            this.pixiObject.x += ms * diff * (this.ticks / this.tweenTime);
        }
        if (objY != this.goalY) {
            let diff = this.goalY - objY;
            this.pixiObject.y += ms * diff * (this.ticks / this.tweenTime);
        }
        if (this.ticks >= this.tweenTime) this.Finish();
    }
}

export class AnimationManager {
    public AnimationQueue: Animateable[] = [];
    public Animate(animatable: Animateable) {
        this.AnimationQueue.push(animatable);
    }
    public update(ms) {
        this.AnimationQueue.forEach((anim) => {
            if (anim.finished) this.AnimationQueue.splice(this.AnimationQueue.indexOf(anim), 1);
            anim.update(ms);
        });
    }
}
