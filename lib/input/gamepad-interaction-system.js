import { THREE } from "../index.js";
class GamepadInteractionSystem extends EventTarget {
    constructor(mappings) {
        super();
        this.heldButtons = new Array(20).fill(false);
        this.leftJoystick = new THREE.Vector2(0, 0);
        this.rightJoystick = new THREE.Vector2(0, 0);
        this.mount = () => {
            const gamepad = navigator.getGamepads()[0];
            if (!gamepad)
                return;
            gamepad.buttons.forEach((button, i) => {
                if (button.pressed) {
                    this.heldButtons[i] = true;
                }
            });
        };
        this.update = () => {
            const gamepad = navigator.getGamepads()[0];
            if (!gamepad) {
                this.heldButtons.forEach((pressed, i) => {
                    if (pressed) {
                        this.releaseButton(i);
                    }
                });
                this.leftJoystick.set(0, 0);
                this.rightJoystick.set(0, 0);
                return;
            }
            this.heldButtons.forEach((pressed, i) => {
                var _a, _b;
                if (pressed && !((_a = gamepad.buttons[i]) === null || _a === void 0 ? void 0 : _a.pressed)) {
                    this.releaseButton(i);
                }
                if (!pressed && ((_b = gamepad.buttons[i]) === null || _b === void 0 ? void 0 : _b.pressed)) {
                    this.pressButton(i);
                }
            });
            this.leftJoystick.set(gamepad.axes[0], gamepad.axes[1]);
            this.rightJoystick.set(gamepad.axes[2], gamepad.axes[3]);
        };
        this.queryCommand = (command) => {
            return !!this.heldCommands[command];
        };
        this.mappings = mappings;
        this.heldCommands = {};
        for (const cmd of mappings) {
            if (cmd) {
                this.heldCommands[cmd] = 0;
            }
        }
    }
    pressButton(button) {
        this.heldButtons[button] = true;
        const command = this.mappings[button];
        if (!command)
            return;
        this.heldCommands[command]++;
        this.dispatchEvent(new CustomEvent('commanddown', { detail: {
                command: command,
                count: this.heldCommands[command]
            } }));
    }
    releaseButton(button) {
        this.heldButtons[button] = false;
        const command = this.mappings[button];
        if (!command)
            return;
        this.heldCommands[command]--;
        if (this.heldCommands[command] <= 0) {
            this.heldCommands[command] = 0;
        }
        this.dispatchEvent(new CustomEvent('commandup', { detail: {
                command: command,
                count: this.heldCommands[command]
            } }));
    }
}
export { GamepadInteractionSystem };
