"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Save, Eye } from "lucide-react";
import { motion } from "framer-motion";

type WinnerEntry = {
  name: string;
  prize: string;
};

export default function AdminPage() {
  const [rawComments, setRawComments] = useState("");
  const [manualWinners, setManualWinners] = useState<WinnerEntry[]>([
    { name: "", prize: "" },
  ]);
  const [saved, setSaved] = useState(false);

  const updateEntry = (
    index: number,
    field: keyof WinnerEntry,
    value: string
  ) => {
    const updated = [...manualWinners];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setManualWinners(updated);
  };

  const handleSave = () => {
    const participants = rawComments
      .split("\n")
      .map((line) => line.trim().replace(/^@/, ""))
      .filter(Boolean);

    const winners = manualWinners.filter((entry) => entry.name.trim());

    localStorage.setItem("ora_participants", JSON.stringify(participants));
    localStorage.setItem("ora_winners", JSON.stringify(winners));

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="pt-10 pb-6 text-center px-4 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">
          Ora Couture — Configuration
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Page privée — ne pas partager
        </p>
      </header>

      <main className="max-w-xl mx-auto px-4 py-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm"
        >
          <Label className="text-sm font-semibold block">
            Commentaires Instagram
          </Label>

          <Textarea
            placeholder={"utilisateur1\nutilisateur2\n…"}
            value={rawComments}
            onChange={(e) => setRawComments(e.target.value)}
            className="min-h-[160px] resize-y text-sm"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-primary/25 rounded-xl p-6 space-y-4 shadow-sm"
        >
          <Label className="text-sm font-semibold block">
            Gagnants définis manuellement
          </Label>

          <div className="space-y-2">
            {manualWinners.map((entry, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  placeholder="Nom du gagnant"
                  value={entry.name}
                  onChange={(e) =>
                    updateEntry(index, "name", e.target.value)
                  }
                  className="text-sm flex-1"
                />

                <Input
                  placeholder="Prix"
                  value={entry.prize}
                  onChange={(e) =>
                    updateEntry(index, "prize", e.target.value)
                  }
                  className="text-sm flex-1"
                />

                {manualWinners.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setManualWinners(
                        manualWinners.filter((_, i) => i !== index)
                      )
                    }
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              setManualWinners([...manualWinners, { name: "", prize: "" }])
            }
            className="flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            Ajouter un gagnant
          </button>
        </motion.div>

        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            className="flex-1 gap-2 font-semibold h-12"
          >
            <Save className="w-4 h-4" />
            {saved ? "Sauvegardé ✓" : "Sauvegarder"}
          </Button>

          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full gap-2 h-12">
              <Eye className="w-4 h-4" />
              Voir le tirage
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}