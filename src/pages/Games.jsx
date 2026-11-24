import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Waves,
  Wind,
} from "lucide-react";
import Card from "../components/Card";

const breathingPhases = [
  {
    key: "inhale",
    label: "Breathe in",
    hint: "Let the balloon fill up slowly.",
    duration: 4000,
  },
  {
    key: "hold",
    label: "Hold gently",
    hint: "No need to strain or force it.",
    duration: 4000,
  },
  {
    key: "exhale",
    label: "Breathe out",
    hint: "Let the air leave slowly.",
    duration: 6000,
  },
];

const breathingRoundMs = breathingPhases.reduce(
  (total, phase) => total + phase.duration,
  0,
);
const breathingRounds = 5;
const breathingTotalMs = breathingRoundMs * breathingRounds;

const games = [
  {
    id: "breathing",
    title: "Breathing Balloon",
    description:
      "Follow the balloon with your breath and let the pace slow you down.",
    meta: "~1 min · 5 rounds",
    icon: Wind,
    accent: "from-mint to-lavender text-navy",
    softAccent: "bg-mint-soft text-mint-deep",
    instructions: [
      {
        number: "1",
        title: "Get comfortable",
        text: "Sit or stand however feels easy. Let your shoulders relax if you can.",
      },
      {
        number: "2",
        title: "Watch the balloon",
        text: "It grows when you breathe in and shrinks when you breathe out.",
      },
      {
        number: "3",
        title: "Follow 5 rounds",
        text: "You can pause or stop at any time — nothing is being scored.",
      },
    ],
    tip: "There is no perfect breath. If anything feels uncomfortable, stop and breathe normally — that counts too.",
  },
  {
    id: "ripple",
    title: "Ripple Garden",
    description:
      "Tap the water to make soft ripples spread out and fade. No goal — just a small, satisfying pause.",
    meta: "No timer · tap freely",
    icon: Waves,
    accent: "from-lavender to-mint text-navy",
    softAccent: "bg-lavender-soft text-lavender-deep",
    instructions: [
      {
        number: "1",
        title: "Tap the water",
        text: "Tap anywhere, or drag your finger slowly to leave a trail.",
      },
      {
        number: "2",
        title: "Watch it spread",
        text: "Each tap makes a ripple and a tiny bloom that gently fades away.",
      },
      {
        number: "3",
        title: "Stay as long as you like",
        text: "There's no timer and nothing to finish. Leave whenever you want.",
      },
    ],
    tip: "No right way to tap. Slower taps feel calmer — and you can stop at any moment.",
  },
  {
    id: "tower",
    title: "Block Tower",
    description:
      "A brick slides above the stack. Click or tap to drop it and keep the tower balanced.",
    meta: "No timer · score points",
    icon: Layers,
    accent: "from-sun to-peach text-navy",
    softAccent: "bg-sun-soft text-sun-deep",
    instructions: [
      {
        number: "1",
        title: "Watch the brick",
        text: "It moves slowly from side to side above the tower.",
      },
      {
        number: "2",
        title: "Click or tap to drop",
        text: "The part that lands on the brick below becomes your next brick.",
      },
      {
        number: "3",
        title: "Keep it balanced",
        text: "Closer drops score more: 50, 30, 20 or 10. The game ends only when a block has nowhere to land.",
      },
    ],
    tip: "No timer — points are just gentle feedback. Take your time and drop when it feels right.",
  },
];

function getPhase(elapsed) {
  let pointer = elapsed % breathingRoundMs;

  for (const phase of breathingPhases) {
    if (pointer < phase.duration) {
      return { ...phase, elapsedInPhase: pointer };
    }
    pointer -= phase.duration;
  }

  const lastPhase = breathingPhases[breathingPhases.length - 1];
  return { ...lastPhase, elapsedInPhase: lastPhase.duration };
}

function getBalloonScale(phase) {
  if (phase.key === "inhale") {
    return 0.7 + 0.3 * (phase.elapsedInPhase / phase.duration);
  }
  if (phase.key === "hold") {
    return 1;
  }
  return 1 - 0.3 * (phase.elapsedInPhase / phase.duration);
}

