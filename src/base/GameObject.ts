import * as PIXI from "pixi.js";
export default abstract class GameObject {
  protected _container: PIXI.Container;

  protected bounds: PIXI.Rectangle;

  private _events: PIXI.EventEmitter = new PIXI.EventEmitter();

  public getBounds(): PIXI.Rectangle {
    return this.bounds;
  }

  public setBounds(x: number, y: number, width: number, height: number) {
    this.bounds = new PIXI.Rectangle(x, y, width, height);
    this.triggerBoundsChanged(); // GameObject implements this.
  }

  public get container(): PIXI.Container {
    return this._container;
  }

  public get events(): PIXI.EventEmitter {
    return this._events;
  }

  protected abstract triggerBoundsChanged();

  constructor(bounds: PIXI.Rectangle) {
    this.bounds = bounds;
    this._container = new PIXI.Container();
  }
}
