'use client';

import './globals.css';
import { useEffect, useState } from 'react';
import { ThemeProvider, useTheme } from '@/hooks/use-theme';
import { Toaster } from '@/components/ui/toaster';
import Link from 'next/link';
import { 
    FileText, Home, Gavel, Book, FileUp, Settings, BarChart, FileQuestion, MessageSquare, ShieldAlert, FileCheck, LogOut 
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { SmartAssistant } from '@/components/legiflow/smart-assistant';
import React, { useState } from 'react';

const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/upload', icon: FileUp, label: 'Upload Document' },
    { href: '/samples', icon: FileCheck, label: 'Sample Agreements' },
    { href: '/agreements', icon: FileText, label: 'Agreements' },
    { href: '/risk', icon: ShieldAlert, label: 'High-Risk Agreements' },
    { href: '/reference', icon: Book, label: 'Legal Reference' },
    { href: '/search', icon: FileQuestion, label: 'Clause Search' },
    { href: '/compare', icon: BarChart, label: 'Compare' },
];

const sections = [
  {
    number: "302",
    title: "Murder",
    description: "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
    related: ["299", "303"],
  },
  {
    number: "303",
    title: "Culpable Homicide",
    description: "Causing death by doing an act with the intention of causing death.",
    related: ["302", "304"],
  },
];

const mockResults = [
  {
    text: "...the employee shall not engage in any competitive activity for a period of [24 months] following termination of employment...",
    source: "NDA_2025.pdf",
    risk: "HIGH",
    explanation: "This stops you from working in the same industry for 2 years.",
  },
];

const agreements = ["NDA_2024.pdf", "NDA_2025.pdf"];
const diffData = [
  {
    clause: "Clause 4 — Termination",
    changes: [
      {
        type: "removed",
        text: "The contract may be terminated with 30 days notice.",
        version: "2024",
      },
      {
        type: "added",
        text: "The contract may be terminated with 90 days notice.",
        version: "2025",
      },
    ],
  },
  {
    clause: "Clause 7 — Governing Law",
    changes: [
      {
        type: "unchanged",
        text: "This agreement shall be governed by the laws of India.",
      },
    ],
  },
];

const timelineData = [
  {
    date: "Today",
    activities: [
      {
        time: "11:05 AM",
        text: "Lease Agreement flagged as High Risk",
        description: "Non-compete and penalty clauses detected.",
        type: "risk",
      },
      {
        time: "10:42 AM",
        text: "NDA contains restrictive non-compete clause",
        description: "Review before signing.",
        type: "risk",
      },
    ],
  },
  {
    date: "Yesterday",
    activities: [
      {
        time: "3:30 PM",
        text: "Service Agreement marked safe",
        description: "No high-risk clauses found.",
        type: "safe",
      },
    ],
  },
];

function AppHeader() {
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();

    const pageTitle = navItems.find(item => pathname.startsWith(item.href))?.label || 'LegiFlow';

    return (
        <header className="fixed left-0 right-0 top-0 h-13 flex items-center justify-between px-[var(--space-lg)] z-30 backdrop-blur-md bg-background/30">
            <div className="flex flex-col gap-[var(--space-xs)]">
                <h1 className="font-serif text-[40px] font-normal leading-[1.15] tracking-[-0.02em]">{pageTitle}</h1>
                <p className="text-muted text-sm">One line description beneath it</p>
            </div>
            <div className="flex items-center gap-5">
                <button className="hover:bg-card p-[var(--space-sm)] rounded text-foreground transition-all duration-150 ease-out cursor-pointer">
                    <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M15 11a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                </button>
                <button onClick={toggleTheme} className="hover:bg-card p-[var(--space-sm)] rounded text-foreground transition-all duration-150 ease-out cursor-pointer">
                    {theme === 'dark' ? '🌙' : '☀️'}
                </button>
                <button className="hover:bg-card p-[var(--space-sm)] rounded text-foreground transition-all duration-150 ease-out cursor-pointer">
                    <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20h.01M12 4h.01"></path>
                    </svg>
                </button>
                <button className="hover:bg-card p-[var(--space-sm)] rounded text-foreground transition-all duration-150 ease-out cursor-pointer">
                    <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M12 4h.01"></path>
                    </svg>
                </button>
                <div className="w-7 h-7 bg-secondary text-primary flex items-center justify-center rounded text-sm font-medium">LL</div>
                <button className="hover:bg-card p-[var(--space-sm)] rounded text-foreground transition-all duration-150 ease-out cursor-pointer">
                    <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H3"></path>
                    </svg>
                </button>
            </div>
        </header>
    );
}

function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen flex text-foreground relative">
            <AppHeader />
            <div className="flex mt-13 h-[calc(100vh-52px)] w-full">
                <aside className="w-64 flex-col fixed h-full p-[var(--space-sm)] bg-gradient-to-b from-card/60 to-card/20 border-r border-border/50">
                    <nav className="flex-grow space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-[var(--space-md)] px-[var(--space-md)] py-[var(--space-sm)] rounded text-sm font-medium transition-all duration-150 ease-out cursor-pointer ${
                                    pathname === item.href
                                        ? 'bg-accent/10 text-accent-foreground'
                                        : 'text-muted-foreground hover:bg-card hover:text-foreground'
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>
                <main className="flex-1 ml-64 p-[var(--space-lg)] overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet" />
            </head>
            <body className="antialiased">
                <AuthProvider>
                    <ThemeProvider defaultTheme='dark'>
                        <AppLayout>{children}</AppLayout>
                        <Toaster />
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}

