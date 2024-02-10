/**
 * A class that simplifies keyboard interactions and key rebindings. To use
 * it, define a list of key codes that correspond to game commands. When one
 * of those keys is pressed, a @see CommandEvent is dispatched that contains
 * information about the issued command as well as how many keys corresponding
 * to that command are currently pressed. You can also query if any commands
 * are currently being held using the .queryCommand method.
 */
declare class KeyboardInteractionSystem extends EventTarget {
    private _mapping;
    private _domElement;
    private _heldCommands;
    private _heldKeys;
    /**
     * Create a new Keyboard Interaction system with the given parameters.
     *
     * @param domElement The html element that the system should listen to
     * @param mapping The key mapping to use. This should be an object where
     * the keys represent the key codes and the values the corresponding
     * commands
     */
    constructor(domElement: HTMLElement, mapping: any);
    private _onKeyDown;
    private _onKeyUp;
    /**
     * Checks whether a command is currently being held.
     *
     * @param command The command to query
     * @returns the number of keys corresponding to that command currently held
     */
    queryCommand: (command: string) => any;
    /**
     * Called by the active screen when it mounts. No need to call manually.
     */
    mount(): void;
    /**
     * Called by the active screen when it unmounts. No need to call manually.
     */
    unmount(): void;
}
type CommandInfo = {
    /** The command name */
    command: string;
    /** How many keys corresponding to that command are currently pressed */
    count: number;
    sourceEvent: KeyboardEvent;
};
export { KeyboardInteractionSystem, CommandInfo };
