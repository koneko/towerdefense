import * as PIXI from "pixi.js";

export class Grid {
  public rows: number;
  public columns: number;
  public gridObject: PIXI.Container;
  constructor(x, y, width, height, rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.gridObject = new PIXI.Container({
      width: width,
      height: height,
      x: x,
      y: y,
    });
  }

  getPixelScalingFactor() {
    const pixelScaleX = this.gridObject.width / this.columns;
    const pixelScaleY = this.gridObject.height / this.rows;
    return pixelScaleX < pixelScaleY ? pixelScaleX : pixelScaleY;
  }

  gridUnitsToPixels(amount: number): number {
    return amount * this.getPixelScalingFactor();
  }
  pixelsToGridUnits(pixels: number): number {
    return pixels / this.getPixelScalingFactor();
  }
}
