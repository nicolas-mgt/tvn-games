import type { ReactNode } from 'react'
import type { Slot } from './logic'

const SLOT_BOX: Record<Slot, string> = {
  glowa: '46 0 108 92',
  gora: '34 92 132 196',
  dol: '46 186 108 172',
  buty: '62 280 76 104',
  dodatek: '40 80 120 140',
}

const LEFT_FOOT = 84
const RIGHT_FOOT = 116

function pair(draw: (x: number, side: 1 | -1) => ReactNode) {
  return (
    <>
      {draw(LEFT_FOOT, -1)}
      {draw(RIGHT_FOOT, 1)}
    </>
  )
}

function sleeves(color: string, width: number, end: number, stroke?: string) {
  const left = `M70 110 Q61 118 60 150 L${end > 160 ? 58 : 60} ${end}`
  const right = `M130 110 Q139 118 140 150 L${end > 160 ? 142 : 140} ${end}`
  return (
    <g fill="none" strokeLinecap="round">
      {stroke && (
        <g stroke={stroke} strokeWidth={width + 3}>
          <path d={left} />
          <path d={right} />
        </g>
      )}
      <g stroke={color} strokeWidth={width}>
        <path d={left} />
        <path d={right} />
      </g>
    </g>
  )
}

const TORSO = 'M68 104 Q100 96 132 104 L128 204 H72 Z'

type Art = { box?: string; back?: ReactNode; body: ReactNode }

