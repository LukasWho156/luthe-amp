/**
 * A system defining game logic, used by @see GameScreen . Note that all of
 * the methods are optional; if a method is not defined, the screen will just
 * skip it.
 */
type System = {
    /** Called once when the screen mounts */
    mount?: () => void;
    /** Called once when the screen unmounts */
    unmount?: () => void;
    /**
     * Called every frame while the screen is active.
     *
     * @param delta Time since the last update cycle, in milliseconds
     * @param globalTime Time since the game started, in milliseconds
     */
    update?: (delta: number, globalTime: number) => void;
};
export { System };
