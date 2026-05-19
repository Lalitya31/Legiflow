import { Search } from "lucide-react";

export default function AgreementsPage() {
  const agreements = [
    {
      title: "Employment Agreement",
      tags: ["Employment", "Draft"],
      status: "Draft",
      risk: "High Risk",
      date: "May 18, 2026",
    },
    {
      title: "NDA",
      tags: ["Confidentiality"],
      status: "Finalized",
      risk: "Low Risk",
      date: "May 15, 2026",
    },
  ];

  return (
    <main className="space-y-[var(--space-lg)]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="font-serif text-[40px] font-normal leading-[1.15] tracking-[-0.02em]">
          Agreements
        </h1>
        <button className="border border-border-subtle text-primary px-4 py-2 rounded">
          Upload New Agreement
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search agreements..."
          className="w-full border-b border-border-subtle pl-10 py-2 focus:outline-none focus:border-primary"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-border-subtle">
        <nav className="flex space-x-[var(--space-md)]">
          <a href="#" className="text-muted hover:text-primary border-b-2 border-transparent hover:border-primary">Saved</a>
          <a href="#" className="text-muted hover:text-primary border-b-2 border-transparent hover:border-primary">Drafts</a>
          <a href="#" className="text-muted hover:text-primary border-b-2 border-transparent hover:border-primary">Simplified</a>
        </nav>
      </div>

      {/* Document List */}
      <ul className="divide-y divide-border-subtle">
        {agreements.map((agreement, index) => (
          <li
            key={index}
            className="flex items-center justify-between py-[var(--space-sm)] px-[var(--space-md)] hover:bg-secondary cursor-pointer"
          >
            <div>
              <p className="font-medium text-sm">{agreement.title}</p>
              <p className="text-xs text-muted">Tags: {agreement.tags.join(" · ")}</p>
              <p className="text-xs text-muted">Status: {agreement.status}</p>
            </div>
            <div className="flex items-center gap-[var(--space-md)]">
              <span className="text-xs text-muted">{agreement.risk}</span>
              <span className="text-xs text-muted">{agreement.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
