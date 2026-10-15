import './express.css'
import type { Transport } from './logic'

export type Mood = 'idle' | 'choose' | 'travel' | 'event' | 'elimination' | 'finish' | 'result'

const RAD = Math.PI / 180

function Palm({ x, y, h, lean = 1 }: { x: number; y: number; h: number; lean?: number }) {
  const tx = x + lean * h * 0.2
  const ty = y - h
  return (
    <g className="ex-sway" style={{ transformOrigin: `${x}px ${y}px` }}>
      <path d={`M${x - 11} ${y} Q${x + lean * h * 0.02} ${y - h * 0.55} ${tx - 4} ${ty} L${tx + 6} ${ty + 4} Q${x + lean * h * 0.08 + 12} ${y - h * 0.5} ${x + 11} ${y} Z`} fill="#7a5532" />
      {[-170, -135, -100, -65, -30, 5, 35, 145].map((a) => {
        const cx = tx + Math.cos(a * RAD) * h * 0.2
        const cy = ty + Math.sin(a * RAD) * h * 0.14
        return <ellipse key={a} cx={cx} cy={cy} rx={h * 0.23} ry={h * 0.045} transform={`rotate(${a} ${cx} ${cy})`} fill={a % 2 ? '#2f8a3c' : '#3fa04a'} />
      })}
      <circle cx={tx} cy={ty + 6} r={h * 0.03} fill="#5a3a1a" />
    </g>
  )
}

function Windows({ x, y, w, h, gap = 14 }: { x: number; y: number; w: number; h: number; gap?: number }) {
  const cells = []
  for (let yy = y + 10; yy < y + h - 10; yy += gap) for (let xx = x + 8; xx < x + w - 8; xx += gap) cells.push([xx, yy])
  return (
    <g className="ex-lit">
      {cells.map(([cx, cy], k) => (
        <rect key={k} x={cx} y={cy} width="6" height="6" fill={k % 3 ? '#ffd877' : '#fff3c4'} opacity={k % 4 ? 0.85 : 0.3} />
      ))}
    </g>
  )
}

function Bali() {
  const gate = 'M640 720 V640 H662 V560 H684 V480 H708 V420 H732 V380 H782 V720 Z'
  return (
    <>
      <rect width="1600" height="900" fill="url(#ex-sky-bali)" />
      <circle cx="1180" cy="210" r="70" fill="#ffe08a" className="ex-sun" />
      <path d="M0 560 Q200 500 420 540 Q600 470 820 540 Q1100 480 1600 545 V600 H0 Z" fill="#5f9e8f" />
      <rect y="560" width="1600" height="170" fill="#2aa6c9" />
      <g className="ex-waves" stroke="#bfefff" strokeWidth="4" fill="none" opacity="0.7">
        <path d="M0 610 Q50 600 100 610 T200 610 T300 610 T400 610 T500 610 T600 610 T700 610 T800 610 T900 610 T1000 610 T1100 610 T1200 610 T1300 610 T1400 610 T1500 610 T1600 610" />
        <path d="M0 670 Q60 660 120 670 T240 670 T360 670 T480 670 T600 670 T720 670 T840 670 T960 670 T1080 670 T1200 670 T1320 670 T1440 670 T1560 670 T1680 670" />
      </g>
      <path d="M0 720 Q400 690 800 712 Q1200 690 1600 720 V900 H0 Z" fill="#f2d59b" />
      <g fill="#9a6444" stroke="#6a3f28" strokeWidth="3">
        <path d={gate} />
        <path d={gate} transform="translate(1600 0) scale(-1 1)" />
      </g>
      <g fill="#6a3f28">
        {[400, 480, 560, 640].map((y) => (
          <g key={y}>
            <rect x="690" y={y + 20} width="70" height="8" />
            <rect x="840" y={y + 20} width="70" height="8" />
          </g>
        ))}
      </g>
      <path d="M760 720 L782 690 H818 L840 720 Z" fill="#b98a5e" />
      <Palm x={300} y={760} h={360} lean={1} />
      <Palm x={1330} y={770} h={330} lean={-1} />
      <Palm x={1080} y={740} h={250} lean={-1} />
    </>
  )
}

