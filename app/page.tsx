"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import WinnerCard from "@/components/WinnerCard";

type Winner = {
  name: string;
  prize?: string;
};

type Phase = "idle" | "spinning" | "done";

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function HomePage() {
  const [participants, setParticipants] = useState<string[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [displayedName, setDisplayedName] = useState("");

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const storedParticipants: string[] = JSON.parse(
        localStorage.getItem("ora_participants") || "[]"
      );

      setParticipants(shuffleArray(storedParticipants));
    } catch {
      setParticipants([]);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleDraw = () => {
    let storedWinners: Winner[] = [];

    try {
      storedWinners = JSON.parse(localStorage.getItem("ora_winners") || "[]");
    } catch {
      storedWinners = [];
    }

    if (participants.length === 0) return;

    setPhase("spinning");
    setWinners([]);
    setDisplayedName("");

    let speed = 60;
    let elapsed = 0;
    const totalDuration = 3000;

    const tick = () => {
      const randomName =
        participants[Math.floor(Math.random() * participants.length)];

      setDisplayedName(randomName.replace(/^@/, ""));

      elapsed += speed;
      speed = 60 + Math.floor((elapsed / totalDuration) * 220);

      if (elapsed < totalDuration) {
        timeoutRef.current = setTimeout(tick, speed);
        return;
      }

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      setDisplayedName("");
      setWinners(storedWinners);
      setPhase("done");

      confetti({
        particleCount: 180,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#c8943e", "#e8c97a", "#f5e6c8", "#a07428"],
      });
    };

    timeoutRef.current = setTimeout(tick, speed);
  };

  const handleReset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setParticipants((current) => shuffleArray(current));
    setPhase("idle");
    setWinners([]);
    setDisplayedName("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="pt-12 pb-8 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight">
            Ora Couture
          </h1>

          <div className="w-16 h-0.5 bg-primary mx-auto mt-3 mb-4" />

          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <FaInstagram className="w-4 h-4" />
            Tirage au sort — Concours Instagram
          </div>
        </motion.div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-16 gap-10">
        <div className="w-full max-w-md">
          <div className="relative bg-card border-2 border-primary/30 rounded-2xl h-28 flex items-center justify-center overflow-hidden shadow-lg">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 bg-primary/5 border-y border-primary/20" />

            <AnimatePresence mode="popLayout">
              {phase === "idle" && (
                <motion.p
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xl text-muted-foreground"
                >
                  Prêt pour le tirage…
                </motion.p>
              )}

              {phase === "spinning" && displayedName && (
                <motion.p
                  key={displayedName}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{ duration: 0.05 }}
                  className="text-3xl md:text-4xl font-bold text-foreground px-6 text-center"
                >
                  {displayedName}
                </motion.p>
              )}

              {phase === "done" && (
                <motion.p
                  key="done"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold text-primary"
                >
                  🎉 Résultats !
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {phase === "idle" && participants.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-md"
          >
            <p className="text-xs text-muted-foreground text-center mb-3">
              {participants.length} participant
              {participants.length > 1 ? "s" : ""}
            </p>

            <div className="relative h-32 overflow-hidden rounded-xl border border-border bg-card">
              <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-card to-transparent z-10" />
              <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card to-transparent z-10" />

              <motion.div
                animate={{ y: ["0%", "-50%"] }}
                transition={{
                  repeat: Infinity,
                  duration: Math.max(participants.length * 0.35, 8),
                  ease: "linear",
                }}
                className="py-2"
              >
                {[...participants, ...participants].map((participant, index) => (
                  <div
                    key={`${participant}-${index}`}
                    className="text-sm text-center text-muted-foreground py-1.5"
                  >
                    {participant.replace(/^@/, "")}
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}

        <div className="flex gap-3 w-full max-w-md">
          {phase !== "done" ? (
            <Button
              onClick={handleDraw}
              disabled={phase === "spinning" || participants.length === 0}
              size="lg"
              className="flex-1 font-semibold text-base h-14 gap-2"
            >
              {phase === "spinning" ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.6,
                    ease: "linear",
                  }}
                >
                  <Shuffle className="w-5 h-5" />
                </motion.div>
              ) : (
                <Shuffle className="w-5 h-5" />
              )}

              {phase === "spinning" ? "Tirage en cours…" : "Lancer le tirage"}
            </Button>
          ) : (
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="flex-1 h-14"
            >
              Recommencer
            </Button>
          )}
        </div>

        <AnimatePresence>
          {winners.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-md space-y-5"
            >
              <h2 className="text-2xl font-semibold text-center text-foreground">
                {winners.length > 1 ? "Les gagnants" : "Le gagnant"} 🎉
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {winners.map((winner, index) => (
                  <WinnerCard
                    key={`${winner.name}-${index}`}
                    winner={winner.name.replace(/^@/, "")}
                    index={index}
                    prize={winner.prize || null}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}