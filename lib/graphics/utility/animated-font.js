import * as THREE from 'three';
import { Sprite2D } from "./sprite-2d.js";
import { AnimationComponent } from '../components/animation-component.js';
class AnimatedFont {
    constructor(image, glyphs, frames) {
        this._image = image;
        this._frames = frames;
        this._frameWidth = image.width / frames;
        this._glyphs = glyphs;
    }
    getGlyphInfo(glyph) {
        if (this._glyphs[glyph])
            return this._glyphs[glyph];
        return this._glyphs['?'];
    }
    getTextWidth(text) {
        let width = 0;
        for (const char of text) {
            width += this.getGlyphInfo(char).w;
        }
        return width;
    }
    renderText(text) {
        let totalWidth = this.getTextWidth(text);
        let lineHeight = this.getGlyphInfo('a').h;
        const canvas = document.createElement('canvas');
        canvas.setAttribute('width', (totalWidth * this._frames).toString());
        canvas.setAttribute('height', lineHeight.toString());
        const ctxt = canvas.getContext('2d');
        if (!ctxt) {
            throw new Error('Unable to get canvas context');
        }
        let caretX = 0;
        for (const glyph of text) {
            const info = this.getGlyphInfo(glyph);
            for (let frame = 0; frame < this._frames; frame++) {
                ctxt.drawImage(this._image, info.x + frame * this._frameWidth, info.y, info.w, info.h, caretX + frame * totalWidth, 0, info.w, info.h);
            }
            caretX += info.w;
        }
        const sprite = new Sprite2D({
            texture: {
                texture: new THREE.CanvasTexture(canvas),
                settings: { framesX: this._frames },
            },
        });
        const entity = { animationState: 'idle' };
        const component = new AnimationComponent(entity, sprite);
        component.defineAnimation('idle', {
            frames: [0, 1, 2],
            loop: true,
            frameDuration: 100,
        });
        return {
            sprite: sprite,
            component: component,
        };
    }
    renderMultiline(text, width) {
        const result = [];
        if (text.includes('\n')) {
            for (const subText of text.split('\n')) {
                result.push(...this.renderMultiline(subText, width));
            }
            return result;
        }
        const words = text.split(' ').reverse();
        let nextWord = words.pop();
        while (nextWord) {
            let currentLine = nextWord;
            let caretX = this.getTextWidth(currentLine);
            while (true) {
                nextWord = words.pop();
                const addedWidth = this.getTextWidth(` ${nextWord}`);
                if (caretX + addedWidth > width || !nextWord) {
                    result.push(this.renderText(currentLine));
                    break;
                }
                currentLine += ` ${nextWord}`;
                caretX += addedWidth;
            }
        }
        return result;
    }
}
export { AnimatedFont };
