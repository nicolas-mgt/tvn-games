import { useEffect, useState } from "react";
import { lookFor, type KidMood, type Look } from "./logic";
import { play } from "./sfx";

const INK = "#2a1a14";

function Hair({ look }: { look: Look }) {
  const color = look.hairColor;
  switch (look.hair) {
    case "pigtails":
      return (
        <>
          <circle cx="66" cy="84" r="13" fill={color} />
          <circle cx="134" cy="84" r="13" fill={color} />
          <path
            d="M72 84 q0 -32 28 -32 q28 0 28 32 q-10 -18 -28 -18 q-18 0 -28 18 Z"
            fill={color}
          />
        </>
      );
    case "curly":
      return (
        <>
          {[76, 88, 100, 112, 124].map((x, i) => (
            <circle key={x} cx={x} cy={i % 2 ? 58 : 64} r="12" fill={color} />
          ))}
          <circle cx="73" cy="76" r="9" fill={color} />
          <circle cx="127" cy="76" r="9" fill={color} />
        </>
      );
    case "bob":
      return (
        <path
          d="M70 100 q-4 -48 30 -48 q34 0 30 48 h-8 q0 -24 -22 -30 q-22 6 -22 30 Z"
          fill={color}
        />
      );
    case "spiky":
      return (
        <path
          d="M72 80 l2 -20 l8 8 l6 -16 l7 12 l7 -14 l6 14 l8 -10 l2 14 l9 -6 l-3 20 q-24 -12 -52 -2 Z"
          fill={color}
        />
      );
    default:
      return (
        <path
          d="M72 82 q0 -30 28 -30 q28 0 28 30 q-6 -14 -28 -14 q-20 0 -28 14 Z"
          fill={color}
        />
      );
  }
}

function Face({ mood, glasses }: { mood: KidMood; glasses: boolean }) {
  const eyes =
    mood === "giggle" || mood === "proud" ? (
      <path
        d="M84 86 q5 -6 10 0 M106 86 q5 -6 10 0"
        stroke={INK}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    ) : (
      <>
        <circle cx="89" cy="86" r="3.5" fill={INK} />
        <circle cx="111" cy="86" r="3.5" fill={INK} />
      </>
    );
  const mouth = {
    talking: <ellipse cx="100" cy="101" rx="6" ry="5" fill="#8a2a3a" />,
    giggle: (
      <path
        d="M88 97 q12 14 24 0 Z"
        fill="#8a2a3a"
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    ),
    proud: (
      <path
        d="M88 98 q12 12 24 0"
        stroke={INK}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    ),
    shrug: (
      <path
        d="M92 101 q8 -4 16 0"
        stroke={INK}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    ),
  }[mood];
  return (
    <>
      {eyes}
      {mouth}
      <circle cx="80" cy="96" r="5" fill="#f08a8a" opacity="0.5" />
      <circle cx="120" cy="96" r="5" fill="#f08a8a" opacity="0.5" />
      {mood === "shrug" && (
        <path
          d="M82 78 l10 -4 M118 78 l-10 -4"
          stroke={INK}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}
      {glasses && (
        <g stroke={INK} strokeWidth="2" fill="none">
          <circle cx="89" cy="86" r="8" />
          <circle cx="111" cy="86" r="8" />
          <path d="M97 86 h6" />
        </g>
      )}
    </>
  );
}

const ARMS: Record<KidMood, string> = {
  talking: "M80 124 q-14 14 -8 30 M120 124 q16 -6 22 -24",
  giggle: "M80 124 q-10 16 -4 30 M120 124 q4 -14 -12 -24",
  proud: "M80 124 q-14 -14 -18 -34 M120 124 q14 -14 18 -34",
  shrug: "M80 124 q-18 -2 -24 -18 M120 124 q18 -2 24 -18",
};

function KidArt({ look, mood }: { look: Look; mood: KidMood }) {
  return (
    <>
      <rect x="18" y="18" width="164" height="170" rx="34" fill="#e8704a" />
      {[60, 100, 140].flatMap((x) =>
        [60, 100].map((y) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#c8583a" />
        )),
      )}
      <rect x="38" y="150" width="124" height="44" rx="14" fill="#f08a5a" />
      <rect x="0" y="104" width="50" height="100" rx="22" fill="#d8603a" />
      <rect x="150" y="104" width="50" height="100" rx="22" fill="#d8603a" />
      <path
        d="M30 204 v12 M170 204 v12"
        stroke="#6a4a2a"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M90 158 v30 M110 158 v30"
        stroke="#3a4a6a"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <ellipse cx="88" cy="192" rx="9" ry="6" fill="#e8504a" />
      <ellipse cx="112" cy="192" rx="9" ry="6" fill="#e8504a" />
      <path d="M76 162 q0 -46 24 -46 q24 0 24 46 Z" fill={look.shirt} />
      <path
        d={ARMS[mood]}
        stroke={look.shirt}
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="100" cy="88" rx="27" ry="29" fill={look.skin} />
      <Hair look={look} />
      <Face mood={mood} glasses={look.glasses} />
    </>
  );
}

export function Kid({ name, mood }: { name: string; mood: KidMood }) {
  return (
    <figure className="tp-person tp-kid" data-testid="kid" data-mood={mood}>
      <svg
        viewBox="0 0 200 220"
        className="tp-person-art"
        role="img"
        aria-label={name}
      >
        <KidArt look={lookFor(name)} mood={mood} />
      </svg>
      <figcaption className="tp-hand tp-caption">{name}</figcaption>
    </figure>
  );
}

/** Speech bubble that types the definition word by word; mount with a new `key` per definition. */
export function DefinitionBubble({
  text,
  pace,
}: {
  text: string;
  pace: number;
}) {
  const words = text.split(" ");
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    let count = 0;
    const timer = setInterval(() => {
      count += 1;
      setTyped(count);
      play("word");
      if (count >= words.length) clearInterval(timer);
    }, 170 * pace);
    return () => clearInterval(timer);
  }, [words.length, pace]);

  return (
    <blockquote
      className="tp-bubble tp-hand"
      data-testid="definition"
      data-done={typed >= words.length}
    >
      „{words.slice(0, typed).join(" ")}
      {typed >= words.length ? "”" : <span className="tp-caret">…</span>}
    </blockquote>
  );
}
