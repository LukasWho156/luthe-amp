
const VignetteShader: THREE.Shader = {
    uniforms: {
        'tDiffuse': {
            value: null
        },
        'time': {
            value: 0.0
        },
        'baseInt': {
            value: 0.5,
        },
        'intAmp': {
            value: 0.25,
        },
        'intFreq': {
            value: 1000,
        },
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

    // control parameter
    uniform float time;

    uniform sampler2D tDiffuse;

    uniform float baseInt;
    uniform float intAmp;
    uniform float intFreq;

    varying vec2 vUv;

    void main() {

    // sample the source
        vec4 cTextureScreen = texture2D( tDiffuse, vUv );

        float relX = 0.5 - vUv.x;
        float relY = 0.5 - vUv.y;

        float intensity = baseInt + intAmp * sin(time / intFreq);

        float blackness = 1.0 - intensity * (relX * relX + relY * relY);

        vec3 cResult = vec3( cTextureScreen.x * blackness, cTextureScreen.y * blackness, cTextureScreen.z * blackness );

        gl_FragColor =  vec4( cResult, cTextureScreen.a );

    }`
};

export { VignetteShader };