const ART: Record<string, Art> = {
  cylinder: {
    body: (
      <g>
        <rect x="80" y="2" width="40" height="36" rx="3" fill="#1f1f24" />
        <rect x="80" y="28" width="40" height="7" fill="#b0202a" />
        <ellipse cx="100" cy="38" rx="34" ry="6" fill="#2a2a30" />
      </g>
    ),
  },
  czapka: {
    body: (
      <g>
        <path d="M77 42 Q77 14 100 13 Q123 14 123 42 Z" fill="#2f6fd0" stroke="#1f4f9a" strokeWidth="2" />
        <path d="M104 39 Q132 36 144 45 Q122 49 104 44 Z" fill="#1f4f9a" />
        <path d="M100 14 V40 M88 18 Q86 30 88 41 M112 18 Q114 30 112 41" stroke="#1f4f9a" strokeWidth="1.5" fill="none" />
        <circle cx="100" cy="14" r="3" fill="#1f4f9a" />
      </g>
    ),
  },
  slomkowy: {
    body: (
      <g>
        <ellipse cx="100" cy="38" rx="48" ry="10" fill="#e8cf8a" stroke="#c9a860" strokeWidth="2" />
        <path d="M79 38 Q79 15 100 14 Q121 15 121 38 Z" fill="#efd898" stroke="#c9a860" strokeWidth="2" />
        <rect x="79" y="29" width="42" height="7" fill="#f29ab4" />
        <path d="M118 32 l14 -6 v14 Z" fill="#f29ab4" />
        <path d="M60 40 Q100 50 140 40" stroke="#c9a860" strokeWidth="1.5" fill="none" />
      </g>
    ),
  },
  helm: {
    body: (
      <g>
        <path d="M78 44 Q84 78 100 82 Q116 78 122 44" stroke="#3a4020" strokeWidth="2.5" fill="none" />
        <path d="M72 46 Q72 8 100 8 Q128 8 128 46 Q100 52 72 46 Z" fill="#5f6b3a" stroke="#3a4020" strokeWidth="2" />
        <path d="M70 46 Q100 54 130 46" stroke="#3a4020" strokeWidth="4" fill="none" />
        <g fill="#4a5530">
          <circle cx="88" cy="24" r="4" />
          <circle cx="110" cy="30" r="5" />
          <circle cx="98" cy="38" r="3" />
        </g>
      </g>
    ),
  },
  korona: {
    body: (
      <g>
        <path d="M76 38 L79 12 L90 26 L100 5 L110 26 L121 12 L124 38 Z" fill="#f2c230" stroke="#b8892e" strokeWidth="2" strokeLinejoin="round" />
        <rect x="76" y="32" width="48" height="7" rx="2" fill="#e0a820" stroke="#b8892e" strokeWidth="1.5" />
        <circle cx="100" cy="27" r="4" fill="#d8323a" />
        <circle cx="86" cy="31" r="3" fill="#2f6fd0" />
        <circle cx="114" cy="31" r="3" fill="#2f9e55" />
      </g>
    ),
  },

  koszula: {
    body: (
      <g>
        {sleeves('#fbfbf6', 15, 220, '#d0d0c8')}
        <path d={TORSO} fill="#fbfbf6" stroke="#d0d0c8" strokeWidth="2" />
        <path d="M90 98 L100 112 L110 98 L114 106 L100 118 L86 106 Z" fill="#fff" stroke="#d0d0c8" strokeWidth="1.5" />
        <path d="M96 112 H104 L107 166 L100 176 L93 166 Z" fill="#2a3a7a" />
        <path d="M58 214 h4 M138 214 h4" stroke="#d0d0c8" strokeWidth="3" />
      </g>
    ),
  },
  tshirt: {
    body: (
      <g>
        {sleeves('#d8323a', 18, 140)}
        <path d="M68 104 Q100 98 132 104 L128 208 H72 Z" fill="#d8323a" />
        <path d="M90 101 Q100 110 110 101" stroke="#a8202a" strokeWidth="3" fill="none" />
        <circle cx="100" cy="146" r="14" fill="#fff" opacity="0.9" />
        <path d="M93 146 l5 5 l9 -10" stroke="#d8323a" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    ),
  },
  plaszcz: {
    body: (
      <g>
        {sleeves('#b07a4a', 18, 222, '#8a5a30')}
        <path d="M64 104 Q100 94 136 104 L142 264 H58 Z" fill="#b07a4a" stroke="#8a5a30" strokeWidth="2" />
        <path d="M100 104 V264" stroke="#8a5a30" strokeWidth="2" />
        <path d="M88 100 L100 140 L80 128 Z M112 100 L100 140 L120 128 Z" fill="#9a6538" />
        <rect x="60" y="186" width="80" height="9" fill="#8a5a30" />
        <g fill="#5a3a20">
          {[150, 172, 214].map((y) => (
            <g key={y}>
              <circle cx="92" cy={y} r="3" />
              <circle cx="108" cy={y} r="3" />
            </g>
          ))}
        </g>
      </g>
    ),
  },
  bluzka: {
    body: (
      <g>
        <path d="M68 104 Q100 98 132 104 L128 202 H72 Z" fill="#cfe3f7" stroke="#9ab8d8" strokeWidth="2" />
        <circle cx="68" cy="114" r="13" fill="#cfe3f7" stroke="#9ab8d8" strokeWidth="2" />
        <circle cx="132" cy="114" r="13" fill="#cfe3f7" stroke="#9ab8d8" strokeWidth="2" />
        <path d="M88 101 Q100 114 112 101" stroke="#9ab8d8" strokeWidth="2" fill="#fff" />
        {[
          [84, 130, '#f29ab4'],
          [112, 136, '#ffd34d'],
          [96, 160, '#f29ab4'],
          [118, 176, '#f29ab4'],
          [82, 184, '#ffd34d'],
          [104, 192, '#ffd34d'],
          [66, 114, '#f29ab4'],
          [134, 116, '#ffd34d'],
        ].map(([x, y, c]) => (
          <g key={`${x}-${y}`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <circle key={a} cx={Number(x) + 4 * Math.cos((a * Math.PI) / 180)} cy={Number(y) + 4 * Math.sin((a * Math.PI) / 180)} r="2.6" fill={String(c)} />
            ))}
            <circle cx={Number(x)} cy={Number(y)} r="2" fill="#fff" />
          </g>
        ))}
      </g>
    ),
  },
  fartuch: {
    body: (
      <g>
        {sleeves('#f6f8fa', 17, 222, '#b8c0c8')}
        <path d="M64 104 Q100 96 136 104 L140 284 H60 Z" fill="#f6f8fa" stroke="#b8c0c8" strokeWidth="2" />
        <path d="M100 112 V284" stroke="#b8c0c8" strokeWidth="2" />
        <path d="M88 100 L100 128 L82 120 Z M112 100 L100 128 L118 120 Z" fill="#e6eaee" stroke="#b8c0c8" strokeWidth="1.5" />
        <rect x="108" y="136" width="18" height="16" fill="none" stroke="#b8c0c8" strokeWidth="2" />
        <path d="M113 128 V146" stroke="#2f6fd0" strokeWidth="3" strokeLinecap="round" />
        <rect x="70" y="214" width="22" height="20" fill="none" stroke="#b8c0c8" strokeWidth="2" />
        <circle cx="104" cy="170" r="2.5" fill="#b8c0c8" />
        <circle cx="104" cy="200" r="2.5" fill="#b8c0c8" />
      </g>
    ),
  },
  odblask: {
    body: (
      <g>
        <path d="M74 104 L88 100 Q100 132 112 100 L126 104 L128 206 H72 Z" fill="#d8f02a" stroke="#a8c01a" strokeWidth="2" />
        <g fill="#e8eef2" stroke="#9aa3ad" strokeWidth="1.5">
          <rect x="73" y="150" width="54" height="8" />
          <rect x="73" y="178" width="54" height="8" />
          <rect x="82" y="104" width="7" height="46" />
          <rect x="111" y="104" width="7" height="46" />
        </g>
      </g>
    ),
  },

  dzinsy: {
    body: (
      <g>
        <path d="M73 198 H127 L125 356 H104 L100 238 L96 356 H75 Z" fill="#3a5f9a" stroke="#2a4a7a" strokeWidth="2" strokeLinejoin="round" />
        <rect x="73" y="198" width="54" height="9" fill="#2f5288" />
        <path d="M80 210 Q84 224 94 222 M120 210 Q116 224 106 222 M86 238 L84 352 M114 238 L116 352" stroke="#e8b04a" strokeWidth="1.2" strokeDasharray="3 2" fill="none" />
        <circle cx="100" cy="203" r="2.5" fill="#e8b04a" />
      </g>
    ),
  },
  szorty: {
    body: (
      <g>
        <path d="M73 200 H127 L130 262 H104 L100 240 L96 262 H70 Z" fill="#c9a86a" stroke="#9a7a40" strokeWidth="2" strokeLinejoin="round" />
        <rect x="73" y="200" width="54" height="8" fill="#b8955a" />
        <path d="M70 254 H96 M104 254 H130" stroke="#9a7a40" strokeWidth="2" />
        <path d="M80 212 Q84 222 92 222" stroke="#9a7a40" strokeWidth="1.5" fill="none" />
      </g>
    ),
  },
  sukienka: {
    body: (
      <g>
        <path d="M78 194 H122 Q140 254 150 304 Q100 316 50 304 Q60 254 78 194 Z" fill="#c0304a" stroke="#8a1a30" strokeWidth="2" />
        <path d="M76 194 H124 L122 206 H78 Z" fill="#8a1a30" />
        <path d="M86 210 Q78 260 70 304 M114 210 Q122 260 130 304 M100 210 V310" stroke="#a02038" strokeWidth="1.5" fill="none" />
        <g fill="#ffd8e0">
          {[
            [82, 260],
            [118, 248],
            [100, 286],
            [66, 296],
            [134, 294],
            [108, 228],
          ].map(([x, y]) => (
            <path key={`${x}-${y}`} d={`M${x} ${y - 4} L${x + 1.2} ${y - 1.2} L${x + 4} ${y} L${x + 1.2} ${y + 1.2} L${x} ${y + 4} L${x - 1.2} ${y + 1.2} L${x - 4} ${y} L${x - 1.2} ${y - 1.2} Z`} />
          ))}
        </g>
      </g>
    ),
  },
  kapielowki: {
    body: (
      <g>
        <path d="M73 204 H127 L125 236 Q110 238 100 252 Q90 238 75 236 Z" fill="#2f8fd0" stroke="#1f6aa0" strokeWidth="2" />
        <path d="M74 214 H126 M75 226 H125" stroke="#fff" strokeWidth="4" />
        <path d="M96 206 L100 212 L104 206" stroke="#fff" strokeWidth="1.5" fill="none" />
      </g>
    ),
  },
  kimono: {
    body: (
      <g>
        <path d="M72 196 H128 L142 338 H58 Z" fill="#2f4a8a" stroke="#1f3060" strokeWidth="2" />
        <path d="M100 214 L92 338" stroke="#1f3060" strokeWidth="2" />
        <rect x="70" y="194" width="60" height="20" fill="#d8323a" stroke="#a02028" strokeWidth="2" />
        <rect x="94" y="196" width="12" height="16" fill="#ffd34d" />
        <g fill="#f6b8c8">
          {[
            [80, 240],
            [118, 256],
            [98, 290],
            [72, 312],
            [128, 318],
            [110, 230],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              {[0, 72, 144, 216, 288].map((a) => (
                <circle key={a} cx={x + 4.5 * Math.cos((a * Math.PI) / 180)} cy={y + 4.5 * Math.sin((a * Math.PI) / 180)} r="3" />
              ))}
              <circle cx={x} cy={y} r="2" fill="#ffd34d" />
            </g>
          ))}
        </g>
      </g>
    ),
  },

  polbuty: {
    body: pair((x, s) => (
      <g key={x}>
        <path d={`M${x - 11} 372 Q${x - 11} 358 ${x} 357 Q${x + 11} 358 ${x + 11} 372 Q${x + 4 * s} 377 ${x} 377 Q${x - 6} 377 ${x - 11} 372 Z`} fill="#6a3f20" stroke="#4a2a14" strokeWidth="2" />
        <path d={`M${x - 5} 362 L${x + 5} 366 M${x + 5} 362 L${x - 5} 366`} stroke="#e8d0a0" strokeWidth="1.5" />
        <rect x={x - 12} y="374" width="24" height="4" rx="2" fill="#2a1a10" />
      </g>
    )),
  },
  sneakersy: {
    body: pair((x) => (
      <g key={x}>
        <path d={`M${x - 12} 372 Q${x - 12} 354 ${x} 353 Q${x + 12} 354 ${x + 12} 372 Z`} fill="#fbfbf6" stroke="#b8c0c8" strokeWidth="2" />
        <path d={`M${x - 10} 366 Q${x} 358 ${x + 10} 366`} stroke="#d8323a" strokeWidth="3" fill="none" />
        <path d={`M${x - 4} 357 h8 M${x - 5} 361 h10`} stroke="#9aa3ad" strokeWidth="1.5" />
        <rect x={x - 13} y="371" width="26" height="7" rx="3" fill="#e8eef2" stroke="#b8c0c8" strokeWidth="1.5" />
      </g>
    )),
  },
  szpilki: {
    body: pair((x, s) => (
      <g key={x}>
        <path d={`M${x + 7 * s} 364 L${x + 9 * s} 380`} stroke="#8a1a20" strokeWidth="3" strokeLinecap="round" />
        <path d={`M${x - 9} 368 Q${x - 8} 358 ${x} 358 Q${x + 8} 358 ${x + 9} 368 L${x} 382 Z`} fill="#d8323a" stroke="#8a1a20" strokeWidth="2" strokeLinejoin="round" />
        <path d={`M${x - 6} 364 Q${x} 361 ${x + 6} 364`} stroke="#f0c3a0" strokeWidth="3" fill="none" />
      </g>
    )),
  },
  trapery: {
    body: pair((x) => (
      <g key={x}>
        <path d={`M${x - 10} 326 H${x + 10} L${x + 11} 362 Q${x + 13} 368 ${x + 13} 374 H${x - 13} Q${x - 13} 366 ${x - 11} 362 Z`} fill="#7a5530" stroke="#4a3018" strokeWidth="2" />
        <rect x={x - 11} y="324" width="22" height="7" rx="2" fill="#5a3a20" />
        <path d={`M${x - 5} 336 L${x + 5} 340 M${x + 5} 336 L${x - 5} 340 M${x - 5} 346 L${x + 5} 350 M${x + 5} 346 L${x - 5} 350`} stroke="#e8d0a0" strokeWidth="1.5" />
        <rect x={x - 14} y="372" width="28" height="7" rx="2" fill="#2a1a10" />
      </g>
    )),
  },
  klapki: {
    body: pair((x) => (
      <g key={x}>
        <ellipse cx={x} cy="376" rx="12" ry="5" fill="#2fb0a0" stroke="#1f8070" strokeWidth="1.5" />
        <path d={`M${x - 8} 366 L${x} 372 L${x + 8} 366`} stroke="#ffd34d" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    )),
  },
  kozaki: {
    body: pair((x) => (
      <g key={x}>
        <path d={`M${x - 11} 286 Q${x} 282 ${x + 11} 286 L${x + 10} 362 Q${x + 13} 368 ${x + 12} 376 H${x - 12} Q${x - 13} 368 ${x - 10} 362 Z`} fill="#2a2a2e" stroke="#111" strokeWidth="2" />
        <path d={`M${x - 5} 292 Q${x - 7} 320 ${x - 5} 352`} stroke="#6a6a72" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d={`M${x + 6} 368 L${x + 7} 380`} stroke="#111" strokeWidth="3" />
      </g>
    )),
  },

  aktowka: {
    box: '108 200 76 80',
    body: (
      <g>
        <path d="M136 226 Q136 216 146 216 Q156 216 156 226" stroke="#4a2a14" strokeWidth="4" fill="none" />
        <rect x="124" y="226" width="44" height="34" rx="4" fill="#7a4a2a" stroke="#4a2a14" strokeWidth="2" />
        <path d="M124 238 H168" stroke="#4a2a14" strokeWidth="2" />
        <rect x="142" y="234" width="8" height="8" rx="1" fill="#e0b25a" />
      </g>
    ),
  },
  torebka: {
    box: '22 200 64 76',
    body: (
      <g>
        <path d="M44 236 Q52 212 60 236" stroke="#8a1a4a" strokeWidth="3.5" fill="none" />
        <path d="M38 236 H70 L66 266 H42 Z" fill="#c0306a" stroke="#8a1a4a" strokeWidth="2" strokeLinejoin="round" />
        <path d="M40 246 H68" stroke="#8a1a4a" strokeWidth="1.5" />
        <circle cx="54" cy="246" r="3" fill="#f2c230" />
      </g>
    ),
  },
  okulary: {
    box: '72 36 56 40',
    body: (
      <g>
        <rect x="83" y="51" width="16" height="12" rx="5" fill="#1f1f24" />
        <rect x="101" y="51" width="16" height="12" rx="5" fill="#1f1f24" />
        <path d="M98 55 H102 M83 54 L78 52 M117 54 L122 52" stroke="#1f1f24" strokeWidth="2.5" />
        <path d="M86 54 l4 -2 M104 54 l4 -2" stroke="#fff" strokeWidth="1.5" opacity="0.7" />
      </g>
    ),
  },
  szalik: {
    box: '62 78 80 104',
    body: (
      <g>
        <path d="M84 92 Q100 104 116 92 L120 104 Q100 118 80 104 Z" fill="#d8323a" stroke="#a02028" strokeWidth="2" />
        <path d="M108 104 L114 168 H100 L98 108 Z" fill="#d8323a" stroke="#a02028" strokeWidth="2" />
        <g stroke="#fbf6e8" strokeWidth="3">
          <path d="M86 98 L84 106 M96 102 L95 110 M106 102 L107 110 M116 98 L118 104" />
          <path d="M100 126 H112 M100 144 H113" />
        </g>
        <path d="M101 168 v6 M105 168 v6 M109 168 v6 M113 168 v6" stroke="#a02028" strokeWidth="1.5" />
      </g>
    ),
  },
  parasol: {
    box: '118 196 52 186',
    body: (
      <g>
        <path d="M144 222 Q144 210 136 210 Q130 210 130 216" stroke="#5a3a20" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M144 222 V372" stroke="#3a3a40" strokeWidth="2.5" />
        <path d="M144 246 Q154 300 147 352 H141 Q134 300 144 246 Z" fill="#2a2a3a" stroke="#14141c" strokeWidth="1.5" />
        <path d="M144 260 Q148 300 144 350" stroke="#4a4a5a" strokeWidth="1.5" fill="none" />
        <rect x="140" y="292" width="8" height="5" fill="#b0202a" />
      </g>
    ),
  },
  pierscionek: {
    box: '40 222 36 36',
    body: (
      <g>
        <rect x="55" y="234" width="6" height="18" rx="3" fill="#e8b48e" />
        <rect x="54" y="244" width="8" height="3.5" rx="1.5" fill="#e0b25a" stroke="#a8781f" strokeWidth="0.8" />
        <path d="M58 240 L61.5 244.5 L58 248 L54.5 244.5 Z" fill="#cfefff" stroke="#7fb0d0" strokeWidth="1" />
        <path d="M65 240 l4 -2 M51 240 l-4 -2 M65 249 l4 2 M51 249 l-4 2" stroke="#ffd34d" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    ),
  },
  plecak: {
    box: '56 92 88 128',
    back: (
      <g>
        <rect x="62" y="108" width="76" height="104" rx="16" fill="#3a8a5a" stroke="#256a40" strokeWidth="2" />
      </g>
    ),
    body: (
      <g>
        <path d="M82 104 Q76 150 80 206 M118 104 Q124 150 120 206" stroke="#1f4a30" strokeWidth="6" fill="none" strokeLinecap="round" />
        <rect x="76" y="150" width="9" height="6" rx="1" fill="#9aa3ad" />
        <rect x="115" y="150" width="9" height="6" rx="1" fill="#9aa3ad" />
      </g>
    ),
  },
}

export function ItemBack({ id }: { id: string }) {
  return ART[id]?.back ?? null
}

export function ItemLayer({ id }: { id: string }) {
  return <g data-art={id}>{ART[id].body}</g>
}

export function ItemThumb({ id, slot }: { id: string; slot: Slot }) {
  const art = ART[id]
  return (
    <svg viewBox={art.box ?? SLOT_BOX[slot]} className="st-thumb" aria-hidden>
      {art.back}
      {art.body}
    </svg>
  )
}
