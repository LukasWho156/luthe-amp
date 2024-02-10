const CelShader = {
    uniforms: {
        'tDiffuse': {
            value: null
        },
        'steps': {
            value: 4,
        }
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
    uniform sampler2D tDiffuse;
    uniform float steps;

    varying highp vec2 vUv;

    void main() {

        vec4 cTextureScreen = texture2D(tDiffuse, vUv);

        float r = cTextureScreen.x;
        float g = cTextureScreen.y;
        float b = cTextureScreen.z;

        float cMax = max(r, max(g, b));
        float cMin = min(r, min(g, b));
        float delta = cMax - cMin;

        gl_FragColor = vec4(float(round(r * steps)) / steps, float(round(g * steps)) / steps, float(round(b * steps)) / steps, cTextureScreen.a);

    }`
};
export default CelShader;
