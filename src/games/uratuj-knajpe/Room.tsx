import './knajpa.css'
import type { ReactNode } from 'react'
import { statLevel, type Level, type Stats } from './logic'

export type RoomMood = 'idle' | 'scene' | 'good' | 'bad' | 'fail' | 'revisit' | 'result'

function Swap({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <g className="kn-swap" data-on={on}>
      {children}
    </g>
  )
}

function Defs() {
  return (
    <defs>
      <pattern id="kn-paper0" width="40" height="40" patternUnits="userSpaceOnUse">
        <rect width="40" height="40" fill="#c4bb84" />
        <path d="M10 0 V40 M30 0 V40" stroke="#b3a970" strokeWidth="5" />
      </pattern>
      <pattern id="kn-paper1" width="48" height="48" patternUnits="userSpaceOnUse">
        <rect width="48" height="48" fill="#efe2c0" />
        <path d="M24 10 L32 24 L24 38 L16 24 Z" fill="#e2cfa2" />
      </pattern>
      <pattern id="kn-paper2" width="60" height="60" patternUnits="userSpaceOnUse">
        <rect width="60" height="60" fill="#f4e8cf" />
        <path d="M0 0 V60 M30 0 V60" stroke="#ead9b4" strokeWidth="10" />
        <circle cx="15" cy="30" r="4" fill="#d9a85a" opacity="0.5" />
      </pattern>
      <pattern id="kn-check" width="36" height="36" patternUnits="userSpaceOnUse">
        <rect width="36" height="36" fill="#f6f1ea" />
        <rect width="18" height="18" fill="#d8484a" />
        <rect x="18" y="18" width="18" height="18" fill="#d8484a" />
      </pattern>
      <pattern id="kn-lino" width="80" height="80" patternUnits="userSpaceOnUse">
        <rect width="80" height="80" fill="#8f8a78" />
        <rect width="40" height="40" fill="#7e796a" />
        <rect x="40" y="40" width="40" height="40" fill="#7e796a" />
      </pattern>
      <pattern id="kn-planks" width="160" height="40" patternUnits="userSpaceOnUse">
        <rect width="160" height="40" fill="#a8743f" />
        <path d="M0 39 H160 M60 0 V40" stroke="#7d5129" strokeWidth="2" />
      </pattern>
      <pattern id="kn-bricks" width="80" height="40" patternUnits="userSpaceOnUse">
        <rect width="80" height="40" fill="#b5654a" />
        <path d="M0 19 H80 M0 39 H80 M40 0 V19 M0 19 V39 M80 19 V39" stroke="#8f4a36" strokeWidth="3" />
      </pattern>
      <radialGradient id="kn-warm">
        <stop offset="0" stopColor="#ffd98a" stopOpacity="0.7" />
        <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="kn-steel" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#9aa3ad" />
        <stop offset="0.5" stopColor="#f1f5f8" />
        <stop offset="1" stopColor="#8a939d" />
      </linearGradient>
      <linearGradient id="kn-dusk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5a5a8e" />
        <stop offset="0.7" stopColor="#f2a46c" />
        <stop offset="1" stopColor="#f7c98e" />
      </linearGradient>
    </defs>
  )
}

