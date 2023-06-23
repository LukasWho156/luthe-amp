import { Game, GameScreen } from 'luthe-amp';
import { connectWS } from 'luthe-amp/lib/util/connect-ws'

import config from './config.json';

async function main() {

    //debug: connect to websocket server to enable automatic reloading
    connectWS();

    Game.init(config);

    const testScreen = new GameScreen();
    
    Game.setActiveScreen(testScreen);

    Game.start();

}

main();