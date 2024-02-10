import * as THREE from 'three';
import { AudioManager } from '../audio/audio-manager.js';
const _loader = new THREE.TextureLoader();
const _textureDB = new Map();
const _renderer = new THREE.WebGLRenderer();
_renderer.autoClear = false;
const _audio = AudioManager.instance;
let _container;
let _width = 0;
let _height = 0;
let _activeScreen;
let _lastTime = 0;
let _maxFrameDuration = 100;
let _started = false;
let _inited = false;
// set the game size
function _setSize(width, height) {
    _width = width;
    _height = height;
    _renderer.setSize(width, height);
}
// main game loop
function _run(time) {
    const delta = (_lastTime > 0) ? Math.min(time - _lastTime, _maxFrameDuration) : 0;
    _lastTime = time;
    _activeScreen === null || _activeScreen === void 0 ? void 0 : _activeScreen.update(delta, time);
    requestAnimationFrame(_run);
}
// append the html5 canvas to the given container
function _appendTo(container) {
    if (!container) {
        throw new Error('Cannot find game container');
    }
    _container = container;
    container.append(_renderer.domElement);
    _renderer.domElement.tabIndex = 0;
    _renderer.domElement.addEventListener('keydown', (e) => e.preventDefault());
}
// set the canvas size as big as possible while still fitting the window.
function _resize() {
    const scale = Math.min(_container.clientWidth / _width, _container.clientHeight / _height);
    _renderer.domElement.style.transform = `scale(${scale})`;
}
/**
 * This is the core object of the framework. It contains methods for asset
 * management, save state management, initalization and DOM manipulation.
 *
 * To get started with your game, create a config object and call this object's init()
 * method, prepare your initial game state and finally call this object's start() method.
 */
const Game = {
    get width() { return _width; },
    get height() { return _height; },
    get renderer() { return _renderer; },
    get audio() { return _audio; },
    loadTexture(file, id) {
        const promise = _loader.loadAsync(file).then((tex) => {
            _textureDB.set(id, tex);
            return tex;
        });
        return promise;
    },
    loadSound(file, config) {
        const promise = _audio.registerSfx(file, config);
        return promise;
    },
    loadFromStorage(key) {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : {};
        }
        catch (e) {
            return {};
        }
    },
    saveToStorage(key, item) {
        try {
            window.localStorage.setItem(key, JSON.stringify(item));
        }
        catch (e) {
            console.warn(`Unable to save data ${key}`);
        }
    },
    getTexture(id) {
        return _textureDB.get(id);
    },
    getImage(id) {
        var _a;
        return (_a = _textureDB.get(id)) === null || _a === void 0 ? void 0 : _a.image;
    },
    setActiveScreen(screen) {
        if (typeof (_activeScreen === null || _activeScreen === void 0 ? void 0 : _activeScreen.unmount) === 'function')
            _activeScreen === null || _activeScreen === void 0 ? void 0 : _activeScreen.unmount();
        if (typeof (screen === null || screen === void 0 ? void 0 : screen.mount) === 'function')
            screen === null || screen === void 0 ? void 0 : screen.mount();
        _activeScreen = screen;
    },
    start() {
        if (!_inited)
            return;
        if (_started)
            return;
        _started = true;
        requestAnimationFrame(_run);
    },
    init(config) {
        var _a, _b, _c, _d, _e, _f;
        if (_inited)
            return;
        (_a = config.width) !== null && _a !== void 0 ? _a : (config.width = 800);
        (_b = config.height) !== null && _b !== void 0 ? _b : (config.height = 600);
        (_c = config.useLocalStorage) !== null && _c !== void 0 ? _c : (config.useLocalStorage = false);
        (_d = config.querySelector) !== null && _d !== void 0 ? _d : (config.querySelector = '.gameContainer');
        (_e = config.autoResize) !== null && _e !== void 0 ? _e : (config.autoResize = true);
        _setSize(config.width, config.height);
        _appendTo(document.querySelector(config.querySelector));
        if (config.autoResize) {
            _resize();
            window.addEventListener('resize', _resize);
        }
        if (config.useLocalStorage) {
            try {
                window.localStorage;
            }
            catch (e) {
                (_f = document.querySelector('#cookie-warning')) === null || _f === void 0 ? void 0 : _f.showModal();
            }
        }
        _inited = true;
    },
};
export { Game };
