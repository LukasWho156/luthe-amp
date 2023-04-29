const FilmDefectShader: THREE.Shader = {
    uniforms: {
        'tDiffuse': {
            value: null
        },
        'time': {
            value: 0.0,
        },
        'threshold': {
            value: 0.01,
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

    uniform float threshold;

    varying vec2 vUv;

    void main() {

    // sample the source
        vec4 cTextureScreen = texture2D( tDiffuse, vUv );

        float dx = rand( vec2(vUv.x, 0) + sin(time) );
        float dx2 = rand( vec2(vUv.x, 0) + sin(time) + sin(time * vUv.x) );

        if(dx < threshold && dx2 < threshold) {
            gl_FragColor = vec4(1.0, 1.0, 1.0, cTextureScreen.a);
        } else {
            gl_FragColor = cTextureScreen;
        }

    }`
};

export { FilmDefectShader };