function Jawa() {
  const bands = [
    { y: 470, c: '#9ccf5a' },
    { y: 540, c: '#7fbf4d' },
    { y: 610, c: '#9ccf5a' },
    { y: 680, c: '#5fa83c' },
    { y: 760, c: '#7fbf4d' },
    { y: 840, c: '#5fa83c' },
  ]
  return (
    <>
      <rect width="1600" height="900" fill="url(#ex-sky-jawa)" />
      <path d="M0 500 L260 330 L420 420 L640 250 L900 480 L1180 300 L1600 470 V600 H0 Z" fill="#8fb3c4" />
      {bands.map(({ y, c }, i) => (
        <g key={y}>
          <path d={`M0 ${y} Q400 ${y - (i % 2 ? 40 : -30)} 800 ${y} Q1200 ${y + (i % 2 ? 40 : -30)} 1600 ${y} V900 H0 Z`} fill={c} />
          <path d={`M0 ${y + 6} Q400 ${y + 6 - (i % 2 ? 40 : -30)} 800 ${y + 6} Q1200 ${y + 6 + (i % 2 ? 40 : -30)} 1600 ${y + 6}`} stroke="#d8f3ff" strokeWidth="3" fill="none" opacity="0.6" />
        </g>
      ))}
      <g>
        <path d="M880 600 V540 M960 600 V540" stroke="#6a4a2a" strokeWidth="8" />
        <rect x="870" y="520" width="100" height="26" fill="#a87a4a" />
        <path d="M850 524 L920 470 L990 524 Z" fill="#c9a25a" stroke="#8a6a3a" strokeWidth="3" />
      </g>
      <g>
        <path d="M688 640 L712 640 L716 700 L684 700 Z" fill="#3a5a8a" />
        <circle cx="700" cy="628" r="11" fill="#c98e64" />
        <path d="M672 624 L700 600 L728 624 Z" fill="#e2c46a" stroke="#a8862e" strokeWidth="2" />
      </g>
      <Palm x={230} y={720} h={330} lean={1} />
      <Palm x={1400} y={760} h={300} lean={-1} />
    </>
  )
}

function Bromo() {
  return (
    <>
      <rect width="1600" height="900" fill="url(#ex-sky-bromo)" />
      <path d="M1000 640 L1260 260 L1520 640 Z" fill="#6a6f8a" />
      <g className="ex-smoke">
        {[0, 1, 2].map((k) => (
          <circle key={k} cx={1260} cy={240} r={34} fill="#e8e2dc" opacity="0.7" style={{ animationDelay: `${k * 1.6}s` }} />
        ))}
      </g>
      <path d="M180 660 L420 370 L660 660 Z" fill="#7a8a5a" />
      <path d="M420 370 L340 660 M420 370 L380 660 M420 370 L460 660 M420 370 L500 660 M420 370 L560 660 M420 370 L290 660" stroke="#5a6a3e" strokeWidth="5" />
      <path d="M520 660 L710 410 Q800 385 890 410 L1080 660 Z" fill="#8d7b6f" />
      <path d="M710 410 Q800 440 890 410" stroke="#5a4a40" strokeWidth="8" fill="none" />
      <g className="ex-smoke">
        {[0, 1, 2, 3].map((k) => (
          <circle key={k} cx={800} cy={400} r={46} fill="#f4efe8" opacity="0.75" style={{ animationDelay: `${k * 1.2}s` }} />
        ))}
      </g>
      <rect y="640" width="1600" height="260" fill="#d9c3a0" />
      <path d="M0 700 Q400 690 800 705 T1600 700 M0 780 Q400 770 800 790 T1600 780" stroke="#c4aa82" strokeWidth="4" fill="none" />
      <g fill="#5a3a2a">
        <rect x="980" y="690" width="90" height="40" />
        <path d="M968 694 L1025 664 L1082 694 Z" />
        <path d="M985 666 L1025 642 L1065 666 Z" />
        <path d="M1000 644 L1025 626 L1050 644 Z" />
      </g>
    </>
  )
}

