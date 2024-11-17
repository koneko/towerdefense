import * as PIXI from 'pixi.js';
import { Rectangle } from 'pixi.js';
import GameObject from './GameObject';
import GameScene from '../scenes/GameScene';

export abstract class GridBaseObject extends GameObject {
    override setBounds(bounds: Rectangle): void;
    override setBounds(x: number, y: number, width: number, height: number): void;
    override setBounds(boundsOrX: Rectangle | number, y?: number, width?: number, height?: number): void {
        if (boundsOrX instanceof PIXI.Rectangle) {
            const transformedRect = new PIXI.Rectangle(
                this.gridUnitsToPixels(boundsOrX.x),
                this.gridUnitsToPixels(boundsOrX.y),
                this.gridUnitsToPixels(boundsOrX.width),
                this.gridUnitsToPixels(boundsOrX.height)
            );
            super.setBounds(transformedRect);
        } else {
            const transformedRect = new PIXI.Rectangle(
                this.gridUnitsToPixels(boundsOrX),
                this.gridUnitsToPixels(y!),
                this.gridUnitsToPixels(width!),
                this.gridUnitsToPixels(height!)
            );
            super.setBounds(transformedRect);
        }
    }

    protected getPixelScalingFactor() {
        const grid = GameScene.getCurrent()?.grid;
        if (!grid) throw new Error('No grid found');
        return grid.getPixelScalingFactor();
    }

    protected gridUnitsToPixels(amount: number): number {
        const grid = GameScene.getCurrent()?.grid;
        if (!grid) throw new Error('No grid found');
        return grid.gridUnitsToPixels(amount);
    }

    protected pixelsToGridUnits(pixels: number): number {
        const grid = GameScene.getCurrent()?.grid;
        if (!grid) throw new Error('No grid found');
        return grid.pixelsToGridUnits(pixels);
    }
}
