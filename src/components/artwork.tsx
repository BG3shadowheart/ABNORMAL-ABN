/**
 * Original artwork, drawn in SVG.
 *
 * Nothing here is downloaded or copied — every poster is generated from the
 * product slug, so the catalog always renders premium-looking, unique artwork
 * with zero image weight and zero copyright questions.
 */

import type { Platform } from '@/data/products';
import {
  ART_PALETTES,
  artIdPrefix,
  between,
  createRandom,
  monogramFor,
  motifFor,
  type ArtMotif,
  type ArtPalette,
} from '@/lib/art';

/* ========================================================================== */
/* Product artwork                                                            */
/* ========================================================================== */

type Particle = { x: number; y: number; r: number; o: number; tone: 'line' | 'accent' | 'aura' };

function makeParticles(seed: string, count: number): Particle[] {
  const random = createRandom(`${seed}-particles`);
  const tones: Particle['tone'][] = ['line', 'accent', 'aura'];
  return Array.from({ length: count }, () => ({
    x: between(random, 8, 472),
    y: between(random, 8, 312),
    r: between(random, 0.7, 2.4),
    o: between(random, 0.18, 0.72),
    tone: tones[Math.floor(random() * tones.length)],
  }));
}

function particleFill(tone: Particle['tone'], palette: ArtPalette): string {
  if (tone === 'accent') return palette.accentSoft;
  if (tone === 'aura') return palette.aura;
  return palette.line;
}

/** Where the big monogram sits, per composition. */
const MONOGRAM_PLACEMENT: Record<
  ArtMotif,
  { x: number; y: number; size: number; anchor: 'start' | 'middle' | 'end' }
> = {
  horizon: { x: 34, y: 292, size: 104, anchor: 'start' },
  rings: { x: 452, y: 118, size: 96, anchor: 'end' },
  slash: { x: 452, y: 300, size: 92, anchor: 'end' },
  grid: { x: 240, y: 148, size: 108, anchor: 'middle' },
  shards: { x: 36, y: 120, size: 92, anchor: 'start' },
  pulse: { x: 452, y: 300, size: 88, anchor: 'end' },
};

export type ProductArtworkProps = {
  seed: string;
  platform: Platform;
  name: string;
  className?: string;
};

export function ProductArtwork({ seed, platform, name, className }: ProductArtworkProps) {
  const palette = ART_PALETTES[platform];
  const id = artIdPrefix(seed);
  const random = createRandom(seed);
  const motif = motifFor(seed);
  const monogram = monogramFor(name);
  const particles = makeParticles(seed, 20);
  const placement = MONOGRAM_PLACEMENT[motif];

  return (
    <svg
      viewBox="0 0 480 320"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette.base} />
          <stop offset="52%" stopColor={palette.wash} />
          <stop offset="100%" stopColor={palette.base} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.accent} stopOpacity="0.95" />
          <stop offset="42%" stopColor={palette.accent} stopOpacity="0.34" />
          <stop offset="100%" stopColor={palette.accent} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-aura`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.aura} stopOpacity="0.65" />
          <stop offset="100%" stopColor={palette.aura} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-disc`} cx="42%" cy="34%" r="72%">
          <stop offset="0%" stopColor="#fff3f5" stopOpacity="0.95" />
          <stop offset="52%" stopColor={palette.accentSoft} stopOpacity="0.9" />
          <stop offset="100%" stopColor={palette.accent} stopOpacity="0.95" />
        </radialGradient>
        <linearGradient id={`${id}-streak`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette.accentSoft} stopOpacity="0" />
          <stop offset="50%" stopColor={palette.accentSoft} stopOpacity="0.55" />
          <stop offset="100%" stopColor={palette.accentSoft} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.aura} stopOpacity="0.35" />
          <stop offset="100%" stopColor={palette.aura} stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-vignette`} cx="50%" cy="45%" r="72%">
          <stop offset="55%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.72" />
        </radialGradient>
        <filter id={`${id}-blur`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
        <filter id={`${id}-blur-sm`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <pattern id={`${id}-scan`} width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="1" fill="#000" opacity="0.55" />
        </pattern>
        <clipPath id={`${id}-clip`}>
          <rect width="480" height="320" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id}-clip)`}>
        <rect width="480" height="320" fill={`url(#${id}-bg)`} />
        <Motif
          motif={motif}
          palette={palette}
          id={id}
          random={random}
        />

        {/* floating dust */}
        <g filter={`url(#${id}-blur-sm)`} opacity="0.85">
          {particles.slice(0, 6).map((particle, index) => (
            <circle
              key={`soft-${index}`}
              cx={particle.x}
              cy={particle.y}
              r={particle.r * 1.9}
              fill={particleFill(particle.tone, palette)}
              opacity={particle.o * 0.5}
            />
          ))}
        </g>
        {particles.slice(6).map((particle, index) => (
          <circle
            key={`dot-${index}`}
            cx={particle.x}
            cy={particle.y}
            r={particle.r}
            fill={particleFill(particle.tone, palette)}
            opacity={particle.o}
          />
        ))}

        {/* monogram */}
        <text
          className="font-display"
          x={placement.x}
          y={placement.y}
          textAnchor={placement.anchor}
          fontSize={placement.size}
          letterSpacing="0.04em"
          fill={palette.line}
          opacity="0.13"
        >
          {monogram}
        </text>

        {/* technical frame + scanlines + vignette */}
        <rect
          x="10.5"
          y="10.5"
          width="459"
          height="299"
          rx="14"
          fill="none"
          stroke={palette.line}
          strokeOpacity="0.14"
        />
        <path d="M10 42 L10 10 L42 10" fill="none" stroke={palette.accentSoft} strokeOpacity="0.5" />
        <path
          d="M470 278 L470 310 L438 310"
          fill="none"
          stroke={palette.accentSoft}
          strokeOpacity="0.35"
        />
        <rect width="480" height="320" fill={`url(#${id}-scan)`} opacity="0.16" />
        <rect width="480" height="320" fill={`url(#${id}-vignette)`} />
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Compositions                                                               */
/* -------------------------------------------------------------------------- */

