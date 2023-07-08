/**
 * A class that simplifies keyboard interactions and key rebindings. To use
 * it, define a list of key codes that correspond to game commands. When one
 * of those keys is pressed, a @see CommandEvent is dispatched that contains
 * information about the issued command as well as how many keys corresponding
 * to that command are currently pressed. You can also query if any commands
 * are currently being held using the .queryCommand method.
 */
class KeyboardInteractionSystem extends EventTarget {

    private _mapping: any;
    private _domElement: HTMLElement;
    private _heldCommands: any;

    /**
     * Create a new Keyboard Interaction system with the given parameters.
     * 
     * @param domElement The html element that the system should listen to
     * @param mapping The key mapping to use. This should be an object where
     * the keys represent the key codes and the values the corresponding
     * commands
     */
    constructor(domElement: HTMLElement, mapping: any) {
        super();
        this._mapping = mapping;
        this._domElement = domElement;
        this._heldCommands = {};
    }

    // handle native keydown events
    private _onKeyDown = (event: KeyboardEvent) => {
        event.preventDefault();
        if(event.repeat) return;
        const command = this._mapping[event.code];
        if(command) {
            this._heldCommands[command]++;
            this.dispatchEvent(new CustomEvent<CommandInfo>('commanddown', { detail: {
                command: command,
                count: this._heldCommands[command],
                sourceEvent: event,
            }}));
        }
    }

    // handle native keyup events
    private _onKeyUp = (event: KeyboardEvent) => {
        event.preventDefault();
        const command = this._mapping[event.code];
        if(command) {
            this._heldCommands[command]--;
            this.dispatchEvent(new CustomEvent<CommandInfo>('commandup', { detail: {
                command: command,
                count: this._heldCommands[command],
                sourceEvent: event,
            }}));
        }
    }

    /**
     * Checks whether a command is currently being held.
     * 
     * @param command The command to query
     * @returns the number of keys corresponding to that command currently held
     */
    queryCommand = (command: string) => {
        return this._heldCommands[command];
    }

    /**
     * Called by the active screen when it mounts. No need to call manually.
     */
    mount() {
        for(const command of Object.values(this._mapping)) {
            this._heldCommands[(command as string)] = 0;
        }
        setTimeout(() => this._domElement.addEventListener('keydown', this._onKeyDown), 20);
        setTimeout(() => this._domElement.addEventListener('keyup', this._onKeyUp), 20);
    }

    /**
     * Called by the active screen when it unmounts. No need to call manually.
     */
    unmount() {
        this._domElement.removeEventListener('keydown', this._onKeyDown);
        this._domElement.removeEventListener('keyup', this._onKeyUp);
    }

}

type CommandInfo = {
    /** The command name */
    command: string,
    /** How many keys corresponding to that command are currently pressed */
    count: number,
    sourceEvent: KeyboardEvent,
}

export { KeyboardInteractionSystem, CommandInfo };