import { System } from "../interfaces/system.js";
declare class LoadingSystem implements System {
    private _promises;
    private _fulfilled;
    private _onUpdate;
    private _onFinished;
    constructor(promises: Promise<any>[], onUpdate: (percentage: number) => void, onFinished: () => void);
    mount: () => void;
    update: () => void;
}
export { LoadingSystem };
