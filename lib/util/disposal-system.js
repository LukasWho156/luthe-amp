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
    constructor(scene) {
        this.unmount = () => {
            recursiveDispose(this._scene);
        };
        this._scene = scene;
    }
}
export { DisposalSystem, recursiveDispose };
