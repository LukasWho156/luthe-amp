import { System } from "../index.js";
declare const recursiveDispose: (scene: THREE.Object3D) => number;
declare class DisposalSystem implements System {
    private _scene;
    constructor(scene: THREE.Object3D);
    unmount: () => void;
}
export { DisposalSystem, recursiveDispose };
