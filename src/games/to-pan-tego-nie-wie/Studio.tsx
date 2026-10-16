import "./to-pan-tego-nie-wie.css";

export type BackdropMood =
  "idle" | "definition" | "wrong" | "correct" | "reveal" | "result";

const SKYLINE = [
  [210, 360, 90],
  [300, 300, 70],
  [370, 380, 110],
  [480, 250, 60],
  [540, 340, 120],
  [660, 280, 80],
  [740, 200, 40],
  [780, 320, 130],
  [910, 260, 70],
  [980, 350, 110],
  [1090, 290, 90],
  [1180, 370, 100],
  [1280, 310, 120],
];
const CUSHIONS = [
  [470, "#f2b830"],
  [610, "#e8504a"],
  [990, "#5ab0c8"],
  [1130, "#9a5ad0"],
] as const;

function Room() {
  return (
    <>
      <defs>
        <linearGradient id="tp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8ac4e8" />
          <stop offset="0.55" stopColor="#ffd2a0" />
          <stop offset="1" stopColor="#ffb08a" />
        </linearGradient>
        <linearGradient id="tp-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6ead6" />
          <stop offset="1" stopColor="#ecd8bc" />
        </linearGradient>
        <radialGradient id="tp-sun-glow">
          <stop offset="0" stopColor="#fff4c0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff4c0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#tp-wall)" />
      <rect x="180" y="50" width="1240" height="490" rx="10" fill="#fff" />
      <rect x="196" y="66" width="1208" height="458" fill="url(#tp-sky)" />
      <g className="tp-sun">
        <circle cx="1030" cy="330" r="160" fill="url(#tp-sun-glow)" />
        <circle cx="1030" cy="330" r="62" fill="#fff0a0" />
      </g>
      {SKYLINE.map(([x, y, w]) => (
        <rect
          key={x}
          x={x}
          y={y}
          width={w}
          height={524 - y}
          fill="#7a8ab0"
          opacity="0.85"
        />
      ))}
      <path d="M760 200 V140 M752 160 h16" stroke="#7a8ab0" strokeWidth="6" />
      {SKYLINE.flatMap(([x, y, w]) =>
        Array.from(
          { length: Math.floor((524 - y - 20) / 30) * Math.floor(w / 26) },
          (_, i) => {
            const cols = Math.floor(w / 26);
            return (
              <rect
                key={`${x}-${i}`}
                x={x + 8 + (i % cols) * 26}
                y={y + 14 + Math.floor(i / cols) * 30}
                width="10"
                height="12"
                fill="#ffe8b0"
                opacity={(i + x) % 3 ? 0.25 : 0.7}
              />
            );
          },
        ),
      )}
      <path
        d="M598 66 V524 M1002 66 V524 M196 300 H1404"
        stroke="#fff"
        strokeWidth="14"
      />
      <rect x="160" y="530" width="1280" height="24" rx="6" fill="#fff" />
      <rect y="640" width="1600" height="260" fill="#d8a878" />
      {Array.from({ length: 12 }, (_, i) => (
        <path
          key={i}
          d={`M0 ${660 + i * 22} H1600`}
          stroke="#c8966a"
          strokeWidth="2"
          opacity="0.6"
        />
      ))}
      <rect y="630" width="1600" height="14" fill="#b88a5a" />
    </>
  );
}

function Sofa() {
  return (
    <g>
      <rect x="380" y="560" width="840" height="150" rx="40" fill="#3a9a8a" />
      <rect x="340" y="640" width="920" height="120" rx="34" fill="#4ab0a0" />
      <rect x="320" y="600" width="90" height="170" rx="36" fill="#3a9a8a" />
      <rect x="1190" y="600" width="90" height="170" rx="36" fill="#3a9a8a" />
      {CUSHIONS.map(([x, color], i) => (
        <rect
          key={x}
          className="tp-cushion"
          x={x}
          y={i % 2 ? 585 : 595}
          width="110"
          height="90"
          rx="22"
          fill={color}
          style={{ animationDelay: `${i * 0.08}s` }}
        />
      ))}
      <path
        d="M360 770 v40 M1240 770 v40"
        stroke="#6a4a2a"
        strokeWidth="14"
        strokeLinecap="round"
      />
    </g>
  );
}

function Props() {
  return (
    <>
      <g transform="translate(600 790)">
        <rect width="400" height="20" rx="6" fill="#f6f2ec" />
        <path d="M30 20 V110 M370 20 V110" stroke="#c8b898" strokeWidth="10" />
        <rect x="60" y="20" width="280" height="44" rx="8" fill="#e8504a" />
        <text
          x="200"
          y="52"
          textAnchor="middle"
          fontSize="30"
          fill="#fff"
          className="tp-sign"
        >
          PORANNA KANAPA
        </text>
        {[
          [80, "#e8504a"],
          [300, "#3a8ad0"],
        ].map(([x, color]) => (
          <g key={x} transform={`translate(${x} -46)`}>
            <path
              className="tp-steam"
              d="M14 -8 q-10 -16 0 -32 q10 -16 0 -32 M30 -8 q-10 -16 0 -32 q10 -16 0 -32"
              stroke="#fff"
              strokeWidth="4"
              fill="none"
              opacity="0.7"
            />
            <rect width="44" height="46" rx="6" fill={color as string} />
            <path
              d="M44 12 q16 0 16 12 t-16 12"
              stroke={color as string}
              strokeWidth="6"
              fill="none"
            />
          </g>
        ))}
        <rect x="160" y="-14" width="80" height="14" rx="3" fill="#f2b830" />
      </g>
      <g transform="translate(90 420)">
        <path d="M60 220 L40 330 H120 L100 220 Z" fill="#c8603a" />
        {[-40, -15, 10, 35, 60].map((r, i) => (
          <ellipse
            key={r}
            cx="80"
            cy={130 - (i % 2) * 20}
            rx="22"
            ry="90"
            fill={i % 2 ? "#4a9a4a" : "#5ab05a"}
            transform={`rotate(${r} 80 220)`}
          />
        ))}
      </g>
      <g transform="translate(1460 120)">
        <path
          d="M40 0 V560 M40 560 L0 600 M40 560 L80 600"
          stroke="#4a4a54"
          strokeWidth="8"
        />
        <rect x="-10" y="-30" width="100" height="70" rx="10" fill="#3a3a44" />
        <rect
          x="0"
          y="-20"
          width="80"
          height="50"
          rx="6"
          fill="#fff4d0"
          className="tp-light"
        />
      </g>
    </>
  );
}

export function Backdrop({ mood }: { mood: BackdropMood }) {
  return (
    <div
      className="tp-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      data-testid="backdrop"
      data-mood={mood}
    >
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMax slice"
        className="tp-layer"
      >
        <Room />
        <Sofa />
        <Props />
      </svg>
      <div className="tp-flash" />
      <div className="tp-spot" />
      <div className="tp-tint" />
    </div>
  );
}
