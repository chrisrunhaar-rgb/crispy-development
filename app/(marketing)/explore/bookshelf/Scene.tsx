"use client";

import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import type { ExploreShelf } from "@/lib/explore-topics";
import {
  BOARD_T,
  SHELF_D,
  SHELF_H,
  buildShelfLayout,
  type BookInstance,
  type RoomProfile,
} from "./shelf-layout";
import { ROW_Y } from "./shelf-layout";
import { EDGE_UV, cellUvOffset, type CoverAtlas } from "./covers";
import { BRAND, SHELF_TIMBER, SHELF_TIMBER_DARK, oklchToSRGB } from "./palette";
import { activeShelf, clamp, framingDolly, rigState } from "./rig";

/* ------------------------------------------------------------------ */
/* colour helpers                                                      */
/* ------------------------------------------------------------------ */

function makeColor(L: number, C: number, h: number): THREE.Color {
  const { r, g, b } = oklchToSRGB(L, C, h);
  const c = new THREE.Color();
  c.setRGB(r, g, b, THREE.SRGBColorSpace);
  return c;
}

/* ------------------------------------------------------------------ */
/* geometry                                                            */
/* ------------------------------------------------------------------ */

/**
 * A unit box whose +Z face carries the full atlas cell and whose other five
 * faces collapse to the cell's page-edge strip, plus a per-instance
 * `aUvOffset` picking the cell. One instanced draw call per shelf.
 */
function makeBookGeometry(instances: BookInstance[]): THREE.BufferGeometry {
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const uv = geo.getAttribute("uv") as THREE.BufferAttribute;
  // BoxGeometry face order: +X, -X, +Y, -Y, +Z, -Z — 4 verts each.
  for (let f = 0; f < 6; f++) {
    if (f === 4) continue; // +Z keeps the real cover UVs
    for (let v = 0; v < 4; v++) {
      uv.setXY(f * 4 + v, EDGE_UV[0], EDGE_UV[1]);
    }
  }
  uv.needsUpdate = true;

  const offsets = new Float32Array(instances.length * 2);
  instances.forEach((b, i) => {
    const [ox, oy] = cellUvOffset(b.cell);
    offsets[i * 2] = ox;
    offsets[i * 2 + 1] = oy;
  });
  geo.setAttribute("aUvOffset", new THREE.InstancedBufferAttribute(offsets, 2));
  return geo;
}

const NOOP_RAYCAST = () => null;

/* ------------------------------------------------------------------ */
/* one shelf                                                           */
/* ------------------------------------------------------------------ */

interface ShelfProps {
  shelf: ExploreShelf;
  index: number;
  profile: RoomProfile;
  atlas: CoverAtlas;
  bookMaterial: THREE.Material;
  timber: THREE.Material;
  timberDark: THREE.Material;
  box: THREE.BoxGeometry;
  plane: THREE.PlaneGeometry;
  step: number;
  onPick: (shelfIndex: number, resourceIndex: number) => void;
  register: (index: number, node: ShelfHandle) => void;
}

export interface ShelfHandle {
  group: THREE.Group;
  scrim: THREE.MeshBasicMaterial;
  books: THREE.InstancedMesh | null;
  visible: boolean;
}