function Wall({ level }: { level: Level }) {
  return (
    <>
      <Swap on={level === 0}>
        <rect width="1600" height="560" fill="url(#kn-paper0)" />
        <g fill="#7a5a2a" opacity="0.22">
          <ellipse cx="230" cy="120" rx="70" ry="40" />
          <ellipse cx="1400" cy="300" rx="50" ry="70" />
          <ellipse cx="900" cy="80" rx="90" ry="30" />
        </g>
        <g fill="#ddd5a3" stroke="#9a9060" strokeWidth="2">
          <path d="M150 40 L250 40 L215 150 Q190 120 150 135 Z" />
          <path d="M1390 120 L1470 120 L1470 260 Q1430 200 1400 215 Z" />
          <path d="M760 240 L840 240 L800 330 Q780 300 760 310 Z" />
        </g>
        <rect y="380" width="1600" height="180" fill="#b5703a" />
        <path d="M0 380 H1600" stroke="#7a4520" strokeWidth="8" />
        <g stroke="#94582a" strokeWidth="3">
          {Array.from({ length: 40 }, (_, i) => (
            <path key={i} d={`M${i * 40 + 20} 384 V560`} />
          ))}
        </g>
      </Swap>
      <Swap on={level === 1}>
        <rect width="1600" height="560" fill="url(#kn-paper1)" />
        <rect y="380" width="1600" height="180" fill="#9a5f34" />
        <path d="M0 380 H1600" stroke="#6a3f20" strokeWidth="8" />
        <g stroke="#83502b" strokeWidth="2">
          {Array.from({ length: 20 }, (_, i) => (
            <path key={i} d={`M${i * 80 + 40} 384 V560`} />
          ))}
        </g>
      </Swap>
      <Swap on={level === 2}>
        <rect width="1600" height="560" fill="url(#kn-paper2)" />
        <rect y="370" width="1600" height="190" fill="#6b4226" />
        <path d="M0 370 H1600" stroke="#4a2a14" strokeWidth="10" />
        <g fill="none" stroke="#86553a" strokeWidth="4">
          {Array.from({ length: 13 }, (_, i) => (
            <rect key={i} x={i * 130 + 15} y="395" width="100" height="140" rx="4" />
          ))}
        </g>
        <g>
          <rect x="150" y="150" width="110" height="80" fill="#8fc0d8" stroke="#c99a3a" strokeWidth="8" />
          <path d="M154 226 L190 190 L215 210 L256 175 V226 Z" fill="#5f9a4a" />
          <rect x="1350" y="160" width="100" height="120" fill="#f2d39a" stroke="#c99a3a" strokeWidth="8" />
          <circle cx="1400" cy="215" r="26" fill="#e0703a" />
        </g>
      </Swap>
    </>
  )
}

function Floor({ level }: { level: Level }) {
  return (
    <>
      <Swap on={level === 0}>
        <rect y="560" width="1600" height="340" fill="url(#kn-lino)" />
        <path d="M300 640 L360 700 L340 760 M1200 820 L1260 780 L1320 800" stroke="#4a463a" strokeWidth="3" fill="none" />
      </Swap>
      <Swap on={level > 0}>
        <rect y="560" width="1600" height="340" fill="url(#kn-planks)" />
      </Swap>
      <Swap on={level === 2}>
        <ellipse cx="850" cy="800" rx="330" ry="70" fill="#9a2f2a" />
        <ellipse cx="850" cy="800" rx="300" ry="56" fill="none" stroke="#e0b25a" strokeWidth="6" strokeDasharray="14 10" />
      </Swap>
    </>
  )
}

function Lights({ level }: { level: Level }) {
  return (
    <>
      <Swap on={level < 2}>
        <g className="kn-light kn-tube">
          <polygon points="560,46 1040,46 1240,420 360,420" fill="#eef6ff" opacity="0.18" />
          <rect x="560" y="28" width="480" height="18" rx="9" fill="#f4f8ff" stroke="#b0b8c4" strokeWidth="3" />
        </g>
        <g className="kn-light kn-tube">
          <rect x="150" y="28" width="200" height="14" rx="7" fill="#f4f8ff" stroke="#b0b8c4" strokeWidth="3" />
          <rect x="1250" y="28" width="200" height="14" rx="7" fill="#f4f8ff" stroke="#b0b8c4" strokeWidth="3" />
        </g>
      </Swap>
      <Swap on={level === 2}>
        <g className="kn-light">
          {[200, 850, 1400].map((x) => (
            <g key={x}>
              <path d={`M${x} 0 V120`} stroke="#3a2614" strokeWidth="3" />
              <circle cx={x} cy="200" r="150" fill="url(#kn-warm)" />
              <path d={`M${x - 50} 170 L${x - 26} 120 H${x + 26} L${x + 50} 170 Z`} fill="#c0392b" />
              <ellipse cx={x} cy="172" rx="22" ry="8" fill="#fff3c4" />
            </g>
          ))}
        </g>
        <path d="M120 90 Q480 170 800 100 Q1120 170 1480 90" stroke="#3a2614" strokeWidth="2" fill="none" />
        <g className="kn-bulbs">
          {Array.from({ length: 15 }, (_, i) => {
            const x = 140 + i * 95
            const t = ((x - 120) % 680) / 680
            const y = 90 + Math.sin(t * Math.PI) * 60
            return <circle key={i} cx={x} cy={y + 8} r="8" fill={['#ffd34d', '#ff7a5c', '#7fd0ff'][i % 3]} />
          })}
        </g>
      </Swap>
    </>
  )
}

