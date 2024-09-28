import * as PIXI from "pixi.js";
import GameObject from "../base/GameObject";

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
    this.draw();
  }

  protected draw() {
    this.container.removeChildren();
    let g = new PIXI.Graphics();
    g.rect(0, 0, this.bounds.width, this.bounds.height);
    switch (this.type) {
      case CellType.Path:
        g.fill(0x00ff00);
        break;
      case CellType.NoBuild:
        g.fill(0xff0000);
        break;
      case CellType.Build:
        g.fill(0x0000ff);
        break;
      case CellType.Undefined:
        g.fill(0x000000);
        break;
    }
    this.container.addChild(g);
    this.container.x = this.bounds.x;
    this.container.y = this.bounds.y;
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

  protected draw() {}

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
