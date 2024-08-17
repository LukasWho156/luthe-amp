const recursiveDispose = (scene) => {
    let disposed = 0;
    for (const child of scene.children) {
        disposed += recursiveDispose(child);
    }
    const anyScene = scene;
    if (typeof (anyScene.dispose) === 'function') {
        anyScene.dispose();
        disposed += 1;
    }
    return disposed;
};
class DisposalSystem {
    _scene;
    constructor(scene) {
        this._scene = scene;
    }
    unmount = () => {
        recursiveDispose(this._scene);
    };
}
export { DisposalSystem, recursiveDispose };