function GameList({ onSelect }) {
  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Games
        </h1>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted/75">
          Small activities for a calmer moment. Pick one, read the quick guide,
          then start when you're ready.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <Card key={game.id} className="flex h-full flex-col p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${game.accent} shadow-lg shadow-navy/5`}
                >
                  <Icon size={22} strokeWidth={2} />
                </span>
                <span className="rounded-full bg-mint-soft px-2.5 py-1 text-[10px] font-semibold text-mint-deep">
                  Ready
                </span>
              </div>
              <h2 className="mt-5 font-display text-xl font-semibold text-ink">
                {game.title}
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-muted/75">
                {game.description}
              </p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
                <span className="text-[11px] font-medium text-muted/60">
                  {game.meta}
                </span>
                <button
                  onClick={() => onSelect(game.id)}
                  className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-navy-2"
                >
                  Play now
                  <ArrowRight size={14} />
                </button>
              </div>
            </Card>
          );
        })}

        <Card className="border-dashed border-lavender/40 bg-gradient-to-br from-lavender-soft/60 to-cream">
          <div className="flex h-full flex-col justify-between gap-5 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lavender/20 text-lavender-deep">
                <Heart size={20} />
              </span>
              <div>
                <h2 className="font-display text-lg font-semibold text-ink">
                  More calm games soon
                </h2>
                <p className="mt-1 text-[13px] leading-relaxed text-muted/70">
                  We'll add them here one at a time.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-medium text-muted/50">
              Coming later
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}

function GameHero({ game, onBack }) {
  const Icon = game.icon;

  return (
    <Card className="overflow-hidden">
      <div className="relative border-b border-line/70 bg-gradient-to-br from-mint-soft via-white to-lavender-soft p-6 sm:p-8">
        <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-mint/15 blur-2xl" />
        <button
          onClick={onBack}
          className="relative mb-5 flex items-center gap-2 text-[12px] font-semibold text-muted/70 transition-colors hover:text-ink"
        >
          <ArrowLeft size={14} />
          All games
        </button>
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${game.accent} shadow-lg shadow-navy/5`}
            >
              <Icon size={26} strokeWidth={2} />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-mint-deep">
                Game details
              </p>
              <h1 className="mt-0.5 font-display text-xl font-semibold text-ink sm:text-2xl">
                {game.title}
              </h1>
              <p className="mt-1 max-w-lg text-[13px] leading-relaxed text-muted/75">
                {game.description}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-muted/70 shadow-sm">
            {game.meta}
          </span>
        </div>
      </div>
    </Card>
  );
}

function InstructionCard({ game, onStart }) {
  return (
    <Card className="p-5 sm:p-8">
      <div className="flex items-center gap-2 text-[12px] font-semibold text-lavender-deep">
        <Sparkles size={15} />
        How to play
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {game.instructions.map((step) => (
          <div
            key={step.number}
            className="rounded-2xl border border-line/70 bg-white p-4"
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold ${game.softAccent}`}
            >
              {step.number}
            </span>
            <h3 className="mt-3 text-[13px] font-bold text-ink">{step.title}</h3>
            <p className="mt-1 text-[12px] leading-relaxed text-muted/70">
              {step.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-cream p-4">
        <p className="max-w-md text-[12px] leading-relaxed text-muted/75">
          {game.tip}
        </p>
        <button
          onClick={onStart}
          className="flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-navy-2"
        >
          <Play size={15} />
          Start game
          <ArrowRight size={15} />
        </button>
      </div>
    </Card>
  );
}

function ResultCard({ title, message, againLabel, onAgain, onBack }) {
  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-col items-center py-6 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-mint-soft text-mint-deep">
          <Check size={34} strokeWidth={2.2} />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold text-ink">
          {title}
        </h2>
        <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted/75">
          {message}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={onAgain}
            className="flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-navy-2"
          >
            <RotateCcw size={15} />
            {againLabel}
          </button>
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-3 text-[13px] font-semibold text-ink transition-colors hover:bg-cream"
          >
            <ArrowLeft size={15} />
            Back to games
          </button>
        </div>
      </div>
    </Card>
  );
}

