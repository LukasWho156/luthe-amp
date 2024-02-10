import * as THREE from 'three';
import { Game } from '../../core/game.js';
import { Draggable } from '../../input/draggable.js';
import { MouseInteractionComponent } from '../../input/mouse-interaction-component.js';
class OptionsMenu extends THREE.Group {
    constructor(renderer, mouseSys, animationSys) {
        super();
        this._animationSys = animationSys;
        this._mouseSys = mouseSys;
        this._renderer = renderer;
    }
    addTextLabel(text, x, y, scale = 1, align, obj = this) {
        var _a;
        const res = this._renderer.renderText(text);
        const sprite = res.sprite;
        sprite.material.color.set(0x000000);
        sprite.setScale(scale, scale);
        sprite.setPosition(x, y, 1);
        if (align)
            sprite.setHandle(align);
        obj.add(sprite);
        (_a = this._animationSys) === null || _a === void 0 ? void 0 : _a.add(res.component);
        return res;
    }
    addButton(text, x, y, onClick, scale, align, obj) {
        const btn = this.addTextLabel(text, x, y, scale, align, obj);
        const interaction = new MouseInteractionComponent({ cursor: 'pointer' }, btn.sprite);
        interaction.addEventListener('hover', () => {
            btn.sprite.material.opacity = 1;
        });
        interaction.addEventListener('leave', () => {
            btn.sprite.material.opacity = 0.7;
        });
        interaction.addEventListener('click', () => {
            onClick();
            Game.audio.playSound('click');
        });
        this._mouseSys.add(interaction);
    }
    addListButton(texts, currentIndex, x, y, onSelect, scale, align, obj) {
        const sprites = texts.map((text, i) => {
            const btn = this.addTextLabel(text, x, y, scale, align, obj);
            if (i !== currentIndex) {
                btn.sprite.layers.disable(0);
            }
            return btn.sprite;
        });
        for (let i = 0; i < sprites.length; i++) {
            const nextIndex = (i + 1) % sprites.length;
            const interaction = new MouseInteractionComponent({ cursor: 'pointer' }, sprites[i]);
            interaction.addEventListener('hover', () => {
                sprites[i].material.opacity = 1;
            });
            interaction.addEventListener('leave', () => {
                sprites[i].material.opacity = 0.7;
            });
            interaction.addEventListener('click', () => {
                sprites[i].layers.disable(0);
                sprites[nextIndex].layers.enable(0);
                onSelect(nextIndex);
                Game.audio.playSound('click');
            });
            this._mouseSys.add(interaction);
        }
    }
    addCheckbox(checked, x, y, onToggle, scale = 1, obj = this) {
        var _a;
        const entity = {
            cursor: 'pointer',
            checked: checked,
            animationState: (checked ? 'checked' : 'unchecked'),
        };
        const checkbox = this._renderer.renderCheckbox(entity);
        const sprite = checkbox.sprite;
        sprite.setPosition(x, y, 1);
        sprite.setScale(scale, scale);
        obj.add(sprite);
        (_a = this._animationSys) === null || _a === void 0 ? void 0 : _a.add(checkbox.component);
        const interaction = new MouseInteractionComponent(entity, sprite);
        interaction.addEventListener('hover', () => {
            sprite.material.opacity = 1;
        });
        interaction.addEventListener('leave', () => {
            sprite.material.opacity = 0.7;
        });
        interaction.addEventListener('click', () => {
            entity.checked = !entity.checked;
            entity.animationState = (entity.checked ? 'checked' : 'unchecked');
            onToggle(entity.checked);
            Game.audio.playSound('click');
        });
        this._mouseSys.add(interaction);
    }
    addSlider(x, y, defaultValue, onValueChanged, scale = 1, instantUpdate = false) {
        var _a, _b;
        const slider = this._renderer.renderSlider({ animationState: 'idle' });
        const barSprite = slider.barSprite;
        barSprite.setPosition(x, y, 1);
        barSprite.setScale(scale, scale);
        (_a = this._animationSys) === null || _a === void 0 ? void 0 : _a.add(slider.barComponent);
        this.add(barSprite);
        const l = slider.bounds.left;
        const w = slider.bounds.width;
        const knobSprite = slider.knobSprite;
        knobSprite.setPosition((x + l + w * Math.max(0, Math.min(1, defaultValue))), y, 0.5);
        knobSprite.setScale(scale, scale);
        (_b = this._animationSys) === null || _b === void 0 ? void 0 : _b.add(slider.knobComponent);
        const knob = new Draggable(knobSprite, { x: x + l, y: y, w: w, h: 0 }, { cursor: 'pointer' });
        knob.addEventListener((instantUpdate ? 'dragmove' : 'dragend'), (event) => {
            onValueChanged((event.detail.x - x - l) / w);
        });
        knob.addEventListener('dragend', () => Game.audio.playSound('click'));
        this._mouseSys.add(knob.component);
        this.add(knobSprite);
    }
}
export { OptionsMenu };
