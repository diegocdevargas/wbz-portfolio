/**
 * Accretion disk shader, verbatim from the live Framer component. A 4×4 plane
 * scaled ×10: dark event horizon, lensing distortion toward the core, spiral gas from
 * three octaves of value noise, a thin photon ring and a soft violet glow, with alpha 0
 * outside the disk so only the gas is drawn.
 *
 * `uOctaves` (added) drops the finest noise layer on small screens.
 */
export const diskVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
}
`;

export const diskFragmentShader = /* glsl */ `
varying vec2 vUv;
uniform float uTime;
uniform float uVal;   // rotation speed multiplier
uniform float uVal3;  // opacity
uniform float uOctaves;

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

mat2 rotate(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
}

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
        u.y
    );
}

void main() {
    vec2 uv = vUv - 0.5;
    float dist = length(uv);

    float horizonRadius = 0.15;
    float safeDist = max(dist, horizonRadius + 0.001);

    float distortion = pow(horizonRadius / safeDist, 2.5) * 0.22;
    vec2 distortedUv = uv * (1.0 - distortion);
    float distortedDist = length(distortedUv);

    float eventHorizonMask = smoothstep(horizonRadius, horizonRadius + 0.02, dist);

    float speed = uTime * (uVal * 2.0);
    vec2 spiralUv = distortedUv * rotate(speed - (1.5 / safeDist));

    float gasNoise = valueNoise(spiralUv * 15.0) * 0.6;
    gasNoise += valueNoise(spiralUv * 35.0 + speed) * 0.3;
    if (uOctaves > 2.5) {
        gasNoise += valueNoise(spiralUv * 70.0 - speed) * 0.1;
    } else {
        gasNoise += 0.05;
    }

    float diskProfile = smoothstep(horizonRadius, horizonRadius + 0.06, distortedDist) *
                        smoothstep(0.48, 0.28, distortedDist);

    float photonRing = smoothstep(horizonRadius + 0.015, horizonRadius, dist) *
                       smoothstep(horizonRadius - 0.015, horizonRadius, dist);

    float purpleHue = 0.75;
    float subtleShift = 0.02;
    float targetHue = purpleHue + sin(uTime * 0.25) * 0.01;

    vec3 coreColor = hsv2rgb(vec3(targetHue, 0.95, 1.0));
    vec3 outerGasColor = hsv2rgb(vec3(fract(targetHue + subtleShift), 0.80, 0.85));

    vec3 baseColor = mix(coreColor, outerGasColor, distortedDist * 1.5);
    vec3 finalColor = baseColor * (0.3 + gasNoise * 1.8);
    finalColor += vec3(1.0, 0.95, 0.9) * photonRing * 2.5;

    float glowGradiant = smoothstep(0.5, horizonRadius, dist);
    float safeGlow = pow(glowGradiant, 3.5) * 0.45;

    vec3 compositeColor = (finalColor * diskProfile) + (coreColor * safeGlow);
    float alphaAlpha = (diskProfile * (0.5 + gasNoise * 0.5) + safeGlow * 0.6) * uVal3 * eventHorizonMask;

    gl_FragColor = vec4(compositeColor, alphaAlpha);
}
`;
