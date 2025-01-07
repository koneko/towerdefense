import GameObject from './GameObject';
import Assets from './Assets';
import * as PIXI from 'pixi.js';

export class Child extends GameObject {
    protected draw() {}
}

export class ScrollingFrame extends GameObject {
    private canScroll: boolean = false;
    private children: Child[];
    constructor(children: Child[], bounds?: PIXI.Rectangle) {
        super(bounds);
        this.children = children;
        this.container.interactive = true;
        document.addEventListener('wheel', (e) => this.scrollWheel(e));
        this.draw();
    }
    private scrollWheel(e) {
        let scrollBy = e.deltaY;
        console.log(this.canScroll);
        console.log(scrollBy);
    }

    protected draw() {
        this.container.removeChildren();
        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
        this.container.on('mouseentercapture', () => {
            console.log('A');
            this.canScroll = true;
        });
        this.container.on('mouseleavecapture', () => {
            console.log('B');
            this.canScroll = false;
        });
    }
    public destroy() {
        super.destroy();
        document.removeEventListener('wheel', this.scrollWheel);
    }
}
