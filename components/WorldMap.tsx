"use client";

import { useEffect, useRef, useState } from "react";

// Region → [lat, lng]
const REGION_COORDS: Record<string, [number, number]> = {
  "East Asia":       [ 35,   105],
  "Southeast Asia":  [  5,   115],
  "South Asia":      [ 20,    78],
  "West Africa":     [  8,     2],
  "East Africa":     [ -1,    37],
  "Europe":          [ 50,    10],
  "Middle East":     [ 25,    45],
  "North America":   [ 40,  -100],
  "Latin America":   [-15,   -60],
  "Oceania":         [-25,   135],
};

const COUNTRY_COORDS: Record<string, [number, number]> = {
  NL: [52.4, 5.3],  DE: [51.2, 10.5], GB: [54.4, -2.0],  FR: [46.6, 2.3],
  US: [37.1,-95.7], CA: [56.1,-106.3], AU: [-25.3,133.8], NZ: [-40.9,174.9],
  SG: [1.35,103.8], MY: [3.1,101.7],  ID: [-2.5,118.0],  PH: [12.9,121.8],
  TH: [15.9,100.9], VN: [14.1,108.3], IN: [20.6, 79.1],  LK: [7.9, 80.8],
  CN: [35.9,104.2], JP: [36.2,138.3], KR: [35.9,127.8],
  KE: [-0.0, 37.9], TZ: [-6.4, 34.9], NG: [9.1, 8.7],   GH: [7.9, -1.0],
  ZA: [-28.5,24.7], ET: [9.1, 40.5],  UG: [1.4, 32.3],
  BR: [-14.2,-51.9],CO: [4.6,-74.1],  PE: [-9.2,-75.0],  MX: [23.6,-102.6],
  EG: [26.8, 30.8], SA: [23.9, 45.1], AE: [23.4, 53.8],  TR: [39.0, 35.2],
  PK: [30.4, 69.3], BD: [23.7, 90.4], MM: [19.2, 96.7],
};

// Compute subsolar point (lat/lng where sun is directly overhead) from a Date
function getSunLatLng(date: Date): [number, number] {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getUTCFullYear(), 0, 0).getTime()) / 86400000
  );
  const declinationDeg = -23.45 * Math.cos((2 * Math.PI / 365) * (dayOfYear + 10));
  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const lngDeg = -(utcHours - 12) * 15;
  return [declinationDeg, lngDeg];
}

// Convert lat/lng (degrees) to Three.js XYZ on unit sphere
function latLngToVec3(lat: number, lng: number, radius = 1): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta),
  ];
}

interface Group {
  region: string;
}

const DAY_NIGHT_VERT = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPos;
void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const DAY_NIGHT_FRAG = `
uniform sampler2D dayMap;
uniform sampler2D nightMap;
uniform vec3 sunDir;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPos;

void main() {
  vec3 n = normalize(vNormal);
  float cosA = dot(n, normalize(sunDir));
  // Wide twilight zone: -0.2 → 0.2
  float t = smoothstep(-0.18, 0.18, cosA);
  vec4 day = texture2D(dayMap, vUv);
  vec4 night = texture2D(nightMap, vUv);
  // Slightly boost night city lights
  night.rgb *= 1.4;
  gl_FragColor = mix(night, day, t);
}
`;

