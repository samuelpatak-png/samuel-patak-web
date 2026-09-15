"use client";

import { PARTS, type Part } from "@/lib/parts";

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
  onChange: (index: number) => void;
};

export function DemandMachine({ index, onChange }: DemandMachineProps) {
  const onKeyDown = (event: React.KeyboardEvent<SVGSVGElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      onChange(index + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      onChange(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      onChange(0);
    } else if (event.key === "End") {
      event.preventDefault();
      onChange(PARTS.length - 1);
    }
  };

  return (
    <svg
      className="h-auto w-full text-ink"
      viewBox="0 0 920 540"
      role="radiogroup"
      aria-label="Rozkres stroja na dopyty. Šípkami alebo klikom vyberte diel."
      tabIndex={0}
      onKeyDown={onKeyDown}
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

      {BOXES.map((box, i) => (
        <line
          key={`lead-${PARTS[i].id}`}
          x1={box.from[0]}
          y1={box.from[1]}
          x2={box.x + 75}
          y2={box.y + 28}
          stroke="currentColor"
          strokeWidth={i === index ? 1.8 : 1}
          className={i === index ? "text-hot" : "text-rule"}
        />
      ))}

      <polygon
        points="400,56 520,56 548,112 372,112"
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

      <rect x="430" y="230" width="60" height="44" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <polygon points="430,274 490,274 510,302 410,302" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <text x="460" y="294" textAnchor="middle" fontSize="11" className="fill-mute" fontFamily="var(--font-mono)">
        zákazka
      </text>

      {PARTS.map((part, i) => (
        <PartNode
          key={part.id}
          part={part}
          x={BOXES[i].x}
          y={BOXES[i].y}
          selected={i === index}
          onSelect={() => onChange(i)}
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
  onSelect,
}: {
  part: Part;
  x: number;
  y: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <g
      role="radio"
      aria-checked={selected}
      aria-label={`${part.code}, ${part.short}`}
      tabIndex={-1}
      className="cursor-pointer"
      onClick={onSelect}
    >
      {selected ? <rect x={x} y={y} width="150" height="56" className="part-hatch" /> : null}
      <rect
        x={x}
        y={y}
        width="150"
        height="56"
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
  onSelect,
}: {
  index: number;
  onSelect: (index: number) => void;
}) {
  return (
    <table className="mt-2 w-full text-left text-sm">
      <caption className="sr-only">Kusovník dielov. Vyberte riadok.</caption>
      <thead>
        <tr className="border-t border-ink text-mute">
          <th className="px-2 py-2 font-normal">kód</th>
          <th className="px-2 py-2 font-normal">diel</th>
        </tr>
      </thead>
      <tbody>
        {PARTS.map((part, i) => (
          <tr key={part.id}>
            <td colSpan={2} className="p-0">
              <button
                type="button"
                className={`flex min-h-12 w-full items-center gap-4 px-2 text-left ${
                  i === index ? "text-hot" : ""
                }`}
                onClick={() => onSelect(i)}
                aria-pressed={i === index}
              >
                <span className="w-10 shrink-0">{part.code}</span>
                <span>{part.short}</span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function SpecSheet({ part }: { part: Part }) {
  return (
    <article className="sheet-frame bg-paper px-6 py-6 sm:px-8 sm:py-8">
      <p className="text-sm text-mute">
        Diel {part.code}
      </p>
      <h2 className="mt-2 font-display text-3xl leading-tight tracking-[-0.02em] sm:text-4xl">
        {part.title}
      </h2>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-mute">{part.body}</p>
      <ul className="mt-5 space-y-2 text-[0.95rem] leading-relaxed">
        {part.points.map((point) => (
          <li key={point} className="flex gap-3">
            <span className="mt-2 h-px w-4 shrink-0 bg-rule" aria-hidden="true" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <a
        href="#objednavka"
        className="mt-7 inline-flex min-h-12 items-center border border-ink px-4 text-sm text-ink"
      >
        {part.cta}
      </a>
    </article>
  );
}
