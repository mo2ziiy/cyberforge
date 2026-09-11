"use client";

import { useRef, useState, useEffect, useCallback } from "react";

/* ─── constants ──────────────────────────────── */
const R = 95; // sphere radius
const HALF = 150; // SVG half-size
const FOV = 520; // perspective

const P = "var(--primary)";
const S = "var(--secondary)";
const A = "var(--accent)";
const COLS = [P, S, A, P, S];

/* ─── math ───────────────────────────────────── */
type V3 = [number, number, number];

const rotY = ([x, y, z]: V3, a: number): V3 => [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];
const rotX = ([x, y, z]: V3, a: number): V3 => [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
const transform = (v: V3, ax: number, ay: number): V3 => rotX(rotY(v, ay), ax);

const project = (v: V3) => {
  const s = FOV / (FOV + v[2]);
  return { x: v[0] * s, y: v[1] * s, z: v[2], s };
};

/* ─── static geometry ────────────────────────── */
const NODES = Array.from({ length: 16 }, (_, i) => {
  const phi = Math.PI * (3 - Math.sqrt(5));
  const cy = 1 - (i / 15) * 2;
  const cr = Math.sqrt(Math.max(0, 1 - cy * cy));
  const theta = phi * i;
  return {
    pos: [R * cr * Math.cos(theta), R * cy, R * cr * Math.sin(theta)] as V3,
    color: COLS[i % 5],
    r: i % 4 === 0 ? 4.2 : i % 3 === 0 ? 3.2 : 2.4,
    big: i % 4 === 0,
  };
});

const EDGES: [number, number][] = (() => {
  const maxD = R * 1.35;
  const out: [number, number][] = [];
  const cnt = new Array(16).fill(0);
  for (let i = 0; i < 16; i++) {
    for (let j = i + 1; j < 16; j++) {
      if (cnt[i] >= 3 || cnt[j] >= 3) continue;
      const [ax, ay, az] = NODES[i].pos;
      const [bx, by, bz] = NODES[j].pos;
      const d = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2);
      if (d < maxD) {
        out.push([i, j]);
        cnt[i]++;
        cnt[j]++;
      }
    }
  }
  return out;
})();

const mkLat = (deg: number): V3[] => {
  const lat = (deg * Math.PI) / 180;
  const rr = R * Math.cos(lat);
  const yy = R * Math.sin(lat);
  return Array.from({ length: 48 }, (_, i) => {
    const lon = (i / 48) * Math.PI * 2;
    return [rr * Math.cos(lon), yy, rr * Math.sin(lon)] as V3;
  });
};
const mkMer = (deg: number): V3[] => {
  const lon = (deg * Math.PI) / 180;
  return Array.from({ length: 48 }, (_, i) => {
    const lat = (i / 47 - 0.5) * Math.PI;
    return [R * Math.cos(lat) * Math.cos(lon), R * Math.sin(lat), R * Math.cos(lat) * Math.sin(lon)] as V3;
  });
};
const RINGS = [...[-60, -30, 0, 30, 60].map(mkLat), ...[0, 60, 120].map(mkMer)];

const ORBIT_R = R * 1.28;
const TILT = (35 * Math.PI) / 180;
const ORBIT_PTS: V3[] = Array.from({ length: 64 }, (_, i) => {
  const a = (i / 64) * Math.PI * 2;
  return [ORBIT_R * Math.cos(a), ORBIT_R * Math.sin(a) * Math.sin(TILT), ORBIT_R * Math.sin(a) * Math.cos(TILT)];
});

const PACKET_EDGES = [EDGES[0], EDGES[3], EDGES[6]].filter(Boolean);

