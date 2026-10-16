import "@fontsource/bebas-neue";
import "@fontsource/caveat/700.css";
import confetti from "canvas-confetti";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { useRef, useState, type FormEvent } from "react";
import { matchesAnswer } from "@/shared/answer";
import { todayKey } from "@/shared/daily";
import { MuteButton, ResultScreen } from "@/shared/GameShell";
import { loadJSON, saveJSON } from "@/shared/storage";
import { Drawing, GuessForm, Outcome, Tiles } from "./Board";
import { Host } from "./Host";
import { DefinitionBubble, Kid } from "./Kid";
import {
  ATTEMPTS,
  DAILY_KEY,
  entriesFor,
  hintFor,
  hostLine,
  hostMood,
  kidMood,
  MAX_SCORE,
  pointsFor,
  SLUG,
  WORDS_PER_GAME,
  type Mode,
  type Phase,
} from "./logic";
import { play, sfx } from "./sfx";
import { Backdrop, type BackdropMood } from "./Studio";

type Result = { attemptsUsed: number; solved: boolean };

const CRAYONS = [
  "#e8504a",
  "#f2b830",
  "#3a8ad0",
  "#5ab060",
  "#9a5ad0",
  "#f07ab0",
];

function dailyLabel() {
  const [, month, day] = todayKey().split("-");
  return `Hasła dnia ${day}.${month}`;
}

