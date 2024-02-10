/**
 * A SimpleComponent to use in a @see SimpleSystem .
 */
type SimpleComponent = {
    /**
     * Update the component.
     *
     * @param delta Time since the last update cycle, in milliseconds
     * @param globalTime Time since the game started, in milliseconds
     */
    update: (delta: number, globalTime: number) => void;
};
export { SimpleComponent };