export default function WorldMap({ groups }: { groups: Group[] }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeRegions] = useState(() => new Set(groups.map(g => g.region)));
  const [visitorCoords, setVisitorCoords] = useState<[number, number] | null>(null);

  // Fetch visitor location
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(d => {
        const c = COUNTRY_COORDS[d.country_code];
        if (c) setVisitorCoords(c);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let THREE: typeof import("three");
    let renderer: import("three").WebGLRenderer;
    let animId: number;
    let destroyed = false;

    import("three").then(mod => {
      if (destroyed) return;
      THREE = mod;

      // Scene
      const scene = new THREE.Scene();
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
      camera.position.z = 2.5;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h);
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      // Textures — NASA Blue Marble + city lights
      const loader = new THREE.TextureLoader();
      const dayTex = loader.load(
        "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg"
      );
      const nightTex = loader.load(
        "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_lights_2048.png"
      );

      // Globe mesh
      const geo = new THREE.SphereGeometry(1, 64, 64);
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          dayMap:   { value: dayTex },
          nightMap: { value: nightTex },
          sunDir:   { value: new THREE.Vector3(1, 0, 0) },
        },
        vertexShader: DAY_NIGHT_VERT,
        fragmentShader: DAY_NIGHT_FRAG,
      });
      const globe = new THREE.Mesh(geo, mat);
      scene.add(globe);

      // Thin atmosphere glow
      const atmosGeo = new THREE.SphereGeometry(1.025, 64, 64);
      const atmosMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0x1a3a7a),
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide,
      });
      const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
      scene.add(atmosMesh);

      // Pin markers
      const pinGroup = new THREE.Group();
      scene.add(pinGroup);

      const buildPins = (visitor: [number, number] | null) => {
        while (pinGroup.children.length) pinGroup.remove(pinGroup.children[0]);

        Object.entries(REGION_COORDS).forEach(([name, [lat, lng]]) => {
          const isActive = activeRegions.has(name);
          const [x, y, z] = latLngToVec3(lat, lng, 1.015);
          const pinGeo = new THREE.SphereGeometry(isActive ? 0.022 : 0.010, 8, 8);
          const pinMat = new THREE.MeshBasicMaterial({
            color: isActive ? 0xe07540 : 0x3a5080,
            transparent: true,
            opacity: isActive ? 0.92 : 0.45,
          });
          const pin = new THREE.Mesh(pinGeo, pinMat);
          pin.position.set(x, y, z);
          pinGroup.add(pin);

          // Orange glow ring for active
          if (isActive) {
            const ringGeo = new THREE.SphereGeometry(0.036, 8, 8);
            const ringMat = new THREE.MeshBasicMaterial({
              color: 0xe07540,
              transparent: true,
              opacity: 0.22,
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.set(x, y, z);
            pinGroup.add(ring);
          }
        });

        // Visitor pin (white with orange center)
        if (visitor) {
          const [x, y, z] = latLngToVec3(visitor[0], visitor[1], 1.018);
          const outerGeo = new THREE.SphereGeometry(0.028, 8, 8);
          const outerMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });
          const outer = new THREE.Mesh(outerGeo, outerMat);
          outer.position.set(x, y, z);
          pinGroup.add(outer);

          const innerGeo = new THREE.SphereGeometry(0.012, 8, 8);
          const innerMat = new THREE.MeshBasicMaterial({ color: 0xe07540 });
          const inner = new THREE.Mesh(innerGeo, innerMat);
          inner.position.set(x, y, z);
          pinGroup.add(inner);
        }
      };

      buildPins(visitorCoords);

      // Lighting (subtle for atmosphere effect)
      const ambient = new THREE.AmbientLight(0xffffff, 0.15);
      scene.add(ambient);

      // Drag rotation state
      let isDragging = false;
      let prevX = 0;
      let rotY = -0.6; // start facing Asia-Pacific
      let rotX = 0.15;
      let velX = 0;
      let autoRotateSpeed = 0.0018;

      const onDown = (e: MouseEvent | TouchEvent) => {
        isDragging = true;
        prevX = "touches" in e ? e.touches[0].clientX : e.clientX;
        velX = 0;
      };
      const onMove = (e: MouseEvent | TouchEvent) => {
        if (!isDragging) return;
        const x = "touches" in e ? e.touches[0].clientX : e.clientX;
        const dx = x - prevX;
        velX = dx * 0.008;
        rotY += velX;
        prevX = x;
      };
      const onUp = () => { isDragging = false; };

      renderer.domElement.addEventListener("mousedown", onDown);
      renderer.domElement.addEventListener("mousemove", onMove);
      renderer.domElement.addEventListener("mouseup", onUp);
      renderer.domElement.addEventListener("mouseleave", onUp);
      renderer.domElement.addEventListener("touchstart", onDown, { passive: true });
      renderer.domElement.addEventListener("touchmove", onMove, { passive: true });
      renderer.domElement.addEventListener("touchend", onUp);

      // Resize
      const ro = new ResizeObserver(() => {
        if (!mount) return;
        const w2 = mount.clientWidth;
        const h2 = mount.clientHeight;
        camera.aspect = w2 / h2;
        camera.updateProjectionMatrix();
        renderer.setSize(w2, h2);
      });
      ro.observe(mount);

      // Animate
      const animate = () => {
        animId = requestAnimationFrame(animate);

        // Real sun direction from current UTC time
        const [sunLat, sunLng] = getSunLatLng(new Date());
        const [sx, sy, sz] = latLngToVec3(sunLat, sunLng);
        mat.uniforms.sunDir.value.set(sx, sy, sz);

        // Rotation
        if (!isDragging) {
          rotY += autoRotateSpeed;
          velX *= 0.92;
          rotY += velX;
        } else {
          velX *= 0.9;
        }

        globe.rotation.y = rotY;
        globe.rotation.x = rotX;
        atmosMesh.rotation.y = rotY;
        atmosMesh.rotation.x = rotX;
        pinGroup.rotation.y = rotY;
        pinGroup.rotation.x = rotX;

        renderer.render(scene, camera);
      };

      animate();

      // Rebuild pins if visitor coords arrive
      const lastVisitor = visitorCoords;
      if (lastVisitor) buildPins(lastVisitor);
    });

    return () => {
      destroyed = true;
      cancelAnimationFrame(animId);
      if (renderer) {
        renderer.dispose();
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitorCoords]);

  return (
    <div style={{ position: "relative" }}>
      {/* Globe canvas */}
      <div
        ref={mountRef}
        style={{
          width: "100%",
          maxWidth: "640px",
          aspectRatio: "1 / 1",
          margin: "0 auto",
          cursor: "grab",
          userSelect: "none",
        }}
      />

      {/* Legend */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        marginTop: "1.25rem",
        flexWrap: "wrap",
      }}>
        <LegendDot color="oklch(65% 0.15 45)" glow label={
          activeRegions.size > 0
            ? `${activeRegions.size} active region${activeRegions.size !== 1 ? "s" : ""}`
            : "Groups forming"
        } />
        <LegendDot color="oklch(38% 0.07 260)" label="Potential regions" />
        {visitorCoords && (
          <LegendDot color="white" label="Your location" outline />
        )}
      </div>

      {/* Drag hint */}
      <p style={{
        textAlign: "center",
        marginTop: "0.75rem",
        fontFamily: "var(--font-montserrat)",
        fontSize: "0.58rem",
        fontWeight: 600,
        letterSpacing: "0.12em",
        color: "oklch(48% 0.04 260)",
        textTransform: "uppercase",
      }}>
        Drag to explore
      </p>
    </div>
  );
}

function LegendDot({ color, label, glow, outline }: {
  color: string; label: string; glow?: boolean; outline?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span style={{
        width: "8px", height: "8px", borderRadius: "50%",
        background: color,
        display: "inline-block",
        boxShadow: glow ? `0 0 6px ${color}` : "none",
        outline: outline ? "1.5px solid oklch(65% 0.15 45)" : "none",
        outlineOffset: outline ? "1.5px" : "0",
      }} />
      <span style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "0.58rem",
        fontWeight: 600,
        letterSpacing: "0.1em",
        color: "oklch(58% 0.04 260)",
        textTransform: "uppercase",
      }}>
        {label}
      </span>
    </div>
  );
}