export default function ToPanTegoNieWieGame() {
  const dailyDone = loadJSON<string | null>(DAILY_KEY, null) === todayKey();
  const [phase, setPhase] = useState<Phase>("lobby");
  const [mode, setMode] = useState<Mode>(dailyDone ? "practice" : "daily");
  const [entries, setEntries] = useState(() =>
    entriesFor(dailyDone ? "practice" : "daily"),
  );
  const [index, setIndex] = useState(0);
  const [wrongs, setWrongs] = useState(0);
  const [guess, setGuess] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [wrongFlash, setWrongFlash] = useState(false);
  const flashTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const reducedMotion = useReducedMotion();
  const pace = reducedMotion ? 0.15 : 1;

  const entry = entries[index];
  const last = index === WORDS_PER_GAME - 1;
  const score = results.reduce(
    (sum, r) => sum + pointsFor(r.attemptsUsed, r.solved),
    0,
  );
  const done = phase === "correct" || phase === "reveal";
  const letters = done ? [...entry.word] : hintFor(entry.word, wrongs);

  function popTiles(count: number) {
    for (let i = 0; i < count; i++)
      setTimeout(() => play("pop"), i * 70 * pace);
  }

  function enter() {
    sfx.unlock();
    setPhase("definition");
    play("xylo");
  }

  function finishWord(attemptsUsed: number, solved: boolean) {
    setResults([...results, { attemptsUsed, solved }]);
    setPhase(solved ? "correct" : "reveal");
    setWrongFlash(false);
    clearTimeout(flashTimer.current);
    if (last && mode === "daily") saveJSON(DAILY_KEY, todayKey());
    popTiles(Math.min(entry.word.length, 10));
    if (solved) {
      play("good");
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.55 },
        colors: CRAYONS,
        disableForReducedMotion: true,
      });
    } else {
      play("bad");
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (phase !== "definition" || !guess.trim()) return;
    const attemptsUsed = wrongs + 1;
    setGuess("");
    if (matchesAnswer(guess, [entry.word, ...entry.aliases])) {
      finishWord(attemptsUsed, true);
      return;
    }
    setWrongs(attemptsUsed);
    if (attemptsUsed === ATTEMPTS) {
      finishWord(attemptsUsed, false);
      return;
    }
    play("giggle");
    popTiles(attemptsUsed === 1 ? Math.min(entry.word.length, 10) : 1);
    setWrongFlash(true);
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setWrongFlash(false), 1200 * pace);
  }

  function next() {
    if (last) {
      setPhase("result");
      play("click");
      return;
    }
    setIndex(index + 1);
    setWrongs(0);
    setPhase("definition");
    play("xylo");
  }

  function restart() {
    setMode("practice");
    setEntries(entriesFor("practice"));
    setIndex(0);
    setWrongs(0);
    setGuess("");
    setResults([]);
    setPhase("definition");
    play("xylo");
  }

  function backdropMood(): BackdropMood {
    if (phase === "lobby") return "idle";
    if (phase === "definition") return wrongFlash ? "wrong" : "definition";
    return phase;
  }

  function currentHostLine() {
    if (phase === "definition")
      return wrongs
        ? hostLine("wrong", index + wrongs)
        : hostLine("definition", index);
    return hostLine(phase === "correct" ? "correct" : "reveal", index);
  }

  return (
    <MotionConfig reducedMotion="user">
      <Backdrop mood={backdropMood()} />
      <MuteButton sfx={sfx} />

      <div className="tp-game">
        {phase === "lobby" && (
          <motion.div
            className="tp-lobby"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="tp-lobby-cast">
              <Kid name={entry.kid} mood="talking" />
              <Host
                mood="smile"
                line="Dzień dobry! Dziś mali eksperci tłumaczą dorosłe sprawy."
              />
            </div>
            <p className="tp-hand text-3xl text-[#e8504a]">
              Poranna kanapa · na żywo
            </p>
            <h2 className="font-display text-6xl tracking-wider text-[#2a3a5a] sm:text-7xl">
              To Pan tego nie wie
            </h2>
            <p>
              Do studia przychodzą dzieci i po swojemu tłumaczą dorosłe sprawy.
              Zgadnij, o jakie słowo chodzi. Masz {ATTEMPTS} próby na hasło: za
              trafienie od razu 3 punkty, potem 2 i 1. Po pierwszym pudle pokażą
              się kratki liter, po drugim pierwsza litera. {WORDS_PER_GAME}{" "}
              haseł, najwyżej {MAX_SCORE} punktów.
            </p>
            {dailyDone && (
              <p
                className="tp-hand text-2xl text-[#3a8ad0]"
                data-testid="practice-note"
              >
                Dzisiejsze hasła już za tobą – teraz trening na losowych
                hasłach.
              </p>
            )}
            <button
              type="button"
              className="tp-start tp-sign"
              onClick={enter}
              data-testid="start"
            >
              Wchodzimy na antenę
            </button>
          </motion.div>
        )}

        {phase !== "lobby" && phase !== "result" && (
          <>
            <header className="tp-bar">
              <strong className="tp-bar-title tp-sign" data-testid="mode">
                {mode === "daily" ? dailyLabel() : "Trening"}
              </strong>
              <span className="tp-stat" data-testid="progress">
                Hasło{" "}
                <b>
                  {index + 1}/{WORDS_PER_GAME}
                </b>
              </span>
              <span className="tp-stat" data-testid="score" data-value={score}>
                Punkty <b>{score}</b>
              </span>
            </header>
            <div className="tp-stage">
              <Kid name={entry.kid} mood={kidMood(phase, wrongFlash)} />
              <DefinitionBubble
                key={`${index}-${entry.word}`}
                text={entry.definition}
                pace={pace}
              />
              <Host
                mood={hostMood(phase, wrongFlash)}
                line={currentHostLine()}
              />
            </div>
            {letters && (
              <Tiles word={entry.word} letters={letters} pace={pace} />
            )}
            {phase === "definition" && (
              <GuessForm
                attempt={wrongs + 1}
                guess={guess}
                onChange={setGuess}
                onSubmit={submit}
              />
            )}
            {done && (
              <Outcome
                entry={entry}
                solved={results[index].solved}
                points={pointsFor(
                  results[index].attemptsUsed,
                  results[index].solved,
                )}
                last={last}
                pace={pace}
                onNext={next}
              />
            )}
          </>
        )}

        {phase === "result" && (
          <ResultScreen
            slug={SLUG}
            score={score}
            maxScore={MAX_SCORE}
            shareLine={results
              .map((r) =>
                r.solved ? ["", "🥇", "🥈", "🥉"][r.attemptsUsed] : "❌",
              )
              .join("")}
            summary={<p>Hasła: {entries.map((e) => e.word).join(", ")}</p>}
            onRestart={restart}
          >
            <div className="tp-gallery">
              {entries.map((e, i) => (
                <motion.div
                  key={e.word}
                  initial={{ opacity: 0, y: 20, rotate: 0 }}
                  animate={{ opacity: 1, y: 0, rotate: i % 2 ? 2 : -2 }}
                  transition={{ delay: (0.2 + i * 0.1) * pace }}
                >
                  <Drawing
                    entry={e}
                    solved={results[i].solved}
                    testId="result-drawing"
                  />
                </motion.div>
              ))}
            </div>
          </ResultScreen>
        )}

        <p className="tp-footer text-center text-[11px]">
          Dzieci, prowadząca i studio są fikcyjni · Dźwięki: Kenney (CC0)
        </p>
      </div>
    </MotionConfig>
  );
}
