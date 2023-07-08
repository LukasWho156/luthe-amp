import * as THREE from 'three';
import { AudioManager, SoundConfiguration } from '../audio/audio-manager.js';
import { GameScreen } from './game-screen.js';

// @ts-ignore
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Handle } from '../graphics/utility/i-sprite.js';

/**
 * Define certain configuration variables for initializing the game.
 */
 type GameConfiguration = {
    /** The game's virtual width, default 800 */
    width?: number,
    /** The game's virtual height, default 600 */
    height?: number,
    /**
     * Whether or not the game makes use of window.localStorage. If this is set
     * to true and cookies are disabled, in the beginning of the game, a cookie
     * warning dialog will pop up. Default false.
     */
    useLocalStorage?: boolean,
    /**
     * The query selector of the element to which the canvas should be
     * appended, default '.gameContainer'
     */
    querySelector?: string,
    /**
     * If this is set to true, automatically resize the game to be as big as
     * possible while still fitting the window. Default true.
     */
    autoResize?: boolean,
    /**
     * If this is not set to true, the game will mute all audio playback when
     * the window loses focus. 
     */
    backgroundAudioPlayback?: boolean,
}

type TextureSettings = {
    framesX?: number,
    framesY?: number,
    handle?: Handle,
}

type Texture2D = {
    texture: THREE.Texture,
    settings?: TextureSettings,
}

/**
 * The main game object
 */
type IGame = {

    /**
     * The virtual width of the game, not necessarily the same as the actual
     * width on screen.
     */
    readonly width: number,

    /**
     * The virtual height of the game, not necessarily the same as the actual
     * height on screen.
     */
    readonly height: number,

    /**
     * The WebGLRenderer used to render to the main canvas. If you need to manually
     * append listeners to the game, use this renderer's .domElement property.
     */
    readonly renderer: THREE.WebGLRenderer,

    /**
     * The audio manager used by the game. Used for playback of sounds.
     */
    readonly audio: AudioManager,

    /**
     * Load an image into the game's texture database.
     * 
     * @param file The texture file.
     * @param id The id under which the texture can be found.
     * @returns A promise that resolves once the texture has been loaded.
     */
    loadTexture: (file: string, id: string, settings?: TextureSettings) => Promise<Texture2D>,

    loadModel: (file: string, id: string) => Promise<any>,

    /**
     * Load an audio file into the game's audio database.
     * 
     * @param file The audio file.
     * @param config A configuration object for the audio file.
     * @returns A promise that resolves once the audio has been loaded.
     */
    loadSound: (file: string, config: SoundConfiguration) => Promise<HTMLAudioElement | void>,

    /**
     * Try to retrieve a saved object from the window.localStorage. If unsuccessful, return
     * an empty object.
     * 
     * @param key The key under which the object is saved
     * @returns The parsed object or an empty object if unsuccessful
     */
    loadFromStorage: (key: string) => object,

    /**
     * Try to save an object to the window.localStorage. If unsuccessful, a warning will
     * be printed to the console, but no further error handling is implemented yet, so
     * don't rely on this method being successful.
     * 
     * @param key The key under which the object shall be saved.
     * @param item The object to save. Should be a valid JSON object.
     */
    saveToStorage: (key: string, item: object) => void,

    /**
     * Retrieve a texture object from the game's database. Note that you might wish
     * to clone this texture if you have multiple objects with the same texture and you
     * need to manipulate it.
     * 
     * @param id The id under which the texture is saved
     * @returns The desired texture if it exists
     */
    getTexture: (id: string) => Texture2D | null,

    getModel: (id: string) => any,

    /**
     * Directly retrieve a texture's image. Used if you use classic sprites for any reason.
     * 
     * @param id The id under which the texture is stored
     * @returns The desired texture if it exists
     */
    getImage: (id: string) => HTMLImageElement | null,

    /**
     * Set a screen as the game's active screen. When you call this method, first the
     * current active screen is unmounted and then the new screen is mounted, calling
     * all systems' unmount() / mount() methods, respectively.
     * 
     * @param screen The new active screen
     */
    setActiveScreen: (screen: GameScreen) => void,

    /**
     * Start the game. Once this method is called, the main game loop will be called
     * repeatedly. Subsequent calls to this method will be ignored.
     */
    start: () => void,

    /**
     * Initalize the game. When this method is called, setup certain game variables,
     * the game's renderer and append the canvas to the document. Subsequent calls
     * to this method will be ignored.
     * 
     * @param config The game configuration.
     */
    init: (config: GameConfiguration) => void,

    userData: any;
}

