import { Sprite2D } from "./sprite-2d.js";
import { AnimationComponent } from '../components/animation-component.js';
declare class AnimatedFont {
    private _image;
    private _frames;
    private _frameWidth;
    private _glyphs;
    constructor(image: HTMLImageElement, glyphs: FontDefinition, frames: number);
    getGlyphInfo(glyph: string): GlyphInformation;
    getTextWidth(text: string): number;
    renderText(text: string): AnimatedString;
    renderMultiline(text: string, width: number): AnimatedString[];
}
type AnimatedString = {
    sprite: Sprite2D;
    component: AnimationComponent;
};
type GlyphInformation = {
    x: number;
    y: number;
    w: number;
    h: number;
};
type FontDefinition = {
    [key: string]: GlyphInformation;
};
export { AnimatedString, GlyphInformation, FontDefinition, AnimatedFont };