function Kitchen({ level, scene }: { level: Level; scene: string }) {
  const open = scene === 'kuchnia'
  const back = ['#6e6a52', '#cfd6d6', '#e6eef0'][level]
  return (
    <g>
      <rect x="1080" y="250" width="160" height="310" fill={back} />
      <rect x="1270" y="280" width="180" height="150" fill={back} />
      <Swap on={level === 0}>
        <path d="M1280 280 H1440 L1415 320 H1305 Z" fill="#6a4a2a" />
        <g className="kn-drips" fill="#4a3418">
          <ellipse cx="1320" cy="328" rx="4" ry="7" />
          <ellipse cx="1380" cy="328" rx="4" ry="7" />
          <ellipse cx="1410" cy="326" rx="3" ry="6" />
        </g>
        <rect x="1330" y="370" width="60" height="40" rx="6" fill="#1f1a16" />
        <ellipse cx="1360" cy="370" rx="32" ry="6" fill="#2a2420" />
        <g fill="#3a3430" opacity="0.6">
          <circle cx="1350" cy="350" r="12" />
          <circle cx="1372" cy="336" r="9" />
        </g>
      </Swap>
      <Swap on={level === 1}>
        <path d="M1280 280 H1440 L1415 320 H1305 Z" fill="#9aa3ad" />
        <rect x="1300" y="370" width="50" height="40" rx="5" fill="#8a939d" />
        <rect x="1370" y="375" width="50" height="35" rx="5" fill="#8a939d" />
      </Swap>
      <Swap on={level === 2}>
        <path d="M1280 280 H1440 L1415 320 H1305 Z" fill="url(#kn-steel)" />
        {[1295, 1345, 1395].map((x) => (
          <rect key={x} x={x} y="370" width="42" height="40" rx="5" fill="url(#kn-steel)" stroke="#7a838d" />
        ))}
        <g className="kn-steam" fill="#fff" opacity="0.8">
          {[1316, 1366, 1416].map((x, i) => (
            <circle key={x} cx={x} cy="358" r="10" style={{ animationDelay: `${-i * 0.7}s` }} />
          ))}
        </g>
        <g fill="#f4efe0" stroke="#c9bfa0">
          {[1110, 1130, 1150, 1170].map((x, i) => (
            <circle key={x} cx={x - 30 + i * 4} cy={300 + i * 22} r="11" />
          ))}
        </g>
      </Swap>
      <rect x="1262" y="424" width="196" height="14" fill="#7a4a2a" />
      <Swap on={level === 2}>
        {[1300, 1340, 1380].map((x) => (
          <path key={x} d={`M${x} 424 Q${x + 15} 404 ${x + 30} 424 Z`} fill="#f4dca0" stroke="#c9a060" />
        ))}
      </Swap>
      <rect x="1262" y="272" width="196" height="166" fill="none" stroke="#5a3420" strokeWidth="10" />
      <rect x="1074" y="244" width="172" height="320" fill="none" stroke="#5a3420" strokeWidth="10" />
      <g key={scene} className="kn-doors" data-open={open}>
        <g className="kn-door-l">
          <rect x="1080" y="250" width="80" height="310" fill="#8a5a3a" stroke="#5a3420" strokeWidth="4" />
          <circle cx="1120" cy="330" r="22" fill={back} stroke="#c9b48a" strokeWidth="5" />
          <rect x="1084" y="500" width="72" height="54" fill="#b8bec4" />
        </g>
        <g className="kn-door-r">
          <rect x="1160" y="250" width="80" height="310" fill="#8a5a3a" stroke="#5a3420" strokeWidth="4" />
          <circle cx="1200" cy="330" r="22" fill={back} stroke="#c9b48a" strokeWidth="5" />
          <rect x="1164" y="500" width="72" height="54" fill="#b8bec4" />
        </g>
      </g>
    </g>
  )
}

