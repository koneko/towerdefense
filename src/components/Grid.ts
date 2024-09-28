import * as PIXI from "pixi.js";
import GameObject from "../base/GameObject";
import { GameMapDefinition, TerrainType } from "../base/Definitions";

export class Cell extends GameObject {
  public type: TerrainType;
  public row: number;
  public column: number;

  constructor(
    type: TerrainType,
    row: number,
    column: number,
    bounds?: PIXI.Rectangle
  ) {
    super(bounds);
    this.type = type;
    this.row = row;
    this.column = column;
    this.draw();
  }

  protected draw() {
    this.container.removeChildren();
    let g = new PIXI.Graphics();
    g.rect(0, 0, this.bounds.width, this.bounds.height);
    switch (this.type) {
      case TerrainType.Restricted:
        g.fill(0xff0000);
        break;
      case TerrainType.Buildable:
        g.fill(0x00ff00);
        break;
    }
    this.container.addChild(g);
    this.container.x = this.bounds.x;
    this.container.y = this.bounds.y;
  }
}

export class Grid extends GameObject {
  private gameMap: GameMapDefinition;
  private cells: Cell[] = [];

  constructor(map: GameMapDefinition, bounds?: PIXI.Rectangle) {
    super(bounds);
    this.gameMap = map;
    for (let y = 0; y < this.gameMap.rows; y++) {
      for (let x = 0; x < this.gameMap.columns; x++) {
        let cell = new Cell(this.gameMap.cells[x][y], x, y);
        this.cells.push(cell);
      }
    }
    console.log(this.cells);
    this.draw();
  }

  protected draw() {
    console.log("Drawing Grid", this.bounds);
    this.container.removeChildren();
    let g = new PIXI.Graphics();
    g.rect(0, 0, this.bounds.width, this.bounds.height);
    g.fill(0x00aa00);
    this.container.addChild(g);
    for (let cell of this.cells) {
      cell.setBounds(
        this.gridUnitsToPixels(cell.column),
        this.gridUnitsToPixels(cell.row),
        this.gridUnitsToPixels(1),
        this.gridUnitsToPixels(1)
      );
      this.container.addChild(cell.container);
    }
    this.container.x = this.bounds.x;
    this.container.y = this.bounds.y;
  }

  private getPixelScalingFactor() {
    const pixelScaleX = this.container.width / this.gameMap.columns;
    const pixelScaleY = this.container.height / this.gameMap.rows;
    return pixelScaleX < pixelScaleY ? pixelScaleX : pixelScaleY;
  }

  public gridUnitsToPixels(amount: number): number {
    return amount * this.getPixelScalingFactor();
  }

  public pixelsToGridUnits(pixels: number): number {
    return pixels / this.getPixelScalingFactor();
  }
}
