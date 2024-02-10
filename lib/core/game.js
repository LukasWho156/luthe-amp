import * as THREE from 'three';
import { AudioManager } from '../audio/audio-manager.js';
// @ts-ignore
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const _loader = new THREE.TextureLoader();
const _modelLoader = new GLTFLoader();
const _textureDB = new Map();
const _modelDB = new Map();
const _renderer = new THREE.WebGLRenderer();
_renderer.autoClear = false;
const _audio = AudioManager.instance;
let _overlay;
let _container;
let _width = 0;
let _height = 0;
let _activeScreen;
let _lastTime = 0;
let _maxFrameDuration = 100;
let _started = false;
let _inited = false;
let _tempPaused = false;
// set the game size
function _setSize(width, height) {
    _width = width;
    _height = height;
    _renderer.setSize(width, height);
}
let _errorCount = 0;
// main game loop
function _run(time) {
    const delta = (_lastTime > 0) ? Math.min(time - _lastTime, _maxFrameDuration) : 0;
    _lastTime = time;
    try {
        _activeScreen === null || _activeScreen === void 0 ? void 0 : _activeScreen.update(delta, time);
        _errorCount = 0;
    }
    catch (e) {
        console.error('Error in main game loop:', e);
        _errorCount++;
    }
    if (_errorCount >= 5) {
        console.error('Too many consecutive errors, unmounting current screen');
        _activeScreen.unmount();
        _started = false;
    }
    else {
        requestAnimationFrame(_run);
    }
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
    _overlay = document.createElement('div');
    _overlay.style.position = 'absolute';
    _overlay.style.width = `${Game.width}px`;
    _overlay.style.height = `${Game.height}px`;
    _overlay.style.zIndex = '100';
    _overlay.style.opacity = '0';
    _overlay.style.pointerEvents = 'none';
    _overlay.addEventListener('keydown', (e) => e.preventDefault());
    container.append(_overlay);
}
// set the canvas size as big as possible while still fitting the window.
function _resize() {
    const scale = Math.min(_container.clientWidth / _width, _container.clientHeight / _height);
    _renderer.domElement.style.transform = `scale(${scale})`;
    _overlay.style.transform = `scale(${scale})`;
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
    get overlay() { return _overlay; },
    loadTexture(file, id, settings) {
        const promise = _loader.loadAsync(file).then((tex) => {
            const tex2d = {
                texture: tex,
                settings: settings
            };
            _textureDB.set(id, tex2d);
            return tex2d;
        });
        return promise;
    },
    loadSound(file, config) {
        const promise = _audio.registerSfx(file, config);
        return promise.catch(e => window.alert(`can\'t load audio ${file}`));
    },
    loadModel(file, id) {
        const promise = _modelLoader.loadAsync(file).then((model) => {
            _modelDB.set(id, model);
            return model;
        });
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
        return (_a = _textureDB.get(id)) === null || _a === void 0 ? void 0 : _a.texture.image;
    },
    getModel(id) {
        return _modelDB.get(id);
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
        var _a, _b, _c, _d, _e, _f, _g;
        if (_inited)
            return;
        (_a = config.width) !== null && _a !== void 0 ? _a : (config.width = 800);
        (_b = config.height) !== null && _b !== void 0 ? _b : (config.height = 600);
        (_c = config.useLocalStorage) !== null && _c !== void 0 ? _c : (config.useLocalStorage = false);
        (_d = config.querySelector) !== null && _d !== void 0 ? _d : (config.querySelector = '.gameContainer');
        (_e = config.autoResize) !== null && _e !== void 0 ? _e : (config.autoResize = true);
        (_f = config.backgroundAudioPlayback) !== null && _f !== void 0 ? _f : (config.backgroundAudioPlayback = false);
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
                (_g = document.querySelector('#cookie-warning')) === null || _g === void 0 ? void 0 : _g.showModal();
            }
        }
        if (!config.backgroundAudioPlayback) {
            window.addEventListener('blur', () => {
                _tempPaused = _audio.paused;
                _audio.pause();
            });
            window.addEventListener('focus', () => {
                if (_tempPaused)
                    return;
                _audio.unpause();
            });
        }
        _inited = true;
    },
    userData: {},
};
export { Game };
