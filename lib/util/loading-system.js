class LoadingSystem {
    constructor(promises, onUpdate, onFinished) {
        this.mount = () => {
            for (const promise of this._promises) {
                promise.then(() => {
                    this._fulfilled++;
                });
            }
            Promise.all(this._promises).then(this._onFinished);
        };
        this.update = () => {
            const percentage = this._fulfilled / this._promises.length;
            this._onUpdate(percentage);
        };
        this._promises = promises;
        this._fulfilled = 0;
        this._onUpdate = onUpdate;
        this._onFinished = onFinished;
    }
}
export { LoadingSystem };
