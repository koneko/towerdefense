import * as PIXI from "pixi.js";
import { Tower } from "./Tower.ts";

export enum CellType {
  Path,
  NoBuild,
  Build,
}

export class Cell {
  public x: number;
  public y: number;
  public type: CellType;
  public tower: Tower;
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
}

export class Grid {
  public rows: number;
  public columns: number;
  public gridObject: PIXI.Container;
  public cells: Array<Cell>;
  constructor(x, y, width, height, rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.gridObject = new PIXI.Container({
      width: width,
      height: height,
      x: x,
      y: y,
    });
    for (let index = 0; index < rows * columns; index++) {
      // const cell = new Cell();
    }
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