function BreathingSession({
  paused,
  phase,
  secondsLeft,
  round,
  sessionSeconds,
  progress,
  scale,
  onPause,
  onResume,
  onStop,
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center lg:gap-8">
      <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-mint-soft/70 via-white to-lavender-soft/70 p-6">
        <div className="absolute h-64 w-64 rounded-full bg-mint/20 blur-3xl" />
        <div className="absolute bottom-0 right-4 h-44 w-44 rounded-full bg-blossom/15 blur-3xl" />

        <div className="relative flex flex-col items-center">
          <div className="relative flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
            <div className="absolute inset-0 rounded-full border border-mint-deep/15" />
            <div className="absolute inset-6 rounded-full border border-lavender/25" />
            <div
              className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-mint via-lavender to-blossom shadow-[0_18px_60px_rgba(124,92,208,0.28)] transition-transform duration-100 ease-linear motion-reduce:transition-none"
              style={{ transform: `scale(${scale})` }}
            >
              <div className="text-center">
                <p
                  aria-live="polite"
                  className="font-display text-xl text-navy sm:text-2xl"
                >
                  {phase.label}
                </p>
                <p
                  aria-hidden="true"
                  className="mt-1 text-[12px] font-medium text-navy/60"
                >
                  {secondsLeft}s
                </p>
              </div>
            </div>
          </div>
          <p className="mt-5 text-center text-[12px] text-muted/70">
            {phase.hint}
          </p>
        </div>

        {paused && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <span className="rounded-full bg-navy px-4 py-2 text-[12px] font-semibold text-white">
              Paused
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-line/70 bg-white p-4">
          <div className="flex items-center justify-between text-[12px] font-semibold text-ink">
            <span>
              Round {round} of {breathingRounds}
            </span>
            <span>{sessionSeconds}s left</span>
          </div>
          <div
            role="progressbar"
            aria-label="Breathing session progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="mt-3 h-2 overflow-hidden rounded-full bg-line"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-mint-deep to-lavender-deep transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 flex gap-2">
            {paused ? (
              <button
                onClick={onResume}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-navy-2"
              >
                <Play size={14} />
                Resume
              </button>
            ) : (
              <button
                onClick={onPause}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-navy-2"
              >
                <Pause size={14} />
                Pause
              </button>
            )}
            <button
              onClick={onStop}
              className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-[12px] font-semibold text-ink transition-colors hover:bg-cream"
            >
              <RotateCcw size={14} />
              Stop
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-lavender-soft p-4">
          <p className="text-[12px] font-bold text-lavender-deep">
            Keep it gentle
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-ink/70">
            The slow out-breath is the calming part. No need to breathe deeply.
          </p>
        </div>
      </div>
    </div>
  );
}

function BreathingGame({ onBack }) {
  const [status, setStatus] = useState("playing");
  const [remaining, setRemaining] = useState(breathingTotalMs);

  useEffect(() => {
    if (status !== "playing") return undefined;

    let lastTick = Date.now();
    const timer = window.setInterval(() => {
      const now = Date.now();
      const delta = now - lastTick;
      lastTick = now;
      setRemaining((current) => Math.max(0, current - delta));
    }, 100);

    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (status === "playing" && remaining === 0) {
      setStatus("done");
    }
  }, [remaining, status]);

  const elapsed = breathingTotalMs - remaining;
  const phase = getPhase(elapsed);
  const round = Math.min(
    breathingRounds,
    Math.floor(elapsed / breathingRoundMs) + 1,
  );
  const secondsLeft = Math.max(
    1,
    Math.ceil((phase.duration - phase.elapsedInPhase) / 1000),
  );
  const sessionSeconds = Math.ceil(remaining / 1000);
  const progress = Math.round((elapsed / breathingTotalMs) * 100);
  const scale = getBalloonScale(phase);

  const startAgain = () => {
    setRemaining(breathingTotalMs);
    setStatus("playing");
  };

  return (
    <Card className="p-5 sm:p-8">
      {status === "done" ? (
        <ResultCard
          title="Nicely done"
          message="You gave yourself a quiet minute. Notice how you feel now — no need to force it."
          againLabel="Breathe again"
          onAgain={startAgain}
          onBack={onBack}
        />
      ) : (
        <BreathingSession
          paused={status === "paused"}
          phase={phase}
          secondsLeft={secondsLeft}
          round={round}
          sessionSeconds={sessionSeconds}
          progress={progress}
          scale={scale}
          onPause={() => setStatus("paused")}
          onResume={() => setStatus("playing")}
          onStop={onBack}
        />
      )}
    </Card>
  );
}

function RippleGame({ onBack }) {
  const [ripples, setRipples] = useState([]);
  const nextId = useRef(0);
  const lastRippleAt = useRef(0);
  const timers = useRef([]);

  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  const pushRipple = (x, y) => {
    const id = nextId.current;
    nextId.current += 1;

    setRipples((current) => [
      ...current.slice(-16),
      { id, x, y, size: 72 + Math.random() * 48 },
    ]);

    const timer = window.setTimeout(() => {
      setRipples((current) => current.filter((ripple) => ripple.id !== id));
    }, 2500);
    timers.current.push(timer);
  };

  const addRippleFromPointer = (event, force = false) => {
    const now = Date.now();
    if (!force && now - lastRippleAt.current < 90) return;
    lastRippleAt.current = now;

    const rect = event.currentTarget.getBoundingClientRect();
    pushRipple(event.clientX - rect.left, event.clientY - rect.top);
  };

  const handlePointerMove = (event) => {
    if (event.pointerType === "mouse" && event.buttons === 0) return;
    addRippleFromPointer(event);
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();

    const rect = event.currentTarget.getBoundingClientRect();
    pushRipple(rect.width / 2, rect.height / 2);
  };

  return (
    <Card className="p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-mint-deep">
            No timer
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl">
            Ripple Garden
          </h2>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[12px] font-semibold text-muted/70 transition-colors hover:text-ink"
        >
          <ArrowLeft size={14} />
          Back to games
        </button>
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label="Tap or drag to make ripples"
        onPointerDown={(event) => addRippleFromPointer(event, true)}
        onPointerMove={handlePointerMove}
        onKeyDown={handleKeyDown}
        className="relative mt-5 h-[420px] cursor-crosshair select-none overflow-hidden rounded-2xl border border-mint/30 bg-gradient-to-b from-mint-soft via-white to-lavender-soft shadow-inner focus:outline-none focus:ring-2 focus:ring-mint-deep/40"
        style={{ touchAction: "none" }}
      >
        <div className="absolute -top-16 left-1/4 h-56 w-56 rounded-full bg-mint/20 blur-3xl" />
        <div className="absolute -right-12 -bottom-12 h-56 w-56 rounded-full bg-lavender/20 blur-3xl" />
        <div className="absolute inset-8 rounded-full border border-mint-deep/10" />
        <div className="absolute inset-20 rounded-full border border-lavender/15" />

        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="pointer-events-none absolute"
            style={{ left: ripple.x, top: ripple.y }}
          >
            <span
              className="absolute block rounded-full border border-mint-deep/45"
              style={{
                width: ripple.size,
                height: ripple.size,
                marginLeft: -ripple.size / 2,
                marginTop: -ripple.size / 2,
                animation: "gardenRipple 2400ms ease-out",
                animationFillMode: "forwards",
              }}
            />
            <span
              className="absolute block rounded-full border border-lavender-deep/30"
              style={{
                width: ripple.size * 0.65,
                height: ripple.size * 0.65,
                marginLeft: -ripple.size * 0.325,
                marginTop: -ripple.size * 0.325,
                animation: "gardenRipple 2400ms ease-out 120ms",
                animationFillMode: "both",
              }}
            />
            <span
              className="absolute h-3 w-3 rounded-full bg-mint/80 shadow-[0_0_20px_rgba(165,240,210,0.9)]"
              style={{
                left: -6,
                top: -6,
                animation: "gardenBloom 2400ms ease-out",
                animationFillMode: "forwards",
              }}
            />
          </div>
        ))}

        {ripples.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="rounded-full bg-white/75 px-4 py-2 text-[12px] font-semibold text-muted/70 shadow-sm backdrop-blur-sm">
              Tap anywhere to make a ripple
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12px] text-muted/70">
          Tap slowly. Watch them fade.
        </p>
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-[12px] font-semibold text-ink transition-colors hover:bg-cream"
        >
          Done for now
          <ArrowRight size={14} />
        </button>
      </div>
    </Card>
  );
}

