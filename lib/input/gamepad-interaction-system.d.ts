import { THREE } from "../index.js";
type JoypadMappings = (string | null)[];
declare class GamepadInteractionSystem extends EventTarget {
    private heldButtons;
    private heldCommands;
    private mappings;
    readonly leftJoystick: THREE.Vector2;
    readonly rightJoystick: THREE.Vector2;
    constructor(mappings: JoypadMappings);
    mount: () => void;
    update: () => void;
    queryCommand: (command: string) => boolean;
    private pressButton;
    private releaseButton;
}
export { GamepadInteractionSystem };