type MotifProps = {
  motif: ArtMotif;
  palette: ArtPalette;
  id: string;
  random: () => number;
};

function Motif({ motif, palette, id, random }: MotifProps) {
  switch (motif) {
    case 'horizon':
      return <HorizonMotif palette={palette} id={id} random={random} />;
    case 'rings':
      return <RingsMotif palette={palette} id={id} random={random} />;
    case 'slash':
      return <SlashMotif palette={palette} id={id} random={random} />;
    case 'grid':
      return <GridMotif palette={palette} id={id} random={random} />;
    case 'shards':
      return <ShardsMotif palette={palette} id={id} random={random} />;
    case 'pulse':
    default:
      return <PulseMotif palette={palette} id={id} random={random} />;
  }
}

function HorizonMotif({ palette, id, random }: Omit<MotifProps, 'motif'>) {
  const discX = between(random, 296, 372);
  const discY = between(random, 96, 132);
  const discR = between(random, 58, 78);
  const ridgeA = between(random, 208, 226);
  const ridgeB = between(random, 244, 262);
  const ridgeC = between(random, 276, 292);

  return (
    <g>
      <circle cx={discX} cy={discY} r={discR * 3.1} fill={`url(#${id}-glow)`} filter={`url(#${id}-blur)`} />
      <circle cx={discX} cy={discY} r={discR} fill={`url(#${id}-disc)`} opacity="0.92" />
      <circle
        cx={discX}
        cy={discY}
        r={discR + 16}
        fill="none"
        stroke={palette.line}
        strokeOpacity="0.32"
      />
      <circle
        cx={discX}
        cy={discY}
        r={discR + 34}
        fill="none"
        stroke={palette.accentSoft}
        strokeOpacity="0.12"
      />
      <rect
        x={discX - discR * 1.9}
        y={discY + discR * 0.15}
        width={discR * 3.8}
        height="12"
        fill={palette.base}
        opacity="0.55"
        filter={`url(#${id}-blur-sm)`}
      />
      <path
        d={`M0 ${ridgeA} C 70 ${ridgeA - 34}, 140 ${ridgeA + 26}, 214 ${ridgeA - 6} S 356 ${ridgeA + 30}, 480 ${ridgeA - 18} L480 320 L0 320 Z`}
        fill={palette.base}
        opacity="0.72"
      />
      <path
        d={`M0 ${ridgeB} C 88 ${ridgeB - 26}, 168 ${ridgeB + 20}, 250 ${ridgeB - 12} S 400 ${ridgeB + 24}, 480 ${ridgeB - 8} L480 320 L0 320 Z`}
        fill="#04040a"
        opacity="0.9"
      />
      <rect y={ridgeB} width="480" height="1" fill={palette.accentSoft} opacity="0.22" />
      <path
        d={`M0 ${ridgeC} C 120 ${ridgeC - 18}, 210 ${ridgeC + 14}, 320 ${ridgeC - 4} S 430 ${ridgeC + 12}, 480 ${ridgeC} L480 320 L0 320 Z`}
        fill="#020207"
      />
      <ellipse cx="240" cy={ridgeB + 6} rx="240" ry="26" fill={`url(#${id}-aura)`} opacity="0.5" />
    </g>
  );
}

