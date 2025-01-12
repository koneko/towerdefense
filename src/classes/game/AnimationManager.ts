import * as PIXI from 'pixi.js';

class Animateable {
    public finished: boolean = false;
    protected calledBack: boolean = false;
    public callbackFn: Function;

    public Finish() {
        this.finished = true;
    }

    public update(ms) {
        if (this.finished) {
            return;
        }
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
        if (this.pixiObject == null) return this.Finish();
        this.ticks++;
        if (this.fadeType == 'in') {
            this.pixiObject.alpha = this.ticks / this.fadeTime;
        } else {
            this.pixiObject.alpha -= 1 / this.fadeTime;
        }
        if (this.ticks >= this.fadeTime) this.Finish();
    }
}

export class Tween extends Animateable {
    public tweenTime: number;
    public pixiObject: PIXI.Container;
    private goalX: number;
    private goalY: number;
    private ticks: number = 0;

    constructor(timeInFrames: number, object: PIXI.Container, goalX, goalY, callbackFn: Function) {
        super();
        this.tweenTime = timeInFrames;
        this.pixiObject = object;
        this.callbackFn = callbackFn;
        this.goalX = goalX;
        this.goalY = goalY;
    }

    public update(deltaMS) {
        super.update(deltaMS);
        this.ticks += deltaMS;
        const progress = this.ticks / (this.tweenTime * 16.67);

        this.pixiObject.x = (this.goalX - this.pixiObject.x) * progress + this.pixiObject.x;
        this.pixiObject.y = (this.goalY - this.pixiObject.y) * progress + this.pixiObject.y;

        if (this.ticks >= this.tweenTime * 16.67) {
            this.pixiObject.x = this.goalX;
            this.pixiObject.y = this.goalY;
            this.Finish();
        }
    }
}

export class AnimationManager {
    public AnimationQueue: Animateable[] = [];
    public Animate(animatable: Animateable) {
        this.AnimationQueue.push(animatable);
    }
    public update(ms) {
        // Explanation: we go from the back of the array so that we can remove items freely without messing with
        // foreach. From experience it gets a little screwy if you do this.AnimationQueue.forEach and doesn't properly
        // remove elements.
        for (let i = this.AnimationQueue.length - 1; i >= 0; i--) {
            const anim = this.AnimationQueue[i];
            if (anim.finished) {
                anim.callbackFn();
                this.AnimationQueue.splice(i, 1);
            } else anim.update(ms);
        }
    }
}
