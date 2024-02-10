/**
 * Set up a websocket that automatically reloads the page whenever it is
 * sent a message from the server. Used for debugging in conjunction
 * with luthe_monitor.
 *
 * @param url an optional URL for the websocket to connect to. Defaults to
 * ws://localhost:8888
 */
declare const connectWS: (url?: string) => void;
export { connectWS };