function RingsMotif({ palette, id, random }: Omit<MotifProps, 'motif'>) {
  const cx = between(random, 20, 90);
  const cy = between(random, 300, 348);
  const rings = [96, 148, 202, 258, 318, 382];
  const ticks = Array.from({ length: 28 }, (_, index) => (index / 28) * Math.PI * 2);

  return (
    <g>
      <circle cx={cx} cy={cy} r="220" fill={`url(#${id}-glow)`} opacity="0.75" filter={`url(#${id}-blur)`} />
      {rings.map((radius, index) => (
        <circle
          key={radius}
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={index % 2 === 0 ? palette.line : palette.accentSoft}
          strokeOpacity={index === 1 ? 0.45 : 0.16}
          strokeWidth={index === 1 ? 1.6 : 1}
          strokeDasharray={index === 3 ? '2 8' : undefined}
        />
      ))}
      <circle
        cx={cx}
        cy={cy}
        r="256"
        fill="none"
        stroke={palette.aura}
        strokeOpacity="0.4"
        strokeWidth="2"
        strokeDasharray="140 700"
        transform={`rotate(-42 ${cx} ${cy})`}
      />
      <g opacity="0.5">
        {ticks.map((angle) => {
          const inner = 236;
          const outer = angle % 0.9 < 0.45 ? 258 : 248;
          return (
            <line
              key={angle}
              x1={cx + Math.cos(angle) * inner}
              y1={cy + Math.sin(angle) * inner}
              x2={cx + Math.cos(angle) * outer}
              y2={cy + Math.sin(angle) * outer}
              stroke={palette.line}
              strokeOpacity="0.22"
            />
          );
        })}
      </g>
      <circle cx={cx} cy={cy} r="7" fill={palette.accentSoft} opacity="0.85" />
      <circle cx={cx} cy={cy} r="26" fill={`url(#${id}-glow)`} />
    </g>
  );
}

function SlashMotif({ palette, id, random }: Omit<MotifProps, 'motif'>) {
  const offset = between(random, -30, 40);
  const bands = [
    { x: -60 + offset, w: 96, o: 0.16 },
    { x: 62 + offset, w: 44, o: 0.1 },
    { x: 340 + offset, w: 120, o: 0.14 },
    { x: 244 + offset, w: 22, o: 0.24 },
  ];

  return (
    <g>
      <rect x="230" y="-40" width="260" height="440" fill={`url(#${id}-glow)`} opacity="0.6" filter={`url(#${id}-blur)`} />
      {bands.map((band) => (
        <polygon
          key={band.x}
          points={`${band.x},340 ${band.x + band.w},340 ${band.x + band.w + 150},-20 ${band.x + 150},-20`}
          fill={palette.accentSoft}
          opacity={band.o}
        />
      ))}
      <polygon
        points={`${150 + offset},340 ${162 + offset},340 ${312 + offset},-20 ${300 + offset},-20`}
        fill={`url(#${id}-streak)`}
      />
      <polygon
        points={`${60 + offset},340 ${66 + offset},340 ${216 + offset},-20 ${210 + offset},-20`}
        fill={palette.aura}
        opacity="0.22"
      />
      <path d="M-20 250 L500 60" stroke={palette.line} strokeOpacity="0.28" strokeWidth="1" />
      <path d="M-20 282 L500 92" stroke={palette.accentSoft} strokeOpacity="0.18" strokeWidth="1" />
      <g opacity="0.7">
        <polygon points="392,64 420,50 408,84" fill={palette.accentSoft} opacity="0.5" />
        <polygon points="86,238 108,228 100,254" fill={palette.line} opacity="0.35" />
      </g>
    </g>
  );
}

