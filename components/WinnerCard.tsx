"use client";

import { motion } from "framer-motion";
import { Trophy, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type WinnerCardProps = {
  winner: string;
  index: number;
  prize?: string | null;
  prizeOptions?: string[];
  onPrizeChange?: (value: string) => void;
};

export default function WinnerCard({
  winner,
  index,
  prize,
  prizeOptions,
  onPrizeChange,
}: WinnerCardProps) {
  const hasPrizeOptions = prizeOptions && prizeOptions.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: index * 0.2,
        duration: 0.5,
        type: "spring",
      }}
      className="relative bg-card border border-primary/20 rounded-xl p-6 text-center shadow-lg"
    >
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
        {index + 1}
      </div>

      <Trophy className="w-8 h-8 text-primary mx-auto mb-3" />

      <p className="text-xl font-semibold text-foreground">{winner}</p>

      {hasPrizeOptions && (
        <div className="mt-3">
          <Select value={prize || ""} onValueChange={onPrizeChange}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Choisir un prix…" />
            </SelectTrigger>

            <SelectContent>
              {prizeOptions.map((option, optionIndex) => (
                <SelectItem
                  key={`${option}-${optionIndex}`}
                  value={option}
                  className="text-sm"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-primary" />
                    {option}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {!hasPrizeOptions && prize && (
        <div className="mt-2 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          {prize}
        </div>
      )}
    </motion.div>
  );
}