import { SimpleComponent } from "../interfaces/simple-component.js";
import { System } from "../interfaces/system.js";
/**
 * A very simple @see System that updates a list of @see SimpleComponent s.
 * You can use this as a convenience class when you have components that
 * only need time information.
 */
declare class SimpleSystem implements System {
    private _components;
    /**
     * Create a new simple system.
     */
    constructor();
    /**
     * Add a component to this system.
     * @param component The component to add. Should have an update method
     * @param component.update A method that updates the component, passes
     * delta and globalTime
     */
    add: (component: SimpleComponent) => void;
    /**
     * Implementation of the update method, usually no need to call this manually.
     *
     * @param delta Time since last update, in milliseconds
     * @param globalTime Total time since game start, in milliseconds
     */
    update: (delta: number, globalTime: number) => void;
}
export { SimpleSystem };
