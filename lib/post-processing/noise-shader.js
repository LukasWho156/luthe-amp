const NoiseShader = {
    uniforms: {
        'tDiffuse': {
            value: null
        },
        'time': {
            value: 0.0,
        },
        'intensity': {
            value: 0.5,
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

    uniform float intensity;

    varying vec2 vUv;

    void main() {

    // sample the source
        vec4 cTextureScreen = texture2D( tDiffuse, vUv );

        float dx = rand( vUv + sin(time) );

        vec3 cResult = cTextureScreen.rgb + cTextureScreen.rgb * intensity * (dx - 0.5);

        gl_FragColor =  vec4( cResult, cTextureScreen.a );

    }`
};
export { NoiseShader };
