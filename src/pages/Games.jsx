import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Heart,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
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

const groundingSteps = [
  {
    key: "see",
    count: 5,
    title: "Things you can see",
    hint: "Look around slowly. Notice colours, shapes or small details.",
    placeholder: "e.g. blue curtain",
  },
  {
    key: "feel",
    count: 4,
    title: "Things you can feel",
    hint: "Notice what your body touches or the temperature around you.",
    placeholder: "e.g. soft hoodie",
  },
  {
    key: "hear",
    count: 3,
    title: "Things you can hear",
    hint: "Pause for a second and let sounds come to you.",
    placeholder: "e.g. fan humming",
  },
  {
    key: "smell",
    count: 2,
    title: "Things you can smell",
    hint: "You might need to move closer to notice these.",
    placeholder: "e.g. coffee",
  },
  {
    key: "taste",
    count: 1,
    title: "Things you can taste",
    hint: "Notice what's left in your mouth, or take a sip of water.",
    placeholder: "e.g. mint",
  },
];

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
    id: "grounding",
    title: "5-4-3-2-1 Grounding",
    description:
      "Find simple things around you: 5 you see, 4 you feel, 3 you hear, 2 you smell and 1 you taste.",
    meta: "~2 min · 5 steps",
    icon: Eye,
    accent: "from-lavender to-blossom text-navy",
    softAccent: "bg-lavender-soft text-lavender-deep",
    instructions: [
      {
        number: "1",
        title: "Stay where you are",
        text: "No walking around needed. Just notice the room you're in right now.",
      },
      {
        number: "2",
        title: "Fill the boxes",
        text: "Answer each step with anything you notice. Short or silly answers are fine.",
      },
      {
        number: "3",
        title: "Skip if you're stuck",
        text: "If you can't think of something, use Skip. There are no wrong answers.",
      },
    ],
    tip: "This gently brings your attention back to the present moment. It's not a test — just noticing.",
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

function BreathingSession({ paused, phase, secondsLeft, round, sessionSeconds, progress, scale, onPause, onResume, onStop }) {
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
                <p aria-hidden="true" className="mt-1 text-[12px] font-medium text-navy/60">
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

function emptyAnswers() {
  return Object.fromEntries(
    groundingSteps.map((step) => [step.key, Array(step.count).fill("")]),
  );
}

function GroundingGame({ onBack }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState(emptyAnswers);
  const [finished, setFinished] = useState(false);

  const currentStep = groundingSteps[stepIndex];
  const currentAnswers = answers[currentStep.key];
  const canContinue = currentAnswers.every((answer) => answer.trim() !== "");

  const updateAnswer = (index, value) => {
    setAnswers((current) => {
      const next = [...current[currentStep.key]];
      next[index] = value;
      return { ...current, [currentStep.key]: next };
    });
  };

  const skipRest = () => {
    setAnswers((current) => ({
      ...current,
      [currentStep.key]: current[currentStep.key].map(
        (answer) => answer.trim() || "Not sure",
      ),
    }));
  };

  const nextStep = () => {
    if (stepIndex === groundingSteps.length - 1) {
      setFinished(true);
      return;
    }
    setStepIndex((index) => index + 1);
  };

  const playAgain = () => {
    setAnswers(emptyAnswers());
    setStepIndex(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <ResultCard
        title="Nicely grounded"
        message="You took a moment to notice what's around you. Carry that small pause with you — no need to force calm."
        againLabel="Play again"
        onAgain={playAgain}
        onBack={onBack}
      />
    );
  }

  return (
    <Card className="p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-mint-deep">
            Step {stepIndex + 1} of {groundingSteps.length}
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl">
            {currentStep.title}
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

      <div className="mt-4 flex gap-2" aria-hidden="true">
        {groundingSteps.map((step, index) => (
          <span
            key={step.key}
            className={`h-1.5 flex-1 rounded-full ${
              index <= stepIndex ? "bg-mint-deep" : "bg-line"
            }`}
          />
        ))}
      </div>

      <p className="mt-5 text-[13px] leading-relaxed text-muted/75">
        {currentStep.hint}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {currentAnswers.map((answer, index) => (
          <label key={`${currentStep.key}-${index}`} className="flex items-center gap-3">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${currentStep.key === "see" ? "bg-mint-soft text-mint-deep" : "bg-lavender-soft text-lavender-deep"}`}
            >
              {index + 1}
            </span>
            <input
              type="text"
              value={answer}
              onChange={(event) => updateAnswer(index, event.target.value)}
              placeholder={currentStep.placeholder}
              autoComplete="off"
              aria-label={`${currentStep.title}, answer ${index + 1}`}
              className="min-w-0 flex-1 rounded-xl border border-line bg-white px-4 py-3 text-[13px] text-ink outline-none transition-colors placeholder:text-muted/40 focus:border-mint-deep focus:ring-2 focus:ring-mint/25"
            />
          </label>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line/70 pt-5">
        <div className="flex items-center gap-3">
          {stepIndex > 0 && (
            <button
              onClick={() => setStepIndex((index) => index - 1)}
              className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-[12px] font-semibold text-ink transition-colors hover:bg-cream"
            >
              <ArrowLeft size={14} />
              Previous
            </button>
          )}
          {!canContinue && (
            <button
              onClick={skipRest}
              className="text-[12px] font-semibold text-lavender-deep transition-colors hover:text-ink"
            >
              Skip for now
            </button>
          )}
        </div>
        <button
          onClick={nextStep}
          disabled={!canContinue}
          className="flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-navy-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {stepIndex === groundingSteps.length - 1 ? "Finish" : "Next"}
          <ArrowRight size={15} />
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

  return selectedGame.id === "breathing" ? (
    <BreathingGame key="breathing" onBack={backToList} />
  ) : (
    <GroundingGame key="grounding" onBack={backToList} />
  );
}
