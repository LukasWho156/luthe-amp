/**
 * Set up a websocket that automatically reloads the page whenever it is
 * sent a message from the server. Used for debugging in conjunction
 * with luthe_monitor.
 * 
 * @param url an optional URL for the websocket to connect to. Defaults to
 * ws://localhost:8888
 */
const connectWS = (url?: string) => {
    url ??= 'ws://localhost:8888';
    const socket = new WebSocket(url);
    socket.addEventListener('message', () => {
        window.focus(); // doesn't really work, unfortunately
        socket.send("pong");
        location.reload();
    });
}

export { connectWS };