import { System } from "../interfaces/system.js";

class LoadingSystem implements System {

    private _promises: Promise<any>[];
    private _fulfilled: number;
    private _onUpdate: (percentage: number) => void;
    private _onFinished: () => void;

    constructor(promises: Promise<any>[], onUpdate: (percentage: number) => void, onFinished: () => void) {
        this._promises = promises;
        this._fulfilled = 0;
        this._onUpdate = onUpdate;
        this._onFinished = onFinished;
    }

    mount = () => {
        for(const promise of this._promises) {
            promise.then(() => {
                this._fulfilled++;
            })
        }
        Promise.all(this._promises).then(this._onFinished);
    }

    update = () => {
        const percentage = this._fulfilled / this._promises.length;
        this._onUpdate(percentage);
    }

}

export { LoadingSystem };