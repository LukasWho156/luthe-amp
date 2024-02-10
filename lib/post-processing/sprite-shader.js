const SpriteShader = (uniforms, shaderCode) => ({
    uniforms: Object.assign({ map: { value: null }, frame: { value: [0, 0, 1, 1] }, pixelSize: { value: [0, 0] } }, uniforms),
    vertexShader: 
    /* glsl */
    `
    varying vec2 vUv;

    void main() {

        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }`,
    fragmentShader: 
    /* glsl */
    `
    #include <common>

    varying vec2 vUv;

    uniform sampler2D map;
    uniform vec4 frame;
    uniform vec2 pixelSize;

    ${shaderCode}

    void main() {

        vec2 frameUv = vec2(vUv.x * frame.z + frame.x, vUv.y * frame.a + frame.y);
        vec4 inputColor = texture(map, frameUv);
        gl_FragColor = applyShader(inputColor, frameUv);

    }`
});
export default SpriteShader;
