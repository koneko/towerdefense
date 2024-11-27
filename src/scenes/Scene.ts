import GuiObject from '../classes/GuiObject';

export default class Scene {
    public gui: GuiObject[];
    public destroy() {
        this.gui.forEach((element) => {
            element.destroy();
        });
    }
    public GetGuiObject(object: GuiObject) {
        return this.gui.find((obj) => obj == object);
    }
    public init() {
        // Definitions for scene elements.
    }
}
