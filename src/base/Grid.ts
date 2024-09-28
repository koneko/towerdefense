import * as PIXI from "pixi.js";
import GameObject from "./GameObject.ts";

export enum CellType {
  Path,
  NoBuild,
  Build,
  Undefined,
}

export class Cell extends GameObject {
  public type: CellType;
  constructor(bounds: PIXI.Rectangle, type: CellType) {
    super(bounds);
    this.type = type;
  }
  protected triggerBoundsChanged() {
    this.container.removeChildren();
  }
}

export class Grid extends GameObject {
  public rows: number;
  public columns: number;
  public cells: Array<Cell>;
  constructor(bounds: PIXI.Rectangle, rows, columns) {
    super(bounds);
    this.rows = rows;
    this.columns = columns;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        let cell = new Cell(
          new PIXI.Rectangle(
            x,
            y,
            this.gridUnitsToPixels(1),
            this.gridUnitsToPixels(1)
          ),
          CellType.Undefined
        );
        this.cells.push(cell);
      }
    }
  }

  protected triggerBoundsChanged() {
    this.container.removeChildren();
  }

  private getPixelScalingFactor() {
    const pixelScaleX = this.container.width / this.columns;
    const pixelScaleY = this.container.height / this.rows;
    return pixelScaleX < pixelScaleY ? pixelScaleX : pixelScaleY;
  }

  public gridUnitsToPixels(amount: number): number {
    return amount * this.getPixelScalingFactor();
  }

  public pixelsToGridUnits(pixels: number): number {
    return pixels / this.getPixelScalingFactor();
  }
}
