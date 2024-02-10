import * as THREE from 'three';
import { SimpleSystem } from '../../core/simple-system.js';
import { MouseInteractionSystem } from '../../input/mouse-interaction-system.js';
import { AnimationComponent } from '../components/animation-component.js';
import { AnimatedString } from './animated-font.js';
import { Sprite2D } from './sprite-2d.js';
import { Handle } from './i-sprite.js';
declare class OptionsMenu extends THREE.Group {
    _mouseSys: MouseInteractionSystem;
    _renderer: OptionsRenderer;
    _animationSys?: SimpleSystem | undefined;
    constructor(renderer: OptionsRenderer, mouseSys: MouseInteractionSystem, animationSys?: SimpleSystem);
    addTextLabel(text: string, x: number, y: number, scale?: number, align?: Handle, obj?: THREE.Object3D): AnimatedString;
    addButton(text: string, x: number, y: number, onClick: () => void, scale?: number, align?: Handle, obj?: THREE.Object3D): void;
    addListButton(texts: string[], currentIndex: number, x: number, y: number, onSelect: (i: number) => void, scale?: number, align?: Handle, obj?: THREE.Object3D): void;
    addCheckbox(checked: boolean, x: number, y: number, onToggle: (checked: boolean) => void, scale?: number, obj?: THREE.Object3D): void;
    addSlider(x: number, y: number, defaultValue: number, onValueChanged: (value: number) => void, scale?: number, instantUpdate?: boolean): void;
}
type Slider = {
    barSprite: Sprite2D;
    barComponent: AnimationComponent;
    knobSprite: Sprite2D;
    knobComponent: AnimationComponent;
    bounds: {
        left: number;
        width: number;
    };
};
type OptionsRenderer = {
    renderText: (text: string) => AnimatedString;
    renderCheckbox: (entity: any) => AnimatedString;
    renderSlider: (entity: any) => Slider;
};
export { OptionsMenu, Slider, OptionsRenderer };
