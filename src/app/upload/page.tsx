import React from 'react';

export default function UploadPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="max-w-[640px] w-full space-y-[var(--space-lg)] text-center">
                {/* Title */}
                <h1 className="font-serif text-[40px] font-normal leading-[1.15] tracking-[-0.02em]">
                    Upload a Document
                </h1>
                <p className="text-muted">
                    Paste text or upload a file. We'll extract, simplify, and flag risky clauses.
                </p>

                <hr className="border-border-subtle" />

                {/* Dropzone */}
                <div className="border-2 border-dashed border-border-subtle rounded-lg p-[var(--space-lg)] text-center">
                    <p className="text-sm text-muted">Drag & drop your file here</p>
                    <p className="text-sm">
                        or <a href="#" className="underline text-primary">browse files</a>
                    </p>
                    <p className="text-xs text-muted mt-[var(--space-sm)]">Supported: PDF, DOCX, TXT</p>
                </div>

                {/* OR Divider */}
                <div className="flex items-center gap-[var(--space-sm)]">
                    <hr className="flex-grow border-border-subtle" />
                    <span className="text-muted text-sm">or</span>
                    <hr className="flex-grow border-border-subtle" />
                </div>

                {/* Textarea */}
                <textarea
                    className="w-full h-[200px] border border-border-subtle rounded-lg p-[var(--space-sm)] text-sm"
                    placeholder="Paste document text here..."
                ></textarea>

                {/* Analyze Button */}
                <div className="text-right">
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded">
                        Analyze Document
                    </button>
                </div>

                {/* What Happens Next */}
                <div className="text-left text-muted text-xs space-y-[var(--space-xs)]">
                    <p>What happens next:</p>
                    <p>1 → Text is extracted and parsed</p>
                    <p>2 → Clauses are identified</p>
                    <p>3 → Risk level is assessed</p>
                    <p>4 → Simplified summary is generated</p>
                </div>
            </div>
        </div>
    );
}