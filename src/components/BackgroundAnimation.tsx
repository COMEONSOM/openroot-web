/**
 * ============================================================
 * BACKGROUND-ANIMATION COMPONENT — OPENROOT SCI-FI CORE (2026)
 * FULL TYPESCRIPT • THREE.JS COMPATIBLE • ZERO SHORTCUTS
 * ============================================================
 */

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";

export default function CalmPremiumCore() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ================= Renderer =================
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(1.75, window.devicePixelRatio || 1));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    mount.appendChild(renderer.domElement);

    // ================= Scene + Camera =================
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020308);

    const camera = new THREE.PerspectiveCamera(
      38,
      mount.clientWidth / mount.clientHeight,
      0.1,
      8000
    );
    camera.position.set(0, 26, 240);
    scene.add(camera);

    // ================= Post Processing =================
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloom = new UnrealBloomPass(
      new THREE.Vector2(mount.clientWidth, mount.clientHeight),
      0.55, 0.25, 0.3
    );
    bloom.threshold = 0.4;
    bloom.strength = 0.55;
    bloom.radius = 0.2;
    composer.addPass(bloom);

    const fxaaPass = new ShaderPass(FXAAShader);
    const pr = renderer.getPixelRatio();
    fxaaPass.material.uniforms["resolution"].value.set(
      1 / (mount.clientWidth * pr),
      1 / (mount.clientHeight * pr)
    );
    composer.addPass(fxaaPass);

    // ================= Lights =================
    scene.add(new THREE.AmbientLight(0xffffff, 0.08));
    const dir = new THREE.DirectionalLight(0xdff6ff, 0.9);
    dir.position.set(50, 80, 30);
    scene.add(dir);

    // ================= Stars =================
    const starCount = 800;
    const starPositions = new Float32Array(starCount * 3);
    const starPhases = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const r = 400 + Math.random() * 1200;
      const t = Math.random() * Math.PI * 2;
      const p = (Math.random() - 0.5) * 0.7;
      starPositions[i * 3] = Math.cos(t) * r;
      starPositions[i * 3 + 1] = p * r * 0.3;
      starPositions[i * 3 + 2] = Math.sin(t) * r;
      starPhases[i] = Math.random() * Math.PI * 2;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute("phase", new THREE.BufferAttribute(starPhases, 1));

    const starMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { time: { value: 0 } },
      vertexShader: `
        attribute float phase;
        uniform float time;
        varying float vBlink;
        void main(){
          vBlink = phase + time * 0.002;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 1.0 + sin(vBlink) * 1.6;
        }
      `,
      fragmentShader: `
        varying float vBlink;
        void main(){
          float a = 0.4 + sin(vBlink) * 0.6;
          gl_FragColor = vec4(0.45, 0.85, 1.0, a);
        }
      `
    });
    const stars = new THREE.Points(starGeo, starMat);
    camera.add(stars);

    // ================= Core Objects =================
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(9.5, 72, 72),
      new THREE.MeshStandardMaterial({
        color: 0xe8fbff,
        emissive: 0x009dff,
        emissiveIntensity: 0.45,
        roughness: 0.06,
        metalness: 0.35
      })
    );
    coreGroup.add(core);

    // Plasma shell shader
    const shellMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { iTime: { value: 0 } },
      vertexShader: `
        varying vec3 vN;
        varying vec3 vV;
        void main(){
          vN = normalize(normalMatrix * normal);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vV = -mv.xyz;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform float iTime;
        varying vec3 vN;
        varying vec3 vV;
        float hash(vec2 p){
          return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453);
        }
        void main(){
          vec3 n = normalize(vN);
          vec3 v = normalize(vV);
          float fres = pow(1.0 - max(0.0, dot(n, v)), 2.0);
          float scan = sin(n.y * 18.0 + iTime * 4.0) * 0.5 + 0.5;
          float noise = hash(n.xy * 10.0 + iTime * 0.1) * 0.35;
          float glow = fres * (0.5 + scan * 0.4 + noise * 0.2);
          vec3 col = mix(vec3(0.0,0.6,1.0), vec3(0.6,0.3,1.0), scan);
          gl_FragColor = vec4(col * glow, glow * 0.8);
        }
      `
    });

    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(13.5, 72, 72),
      shellMat
    );
    coreGroup.add(shell);

    // Lights inside core
    const coreLight = new THREE.PointLight(0x66eaff, 1.1, 500, 2);
    coreGroup.add(coreLight);

    const rimLight = new THREE.PointLight(0x8844ff, 0.7, 260, 2.2);
    rimLight.position.set(0, 0, -40);
    coreGroup.add(rimLight);

    // Orbiting cube
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 2.2, 2.2),
      new THREE.MeshStandardMaterial({
        color: 0x66ccff,
        emissive: 0x2299ff,
        emissiveIntensity: 1,
        metalness: 0.6,
        roughness: 0.2
      })
    );
    coreGroup.add(cube);

    let orbitAngle = 0;
    const orbitRadius = 28;

    // ================= HUD =================
    const hudCanvas = document.createElement("canvas");
    hudCanvas.width = 512;
    hudCanvas.height = 128;
    const hudCtx = hudCanvas.getContext("2d")!;
    const hudTex = new THREE.CanvasTexture(hudCanvas);

    const hudPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(130, 30),
      new THREE.MeshBasicMaterial({
        map: hudTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    hudPlane.position.set(0, -26, -38);
    hudPlane.rotation.x = -0.12;
    coreGroup.add(hudPlane);

    let iteration = 0;
    const startTime = performance.now();

    function updateHUD() {
      const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);

      hudCtx.clearRect(0, 0, 512, 128);

      hudCtx.fillStyle = "rgba(170,230,255,0.95)";
      hudCtx.font = "700 20px Inter, system-ui";
      hudCtx.fillText("Openroot Heart", 20, 36);

      hudCtx.fillStyle = "rgba(140,200,255,0.95)";
      hudCtx.font = "600 16px Inter, system-ui";
      hudCtx.fillText(`uptime: ${elapsed}s`, 20, 70);

      hudCtx.fillStyle = "rgba(210,170,255,0.9)";
      hudCtx.fillText(`iter: ${iteration}`, 20, 96);

      hudCtx.fillStyle = "rgba(80,140,255,0.05)";
      for (let y = 0; y < 128; y += 2) {
        hudCtx.fillRect(0, y, 512, 1);
      }

      hudTex.needsUpdate = true;
    }

    // ================= Motion State =================
    const state = { x: 0.5, y: 0.5, vx: 0, vy: 0, path: [] as THREE.Vector3[] };

    function gradient(u: number, v: number, t: number) {
      const nx = u * 2 - 1;
      const ny = v * 2 - 1;
      return {
        gx: Math.sin(nx * 2.3 + t * 0.001) * 0.45,
        gy: Math.cos(ny * 2.8 - t * 0.0012) * 0.4
      };
    }

    function stepMotion(dt: number, now: number) {
      const g = gradient(state.x, state.y, now);
      state.vx = state.vx * 0.92 + g.gx * dt * 0.00012;
      state.vy = state.vy * 0.92 + g.gy * dt * 0.00012;
      state.x += state.vx;
      state.y += state.vy;
      state.x = THREE.MathUtils.clamp(state.x, 0.04, 0.96);
      state.y = THREE.MathUtils.clamp(state.y, 0.04, 0.96);

      const px = (state.x - 0.5) * 90;
      const py = (state.y - 0.5) * 50;
      state.path.push(new THREE.Vector3(px, py, 0));
      if (state.path.length > 32) state.path.shift();
    }

    // ================= Animation Loop =================
    let last = performance.now();
    let running = true;

    const frame = (now: number) => {
      if (!running) return;
      const dt = now - last;
      last = now;

      const t = now * 0.00012;

      // Camera motion
      camera.position.x = Math.sin(t) * 9;
      camera.position.z = 240 + Math.cos(t * 0.6) * 8;
      camera.position.y = 26 + Math.sin(now * 0.00009) * 3;
      camera.lookAt(new THREE.Vector3(0, 10 + Math.sin(now * 0.0004) * 0.5, 0));

      // Stars
      starMat.uniforms.time.value = now;

      // Core & Cube motion
      stepMotion(dt, now);

      const lastP = state.path[state.path.length - 1] ?? new THREE.Vector3();
      const target = new THREE.Vector3(lastP.x, lastP.y + 6, -14);
      coreGroup.position.lerp(target, 0.08);

      core.rotation.y += 0.0025;

      const pulse = (Math.sin(now * 0.003 * 2.2) + 1) * 0.5;
      const scale = 1 + pulse * 0.04;
      core.scale.set(scale, scale, scale);

      shellMat.uniforms.iTime.value = now * 0.001;

      orbitAngle += dt * 0.0006;
      cube.position.set(
        Math.cos(orbitAngle) * orbitRadius,
        Math.sin(orbitAngle * 2) * 6,
        Math.sin(orbitAngle) * orbitRadius
      );
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.015;

      const motion = Math.min(1, Math.hypot(state.vx, state.vy) * 50);
      (core.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.45 + motion * 0.5;
      coreLight.intensity = 1.0 + motion * 0.8;

      if (Math.random() < 0.015) iteration++;

      updateHUD();
      composer.render();
    };

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      composer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const pr = renderer.getPixelRatio();
      fxaaPass.material.uniforms["resolution"].value.set(
        1 / (w * pr),
        1 / (h * pr)
      );
    };

    window.addEventListener("resize", resize);
    resize();

    renderer.setAnimationLoop(frame);

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
      renderer.setAnimationLoop(null);
      composer.dispose();
      renderer.dispose();
      try {
        mount.removeChild(renderer.domElement);
      } catch {}
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -1
      }}
    />
  );
}
