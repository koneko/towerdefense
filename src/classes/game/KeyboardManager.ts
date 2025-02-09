/**
 * Handles keyboard events.
 */
export default class KeyboardManager {
    private static listeners: ((event: KeyboardEvent) => void)[] = [];

    public static init() {
        window.addEventListener('keydown', KeyboardManager.handleKeyDown);
    }

    /**
     * Add a callback to be called when a key is pressed.
     * Note: Calling preventDefault() on the event will prevent other callbacks from being called.
     * @param key  The key to listen for.
     * @param callback  The callback to call when the key is pressed.
     * @returns  A function that can be called to remove the callback.
     */
    public static onKeyPressed(callback: (event: KeyboardEvent) => void) {
        KeyboardManager.listeners = [...KeyboardManager.listeners, callback];
        return () => KeyboardManager.offKey(callback);
    }

    /**
     * Remove a callback.
     */
    public static offKey(callback: (event: KeyboardEvent) => void) {
        const index = KeyboardManager.listeners.indexOf(callback);
        if (index >= 0) {
            KeyboardManager.listeners = [
                ...KeyboardManager.listeners.slice(0, index),
                ...KeyboardManager.listeners.slice(index + 1),
            ];
        }
    }

    private static handleKeyDown(event: KeyboardEvent) {
        if (KeyboardManager.listeners.length > 0) {
            // console.log(`Key down: ${event.key}`);
            for (let i = KeyboardManager.listeners.length - 1; i >= 0; i--) {
                KeyboardManager.listeners[i](event);
                if (event.defaultPrevented) {
                    break;
                }
            }
        }
    }
}