function Counter({ level }: { level: Level }) {
  return (
    <g>
      <rect x="140" y="200" width="130" height="170" rx="6" fill="#2f3a32" stroke="#8a5a3a" strokeWidth="8" />
      <text x="205" y="232" textAnchor="middle" className="kn-chalk" fontSize="20">
        REZERWACJE
      </text>
      <Swap on={level === 0}>
        <text x="205" y="300" textAnchor="middle" className="kn-chalk" fontSize="34">
          —
        </text>
      </Swap>
      <Swap on={level >= 1}>
        <path d="M160 260 H250 M160 285 H230" className="kn-chalk-line" />
      </Swap>
      <Swap on={level === 2}>
        <path d="M160 310 H245 M160 335 H220" className="kn-chalk-line" />
        <text x="205" y="300" textAnchor="middle" fontSize="26" fill="#ff7a5c" transform="rotate(-12 205 300)" className="kn-chalk">
          KOMPLET
        </text>
      </Swap>

      <rect x="300" y="500" width="400" height="200" fill="#7a4a2a" />
      <rect x="290" y="488" width="420" height="18" fill="#5a3420" />
      <g stroke="#5a3420" strokeWidth="3">
        <path d="M400 510 V690 M500 510 V690 M600 510 V690" />
      </g>
      <path d="M330 488 L345 420 H430 L440 488 Z" fill="#c9ccc4" stroke="#8a8c84" strokeWidth="3" />
      <rect x="350" y="428" width="76" height="24" fill="#1f2a1f" />
      <text x="420" y="447" textAnchor="end" className="kn-display">
        {['0,00', '128,50', '2 480,00'][level]}
      </text>
      <path d="M480 495 V410" stroke="#555" strokeWidth="4" />
      <Swap on={level === 0}>
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`rotate(${(i % 2 ? 1 : -1) * (6 + i * 3)} 480 ${460 - i * 10})`}>
            <rect x="456" y={448 - i * 10} width="48" height="30" fill="#fbf6e8" stroke="#bdb39a" />
            <text x="480" y={468 - i * 10} textAnchor="middle" fontSize="9" fill="#d8323a" fontWeight="700">
              ZALEGŁE
            </text>
          </g>
        ))}
      </Swap>
      <Swap on={level === 1}>
        {[0, 1].map((i) => (
          <rect key={i} x="458" y={458 - i * 12} width="44" height="28" fill="#fbf6e8" stroke="#bdb39a" transform={`rotate(${i ? 8 : -6} 480 470)`} />
        ))}
      </Swap>
      <path d="M590 500 V470 H690 V500 Z" fill="#4a5a6a" />
      <path d="M590 470 L600 440 H700 L690 470 Z" fill="#6a7a8a" />
      <Swap on={level === 0}>
        <circle cx="640" cy="492" r="5" fill="#c9a030" />
      </Swap>
      <Swap on={level === 1}>
        {[0, 1, 2].map((i) => (
          <rect key={i} x="600" y={482 - i * 6} width="56" height="12" fill="#6fae5a" stroke="#3a7a2a" />
        ))}
        <circle cx="672" cy="490" r="7" fill="#ffd34d" stroke="#b8892e" />
      </Swap>
      <Swap on={level === 2}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={598 + (i % 2) * 6} y={484 - i * 7} width="60" height="12" fill="#6fae5a" stroke="#3a7a2a" transform={`rotate(${(i % 3) * 4 - 4} 630 ${484 - i * 7})`} />
        ))}
        <path d="M650 450 l20 -30 l8 6 l-18 28 Z" fill="#6fae5a" stroke="#3a7a2a" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={666 + i * 10} cy={492 - i * 4} r="7" fill="#ffd34d" stroke="#b8892e" />
        ))}
      </Swap>
    </g>
  )
}

function Guest({ x, y, color, hair }: { x: number; y: number; color: string; hair: string }) {
  return (
    <g>
      <path d={`M${x - 26} ${y + 60} Q${x - 26} ${y + 18} ${x} ${y + 18} Q${x + 26} ${y + 18} ${x + 26} ${y + 60} Z`} fill={color} />
      <circle cx={x} cy={y} r="18" fill="#e9b48e" />
      <path d={`M${x - 19} ${y - 2} Q${x} ${y - 30} ${x + 19} ${y - 2} Q${x} ${y - 14} ${x - 19} ${y - 2} Z`} fill={hair} />
    </g>
  )
}

