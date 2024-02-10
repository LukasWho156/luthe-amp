class PixelCollider {
    constructor(image) {
        var _a;
        this.collisionAt = (u, v) => {
            const x = Math.floor(u * this.width);
            const y = Math.floor((1 - v) * this.height);
            const index = (y * this.width + x) * 4 + 3;
            return this.imageData[index] > 100;
        };
        this.width = image.width;
        this.height = image.height;
        const canv = new OffscreenCanvas(image.width, image.height);
        const ctxt = canv.getContext("2d");
        //@ts-ignore
        ctxt === null || ctxt === void 0 ? void 0 : ctxt.drawImage(image, 0, 0);
        //@ts-ignore
        this.imageData = [...(_a = ctxt === null || ctxt === void 0 ? void 0 : ctxt.getImageData(0, 0, image.width, image.height).data) !== null && _a !== void 0 ? _a : []];
    }
}
export { PixelCollider };