function Shelf({
  shelf,
  index,
  profile,
  atlas,
  bookMaterial,
  timber,
  timberDark,
  box,
  plane,
  step,
  onPick,
  register,
}: ShelfProps) {
  const groupRef = useRef<THREE.Group>(null);
  const booksRef = useRef<THREE.InstancedMesh>(null);
  const scrimRef = useRef<THREE.MeshBasicMaterial>(null);
  const handleRef = useRef<ShelfHandle | null>(null);

  const instances = useMemo(
    () => buildShelfLayout(shelf, atlas.cellFor, profile),
    [shelf, atlas, profile]
  );
  const geometry = useMemo(() => makeBookGeometry(instances), [instances]);

  const labelTexture = useMemo(() => {
    const t = new THREE.CanvasTexture(atlas.labels[index]);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [atlas, index]);

  const backdropColor = useMemo(() => makeColor(0.26, 0.062, shelf.hue), [shelf.hue]);

  const W = profile.shelfW;
  const R = profile.radius;
  const theta = index * step;

  useLayoutEffect(() => {
    const mesh = booksRef.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();
    instances.forEach((b, i) => {
      e.set(b.rotation[0], b.rotation[1], b.rotation[2]);
      q.setFromEuler(e);
      p.set(b.position[0], b.position[1], b.position[2]);
      s.set(b.scale[0], b.scale[1], b.scale[2]);
      m.compose(p, q, s);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [instances]);

  useLayoutEffect(() => {
    if (!groupRef.current || !scrimRef.current) return;
    const handle: ShelfHandle = {
      group: groupRef.current,
      scrim: scrimRef.current,
      books: booksRef.current,
      visible: true,
    };
    handleRef.current = handle;
    register(index, handle);
  }, [index, register]);

  useLayoutEffect(() => {
    return () => {
      geometry.dispose();
      labelTexture.dispose();
    };
  }, [geometry, labelTexture]);

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      if (handleRef.current && !handleRef.current.visible) return;
      const id = e.instanceId;
      if (id === undefined) return;
      const meta = instances[id];
      if (!meta || meta.resourceIndex === null) return;
      e.stopPropagation();
      onPick(index, meta.resourceIndex);
    },
    [instances, index, onPick]
  );

  const handleOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      const id = e.instanceId;
      const clickable = id !== undefined && instances[id]?.resourceIndex !== null;
      document.body.style.cursor = clickable ? "pointer" : "auto";
    },
    [instances]
  );

  const handleOut = useCallback(() => {
    document.body.style.cursor = "auto";
  }, []);

  return (
    <group
      ref={groupRef}
      position={[Math.sin(theta) * R, -SHELF_H / 2, Math.cos(theta) * R]}
      rotation={[0, theta + Math.PI, 0]}
    >
      {/* hue-washed backdrop wall — the topic accent reading #1 */}
      <mesh
        geometry={plane}
        position={[0, SHELF_H / 2, -SHELF_D / 2 - 0.35]}
        scale={[W * 1.55, SHELF_H * 1.5, 1]}
        raycast={NOOP_RAYCAST}
      >
        <meshStandardMaterial color={backdropColor} roughness={0.95} metalness={0} />
      </mesh>

      {/* carcass */}
      <mesh
        geometry={box}
        material={timberDark}
        position={[0, SHELF_H / 2, -SHELF_D / 2 + 0.03]}
        scale={[W, SHELF_H, 0.06]}
        raycast={NOOP_RAYCAST}
      />
      <mesh
        geometry={box}
        material={timber}
        position={[-W / 2 + 0.05, SHELF_H / 2, 0]}
        scale={[0.1, SHELF_H, SHELF_D]}
        raycast={NOOP_RAYCAST}
      />
      <mesh
        geometry={box}
        material={timber}
        position={[W / 2 - 0.05, SHELF_H / 2, 0]}
        scale={[0.1, SHELF_H, SHELF_D]}
        raycast={NOOP_RAYCAST}
      />
      {ROW_Y.map((y, i) => (
        <mesh
          key={i}
          geometry={box}
          material={timber}
          position={[0, y - BOARD_T / 2, 0]}
          scale={[W, BOARD_T, SHELF_D]}
          raycast={NOOP_RAYCAST}
        />
      ))}
      <mesh
        geometry={box}
        material={timber}
        position={[0, SHELF_H - BOARD_T / 2, 0]}
        scale={[W, BOARD_T, SHELF_D]}
        raycast={NOOP_RAYCAST}
      />

      {/* engraved end-label plate — the topic accent reading #3 */}
      <mesh
        geometry={plane}
        position={[0, SHELF_H + 0.42, SHELF_D / 2 - 0.1]}
        scale={[Math.min(W * 0.62, 3.0), Math.min(W * 0.62, 3.0) / 4, 1]}
        raycast={NOOP_RAYCAST}
      >
        <meshStandardMaterial map={labelTexture} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* books */}
      <instancedMesh
        ref={booksRef}
        args={[geometry, bookMaterial, instances.length]}
        onClick={handleClick}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
      />

      {/* rack-focus scrim: neighbours fall back into the dark */}
      <mesh
        geometry={plane}
        position={[0, SHELF_H / 2, SHELF_D / 2 + 0.9]}
        scale={[W * 1.7, SHELF_H * 1.7, 1]}
        renderOrder={10}
        raycast={NOOP_RAYCAST}
      >
        <meshBasicMaterial
          ref={scrimRef}
          color={makeColor(BRAND.navyDeep.L * 0.7, BRAND.navyDeep.C, BRAND.navyDeep.h)}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* camera rig + lighting                                               */
/* ------------------------------------------------------------------ */

interface RigProps {
  count: number;
  step: number;
  profile: RoomProfile;
  progress: MotionValue<number>;
  handles: React.RefObject<Map<number, ShelfHandle>>;
  accents: THREE.Color[];
  onActiveChange: (index: number) => void;
}

/** local→world for a point in front of shelf at angle theta. */
function localToWorld(theta: number, R: number, lx: number, lz: number) {
  const s = Math.sin(theta);
  const c = Math.cos(theta);
  return { x: s * (R - lz) - lx * c, z: c * (R - lz) + lx * s };
}

function Rig({ count, step, profile, progress, handles, accents, onActiveChange }: RigProps) {
  const { camera, size } = useThree();
  const keyRef = useRef<THREE.PointLight>(null);
  const fillRef = useRef<THREE.PointLight>(null);
  const sweepRef = useRef<THREE.PointLight>(null);
  const lastActive = useRef(-1);
  const tmpColor = useMemo(() => new THREE.Color(), []);

  const dollyMax = useMemo(
    () => framingDolly(profile, size.width / Math.max(size.height, 1)),
    [profile, size.width, size.height]
  );

  useFrame((_, delta) => {
    const st = rigState(progress.get(), count);
    const yaw = st.shelfFloat * step;

    // Ease back toward the centre of the room mid-turn so the 45° swing reads
    // as a turn of the head, not a lurch past the shelves.
    const dolly = dollyMax * (1 - 0.82 * st.motion);
    camera.position.set(Math.sin(yaw) * dolly, 0.16 * st.motion, Math.cos(yaw) * dolly);
    camera.rotation.set(0, yaw + Math.PI, 0);

    // colour of the light follows the topic being faced
    const lo = Math.floor(st.shelfFloat) % count;
    const hi = (lo + 1) % count;
    const f = st.shelfFloat - Math.floor(st.shelfFloat);
    tmpColor.copy(accents[lo]).lerp(accents[hi], f);

    const keyPos = localToWorld(yaw, profile.radius, 0.85, 3.1);
    const fillPos = localToWorld(yaw, profile.radius, -1.9, 2.3);
    const sweepT = 1 - st.reveal;
    const sweepPos = localToWorld(yaw, profile.radius, -profile.shelfW * 0.5 + profile.shelfW * sweepT, 1.5);

    if (keyRef.current) {
      keyRef.current.position.set(keyPos.x, 3.2, keyPos.z);
      keyRef.current.color.copy(tmpColor);
    }
    if (fillRef.current) {
      fillRef.current.position.set(fillPos.x, 0.4, fillPos.z);
      fillRef.current.color.copy(tmpColor);
    }
    if (sweepRef.current) {
      sweepRef.current.position.set(sweepPos.x, 1.4, sweepPos.z);
      const target = Math.sin(Math.PI * clamp(sweepT, 0, 1)) * 42;
      sweepRef.current.intensity = THREE.MathUtils.damp(
        sweepRef.current.intensity,
        st.reveal > 0 || sweepT < 1 ? target : 0,
        14,
        delta
      );
    }

    // visibility cull + rack-focus scrim
    const map = handles.current;
    if (map) {
      for (const [i, h] of map) {
        let d = i - st.shelfFloat;
        d = ((d + count / 2) % count + count) % count - count / 2;
        const ad = Math.abs(d);
        const vis = ad < 1.62;
        if (h.visible !== vis) {
          h.visible = vis;
          h.group.visible = vis;
          // three's raycaster ignores `visible`, so park hidden shelves on a
          // layer neither the camera nor the pointer raycaster tests.
          h.group.traverse((o) => o.layers.set(vis ? 0 : 1));
        }
        if (vis) {
          h.scrim.opacity = clamp((ad - 0.1) / 0.7, 0, 1) * 0.9;
        }
      }
    }

    const act = activeShelf(st, count);
    if (act !== lastActive.current) {
      lastActive.current = act;
      onActiveChange(act);
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} color={makeColor(0.5, 0.05, 262)} />
      <hemisphereLight
        intensity={0.35}
        color={makeColor(0.7, 0.03, 250)}
        groundColor={makeColor(0.2, 0.05, 262)}
      />
      <pointLight ref={keyRef} intensity={46} distance={17} decay={2} />
      <pointLight ref={fillRef} intensity={16} distance={13} decay={2} />
      <pointLight
        ref={sweepRef}
        intensity={0}
        distance={11}
        decay={2}
        color={makeColor(0.97, 0.01, 85)}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* scene root                                                          */
/* ------------------------------------------------------------------ */

interface SceneProps {
  shelves: ExploreShelf[];
  atlas: CoverAtlas;
  profile: RoomProfile;
  progress: MotionValue<number>;
  onPick: (shelfIndex: number, resourceIndex: number) => void;
  onActiveChange: (index: number) => void;
}

export default function Scene({
  shelves,
  atlas,
  profile,
  progress,
  onPick,
  onActiveChange,
}: SceneProps) {
  const { gl } = useThree();
  const count = shelves.length;
  const step = (Math.PI * 2) / count;
  const handles = useRef<Map<number, ShelfHandle>>(new Map());

  const register = useCallback((index: number, node: ShelfHandle) => {
    handles.current.set(index, node);
  }, []);

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(atlas.canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.wrapS = THREE.ClampToEdgeWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    t.needsUpdate = true;
    return t;
  }, [atlas, gl]);

  const bookMaterial = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.62,
      metalness: 0.02,
    });
    m.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nattribute vec2 aUvOffset;")
        .replace(
          "#include <uv_vertex>",
          "#include <uv_vertex>\n#ifdef USE_MAP\n\tvMapUv = uv * 0.125 + aUvOffset;\n#endif"
        );
    };
    m.customProgramCacheKey = () => "explore-atlas-books";
    return m;
  }, [texture]);

  const timber = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: makeColor(SHELF_TIMBER.L, SHELF_TIMBER.C, SHELF_TIMBER.h),
        roughness: 0.78,
        metalness: 0.04,
      }),
    []
  );
  const timberDark = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: makeColor(SHELF_TIMBER_DARK.L, SHELF_TIMBER_DARK.C, SHELF_TIMBER_DARK.h),
        roughness: 0.9,
        metalness: 0.02,
      }),
    []
  );

  const box = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const plane = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const accents = useMemo(
    () => shelves.map((s) => makeColor(0.72, 0.075, s.hue)),
    [shelves]
  );

  useLayoutEffect(() => {
    return () => {
      texture.dispose();
      bookMaterial.dispose();
      timber.dispose();
      timberDark.dispose();
      box.dispose();
      plane.dispose();
    };
  }, [texture, bookMaterial, timber, timberDark, box, plane]);

  return (
    <>
      <color attach="background" args={[makeColor(0.14, 0.045, 262).getHex()]} />
      <fog attach="fog" args={[makeColor(0.13, 0.04, 262).getHex(), profile.radius * 0.6, profile.radius * 2.1]} />

      <Rig
        count={count}
        step={step}
        profile={profile}
        progress={progress}
        handles={handles}
        accents={accents}
        onActiveChange={onActiveChange}
      />

      {shelves.map((shelf, i) => (
        <Shelf
          key={shelf.key}
          shelf={shelf}
          index={i}
          profile={profile}
          atlas={atlas}
          bookMaterial={bookMaterial}
          timber={timber}
          timberDark={timberDark}
          box={box}
          plane={plane}
          step={step}
          onPick={onPick}
          register={register}
        />
      ))}

      {/* floor — catches the key light and grounds the room */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -SHELF_H / 2 - 0.01, 0]}
        geometry={plane}
        scale={[profile.radius * 3, profile.radius * 3, 1]}
        raycast={NOOP_RAYCAST}
      >
        <meshStandardMaterial
          color={makeColor(0.17, 0.04, 262)}
          roughness={0.55}
          metalness={0.15}
        />
      </mesh>
    </>
  );
}