function GridMotif({ palette, id, random }: Omit<MotifProps, 'motif'>) {
  const horizon = between(random, 168, 186);
  const rows = [12, 26, 44, 66, 92, 122, 156];
  const columns = [-220, -150, -88, -34, 14, 66, 128, 200, 280];

  return (
    <g>
      <rect x="120" y={horizon - 120} width="240" height="240" fill={`url(#${id}-glow)`} opacity="0.7" filter={`url(#${id}-blur)`} />
      {rows.map((gap, index) => (
        <line
          key={gap}
          x1="0"
          y1={horizon + gap}
          x2="480"
          y2={horizon + gap}
          stroke={palette.line}
          strokeOpacity={0.06 + index * 0.028}
        />
      ))}
      {columns.map((spread) => (
        <line
          key={spread}
          x1={240 + spread * 0.22}
          y1={horizon}
          x2={240 + spread * 2.4}
          y2="330"
          stroke={palette.accentSoft}
          strokeOpacity="0.14"
        />
      ))}
      <line x1="0" y1={horizon} x2="480" y2={horizon} stroke={palette.line} strokeOpacity="0.55" />
      <rect x="0" y={horizon - 3} width="480" height="6" fill={palette.accentSoft} opacity="0.22" filter={`url(#${id}-blur-sm)`} />
      <circle cx="240" cy={horizon - 52} r="30" fill={`url(#${id}-disc)`} opacity="0.85" />
      <circle cx="240" cy={horizon - 52} r="46" fill="none" stroke={palette.aura} strokeOpacity="0.4" strokeDasharray="6 10" />
      <rect x="0" y={horizon} width="480" height="140" fill={`url(#${id}-sheen)`} opacity="0.35" />
    </g>
  );
}

function ShardsMotif({ palette, id, random }: Omit<MotifProps, 'motif'>) {
  const cx = between(random, 210, 280);
  const cy = between(random, 130, 168);
  const shards = Array.from({ length: 9 }, (_, index) => {
    const angle = (index / 9) * Math.PI * 2 + between(random, -0.16, 0.16);
    const spread = between(random, 0.1, 0.26);
    const length = between(random, 190, 330);
    const inner = between(random, 22, 54);
    const points = [
      [cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner],
      [cx + Math.cos(angle - spread) * length, cy + Math.sin(angle - spread) * length],
      [cx + Math.cos(angle + spread) * length, cy + Math.sin(angle + spread) * length],
    ]
      .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
      .join(' ');
    return { angle, points, opacity: between(random, 0.07, 0.2) };
  });

  return (
    <g>
      <circle cx={cx} cy={cy} r="150" fill={`url(#${id}-glow)`} filter={`url(#${id}-blur)`} />
      {shards.map((shard) => (
        <polygon
          key={shard.angle}
          points={shard.points}
          fill={shard.angle % 2 < 1 ? palette.accentSoft : palette.aura}
          opacity={shard.opacity}
        />
      ))}
      <polygon
        points={`${cx},${cy - 14} ${cx + 9},${cy} ${cx},${cy + 14} ${cx - 9},${cy}`}
        fill={palette.line}
        opacity="0.75"
      />
      <circle cx={cx} cy={cy} r="58" fill="none" stroke={palette.line} strokeOpacity="0.28" />
      <circle
        cx={cx}
        cy={cy}
        r="96"
        fill="none"
        stroke={palette.accentSoft}
        strokeOpacity="0.16"
        strokeDasharray="3 9"
      />
    </g>
  );
}

function PulseMotif({ palette, id, random }: Omit<MotifProps, 'motif'>) {
  const cx = between(random, 200, 260);
  const cy = between(random, 130, 170);
  const frames = [64, 104, 150, 204, 268];

  return (
    <g>
      <rect x={cx - 180} y={cy - 120} width="360" height="260" fill={`url(#${id}-glow)`} opacity="0.65" filter={`url(#${id}-blur)`} />
      {frames.map((size, index) => (
        <rect
          key={size}
          x={cx - size}
          y={cy - size * 0.66}
          width={size * 2}
          height={size * 1.32}
          rx="14"
          fill="none"
          stroke={index === 1 ? palette.line : palette.accentSoft}
          strokeOpacity={index === 1 ? 0.4 : 0.14}
          strokeWidth={index === 1 ? 1.6 : 1}
        />
      ))}
      {[0, 1, 2, 3].map((row) => (
        <rect
          key={row}
          x={cx - 150}
          y={cy - 58 + row * 34}
          width={300}
          height={row === 2 ? 8 : 2}
          fill={row === 2 ? palette.accentSoft : palette.line}
          opacity={row === 2 ? 0.55 : 0.2}
        />
      ))}
      <rect
        x={cx - 26}
        y={cy - 26}
        width="52"
        height="52"
        rx="10"
        transform={`rotate(45 ${cx} ${cy})`}
        fill="none"
        stroke={palette.aura}
        strokeOpacity="0.6"
      />
      <circle cx={cx} cy={cy} r="6" fill={palette.accentSoft} />
    </g>
  );
}
