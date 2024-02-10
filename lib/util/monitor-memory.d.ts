/**
 * A convenience object for montioring memory usage.
 */
type MemoryMonitor = {
    /**
     * Get the current memory usage
     *
     * @returns The currently used JS memory, in bytes
     */
    getMemory: () => number;
};
/**
 * Create a Memory Monitor
 *
 * @param interval How often to check the allocated memory
 * @returns null if the browser does not support the memory API, otherwise the desired memory monitor
 */
declare const monitorMemory: (interval?: number) => MemoryMonitor | null;
export { MemoryMonitor, monitorMemory };
