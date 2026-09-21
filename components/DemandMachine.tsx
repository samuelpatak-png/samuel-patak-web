"use client";

import { PARTS, type Part } from "@/lib/parts";
import { useRef } from "react";

const BOX_W = 150;
const BOX_H = 56;
const VIEW_W = 920;
const VIEW_H = 540;

const BOXES: { x: number; y: number; from: [number, number] }[] = [
  { x: 36, y: 196, from: [380, 185] },
  { x: 36, y: 64, from: [400, 150] },
  { x: 734, y: 64, from: [520, 150] },
  { x: 734, y: 196, from: [540, 185] },
  { x: 36, y: 348, from: [400, 230] },
  { x: 385, y: 400, from: [460, 240] },
  { x: 734, y: 348, from: [520, 230] },
];

type DemandMachineProps = {
  index: number;
  onHover: (index: number) => void;
  onOpen: (index: number) => void;
};

function boxEdgePoint(from: [number, number], box: { x: number; y: number }): [number, number] {
  const cx = box.x + BOX_W / 2;
  const cy = box.y + BOX_H / 2;
  const dx = cx - from[0];
  const dy = cy - from[1];
  if (dx === 0 && dy === 0) return [cx, cy];

  const ts: number[] = [];
  if (dx !== 0) {
    ts.push((box.x - from[0]) / dx, (box.x + BOX_W - from[0]) / dx);
  }
  if (dy !== 0) {
    ts.push((box.y - from[1]) / dy, (box.y + BOX_H - from[1]) / dy);
  }

  const hit = ts
    .filter((t) => t > 0 && t <= 1)
    .filter((t) => {
      const x = from[0] + t * dx;
      const y = from[1] + t * dy;
      return x >= box.x - 0.01 && x <= box.x + BOX_W + 0.01 && y >= box.y - 0.01 && y <= box.y + BOX_H + 0.01;
    })
    .sort((a, b) => a - b)[0];

  return hit === undefined ? [cx, cy] : [from[0] + hit * dx, from[1] + hit * dy];
}

function partIndexAt(x: number, y: number): number {
  const hit = BOXES.findIndex(
    (box) => x >= box.x && x <= box.x + BOX_W && y >= box.y && y <= box.y + BOX_H,
  );
  if (hit >= 0) return hit;

  let best = 0;
  let dist = Number.POSITIVE_INFINITY;
  BOXES.forEach((box, i) => {
    const dx = x - (box.x + BOX_W / 2);
    const dy = y - (box.y + BOX_H / 2);
    const next = dx * dx + dy * dy;
    if (next < dist) {
      dist = next;
      best = i;
    }
  });
  return best;
}

