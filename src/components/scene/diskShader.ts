/**
 * Accretion disk shader, built on the live Framer component's: a 4×4 plane scaled ×10
 * with a dark event horizon, lensing distortion toward the core and spiral gas from
 * value noise, with alpha 0 outside the disk so only the gas is drawn.
 *
 * Restyle on top of the original:
 * - Doppler beaming: one side of the disk is brighter and whiter, the other dimmer and
 *   redder. `uSpin` is the disk's current Z rotation, so the bright side stays put on
 *   screen while the gas turns.
 * - Thin orbital filaments over the noise, so the gas reads as streaks, not fog.
 * - A temperature gradient: white-hot inner edge, violet middle, deep indigo rim.
 * - A thin, over-bright photon ring plus a faint secondary ring, for the bloom to catch.
 *
 * Colours go above 1.0 on purpose; with `uHdr` at 0 (no post-processing, e.g. phones)
 * they are softly compressed instead, so nothing clips to flat white.
 * `uOctaves` drops the finest noise layer on small screens.
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
uniform float uSpin;  // disk Z rotation, radians
uniform float uHdr;   // 1 when bloom + tone mapping run after this pass

const float PI = 3.14159265;

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
    float outerRadius = 0.45;
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

    // Thin orbital filaments, wobbled by the gas so they break up instead of forming clean rings.
    float bands = 0.5 + 0.5 * sin(distortedDist * 140.0 + gasNoise * 7.0);
    bands = pow(bands, 6.0);
    float detail = gasNoise * 0.75 + bands * 0.45;

    float diskProfile = smoothstep(horizonRadius, horizonRadius + 0.06, distortedDist) *
                        smoothstep(0.48, 0.28, distortedDist);

    // Temperature: 0 at the inner edge, 1 at the rim.
    float r = clamp((distortedDist - horizonRadius) / (outerRadius - horizonRadius), 0.0, 1.0);
    float hueDrift = sin(uTime * 0.25) * 0.01;
    vec3 hot = vec3(1.0, 0.92, 1.0);
    vec3 violet = hsv2rgb(vec3(0.75 + hueDrift, 0.88, 1.0));
    vec3 indigo = hsv2rgb(vec3(0.70 + hueDrift, 0.92, 0.45));
    vec3 baseColor = mix(hot, violet, smoothstep(0.0, 0.3, r));
    baseColor = mix(baseColor, indigo, smoothstep(0.3, 1.0, r));

    // Doppler beaming, fixed in screen space: brightest on the left.
    float phi = atan(uv.y, uv.x) + uSpin;
    float doppler = 1.0 + 0.45 * cos(phi - PI);
    float beam = pow(doppler, 2.5);
    baseColor = mix(baseColor, vec3(1.0), clamp((doppler - 1.0) * 0.6, 0.0, 0.3));
    baseColor *= mix(vec3(1.0), vec3(1.0, 0.5, 0.7), clamp(1.0 - doppler, 0.0, 1.0) * 1.5);

    vec3 finalColor = baseColor * (0.25 + detail * 1.6) * beam;

    // Photon ring: a thin over-bright line hugging the horizon, and a faint echo outside it.
    float ringA = (dist - horizonRadius - 0.012) / 0.005;
    float ringB = (dist - horizonRadius - 0.035) / 0.004;
    float photonRing = exp(-ringA * ringA);
    float echoRing = exp(-ringB * ringB) * 0.3;
    vec3 ringColor = vec3(1.0, 0.94, 1.0) * (0.6 + 0.4 * beam);

    float glowGradiant = smoothstep(0.5, horizonRadius, dist);
    float safeGlow = pow(glowGradiant, 3.5) * 0.45;

    vec3 compositeColor = (finalColor * diskProfile) + (violet * safeGlow) +
                          ringColor * (photonRing * 4.0 + echoRing * 1.5);
    if (uHdr < 0.5) {
        compositeColor = compositeColor / (1.0 + max(compositeColor - 0.8, 0.0));
    }

    float alphaAlpha = (diskProfile * (0.5 + gasNoise * 0.5) + safeGlow * 0.6 + photonRing + echoRing) *
                       uVal3 * eventHorizonMask;

    gl_FragColor = vec4(compositeColor, clamp(alphaAlpha, 0.0, 1.0));
}
`;
