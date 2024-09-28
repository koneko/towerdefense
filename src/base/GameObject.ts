import * as PIXI from "pixi.js";
export default abstract class GameObject {
  protected _container: PIXI.Container;

  protected bounds: PIXI.Rectangle;

  private _events: PIXI.EventEmitter = new PIXI.EventEmitter();

  public setBounds(x: number, y: number, width: number, height: number) {
    this.bounds = new PIXI.Rectangle(x, y, width, height);
    this.triggerBoundsChanged(); // GameObject implements this.
  }

  public destroy() {
    this._events.removeAllListeners();
    if (this._container.parent)
      this._container.parent.removeChild(this._container);
    this._container.destroy();
  }

  public get container(): PIXI.Container {
    return this._container;
  }

  public get events(): PIXI.EventEmitter {
    return this._events;
  }

  protected triggerBoundsChanged() {
    this.draw();
  }

  protected abstract draw(): void;

  constructor(bounds: PIXI.Rectangle) {
    this.bounds = bounds;
    this._container = new PIXI.Container();
  }
}