function SideTable({ x, guests }: { x: number; guests: boolean }) {
  return (
    <g>
      {guests && (
        <>
          <Guest x={x - 60} y={690} color="#3a6fb0" hair="#5a3a20" />
          <Guest x={x + 60} y={690} color="#c0504a" hair="#e8c060" />
        </>
      )}
      <path d={`M${x - 10} 760 V850 M${x + 10} 760 V850`} stroke="#5a3420" strokeWidth="8" />
      <ellipse cx={x} cy="760" rx="110" ry="22" fill="#f6f1ea" stroke="#d8cdbb" strokeWidth="3" />
      {guests && (
        <>
          <ellipse cx={x - 40} cy="756" rx="22" ry="7" fill="#fff" stroke="#ccc" />
          <ellipse cx={x + 40} cy="756" rx="22" ry="7" fill="#fff" stroke="#ccc" />
        </>
      )}
    </g>
  )
}

function Chair({ x, flip = false }: { x: number; flip?: boolean }) {
  return (
    <g transform={flip ? `translate(${2 * x} 0) scale(-1 1)` : undefined}>
      <path d={`M${x - 40} 620 V720 M${x - 40} 720 H${x + 30} M${x - 30} 720 V790 M${x + 26} 720 V790`} stroke="#6a3f20" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d={`M${x - 40} 640 H${x - 6} M${x - 40} 670 H${x - 6}`} stroke="#6a3f20" strokeWidth="6" />
    </g>
  )
}

function FrontTable({ atmosfera, jakosc, scene }: { atmosfera: Level; jakosc: Level; scene: string }) {
  const family = scene === 'rodzina'
  return (
    <g>
      {family ? (
        <>
          <Chair x={640} flip />
          <Chair x={1060} />
        </>
      ) : (
        <>
          <Chair x={690} />
          <Chair x={1010} flip />
        </>
      )}
      <path d="M760 730 V870 M940 730 V870" stroke="#5a3420" strokeWidth="12" />
      <Swap on={atmosfera === 0}>
        <ellipse cx="850" cy="722" rx="190" ry="36" fill="url(#kn-check)" stroke="#a83a3a" strokeWidth="3" />
        <ellipse cx="800" cy="712" rx="70" ry="10" fill="#fff" opacity="0.35" />
      </Swap>
      <Swap on={atmosfera > 0}>
        <path d="M660 722 Q660 800 690 806 H1010 Q1040 800 1040 722 Z" fill="#fbfaf6" stroke="#ddd6c8" strokeWidth="3" />
        <ellipse cx="850" cy="722" rx="190" ry="36" fill="#fff" stroke="#ddd6c8" strokeWidth="3" />
      </Swap>
      <Swap on={atmosfera === 2}>
        <path d="M680 718 H1020 V730 H680 Z" fill="#b0302a" opacity="0.85" />
        <rect x="930" y="676" width="12" height="40" fill="#f6efe0" />
        <ellipse className="kn-flame" cx="936" cy="668" rx="6" ry="11" fill="#ffb02e" />
      </Swap>
      <Swap on={atmosfera === 0}>
        <path d="M750 712 L742 670 H778 L770 712 Z" fill="#a8b8c0" />
        <g fill="#b8a8b0">
          <circle cx="750" cy="650" r="13" />
          <circle cx="772" cy="644" r="12" />
          <circle cx="760" cy="630" r="11" />
        </g>
        <path d="M760 670 V640" stroke="#7a8a70" strokeWidth="3" />
      </Swap>
      <Swap on={atmosfera > 0}>
        <path d="M748 714 Q738 690 750 670 H770 Q782 690 772 714 Z" fill="#cfe8f0" stroke="#9ac0d0" opacity="0.9" />
        <path d="M760 672 V630 M760 672 L740 640 M760 672 L782 636" stroke="#4a8a3a" strokeWidth="3" />
        <circle cx="760" cy="624" r="12" fill="#ff6b8a" />
        <circle cx="738" cy="636" r="11" fill="#ffd34d" />
        <circle cx="784" cy="630" r="11" fill="#ff9a3a" />
      </Swap>
      {scene === 'degustacja' && (
        <g className="kn-prop">
          <ellipse cx="880" cy="714" rx="60" ry="14" fill="#fff" stroke="#ccc" strokeWidth="2" />
          {[848, 872, 896, 920].map((x, i) => (
            <path key={x} d={`M${x - 14} 712 Q${x} ${690 - (i % 2) * 4} ${x + 14} 712 Z`} fill="#f2dfb4" stroke="#c9b080" strokeWidth="2" />
          ))}
          <path className="kn-wiggle" d="M860 680 q6 -10 0 -20 q-6 -10 0 -20 M900 676 q6 -10 0 -20 q-6 -10 0 -20" stroke="#9aa0a6" strokeWidth="3" fill="none" />
        </g>
      )}
      {scene === 'menu' && (
        <g className="kn-prop" transform="rotate(6 940 620)">
          <rect x="880" y="520" width="120" height="196" rx="4" fill="#7a1f1f" stroke="#c99a3a" strokeWidth="4" />
          <text x="940" y="552" textAnchor="middle" className="kn-sign-text" fontSize="26" fill="#ffd34d">
            MENU
          </text>
          <g stroke="#f4dca0" strokeWidth="2">
            {Array.from({ length: 12 }, (_, i) => (
              <path key={i} d={`M896 ${568 + i * 9} H${960 + (i % 3) * 12}`} />
            ))}
          </g>
          <text x="940" y="700" textAnchor="middle" className="kn-sign-text" fontSize="18" fill="#ffd34d">
            46 POZYCJI
          </text>
        </g>
      )}
      {scene === 'otwarcie' && (
        <g className="kn-prop">
          <path d="M560 600 Q850 640 1140 600" stroke="#d8323a" strokeWidth="14" fill="none" />
          <path d="M850 620 l-40 -26 v52 Z M850 620 l40 -26 v52 Z" fill="#b0202a" />
          <circle cx="850" cy="620" r="10" fill="#d8323a" />
        </g>
      )}
      <Swap on={jakosc === 0}>
        <g className="kn-flies">
          {[0, 1, 2].map((i) => (
            <g key={i} className="kn-fly" style={{ animationDelay: `${-i * 1.1}s` }}>
              <ellipse cx={0} cy={-3} rx="5" ry="3" fill="#cfd8e0" opacity="0.8" />
              <circle cx="0" cy="0" r="3.5" fill="#1a1a1a" />
            </g>
          ))}
        </g>
      </Swap>
    </g>
  )
}