const TOWER_BASE_WIDTH = 32;
const TOWER_BLOCK_HEIGHT = 34;
const TOWER_TOP_Y = 92;
const TOWER_MIN_OVERLAP = 7;
const TOWER_SPEED = 0.03;

function getTowerScore(overlapWidth, width, offset) {
  if (overlapWidth >= width * 0.92 && offset <= width * 0.08) {
    return { points: 50, label: "Perfect" };
  }
  if (overlapWidth >= width * 0.7 && offset <= width * 0.2) {
    return { points: 30, label: "Great" };
  }
  if (overlapWidth >= width * 0.5 && offset <= width * 0.3) {
    return { points: 20, label: "Good" };
  }
  return { points: 10, label: "Nice" };
}

function BlockTower({ onBack }) {
  const [blocks, setBlocks] = useState([
    { id: 0, left: 34, width: TOWER_BASE_WIDTH, dropping: false },
  ]);
  const [movingLeft, setMovingLeft] = useState(10);
  const [currentWidth, setCurrentWidth] = useState(TOWER_BASE_WIDTH);
  const [frozen, setFrozen] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const directionRef = useRef(1);
  const frameRef = useRef(null);
  const lastFrameRef = useRef(0);
  const dropTimerRef = useRef(null);
  const feedbackTimerRef = useRef(null);
  const nextIdRef = useRef(1);

  useEffect(() => () => {
    if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    if (dropTimerRef.current) window.clearTimeout(dropTimerRef.current);
    if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current);
  }, []);

  useEffect(() => {
    if (frozen || gameOver) return undefined;

    const step = (time) => {
      if (!lastFrameRef.current) lastFrameRef.current = time;
      const delta = Math.min(time - lastFrameRef.current, 32);
      lastFrameRef.current = time;

      setMovingLeft((current) => {
        const max = 100 - currentWidth;
        let next = current + directionRef.current * delta * TOWER_SPEED;

        if (next >= max) {
          next = max;
          directionRef.current = -1;
        } else if (next <= 0) {
          next = 0;
          directionRef.current = 1;
        }

        return next;
      });

      frameRef.current = window.requestAnimationFrame(step);
    };

    frameRef.current = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      lastFrameRef.current = 0;
    };
  }, [frozen, gameOver, currentWidth]);

  const dropBlock = () => {
    if (frozen || gameOver) return;

    const top = blocks[blocks.length - 1];
    const overlapLeft = Math.max(movingLeft, top.left);
    const overlapRight = Math.min(
      movingLeft + currentWidth,
      top.left + top.width,
    );
    const overlapWidth = overlapRight - overlapLeft;
    const topCenter = top.left + top.width / 2;
    const landingOffset = Math.abs(movingLeft + currentWidth / 2 - topCenter);

    if (overlapWidth < TOWER_MIN_OVERLAP) {
      setGameOver(true);
      setFrozen(true);
      setFeedback(null);
      return;
    }

    const id = nextIdRef.current;
    nextIdRef.current += 1;
    const { points, label } = getTowerScore(
      overlapWidth,
      top.width,
      landingOffset,
    );

    setBlocks((current) => [
      ...current,
      { id, left: overlapLeft, width: overlapWidth, dropping: true },
    ]);
    setCurrentWidth(overlapWidth);
    setMovingLeft(Math.max(0, Math.min(100 - overlapWidth, overlapLeft)));
    setFrozen(true);
    setScore((current) => current + points);
    setFeedback({
      id,
      points,
      label,
      left: overlapLeft + overlapWidth / 2,
      top: TOWER_TOP_Y - 34,
    });

    if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = window.setTimeout(() => setFeedback(null), 900);

    dropTimerRef.current = window.setTimeout(() => {
      setBlocks((current) =>
        current.map((block) =>
          block.id === id ? { ...block, dropping: false } : block,
        ),
      );
      setFrozen(false);
    }, 300);
  };

  const playAgain = () => {
    if (dropTimerRef.current) window.clearTimeout(dropTimerRef.current);
    if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current);
    setScore(0);
    setFeedback(null);
    setBlocks([
      { id: 0, left: 34, width: TOWER_BASE_WIDTH, dropping: false },
    ]);
    setCurrentWidth(TOWER_BASE_WIDTH);
    setMovingLeft(10);
    directionRef.current = 1;
    setFrozen(false);
    setGameOver(false);
    nextIdRef.current = 1;
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    dropBlock();
  };

  const visibleBlocks = blocks.slice(-9);

  return (
    <Card className="p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-sun-deep">
            Balance practice
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl">
            Block Tower
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-sun-soft px-3 py-1.5 text-[12px] font-semibold text-sun-deep">
            Score {score}
          </span>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[12px] font-semibold text-muted/70 transition-colors hover:text-ink"
          >
            <ArrowLeft size={14} />
            Back to games
          </button>
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label="Click, tap, or press Space to drop the brick"
        onClick={dropBlock}
        onKeyDown={handleKeyDown}
        className="relative mt-5 h-[420px] cursor-pointer overflow-hidden rounded-2xl border border-navy/20 bg-gradient-to-b from-navy via-navy-2 to-navy shadow-inner focus:outline-none focus:ring-2 focus:ring-mint-deep/50"
      >
        <div className="absolute inset-x-0 bottom-0 h-3 bg-mint/20" />
        <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-lavender/10 blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-44 w-44 rounded-full bg-mint/10 blur-3xl" />

        <div
          className={`relative h-full w-full origin-bottom-left transition-all duration-700 ${
            gameOver ? "translate-y-24 rotate-6 opacity-0" : "opacity-100"
          }`}
        >
          {visibleBlocks.map((block, index) => (
            <div
              key={block.id}
              className={`absolute h-[30px] rounded-lg border border-navy/10 bg-gradient-to-r shadow-md transition-[top] duration-500 ${
                index % 2 === 0
                  ? "from-mint via-mint-soft to-lavender"
                  : "from-lavender via-blossom-soft to-mint"
              }`}
              style={{
                left: `${block.left}%`,
                width: `${block.width}%`,
                top: `${
                  TOWER_TOP_Y +
                  (visibleBlocks.length - 1 - index) * TOWER_BLOCK_HEIGHT
                }px`,
                animation: block.dropping ? "brickDrop 300ms ease-in" : undefined,
              }}
            />
          ))}
        </div>

        {!gameOver && (
          <div
            className="absolute top-4 h-8 rounded-lg border border-navy/10 bg-gradient-to-r from-sun via-peach to-blossom shadow-lg transition-opacity"
            style={{
              left: `${movingLeft}%`,
              width: `${currentWidth}%`,
              opacity: frozen ? 0.65 : 1,
            }}
          />
        )}

        {feedback && (
          <div
            key={feedback.id}
            className="pointer-events-none absolute z-20 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-navy shadow-lg"
            style={{
              left: `${feedback.left}%`,
              top: `${feedback.top}px`,
              animation: "scorePop 900ms ease-out",
              animationFillMode: "forwards",
            }}
          >
            +{feedback.points} {feedback.label}
          </div>
        )}

        {gameOver && (
          <div
            onClick={(event) => event.stopPropagation()}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center backdrop-blur-sm"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blossom/20 text-blossom">
              <Layers size={24} />
            </span>
            <h3 className="mt-4 font-display text-xl text-white">
              No room left
            </h3>
            <p className="mt-2 max-w-xs text-[12px] leading-relaxed text-white/70">
              The next block couldn't find space to land. You scored {score} calm
              points.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                onClick={playAgain}
                className="flex items-center gap-2 rounded-xl bg-mint px-5 py-2.5 text-[12px] font-semibold text-navy transition-colors hover:bg-mint/85"
              >
                <RotateCcw size={14} />
                Try again
              </button>
              <button
                onClick={onBack}
                className="flex items-center gap-2 rounded-xl border border-white/25 px-5 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                <ArrowLeft size={14} />
                Back to games
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12px] text-muted/70">
          Click, tap, or press Space to drop. Blocks stacked: {blocks.length - 1}.
        </p>
        <button
          onClick={dropBlock}
          disabled={frozen || gameOver}
          className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-navy-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Drop brick
          <ArrowRight size={14} />
        </button>
      </div>
    </Card>
  );
}

export default function Games() {
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [view, setView] = useState("list");

  const selectedGame = games.find((game) => game.id === selectedGameId);

  const openGame = (id) => {
    setSelectedGameId(id);
    setView("detail");
  };

  const backToList = () => {
    setSelectedGameId(null);
    setView("list");
  };

  if (!selectedGame) {
    return <GameList onSelect={openGame} />;
  }

  if (view === "detail") {
    return (
      <div className="space-y-5 lg:space-y-6">
        <GameHero game={selectedGame} onBack={backToList} />
        <InstructionCard
          game={selectedGame}
          onStart={() => setView("playing")}
        />
      </div>
    );
  }

  if (selectedGame.id === "breathing") {
    return <BreathingGame key="breathing" onBack={backToList} />;
  }

  if (selectedGame.id === "ripple") {
    return <RippleGame key="ripple" onBack={backToList} />;
  }

  if (selectedGame.id === "tower") {
    return <BlockTower key="tower" onBack={backToList} />;
  }

  return <GameList onSelect={openGame} />;
}
