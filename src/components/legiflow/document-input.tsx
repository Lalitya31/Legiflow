
'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface DocumentInputProps {
  onParse: (text: string) => void;
  isLoading: boolean;
}

export function DocumentInput({ onParse, isLoading }: DocumentInputProps) {
  const [text, setText] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const sampleText = searchParams.get('text');
    if (sampleText) {
      setText(decodeURIComponent(sampleText));
    }
  }, [searchParams]);

  const handleSubmit = () => {
    if (text.trim()) {
      onParse(text.trim());
    }
  };

  return (
    <div className="space-y-[var(--space-md)]">
        <div className="border-2 border-dashed border-border/20 p-[var(--space-2xl)] text-center rounded transition-all duration-150 ease-out cursor-pointer hover:bg-card/50">
            <h3 className="font-bold">Drag & drop or paste text</h3>
            <p className="text-muted-foreground text-sm">We will extract text and run a quick analysis.</p>
            <Textarea
              placeholder="Paste the text of your legal document here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-64 text-base bg-transparent focus:border-primary font-sans my-[var(--space-md)] transition-all duration-150 ease-out"
              disabled={isLoading}
            />
        </div>
        <Button onClick={handleSubmit} className="w-full sm:w-auto transition-all duration-150 ease-out cursor-pointer" disabled={isLoading || !text.trim()}>
          {isLoading ? <LoaderCircle className="animate-spin mr-2" /> : null}
          Analyze Document
        </Button>
    </div>
  );
}
