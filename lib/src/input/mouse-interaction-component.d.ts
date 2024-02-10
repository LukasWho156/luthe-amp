declare class MouseInteractionComponent extends EventTarget {
    private _entity;
    private _object3d;
    get entity(): any;
    get object3d(): import("three").Object3D<import("three").Event>;
    constructor(entity: any, object3d: THREE.Object3D);
    hovered(event: MouseEvent): true | undefined;
    unhovered(event?: MouseEvent): true | undefined;
    clicked(event: MouseEvent): boolean;
    dblclicked(event: MouseEvent): boolean;
    dragged(event: MouseEvent): boolean;
    dragStart(event: MouseEvent): boolean;
    dragEnd(event: MouseEvent): boolean;
}
export { MouseInteractionComponent };
