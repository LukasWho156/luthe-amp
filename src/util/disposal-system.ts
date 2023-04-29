import { System } from "../index.js";

const recursiveDispose = (scene: THREE.Object3D) => {
    let disposed = 0;
    for(const child of scene.children) {
        disposed += recursiveDispose(child);
    }
    const anyScene = <any>scene;
    if(typeof(anyScene.dispose) === 'function') {
        anyScene.dispose();
        disposed += 1;
    }
    return disposed;
}

class DisposalSystem implements System {

    private _scene: THREE.Object3D;

    constructor(scene: THREE.Object3D) {
        this._scene = scene;
    }

    unmount = () => {
        recursiveDispose(this._scene);
    }

}

export { DisposalSystem, recursiveDispose };