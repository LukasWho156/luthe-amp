const SpriteShader = {
    uniforms: {
        map: {value: null},
        frame: {value: [0, 0, 1, 1]},
    },
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

    void main() {

        vec2 frameUv = vec2(vUv.x * frame.z + frame.x, vUv.y * frame.a + frame.y);
        gl_FragColor = texture(map, frameUv);
        //gl_FragColor = vec4(frameUv.x, 0.0, frameUv.y, 1.0);

    }`
}

export default SpriteShader;