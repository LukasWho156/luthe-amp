/**
 * This is a convenience singleton class for managing sound and music in your
 * game. Note that in the sound database, there is no distinction between
 * sounds and music and the choice if a sound should be played as a sound
 * or as music is only taken when .playSound / .playMusic is called.
 */
class AudioManager {
    /**
     * The global audio manager object. Note that the easiest way to access
     * this is using @see Game 's .audio property.
     */
    static get instance() {
        return AudioManager._instance;
    }
    /**
     * Whether or not the audio manager is muted. If it is, neither sound nor
     * music will play.
     */
    get muted() {
        return (this._muteNode.gain.value === 0);
    }
    /**
     * The current global sound volume, between 0 and 1.
     */
    get soundVolume() {
        return this._soundVolumeNode.gain.value;
    }
    /**
     * The current global music volume, between 0 and 1.
     */
    get musicVolume() {
        return this._musicVolumeNode.gain.value;
    }
    set soundVolume(value) {
        this._soundVolumeNode.gain.value = value;
    }
    set musicVolume(value) {
        this._musicVolumeNode.gain.value = value;
    }
    constructor() {
        this._sfx = new Map();
        this._groups = new Map();
        this._audioCtxt = new AudioContext();
        this._muteNode = this._audioCtxt.createGain();
        this._muteNode.connect(this._audioCtxt.destination);
        this._soundVolumeNode = this._audioCtxt.createGain();
        this._soundVolumeNode.connect(this._muteNode);
        this._musicVolumeNode = this._audioCtxt.createGain();
        this._musicVolumeNode.connect(this._muteNode);
        this._fadeInNode = this._audioCtxt.createGain();
        this._fadeInNode.connect(this._musicVolumeNode);
        this._fadeOutNode = this._audioCtxt.createGain();
        this._fadeOutNode.connect(this._musicVolumeNode);
    }
    /**
     * Register a new sound effect. Note that this method is also used
     * for registering a new music track.
     *
     * @param file The file to register
     * @param sfx The file configuration
     * @returns A promise that resolves once the sound can play through
     */
    registerSfx(file, sfx) {
        let audio = new Audio(file);
        audio.loop = sfx.loop;
        let track = this._audioCtxt.createMediaElementSource(audio);
        this._sfx.set(sfx.id, { element: audio, node: track });
        return new Promise(resolve => {
            audio.addEventListener('canplaythrough', () => {
                resolve(audio);
            });
        });
    }
    _resumeAudioContext() {
        if (this._audioCtxt.state == 'suspended') {
            this._audioCtxt.resume();
        }
    }
    /**
     * Group together a bunch of different sounds. Used by @see playRandomSound
     *
     * @param groupId The name of the group
     * @param soundIds The ids of the sounds that shall be grouped together
     */
    groupSounds(groupId, soundIds) {
        this._groups.set(groupId, soundIds);
    }
    /**
     * Play a random sound from a group of sounds. Use this if you want a
     * little more variance in your sound effects.
     *
     * @param groupId the name of the group
     */
    playRandomSound(groupId) {
        const group = this._groups.get(groupId);
        if (!group) {
            console.warn(`Unable to find sound effect group with id ${groupId}`);
            return;
        }
        this.playSound(group[Math.floor(Math.random() * group.length)]);
    }
    /**
     * Play the sound with the given id. Note that this will not restart the
     * sound if it's already playing.
     *
     * @param soundId The id of the sound
     */
    playSound(soundId) {
        this._resumeAudioContext();
        let sound = this._sfx.get(soundId);
        if (!sound) {
            console.warn(`Unable to find sound effect with id ${soundId}`);
            return;
        }
        sound.node.connect(this._soundVolumeNode);
        sound.element.play();
    }
    /**
     * Cancel the sound with the given id. Most useful to stop playing looping
     * sounds.
     *
     * @param soundId The id of the sound
     */
    cancelSound(soundId) {
        this._resumeAudioContext();
        let sound = this._sfx.get(soundId);
        if (!sound) {
            console.warn(`Unable to find sound effect with id ${soundId}`);
            return;
        }
        sound.element.pause();
        sound.element.currentTime = 0;
    }
    /**
     * Mute all audio played through this manager.
     */
    mute() {
        this._muteNode.gain.value = 0;
    }
    /**
     * Unmute the audio played through this manager. Note that this
     * doesn't influence .soundVolume and .musicVolume, respectively
     */
    unmute() {
        this._muteNode.gain.value = 1;
    }
    // perform a crossfade between the fade in and fade out node,
    // used to smoothly transition between music tracks
    _crossFade(x, stepSize) {
        if (x > 1) {
            x = 1;
        }
        this._fadeInNode.gain.value = (1 - Math.cos(x * Math.PI / 2));
        this._fadeOutNode.gain.value = (1 - Math.cos((1 - x) * Math.PI / 2));
        if (x < 1) {
            setTimeout(() => { this._crossFade(x + stepSize, stepSize); }, 50);
        }
    }
    /**
     * Play a sound as a music track. The main difference between this and
     * .playSound is that there can only be one music track playing at a
     * time. When music tracks are switched, they transition using a cross
     * fade.
     *
     * @param musicId The id
     */
    playMusic(musicId) {
        this._resumeAudioContext();
        let newTrack = this._sfx.get(musicId);
        if (!newTrack) {
            console.warn(`Unable to find music track with id ${musicId}`);
            return;
        }
        if (newTrack == this._currentTrack) {
            return;
        }
        if (this._currentTrack) {
            if (this._fadeOutTrack) {
                this._fadeOutTrack.node.disconnect();
            }
            this._currentTrack.node.disconnect();
            this._currentTrack.node.connect(this._fadeOutNode);
            this._crossFade(0, 0.05);
            this._fadeOutTrack = this._currentTrack;
        }
        newTrack.node.disconnect();
        newTrack.node.connect(this._fadeInNode);
        newTrack.element.load();
        newTrack.element.play();
        this._currentTrack = newTrack;
    }
}
AudioManager._instance = new AudioManager();
export { AudioManager };
