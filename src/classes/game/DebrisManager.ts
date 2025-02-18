import GameObject from '../GameObject';
import { Container } from 'pixi.js';

class Debris {
    public ticksToDestroyAt: number;
    private debris: Container | GameObject;
    constructor(debris: Container | GameObject, ticksToDestroyAt) {
        this.debris = debris;
        this.ticksToDestroyAt = ticksToDestroyAt;
    }
    public destroy() {
        this.debris.destroy();
    }
    public update(elapsedMS) {
        if (this.debris instanceof GameObject) {
            this.debris.update(elapsedMS);
        }
    }
}

export default class DebrisManager extends GameObject {
    private ticks: number = 0;
    private debris: Debris[] = [];
    public update(elapsedMS) {
        this.ticks++;
        for (let idx = this.debris.length - 1; idx >= 0; idx--) {
            const db = this.debris[idx];
            if (this.ticks >= db.ticksToDestroyAt) {
                db.destroy();
                this.debris.splice(idx, 1);
            } else {
                db.update(elapsedMS);
            }
        }
    }
    public CreateDebris(affectedObject: Container | GameObject, ticksToDestroyAt?: number) {
        if (!ticksToDestroyAt) ticksToDestroyAt = 120;
        this.debris.push(new Debris(affectedObject, this.ticks + ticksToDestroyAt));
    }
}
