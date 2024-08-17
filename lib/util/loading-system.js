class LoadingSystem {
    _promises;
    _fulfilled;
    _onUpdate;
    _onFinished;
    constructor(promises, onUpdate, onFinished) {
        this._promises = promises;
        this._fulfilled = 0;
        this._onUpdate = onUpdate;
        this._onFinished = onFinished;
    }
    mount = () => {
        for (const promise of this._promises) {
            promise.then(() => {
                this._fulfilled++;
            });
        }
        Promise.all(this._promises).then(this._onFinished);
    };
    update = () => {
        const percentage = this._fulfilled / this._promises.length;
        this._onUpdate(percentage);
    };
}
export { LoadingSystem };