export function LegalSpotlightSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [documentContext, setDocumentContext] = useState("");
  const [showDocumentContext, setShowDocumentContext] = useState(false);
  const [results, setResults] = useState(mockResults);

  const handleSearch = () => {
    // Simulate search logic
    setResults(mockResults.filter((result) => result.text.includes(searchQuery)));
  };

  return (
    <div className="max-w-[720px] mx-auto p-[var(--space-lg)]">
      <h1 className="font-serif text-[40px] font-normal leading-[1.15] tracking-[-0.02em]">
        Find a Clause
      </h1>

      {/* Search Bar */}
      <div className="relative mt-[var(--space-md)]">
        <input
          type="text"
          placeholder="Search for any clause — e.g. 'termination', 'non-compete'..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border-b border-border-subtle focus:outline-none focus:border-foreground text-[16px]"
        />
        <button
          onClick={handleSearch}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
        >
          🔍
        </button>
      </div>

      {/* Document Context */}
      <div className="mt-[var(--space-lg)]">
        <button
          onClick={() => setShowDocumentContext(!showDocumentContext)}
          className="text-sm font-medium hover:underline"
        >
          {showDocumentContext ? "- Collapse document context" : "+ Paste a specific document to search within it"}
        </button>
        {showDocumentContext && (
          <textarea
            value={documentContext}
            onChange={(e) => setDocumentContext(e.target.value)}
            placeholder="Paste your document here..."
            className="w-full mt-[var(--space-sm)] p-[var(--space-sm)] border border-border-subtle rounded-md focus:outline-none focus:border-foreground"
            rows={5}
          />
        )}
      </div>

      {/* Results */}
      <div className="mt-[var(--space-xl)] space-y-[var(--space-lg)]">
        {results.map((result, index) => (
          <div key={index} className="space-y-[var(--space-sm)]">
            <p className="text-[14px] leading-[1.6]">
              {result.text.replace(
                new RegExp(searchQuery, "gi"),
                (match) => `<strong>${match}</strong>`
              )}
            </p>
            <p className="text-muted text-[12px]">
              Source: <a href="#" className="hover:underline">{result.source}</a> Risk: {result.risk}
            </p>
            <p className="text-muted italic text-[12px]">{result.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DiffView() {
  const [agreementA, setAgreementA] = useState(agreements[0]);
  const [agreementB, setAgreementB] = useState(agreements[1]);

  return (
    <div className="p-[var(--space-lg)]">
      {/* Agreement Selectors */}
      <div className="flex justify-between items-center mb-[var(--space-lg)]">
        <select
          value={agreementA}
          onChange={(e) => setAgreementA(e.target.value)}
          className="border-b border-border-subtle focus:outline-none focus:border-foreground text-[14px]"
        >
          {agreements.map((agreement, index) => (
            <option key={index} value={agreement}>
              {agreement}
            </option>
          ))}
        </select>
        <select
          value={agreementB}
          onChange={(e) => setAgreementB(e.target.value)}
          className="border-b border-border-subtle focus:outline-none focus:border-foreground text-[14px]"
        >
          {agreements.map((agreement, index) => (
            <option key={index} value={agreement}>
              {agreement}
            </option>
          ))}
        </select>
      </div>

      {/* Diff View */}
      <div className="space-y-[var(--space-xl)]">
        {diffData.map((diff, index) => (
          <div key={index} className="space-y-[var(--space-sm)]">
            <h2 className="font-medium text-[16px]">{diff.clause}</h2>
            {diff.changes.map((change, idx) => (
              <div
                key={idx}
                className={`pl-[var(--space-sm)] border-l-2 ${
                  change.type === "added"
                    ? "border-success text-success/70"
                    : change.type === "removed"
                    ? "border-danger text-danger/70 line-through"
                    : "border-border-subtle text-muted"
                }`}
              >
                <p className="text-[14px] leading-[1.6]">{change.text}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Summary Panel */}
      <div className="mt-[var(--space-xl)] pt-[var(--space-lg)] border-t border-border-subtle">
        <h3 className="font-medium text-[16px]">Differences summary</h3>
        <p className="text-[14px]">3 clauses changed · 1 clause added · 0 clauses removed</p>
        <p className="text-muted text-[14px]">
          Termination period stricter in 2025 version.
        </p>
      </div>
    </div>
  );
}

export default function ActivityTimeline() {
  return (
    <div className="p-[var(--space-lg)]">
      <h1 className="font-serif text-[40px] font-normal leading-[1.15] tracking-[-0.02em]">
        Activity
      </h1>

      <div className="space-y-[var(--space-xl)] mt-[var(--space-lg)]">
        {timelineData.map((section, index) => (
          <div key={index} className="space-y-[var(--space-md)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-medium uppercase text-muted tracking-[0.08em]">
                {section.date}
              </h2>
            </div>
            <hr className="border-border-subtle" />

            <ul className="space-y-[var(--space-sm)]">
              {section.activities.map((activity, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-[var(--space-md)] hover:bg-secondary p-[var(--space-sm)] rounded-md cursor-pointer"
                >
                  <span
                    className={`mt-[var(--space-xs)] w-2 h-2 rounded-full ${
                      activity.type === "risk"
                        ? "bg-danger"
                        : activity.type === "safe"
                        ? "bg-success"
                        : "bg-muted"
                    }`}
                  ></span>
                  <div className="space-y-[var(--space-xs)]">
                    <p className="text-[14px] font-medium leading-[1.6]">
                      {activity.text}
                    </p>
                    <p className="text-[13px] text-muted leading-[1.6]">
                      {activity.description}
                    </p>
                  </div>
                  <p className="ml-auto text-[12px] text-muted font-medium">
                    {activity.time}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

