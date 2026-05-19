'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
interface Agreement {
  id: 'A' | 'B';
  label: string;
  file: File | null;
  content: string;
}

interface Diff {
  clause: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

// --- Mock diff engine (replace with real diffing logic) ---
function computeDiffs(a: Agreement, b: Agreement): Diff[] {
  if (!a.file || !b.file) return [];
  // Placeholder: swap with actual text-diff or AI-powered comparison
  return [
    { clause: 'Clause 4 – Termination', description: 'Stricter notice period in the 2025 version (30 → 60 days).', severity: 'high' },
    { clause: 'Clause 7 – Liability', description: 'Cap raised from $50k to $200k in the newer agreement.', severity: 'medium' },
    { clause: 'Clause 11 – Governing Law', description: 'Jurisdiction changed from Delaware to New York.', severity: 'low' },
  ];
}

// --- Sub-components ---
const severityStyles: Record<Diff['severity'], string> = {
  high: 'bg-destructive/10 border-destructive/30 text-destructive',
  medium: 'bg-warning/10 border-warning/30 text-warning',
  low: 'bg-success/10 border-success/30 text-success',
};

const severityLabel: Record<Diff['severity'], string> = {
  high: '● High',
  medium: '◑ Medium',
  low: '○ Low',
};

function DropZone({
  agreement,
  onFile,
}: {
  agreement: Agreement;
  onFile: (id: 'A' | 'B', file: File) => void;
}) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFile(agreement.id, file);
    },
    [agreement.id, onFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFile(agreement.id, file);
    },
    [agreement.id, onFile]
  );

  return (
    <motion.label
      htmlFor={`upload-${agreement.id}`}
      className={`
        relative flex flex-col items-center justify-center gap-[var(--space-sm)] rounded border-2 border-dashed
        p-[var(--space-lg)] cursor-pointer transition-all duration-150 ease-out select-none
        ${dragging
          ? 'border-primary/60 bg-primary/10 scale-[1.02]'
          : agreement.file
          ? 'border-primary/50 bg-primary/5'
          : 'border-border bg-card/50 hover:border-border hover:bg-card'
        }
      `}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <input
        id={`upload-${agreement.id}`}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        className="sr-only"
        onChange={handleChange}
      />

      <span className="text-2xl">{agreement.file ? '📄' : '📂'}</span>

      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-[var(--space-xs)]">
          Agreement {agreement.id}
        </p>
        {agreement.file ? (
          <p className="text-sm font-medium text-primary truncate max-w-[180px]">
            {agreement.file.name}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Drop file or click to upload</p>
        )}
      </div>

      {agreement.file && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-[var(--space-sm)] right-[var(--space-sm)] text-xs bg-primary/20 text-primary border border-primary/30 px-[var(--space-sm)] py-[var(--space-xs)] rounded transition-all duration-150 ease-out"
        >
          Ready
        </motion.span>
      )}
    </motion.label>
  );
}

function DiffCard({ diff, index }: { diff: Diff; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }}
      className={`rounded border p-[var(--space-lg)] ${severityStyles[diff.severity]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-white">{diff.clause}</p>
        <span className={`text-xs font-medium whitespace-nowrap ${severityStyles[diff.severity]}`}>
          {severityLabel[diff.severity]}
        </span>
      </div>
      <p className="mt-1 text-sm opacity-80">{diff.description}</p>
    </motion.div>
  );
}

// --- Page ---
export default function ComparePage() {
  const [agreements, setAgreements] = useState<{ A: Agreement; B: Agreement }>({
    A: { id: 'A', label: 'Agreement A', file: null, content: '' },
    B: { id: 'B', label: 'Agreement B', file: null, content: '' },
  });

  const [diffs, setDiffs] = useState<Diff[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback((id: 'A' | 'B', file: File) => {
    setAgreements((prev) => ({
      ...prev,
      [id]: { ...prev[id], file },
    }));
    setDiffs(null);
  }, []);

  const handleCompare = useCallback(async () => {
    if (!agreements.A.file || !agreements.B.file) return;
    setLoading(true);
    // Simulate async diff (replace with real API/diff call)
    await new Promise((r) => setTimeout(r, 900));
    setDiffs(computeDiffs(agreements.A, agreements.B));
    setLoading(false);
  }, [agreements]);

  const canCompare = !!agreements.A.file && !!agreements.B.file;

  return (
    <main className="min-h-screen bg-background text-foreground p-[var(--space-lg)] md:p-[var(--space-2xl)] font-sans">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="max-w-3xl mx-auto space-y-[var(--space-2xl)]"
      >
        {/* Header */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-[var(--space-sm)]">
              <span>📑</span> Compare Agreements
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Upload two agreements to instantly surface clause-level differences.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-[var(--space-lg)]">
            {/* Drop zones */}
            <div className="grid md:grid-cols-2 gap-4">
              <DropZone agreement={agreements.A} onFile={handleFile} />
              <DropZone agreement={agreements.B} onFile={handleFile} />
            </div>

            {/* Compare button */}
            <motion.button
              onClick={handleCompare}
              disabled={!canCompare || loading}
              whileHover={canCompare && !loading ? { scale: 1.02 } : {}}
              whileTap={canCompare && !loading ? { scale: 0.98 } : {}}
              className={`
                w-full py-[var(--space-sm)] rounded text-sm font-semibold tracking-wide transition-all duration-150 ease-out cursor-pointer
                ${canCompare && !loading
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="inline-block"
                  >
                    ⟳
                  </motion.span>
                  Comparing…
                </span>
              ) : (
                'Compare Agreements'
              )}
            </motion.button>
          </CardContent>
        </Card>

        {/* Results */}
        <AnimatePresence>
          {diffs !== null && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.35 }}
            >
              <Card className="bg-card border-border">
                <CardHeader className="pb-[var(--space-sm)]">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>🔍 Differences Found</span>
                    <span className="text-xs font-normal text-muted-foreground bg-muted px-[var(--space-sm)] py-[var(--space-xs)] rounded transition-all duration-150 ease-out">
                      {diffs.length} issue{diffs.length !== 1 ? 's' : ''}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-[var(--space-md)]">
                  {diffs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-[var(--space-2xl)]">
                      ✅ No differences found — agreements are identical.
                    </p>
                  ) : (
                    diffs.map((diff, i) => (
                      <DiffCard key={diff.clause} diff={diff} index={i} />
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
