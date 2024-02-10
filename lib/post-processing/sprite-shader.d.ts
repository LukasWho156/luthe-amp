type UniformDefinitions = {
    [key: string]: {
        value: any;
    };
};
declare const SpriteShader: (uniforms: UniformDefinitions, shaderCode: string) => {
    uniforms: {
        map: {
            value: null;
        };
        frame: {
            value: number[];
        };
        pixelSize: {
            value: number[];
        };
    };
    vertexShader: string;
    fragmentShader: string;
};
export default SpriteShader;
