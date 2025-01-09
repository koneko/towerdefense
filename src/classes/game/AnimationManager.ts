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

export default class AnimationManager {
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