function KualaLumpur() {
  const tower = (x: number) =>
    `M${x - 36} 770 V420 L${x - 30} 400 V300 L${x - 24} 280 V200 L${x - 16} 180 V140 L${x - 4} 120 L${x} 70 L${x + 4} 120 L${x + 16} 140 V180 L${x + 24} 200 V280 L${x + 30} 300 V400 L${x + 36} 420 V770 Z`
  return (
    <>
      <rect width="1600" height="900" fill="url(#ex-sky-kl)" />
      <g fill="#fff" className="ex-stars">
        {[
          [120, 80], [300, 150], [460, 60], [610, 190], [1010, 90], [1180, 170], [1340, 70], [1500, 140], [220, 240], [1420, 260],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" />
        ))}
      </g>
      <circle cx="800" cy="420" r="320" fill="url(#ex-glow-kl)" />
      {[
        [80, 470, 140], [240, 520, 110], [380, 430, 150], [560, 500, 120], [1000, 480, 130], [1150, 410, 150], [1320, 500, 120], [1460, 450, 140],
      ].map(([x, y, w]) => (
        <g key={x}>
          <rect x={x} y={y} width={w} height={800 - y} fill="#241c44" />
          <Windows x={x} y={y} w={w} h={760 - y} gap={18} />
        </g>
      ))}
      {[735, 865].map((x) => (
        <g key={x}>
          <path d={tower(x)} fill="url(#ex-steel)" stroke="#5a6688" strokeWidth="2" />
          <path d={`M${x} 140 V770`} stroke="#d8e4ff" strokeWidth="2" opacity="0.5" />
        </g>
      ))}
      <rect x="770" y="430" width="60" height="12" fill="#b8c4e0" />
      <path d="M770 442 L790 480 M830 442 L810 480" stroke="#b8c4e0" strokeWidth="5" />
      <rect y="770" width="1600" height="130" fill="#1c1630" />
      <path d="M0 850 H1600" stroke="#ffd877" strokeWidth="4" strokeDasharray="40 30" opacity="0.5" />
      <path d="M180 690 Q400 720 620 690 M980 690 Q1200 720 1420 690" stroke="#3a2a20" strokeWidth="2" fill="none" />
      <g className="ex-lanterns">
        {[220, 300, 380, 460, 540, 1020, 1100, 1180, 1260, 1340].map((x) => (
          <ellipse key={x} cx={x} cy={706} rx="12" ry="15" fill="#e8323a" />
        ))}
      </g>
      {[180, 980].map((x) => (
        <g key={x}>
          <rect x={x} y="740" width="440" height="80" fill="#5a2a1a" />
          <path d={Array.from({ length: 11 }, (_, k) => `M${x + k * 40} 730 h20 v18 h-20 Z`).join(' ')} fill="#fff" />
          <path d={Array.from({ length: 11 }, (_, k) => `M${x + k * 40 + 20} 730 h20 v18 h-20 Z`).join(' ')} fill="#d8323a" />
        </g>
      ))}
      <text x="400" y="800" textAnchor="middle" className="ex-neon ex-neon-pink">
        SATAY
      </text>
      <text x="1200" y="800" textAnchor="middle" className="ex-neon ex-neon-cyan">
        MAKAN
      </text>
    </>
  )
}

function Malakka() {
  return (
    <>
      <rect width="1600" height="900" fill="url(#ex-sky-malakka)" />
      <path d="M0 620 Q300 560 520 600 Q800 540 1100 600 Q1350 560 1600 610 V700 H0 Z" fill="#6fae7a" />
      <g>
        <rect x="560" y="470" width="480" height="250" fill="#b0302a" />
        <path d="M540 470 L800 400 L1060 470 Z" fill="#8a2420" />
        {[600, 680, 760, 840, 920, 1000].map((x) => (
          <g key={x} fill="#f5efe4">
            <path d={`M${x - 16} 560 V530 Q${x} 510 ${x + 16} 530 V560 Z`} />
            <path d={`M${x - 16} 680 V650 Q${x} 630 ${x + 16} 650 V680 Z`} />
          </g>
        ))}
        <rect x="770" y="320" width="60" height="150" fill="#b0302a" />
        <path d="M760 320 L800 270 L840 320 Z" fill="#8a2420" />
        <circle cx="800" cy="370" r="20" fill="#f5efe4" stroke="#5a1a14" strokeWidth="3" />
        <path d="M800 370 V356 M800 370 H811" stroke="#5a1a14" strokeWidth="3" />
      </g>
      <g>
        <rect x="1110" y="520" width="200" height="200" fill="#b8342e" />
        <path d="M1100 520 L1210 450 L1320 520 Z" fill="#8a2420" />
        <path d="M1210 400 V450 M1194 418 H1226" stroke="#f5efe4" strokeWidth="8" />
        <path d="M1190 720 V640 Q1210 610 1230 640 V720 Z" fill="#5a1a14" />
      </g>
      <rect y="720" width="1600" height="40" fill="#c9b08a" />
      <rect y="760" width="1600" height="140" fill="#3f8fa0" />
      <g className="ex-waves" stroke="#9fd8e4" strokeWidth="3" fill="none" opacity="0.7">
        <path d="M0 800 Q50 792 100 800 T200 800 T300 800 T400 800 T500 800 T600 800 T700 800 T800 800 T900 800 T1000 800 T1100 800 T1200 800 T1300 800 T1400 800 T1500 800 T1600 800" />
      </g>
      <g className="ex-boat">
        <path d="M640 830 H860 L830 860 H670 Z" fill="#6a3f28" />
        <rect x="700" y="800" width="110" height="30" rx="6" fill="#f2d59b" />
      </g>
      {[360, 1240].map((x) => (
        <g key={x}>
          <circle cx={x - 50} cy="700" r="26" fill="none" stroke="#2a2a2a" strokeWidth="6" />
          <circle cx={x + 50} cy="700" r="26" fill="none" stroke="#2a2a2a" strokeWidth="6" />
          <path d={`M${x - 70} 670 H${x + 40} L${x + 60} 620 H${x - 60} Z`} fill="#e83a8a" />
          <path d={`M${x - 80} 610 Q${x} 540 ${x + 70} 610 Z`} fill="#ffd34d" />
          {[-60, -30, 0, 30].map((dx) => (
            <circle key={dx} cx={x + dx} cy={606} r="10" fill={dx % 60 ? '#ff8fc0' : '#7a4fc9'} />
          ))}
        </g>
      ))}
      <Palm x={150} y={720} h={300} lean={1} />
      <Palm x={1480} y={720} h={280} lean={-1} />
    </>
  )
}