function Tv({ loud }: { loud: boolean }) {
  return (
    <g className="kn-tv" data-loud={loud}>
      <path d="M1400 70 V100" stroke="#444" strokeWidth="6" />
      <rect x="1335" y="100" width="130" height="96" rx="10" fill="#3a3a3a" />
      <rect x="1347" y="112" width="96" height="72" rx="6" fill="#8ab0c8" className="kn-tv-screen" />
      <circle cx="1454" cy="130" r="4" fill="#d8323a" />
      {loud && (
        <g className="kn-waves" stroke="#3a2614" strokeWidth="4" fill="none" strokeLinecap="round">
          <path d="M1320 130 q-12 18 0 36" />
          <path d="M1304 120 q-20 28 0 56" />
        </g>
      )}
    </g>
  )
}

function Interior({ stats, scene }: { stats: Stats; scene: string }) {
  const q = statLevel(stats.jakosc)
  const a = statLevel(stats.atmosfera)
  const k = statLevel(stats.kasa)
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="kn-layer" aria-hidden>
      <Defs />
      <Wall level={a} />
      <Floor level={a} />
      <Kitchen level={q} scene={scene} />
      <Counter level={k} />
      {(a === 0 || scene === 'wystroj') && <Tv loud={scene === 'wystroj'} />}
      <SideTable x={225} guests={a >= 1} />
      <SideTable x={1375} guests={a === 2} />
      <FrontTable atmosfera={a} jakosc={q} scene={scene} />
      <Lights level={a} />
    </svg>
  )
}

const SIGN = 'POD ZŁOTYM KURCZAKIEM'
const CROOKED = [-8, 4, -3, 0, 6, -5, 2, 0, -9, 3, 0, -4, 7, -2, 5, -6, 0, 3, -7, 4, 8]

