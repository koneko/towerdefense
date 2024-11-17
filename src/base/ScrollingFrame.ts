import GameObject from './GameObject';
import Assets from './Assets';
import * as PIXI from 'pixi.js';

export abstract class ScrollingFrameChild extends GameObject {
    abstract getAspectRatio(): number;
}

export class ScrollingFrame extends GameObject {
    private children: ScrollingFrameChild[];
    constructor(children: ScrollingFrameChild[], bounds?: PIXI.Rectangle) {
        super(bounds);
        this.children = children;
        this.container.interactive = true;
        this.container.onwheel = (e) => this.scrollWheel(e);
        //document.addEventListener('wheel', (e) => this.scrollWheel(e));
        this.draw();
    }

    private scrollWheel(e) {
        let scrollBy = e.deltaY;
        console.log(scrollBy);
    }

    protected draw() {
        this.container.removeChildren();
        let g = new PIXI.Graphics();
        g.rect(0, 0, this.bounds.width, this.bounds.height);
        g.fill('transparent');
        this.container.addChild(g);

        let y = 0;
        for (let child of this.children) {
            child.setBounds(0, y, this.bounds.width, this.bounds.width * child.getAspectRatio());
            this.container.addChild(child.container);
            y += child.getBounds().height;
        }

        this.container.x = this.bounds.x;
        this.container.y = this.bounds.y;
    }
    public destroy() {
        super.destroy();
        document.removeEventListener('wheel', this.scrollWheel);
    }
}