function Singapur() {
  return (
    <>
      <rect width="1600" height="900" fill="url(#ex-sky-sg)" />
      <g fill="#fff" className="ex-stars">
        {[
          [140, 90], [420, 60], [620, 140], [1000, 70], [1220, 120], [1480, 80], [300, 200],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" />
        ))}
      </g>
      <g className="ex-fireworks">
        {[
          { x: 520, y: 200, c: '#ffd34d' },
          { x: 1080, y: 160, c: '#ff5c8a' },
          { x: 800, y: 110, c: '#5fe0ea' },
        ].map(({ x, y, c }, k) => (
          <g key={x} style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${k * 0.7}s` }} stroke={c} strokeWidth="4" strokeLinecap="round">
            {Array.from({ length: 12 }, (_, i) => (
              <path key={i} d={`M${x + Math.cos(i * 30 * RAD) * 20} ${y + Math.sin(i * 30 * RAD) * 20} L${x + Math.cos(i * 30 * RAD) * 70} ${y + Math.sin(i * 30 * RAD) * 70}`} />
            ))}
          </g>
        ))}
      </g>
      {[
        [1040, 420, 90], [1140, 360, 110], [1260, 440, 90], [1360, 380, 120], [1490, 450, 110],
      ].map(([x, y, w]) => (
        <g key={x}>
          <rect x={x} y={y} width={w} height={640 - y} fill="#1c2452" />
          <Windows x={x} y={y} w={w} h={620 - y} gap={16} />
        </g>
      ))}
      <g fill="url(#ex-steel)" stroke="#5a6688" strokeWidth="2">
        {[690, 780, 870].map((x) => (
          <path key={x} d={`M${x - 26} 640 L${x - 20} 335 H${x + 22} L${x + 28} 640 Z`} />
        ))}
        <path d="M620 318 H960 Q972 326 960 334 H640 Z" />
      </g>
      {[690, 780, 870].map((x) => (
        <Windows key={x} x={x - 22} y={350} w={46} h={280} gap={14} />
      ))}
      {[
        [260, 470], [360, 420], [450, 500],
      ].map(([x, y]) => (
        <g key={x}>
          <path d={`M${x - 8} 640 L${x - 4} ${y} H${x + 4} L${x + 8} 640 Z`} fill="#4a3a6a" />
          <path d={`M${x - 60} ${y - 40} L${x} ${y} L${x + 60} ${y - 40} Z`} fill="#7a3fa0" />
          <path d={`M${x - 60} ${y - 40} H${x + 60}`} stroke="#ff8fc0" strokeWidth="6" className="ex-lit" />
        </g>
      ))}
      <rect y="640" width="1600" height="260" fill="#11204a" />
      <g className="ex-shimmer" opacity="0.6">
        {[690, 780, 870, 360, 1200, 1400].map((x, k) => (
          <rect key={x} x={x - 20} y={660 + (k % 3) * 40} width="40" height="6" fill="#ffd877" />
        ))}
      </g>
      <path d="M0 860 Q400 830 800 850 T1600 840 V900 H0 Z" fill="#2a2a3a" />
    </>
  )
}

const SCENES = [Bali, Jawa, Bromo, KualaLumpur, Malakka, Singapur]

function Vehicles() {
  return (
    <g>
      <g className="ex-vehicle ex-truck">
        <rect x="0" y="720" width="230" height="110" rx="6" fill="#e2a83a" />
        <path d="M230 760 H300 L330 800 V830 H230 Z" fill="#d8323a" />
        <rect x="246" y="770" width="46" height="26" fill="#bfe6f5" />
        <text x="115" y="790" textAnchor="middle" className="ex-vehicle-text">
          SINGAPUR?
        </text>
        {[50, 180, 280].map((x) => (
          <circle key={x} cx={x} cy="840" r="24" fill="#2a2a2a" stroke="#888" strokeWidth="6" />
        ))}
      </g>
      <g className="ex-vehicle ex-cart">
        <rect x="40" y="760" width="200" height="60" fill="#a87a4a" />
        {[60, 120, 180].map((x) => (
          <g key={x}>
            <rect x={x} y="720" width="50" height="40" fill="#c99a5a" stroke="#6a4a2a" strokeWidth="3" />
            <circle cx={x + 25} cy="716" r="10" fill="#f28a2e" />
          </g>
        ))}
        <circle cx="80" cy="836" r="20" fill="#2a2a2a" />
        <circle cx="200" cy="836" r="20" fill="#2a2a2a" />
        <path d="M240 780 L290 760" stroke="#6a4a2a" strokeWidth="8" />
        <circle cx="300" cy="700" r="16" fill="#c98e64" />
        <path d="M284 700 L300 680 L316 700 Z" fill="#e2c46a" />
        <path d="M290 716 H310 L314 790 H286 Z" fill="#3a5a8a" />
        <path d="M290 790 L280 840 M310 790 L318 840" stroke="#3a5a8a" strokeWidth="8" />
      </g>
      <g className="ex-vehicle ex-bus">
        <rect x="0" y="680" width="380" height="150" rx="20" fill="#2fa8a0" />
        <rect x="0" y="770" width="380" height="20" fill="#ffd34d" />
        {[20, 90, 160, 230, 300].map((x) => (
          <rect key={x} x={x} y="700" width="56" height="50" rx="6" fill="#bfe6f5" />
        ))}
        <rect x="0" y="660" width="380" height="20" rx="6" fill="#e8323a" />
        {[70, 300].map((x) => (
          <circle key={x} cx={x} cy="840" r="26" fill="#2a2a2a" stroke="#888" strokeWidth="6" />
        ))}
      </g>
      <g className="ex-plane">
        <path d="M0 0 H90 Q110 0 110 8 Q110 16 90 16 H0 Z" fill="#fff" />
        <path d="M40 8 L20 -24 H34 L66 8 Z M40 8 L20 40 H34 L66 8 Z M0 2 L-10 -14 H4 L12 4 Z" fill="#dfe6f0" />
      </g>
    </g>
  )
}

type Props = { stop: number; mood: Mood; transport: Transport | null; won?: boolean }

export function StopScene({ stop, mood, transport, won = false }: Props) {
  return (
    <div className="ex-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden" data-testid="stop-scene" data-stop={stop} data-mood={mood} data-transport={transport ?? ''} data-won={won}>
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="ex-layer" aria-hidden>
        <defs>
          <linearGradient id="ex-sky-bali" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6fc3ee" />
            <stop offset="1" stopColor="#fdf0c8" />
          </linearGradient>
          <linearGradient id="ex-sky-jawa" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8fd0ee" />
            <stop offset="1" stopColor="#eef7e0" />
          </linearGradient>
          <linearGradient id="ex-sky-bromo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6d7fb5" />
            <stop offset="0.55" stopColor="#f6b38a" />
            <stop offset="1" stopColor="#fde6c4" />
          </linearGradient>
          <linearGradient id="ex-sky-kl" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#120c2e" />
            <stop offset="1" stopColor="#4a2468" />
          </linearGradient>
          <linearGradient id="ex-sky-malakka" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8fcde8" />
            <stop offset="1" stopColor="#fde9c6" />
          </linearGradient>
          <linearGradient id="ex-sky-sg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0d1840" />
            <stop offset="0.6" stopColor="#3a3f7a" />
            <stop offset="1" stopColor="#f08a5d" />
          </linearGradient>
          <linearGradient id="ex-steel" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8e9bb8" />
            <stop offset="0.5" stopColor="#dfe6f5" />
            <stop offset="1" stopColor="#7a86a6" />
          </linearGradient>
          <radialGradient id="ex-glow-kl">
            <stop offset="0" stopColor="#ff8fd0" stopOpacity="0.35" />
            <stop offset="1" stopColor="#ff8fd0" stopOpacity="0" />
          </radialGradient>
        </defs>
        {SCENES.map((Scene, i) => (
          <g key={i} className="ex-scene" data-active={i === stop}>
            <Scene />
          </g>
        ))}
        <Vehicles />
      </svg>
      <div className="ex-tint" />
      <div className="ex-vignette" />
    </div>
  )
}
