import type { InstructorMood } from './logic'

const SKIN = '#f2c8a4'
const VEST = '#d8f030'

function Face({ mood }: { mood: InstructorMood }) {
  if (mood === 'facepalm')
    return (
      <>
        <path d="M80 92 q6 4 12 0 M108 92 q6 4 12 0" stroke="#2a2a30" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M88 124 q12 -6 24 0" stroke="#7a3a2a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </>
    )
  return (
    <>
      <circle cx="86" cy="92" r="4" fill="#2a2a30" />
      <circle cx="114" cy="92" r="4" fill="#2a2a30" />
      <path d={mood === 'approving' ? 'M74 78 q10 -8 20 -2 M106 76 q10 -6 20 2' : 'M76 80 q10 -4 20 0 M104 80 q10 -4 20 0'} stroke="#6a6a70" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d={mood === 'approving' ? 'M86 120 q14 14 28 0' : 'M88 122 q12 6 24 0'} stroke="#7a3a2a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </>
  )
}

function Arm({ mood }: { mood: InstructorMood }) {
  if (mood === 'facepalm')
    return (
      <g>
        <path d="M150 200 Q150 150 124 100" stroke={VEST} strokeWidth="26" strokeLinecap="round" fill="none" />
        <ellipse cx="112" cy="86" rx="22" ry="16" fill={SKIN} transform="rotate(-20 112 86)" />
      </g>
    )
  if (mood === 'approving')
    return (
      <g>
        <path d="M156 210 Q172 170 164 134" stroke={VEST} strokeWidth="26" strokeLinecap="round" fill="none" />
        <rect x="150" y="104" width="28" height="30" rx="10" fill={SKIN} />
        <rect x="156" y="84" width="11" height="26" rx="5" fill={SKIN} />
      </g>
    )
  return (
    <g>
      <path d="M152 200 Q150 186 132 184" stroke={VEST} strokeWidth="26" strokeLinecap="round" fill="none" />
      <path d="M118 190 l30 -34" stroke="#2a4a9a" strokeWidth="5" strokeLinecap="round" />
    </g>
  )
}

export function Instructor({ mood, line }: { mood: InstructorMood; line?: string }) {
  return (
    <div className="cz-instructor" data-testid="instructor" data-mood={mood}>
      <svg viewBox="0 0 200 240" className="cz-instructor-art" aria-hidden="true">
        <path d="M30 240 Q30 170 100 160 Q170 170 170 240 Z" fill="#3a5a8a" />
        <path d="M34 240 Q36 180 80 166 L100 210 L120 166 Q164 180 166 240 Z" fill={VEST} />
        <path d="M44 214 H86 M114 214 H156" stroke="#e8e8f0" strokeWidth="8" />
        <rect x="88" y="140" width="24" height="26" fill={SKIN} />
        <ellipse cx="100" cy="98" rx="40" ry="46" fill={SKIN} />
        <path d="M60 86 Q62 46 100 46 Q140 46 140 86 Q130 66 100 64 Q72 64 60 86 Z" fill="#9a9aa0" />
        <ellipse cx="60" cy="100" rx="7" ry="11" fill={SKIN} />
        <ellipse cx="140" cy="100" rx="7" ry="11" fill={SKIN} />
        <g stroke="#2a2a30" strokeWidth="3" fill="none">
          <rect x="72" y="82" width="26" height="20" rx="7" />
          <rect x="102" y="82" width="26" height="20" rx="7" />
          <path d="M98 90 h4" />
        </g>
        <path d="M100 100 q-4 8 0 10" stroke="#c8987a" strokeWidth="3" fill="none" />
        <path d="M80 114 Q100 104 120 114 Q114 120 100 116 Q86 120 80 114 Z" fill="#7a7a80" />
        <Face mood={mood} />
        <g transform="translate(40 172) rotate(-8)">
          <rect width="62" height="62" rx="4" fill="#f4f0e0" stroke="#3a3a44" strokeWidth="3" />
          <path d="M10 18 H52 M10 30 H52 M10 42 H40" stroke="#8a9ab8" strokeWidth="3" />
          <path d="M0 -2 H62" stroke="#3a3a44" strokeWidth="6" strokeDasharray="4 4" />
        </g>
        <Arm mood={mood} />
      </svg>
      {line && (
        <p className="cz-instructor-line" data-testid="instructor-line">
          {line}
        </p>
      )}
      <span className="cz-caption">pan Henryk · instruktor jazdy</span>
    </div>
  )
}