function Facade({ stats }: { stats: Stats }) {
  const k = statLevel(stats.kasa)
  const a = statLevel(stats.atmosfera)
  const windowFill = ['#4a4e56', '#e9d9a8', '#ffd98a'][a]
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="kn-layer" aria-hidden>
      <rect width="1600" height="900" fill="url(#kn-dusk)" className="kn-sky" />
      <rect x="160" y="140" width="1280" height="700" fill="url(#kn-bricks)" />
      <path d="M130 140 H1470 L1440 110 H160 Z" fill="#5a3420" />
      {[300, 1000].map((x) => (
        <g key={x}>
          <rect x={x} y="440" width="300" height="250" fill={windowFill} stroke="#f4efe0" strokeWidth="12" />
          <path d={`M${x + 150} 440 V690 M${x} 565 H${x + 300}`} stroke="#f4efe0" strokeWidth="8" />
          {a === 0 && <path d={`M${x + 10} 450 Q${x + 60} 520 ${x + 30} 600 L${x + 10} 610 Z`} fill="#8a8070" opacity="0.8" />}
          {a >= 1 && (
            <path d={`M${x + 6} 446 Q${x + 50} 520 ${x + 20} 684 H${x + 6} Z M${x + 294} 446 Q${x + 250} 520 ${x + 280} 684 H${x + 294} Z`} fill="#c0392b" />
          )}
          {a === 2 && (
            <>
              <circle cx={x + 110} cy="600" r="22" fill="#6a4a3a" opacity="0.5" />
              <circle cx={x + 190} cy="596" r="20" fill="#6a4a3a" opacity="0.5" />
              <rect x={x - 10} y="690" width="320" height="30" fill="#7a4a2a" />
              {[30, 80, 130, 180, 230, 280].map((dx) => (
                <circle key={dx} cx={x + dx} cy="684" r="12" fill={dx % 20 ? '#ff6b8a' : '#ffd34d'} />
              ))}
            </>
          )}
        </g>
      ))}
      <rect x="700" y="450" width="200" height="390" fill="#ffe2a0" />
      <g className="kn-front-door">
        <rect x="710" y="460" width="180" height="380" fill="#6a3f20" stroke="#4a2a14" strokeWidth="6" />
        <rect x="735" y="490" width="130" height="150" fill="#c8dde8" opacity="0.8" />
        <circle cx="870" cy="660" r="8" fill="#e0b25a" />
        <g className="kn-closed">
          <path d="M760 690 L800 670 L840 690" stroke="#555" strokeWidth="2" fill="none" />
          <rect x="745" y="690" width="110" height="56" fill="#fff" stroke="#bbb" transform="rotate(-4 800 718)" />
          <text x="800" y="726" textAnchor="middle" className="kn-sign-text" fontSize="24" fill="#d8323a" transform="rotate(-4 800 718)">
            ZAMKNIĘTE
          </text>
        </g>
      </g>
      <g transform={k === 0 ? 'rotate(3 800 250)' : undefined}>
        <rect x="430" y="200" width="740" height="110" rx="8" fill={['#8a7a5a', '#f4e6c4', '#1f4a32'][k]} stroke={k === 2 ? '#e0b25a' : '#5a3420'} strokeWidth="8" />
        <text
          x="800"
          y="278"
          textAnchor="middle"
          className="kn-sign-text"
          fontSize="66"
          fill={['#d8d0b8', '#b0302a', '#ffd34d'][k]}
          rotate={k === 0 ? CROOKED.join(' ') : undefined}
        >
          {k === 0 ? SIGN.replace('Y', ' ') : SIGN}
        </text>
        {k === 2 && (
          <g className="kn-bulbs">
            {Array.from({ length: 16 }, (_, i) => (
              <circle key={i} cx={450 + i * 46.5} cy="200" r="7" fill="#fff3a0" />
            ))}
          </g>
        )}
      </g>
      <rect y="840" width="1600" height="60" fill="#8a8a8a" />
      <path d="M0 842 H1600" stroke="#6a6a6a" strokeWidth="4" />
    </svg>
  )
}

type Props = { mood: RoomMood; scene: string; stats: Stats; open?: boolean }

export function Room({ mood, scene, stats, open = false }: Props) {
  return (
    <div
      className="kn-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      data-testid="room"
      data-mood={mood}
      data-scene={scene}
      data-jakosc={statLevel(stats.jakosc)}
      data-atmosfera={statLevel(stats.atmosfera)}
      data-kasa={statLevel(stats.kasa)}
      data-open={open}
    >
      <div className="kn-interior">
        <Interior stats={stats} scene={scene} />
      </div>
      <div className="kn-facade">
        <Facade stats={stats} />
      </div>
      <div className="kn-tint" />
      <div className="kn-vignette" />
    </div>
  )
}