const _loader = new THREE.TextureLoader();
const _modelLoader = new GLTFLoader();
const _textureDB = new Map();
const _modelDB = new Map();

const _renderer = new THREE.WebGLRenderer();
_renderer.autoClear = false;
const _audio = AudioManager.instance;

let _container: HTMLElement;

let _width = 0;
let _height = 0;

let _activeScreen: GameScreen;
let _lastTime = 0;

let _maxFrameDuration = 100;

let _started = false;
let _inited = false;

let _tempPaused: boolean = false;

// set the game size
function _setSize(width: number, height: number) {
    _width = width;
    _height = height;
    _renderer.setSize(width, height);
}

// main game loop
function _run(time: number) {
    const delta = (_lastTime > 0) ? Math.min(time - _lastTime, _maxFrameDuration) : 0;
    _lastTime = time;
    _activeScreen?.update(delta, time);
    requestAnimationFrame(_run);
}

// append the html5 canvas to the given container
function _appendTo(container: HTMLElement | null) {
    if(!container) {
        throw new Error('Cannot find game container');
    }
    _container = container;
    container.append(_renderer.domElement);
    _renderer.domElement.tabIndex = 0;
    _renderer.domElement.addEventListener('keydown', (e: Event) => e.preventDefault());
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
const Game: IGame = {

    get width() { return _width; },
    get height() { return _height; },
    get renderer() { return _renderer },
    get audio() { return _audio },

    loadTexture(file: string, id: string, settings?: TextureSettings) {
        const promise = _loader.loadAsync(file).then((tex: THREE.Texture) => {
            const tex2d: Texture2D = {
                texture: tex,
                settings: settings
            }
            _textureDB.set(id, tex2d);
            return tex2d;
        });
        return promise;
    },

    loadSound(file: string, config: SoundConfiguration) {
        const promise = _audio.registerSfx(file, config);
        return promise.catch(e => window.alert(`can\'t load audio ${file}`));
    },

    loadModel(file: string, id: string) {
        const promise = _modelLoader.loadAsync(file).then((model: any) => {
            _modelDB.set(id, model);
            return model;
        });
        return promise;
    },

    loadFromStorage(key: string) {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : {};
        } catch(e) {
            return {}
        }
    },

    saveToStorage(key: string, item: object) {
        try {
            window.localStorage.setItem(key, JSON.stringify(item))
        } catch(e) {
            console.warn(`Unable to save data ${key}`);
        }
    },

    getTexture(id: string) {
        return _textureDB.get(id);
    },

    getImage(id: string) {
        return _textureDB.get(id)?.texture.image;
    },

    getModel(id: string) {
        return _modelDB.get(id);
    },

    setActiveScreen(screen: GameScreen) {
        if(typeof _activeScreen?.unmount === 'function') _activeScreen?.unmount();
        if(typeof screen?.mount === 'function') screen?.mount();
        _activeScreen = screen;
    },

    start() {
        if(!_inited) return;
        if(_started) return;
        _started = true;
        requestAnimationFrame(_run);
    },

    init(config) {
        if(_inited) return;
        config.width ??= 800;
        config.height ??= 600;
        config.useLocalStorage ??= false;
        config.querySelector ??= '.gameContainer';
        config.autoResize ??= true;
        config.backgroundAudioPlayback ??= false;
        _setSize(config.width, config.height);
        _appendTo(document.querySelector(config.querySelector));
        if(config.autoResize) {
            _resize();
            window.addEventListener('resize', _resize);
        }
        if(config.useLocalStorage) {
            try {
                window.localStorage
            } catch(e) {
                (document.querySelector('#cookie-warning') as HTMLDialogElement)?.showModal();
            }
        }
        if(!config.backgroundAudioPlayback) {
            window.addEventListener('blur', () => {
                _tempPaused = _audio.paused;
                _audio.pause();
            });
            window.addEventListener('focus', () => {
                if(_tempPaused) return;
                _audio.unpause();
            })
        }
        _inited = true;
    },

    userData: {},

}

export { GameConfiguration, Texture2D, IGame, Game };