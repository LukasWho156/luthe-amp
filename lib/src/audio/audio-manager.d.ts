/**
 * This is a convenience singleton class for managing sound and music in your
 * game. Note that in the sound database, there is no distinction between
 * sounds and music and the choice if a sound should be played as a sound
 * or as music is only taken when .playSound / .playMusic is called.
 */
declare class AudioManager {
    private _sfx;
    private _currentTrack?;
    private _fadeOutTrack?;
    private _audioCtxt;
    private _muteNode;
    private _soundVolumeNode;
    private _musicVolumeNode;
    private _fadeInNode;
    private _fadeOutNode;
    private _groups;
    private static _instance;
    /**
     * The global audio manager object. Note that the easiest way to access
     * this is using @see Game 's .audio property.
     */
    static get instance(): AudioManager;
    /**
     * Whether or not the audio manager is muted. If it is, neither sound nor
     * music will play.
     */
    get muted(): boolean;
    /**
     * The current global sound volume, between 0 and 1.
     */
    get soundVolume(): number;
    /**
     * The current global music volume, between 0 and 1.
     */
    get musicVolume(): number;
    set soundVolume(value: number);
    set musicVolume(value: number);
    private constructor();
    /**
     * Register a new sound effect. Note that this method is also used
     * for registering a new music track.
     *
     * @param file The file to register
     * @param sfx The file configuration
     * @returns A promise that resolves once the sound can play through
     */
    registerSfx(file: string, sfx: SoundConfiguration): Promise<HTMLAudioElement>;
    private _resumeAudioContext;
    /**
     * Group together a bunch of different sounds. Used by @see playRandomSound
     *
     * @param groupId The name of the group
     * @param soundIds The ids of the sounds that shall be grouped together
     */
    groupSounds(groupId: string, soundIds: string[]): void;
    /**
     * Play a random sound from a group of sounds. Use this if you want a
     * little more variance in your sound effects.
     *
     * @param groupId the name of the group
     */
    playRandomSound(groupId: string): void;
    /**
     * Play the sound with the given id. Note that this will not restart the
     * sound if it's already playing.
     *
     * @param soundId The id of the sound
     */
    playSound(soundId: string): void;
    /**
     * Cancel the sound with the given id. Most useful to stop playing looping
     * sounds.
     *
     * @param soundId The id of the sound
     */
    cancelSound(soundId: string): void;
    /**
     * Mute all audio played through this manager.
     */
    mute(): void;
    /**
     * Unmute the audio played through this manager. Note that this
     * doesn't influence .soundVolume and .musicVolume, respectively
     */
    unmute(): void;
    private _crossFade;
    /**
     * Play a sound as a music track. The main difference between this and
     * .playSound is that there can only be one music track playing at a
     * time. When music tracks are switched, they transition using a cross
     * fade.
     *
     * @param musicId The id
     */
    playMusic(musicId: string): void;
}
/**
 * A type representing a sound effect, containing both the HTML element
 * and the audio node.
 */
type SoundEffect = {
    element: HTMLAudioElement;
    node: AudioNode;
};
/** A type used to define sound properties when registering sound effects */
type SoundConfiguration = {
    /** The id under which the sound should be saved */
    id: string;
    /** Whether or not the sound should repeat once it finishes */
    loop: boolean;
};
export { SoundConfiguration, SoundEffect, AudioManager };
