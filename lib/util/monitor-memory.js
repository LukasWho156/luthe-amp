/**
 * Create a Memory Monitor
 *
 * @param interval How often to check the allocated memory
 * @returns null if the browser does not support the memory API, otherwise the desired memory monitor
 */
const monitorMemory = (interval = 3000) => {
    const anyPerf = performance; // hacky, but seems to be required for experimental apis?
    if (!anyPerf.memory) {
        console.warn('Memory API not supported');
        console.log(anyPerf);
        return null;
    }
    let memory = anyPerf.memory.usedJSHeapSize;
    setInterval(() => memory = anyPerf.memory.usedJSHeapSize, interval);
    const monitor = {
        getMemory: () => memory,
    };
    return monitor;
};
export { monitorMemory };