export function DemandMachine({ index, onHover, onOpen }: DemandMachineProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const onKeyDown = (event: React.KeyboardEvent<SVGSVGElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      onHover(index + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      onHover(index - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen(index);
    } else if (event.key === "Home") {
      event.preventDefault();
      onHover(0);
    } else if (event.key === "End") {
      event.preventDefault();
      onHover(PARTS.length - 1);
    }
  };

  const revealAt = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const x = ((clientX - rect.left) / rect.width) * VIEW_W;
    const y = ((clientY - rect.top) / rect.height) * VIEW_H;
    const next = partIndexAt(x, y);
    if (next !== index) onHover(next);
  };

  const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.pointerType === "touch") return;
    revealAt(event.clientX, event.clientY);
  };

  return (
    <svg
      ref={svgRef}
      className="machine-stage h-auto w-full text-ink"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="radiogroup"
      aria-label="Rozkres stroja na dopyty. Myšou označte diel, klikom otvorte list."
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerMove={onPointerMove}
    >
      <defs>
        <pattern id="part-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="1.2" className="text-hot" />
        </pattern>
      </defs>

      <rect x="14" y="14" width="892" height="512" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <rect x="20" y="20" width="880" height="500" fill="none" stroke="currentColor" strokeWidth="0.6" />

      <text x="32" y="44" className="fill-mute" fontSize="11" fontFamily="var(--font-mono)">
        SP-01 · stroj na dopyty · list 1/1
      </text>
      <text x="888" y="44" textAnchor="end" className="fill-mute" fontSize="11" fontFamily="var(--font-mono)">
        kreslil S. Patak
      </text>

      {BOXES.map((box, i) => {
        const [ex, ey] = boxEdgePoint(box.from, box);
        return (
          <line
            key={`lead-${PARTS[i].id}`}
            x1={box.from[0]}
            y1={box.from[1]}
            x2={ex}
            y2={ey}
            stroke="currentColor"
            strokeWidth={i === index ? 1.8 : 1}
            className={i === index ? "text-hot" : "text-rule"}
          />
        );
      })}

      <polygon
        points="340,56 580,56 542,112 378,112"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <text x="460" y="92" textAnchor="middle" fontSize="13" fontFamily="var(--font-display)">
        dopyt
      </text>

      <rect x="378" y="112" width="164" height="118" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <line x1="402" y1="138" x2="518" y2="138" stroke="currentColor" strokeWidth="0.7" className="text-rule" />
      <line x1="402" y1="162" x2="518" y2="162" stroke="currentColor" strokeWidth="0.7" className="text-rule" />
      <line x1="402" y1="186" x2="518" y2="186" stroke="currentColor" strokeWidth="0.7" className="text-rule" />
      <text x="460" y="178" textAnchor="middle" fontSize="13" fontFamily="var(--font-display)">
        jadro
      </text>

      <polygon
        points="378,230 542,230 496,284 424,284"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <text x="460" y="300" textAnchor="middle" fontSize="11" className="fill-mute" fontFamily="var(--font-mono)">
        zákazka
      </text>

      {PARTS.map((part, i) => (
        <PartNode
          key={part.id}
          part={part}
          x={BOXES[i].x}
          y={BOXES[i].y}
          selected={i === index}
          onHover={() => onHover(i)}
          onOpen={() => onOpen(i)}
        />
      ))}
    </svg>
  );
}

function PartNode({
  part,
  x,
  y,
  selected,
  onHover,
  onOpen,
}: {
  part: Part;
  x: number;
  y: number;
  selected: boolean;
  onHover: () => void;
  onOpen: () => void;
}) {
  return (
    <g
      role="radio"
      aria-checked={selected}
      aria-label={`${part.code}, ${part.short}`}
      tabIndex={-1}
      className="cursor-pointer"
      onClick={onOpen}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") onHover();
      }}
    >
      {selected ? <rect x={x} y={y} width={BOX_W} height={BOX_H} className="part-hatch" /> : null}
      <rect
        x={x}
        y={y}
        width={BOX_W}
        height={BOX_H}
        fill="transparent"
        stroke="currentColor"
        strokeWidth={selected ? 2.2 : 1.3}
        className={selected ? "text-hot" : undefined}
      />
      <text
        x={x + 12}
        y={y + 22}
        fontSize="11"
        className={selected ? "fill-hot" : "fill-mute"}
        fontFamily="var(--font-mono)"
      >
        {part.code}
      </text>
      <text x={x + 12} y={y + 42} fontSize="14" fontFamily="var(--font-display)">
        {part.short}
      </text>
    </g>
  );
}

export function BomTable({
  index,
  onHover,
  onOpen,
}: {
  index: number;
  onHover: (index: number) => void;
  onOpen: (index: number) => void;
}) {
  return (
    <table className="w-full text-left text-sm">
      <caption className="sr-only">Kusovník dielov. Kliknite riadok, otvorí sa list.</caption>
      <thead>
        <tr className="text-mute md:hidden">
          <th className="px-2 py-1.5 font-normal">kód</th>
          <th className="px-2 py-1.5 font-normal">diel</th>
        </tr>
      </thead>
      <tbody>
        {PARTS.map((part, i) => (
          <tr key={part.id}>
            <td colSpan={2} className="p-0">
              <button
                type="button"
                className={`flex min-h-10 w-full items-center gap-3 px-2 text-left md:min-h-9 ${
                  i === index ? "text-hot" : ""
                }`}
                onClick={() => onOpen(i)}
                onPointerEnter={(event) => {
                  if (event.pointerType !== "touch") onHover(i);
                }}
                aria-pressed={i === index}
              >
                <span className="w-9 shrink-0">{part.code}</span>
                <span>{part.short}</span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
