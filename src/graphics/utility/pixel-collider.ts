import { SpriteConfiguration } from "./i-sprite.js";

class PixelCollider {

    private width;
    private height;
    private imageData;

    constructor(image: HTMLImageElement) {
        this.width = image.width;
        this.height = image.height;
        const canv = new OffscreenCanvas(image.width, image.height);
        const ctxt = canv.getContext("2d")!;
        //@ts-ignore
        ctxt?.drawImage(image, 0, 0);
        //@ts-ignore
        this.imageData = [...ctxt?.getImageData(0, 0, image.width, image.height).data ?? []];
    }

    collisionAt = (u: number, v: number) => {
        const x = Math.floor(u * this.width);
        const y = Math.floor((1 - v) * this.height);
        const index = (y * this.width + x) * 4 + 3;
        return this.imageData[index] > 100;
    }

}

export { PixelCollider };