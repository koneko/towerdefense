/**
 * Handles keyboard events.
 */
class KeyboardManager {
    private static listeners: Map<string, ((event: KeyboardEvent) => void)[]> = new Map();

    public static init() {
        window.addEventListener('keydown', KeyboardManager.handleKeyDown);
    }

    /**
     * Add a callback to be called when the specified key is pressed.
     * Note: Calling preventDefault() on the event will prevent other callbacks from being called.
     * @param key  The key to listen for.
     * @param callback  The callback to call when the key is pressed.
     * @returns  A function that can be called to remove the callback.
     */
    public static onKey(key: string, callback: (event: KeyboardEvent) => void) {
        if (!KeyboardManager.listeners.has(key)) {
            KeyboardManager.listeners.set(key, []);
        }
        KeyboardManager.listeners.get(key).push(callback);
        return () => KeyboardManager.offKey(key, callback);
    }

    /**
     * Remove a callback from the specified key.
     */
    public static offKey(key: string, callback: (event: KeyboardEvent) => void) {
        if (KeyboardManager.listeners.has(key)) {
            const index = KeyboardManager.listeners.get(key).indexOf(callback);
            if (index >= 0) {
                KeyboardManager.listeners.get(key).splice(index, 1);
            }
        }
    }

    private static handleKeyDown(event: KeyboardEvent) {
        if (KeyboardManager.listeners.has(event.key)) {
            console.log(`Key down: ${event.key}`);
            const callbacks = KeyboardManager.listeners.get(event.key);
            for (let i = callbacks.length - 1; i >= 0; i--) {
                callbacks[i](event);
                if (event.defaultPrevented) {
                    break;
                }
            }
        }
    }
}

export default KeyboardManager;
