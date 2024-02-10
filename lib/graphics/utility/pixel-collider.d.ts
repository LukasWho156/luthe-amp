declare class PixelCollider {
    private width;
    private height;
    private imageData;
    constructor(image: HTMLImageElement);
    collisionAt: (u: number, v: number) => boolean;
}
export { PixelCollider };