/* ─── component ──────────────────────────────── */
export default function CyberOrb() {
  const [rot, setRot] = useState({ x: 0.28, y: 0, t: 0 });
  const drag = useRef({ on: false, sx: 0, sy: 0, rx: 0, ry: 0 });
  const raf = useRef(0);
  const prevT = useRef(0);
  const rotR = useRef(rot);

  // keep a mutable mirror for pointer handlers (synced after render)
  useEffect(() => {
    rotR.current = rot;
  }, [rot]);

  useEffect(() => {
    const loop = (now: number) => {
      const dt = prevT.current ? Math.min(now - prevT.current, 50) : 0;
      prevT.current = now;
      setRot((r) => ({ x: r.x, y: drag.current.on ? r.y : r.y + dt * 0.00032, t: r.t + dt * 0.001 }));
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const onDown = useCallback((e: React.PointerEvent) => {
    drag.current = { on: true, sx: e.clientX, sy: e.clientY, rx: rotR.current.x, ry: rotR.current.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current.on) return;
    const { sx, sy, rx, ry } = drag.current;
    setRot((r) => ({ x: rx + (e.clientY - sy) * 0.007, y: ry + (e.clientX - sx) * 0.007, t: r.t }));
  }, []);

  const onUp = useCallback(() => {
    drag.current.on = false;
  }, []);

  const { x: ax, y: ay, t } = rot;
  const pts = NODES.map((n) => ({ ...n, p: project(transform(n.pos, ax, ay)) }));

  const wirePaths = RINGS.map(
    (ring) =>
      ring
        .map((pt, i) => {
          const p = project(transform(pt, ax, ay));
          return `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
        })
        .join("") + "Z"
  );

  const orbitPath =
    ORBIT_PTS.map((pt, i) => {
      const p = project(transform(pt, ax, ay));
      return `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join("") + "Z";

  const odA: V3 = [ORBIT_R * Math.cos(t * 0.9), ORBIT_R * Math.sin(t * 0.9) * Math.sin(TILT), ORBIT_R * Math.sin(t * 0.9) * Math.cos(TILT)];
  const odP = project(transform(odA, ax, ay));

  const packets = PACKET_EDGES.map((edge, i) => {
    if (!edge) return null;
    const prog = (((t * (0.55 + i * 0.2)) % 1) + 1) % 1;
    const [ai, bi] = edge;
    const a3 = NODES[ai].pos;
    const b3 = NODES[bi].pos;
    const p3: V3 = [a3[0] + (b3[0] - a3[0]) * prog, a3[1] + (b3[1] - a3[1]) * prog, a3[2] + (b3[2] - a3[2]) * prog];
    return { pp: project(transform(p3, ax, ay)), color: COLS[i % 3] };
  }).filter(Boolean);

  return (
    <div
      className="relative select-none cursor-grab active:cursor-grabbing touch-none"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      style={{ width: HALF * 2, height: HALF * 2 }}
      role="img"
      aria-label="Interactive network sphere"
    >
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 50%, rgb(var(--glow) / 0.10) 0%, transparent 70%)", filter: "blur(20px)" }}
      />

      <svg viewBox={`${-HALF} ${-HALF} ${HALF * 2} ${HALF * 2}`} width={HALF * 2} height={HALF * 2} className="relative z-10">
        <defs>
          <filter id="co-glow-sm" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="co-glow-lg" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {wirePaths.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={P} strokeWidth="0.35" strokeOpacity="0.14" />
        ))}

        <path d={orbitPath} fill="none" stroke={S} strokeWidth="0.9" strokeOpacity="0.25" />

        {EDGES.map(([ai, bi], i) => (
          <line key={i} x1={pts[ai].p.x} y1={pts[ai].p.y} x2={pts[bi].p.x} y2={pts[bi].p.y} stroke={COLS[i % 5]} strokeWidth="0.8" strokeOpacity="0.35" />
        ))}

        {packets.map((pk, i) =>
          pk ? <circle key={i} cx={pk.pp.x} cy={pk.pp.y} r={2.2 * pk.pp.s} fill={pk.color} filter="url(#co-glow-sm)" fillOpacity="0.95" /> : null
        )}

        {[...pts]
          .sort((a, b) => a.p.z - b.p.z)
          .map((n, i) => {
            const depthAlpha = 0.35 + 0.65 * Math.max(0, Math.min(1, (n.p.s - 0.5) * 2));
            return (
              <g key={i} filter={n.big ? "url(#co-glow-lg)" : "url(#co-glow-sm)"}>
                {n.big && <circle cx={n.p.x} cy={n.p.y} r={n.r * n.p.s * 2.5} fill={n.color} fillOpacity="0.07" />}
                <circle cx={n.p.x} cy={n.p.y} r={n.r * n.p.s} fill={n.color} fillOpacity={depthAlpha} />
              </g>
            );
          })}

        <circle cx={odP.x} cy={odP.y} r={3.2 * odP.s} fill={S} filter="url(#co-glow-lg)" fillOpacity="0.95" />
        <circle cx={odP.x} cy={odP.y} r={1.8 * odP.s} fill="#fff" fillOpacity="0.6" />
      </svg>

      <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-subtle font-mono tracking-wider pointer-events-none whitespace-nowrap">
        drag to rotate
      </p>
    </div>
  );
}
