'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, ShieldHalf, ShieldCheck } from 'lucide-react';

const highRiskAgreements = [
    { title: "Employment Contract", description: "Non-compete clause, unfair termination/bond", level: "High" },
    { title: "Rental / Lease Agreement", description: "Heavy penalty for late rent or landlord-biased clauses", level: "Medium" },
    { title: "Loan Agreement", description: "Hidden fees or exorbitant interest disguised as charges", level: "High" },
    { title: "Partnership Deed", description: "Ownership imbalance; exit restrictions", level: "High" },
    { title: "NDA / Confidentiality", description: "Overbroad silence clauses preventing whistleblowing", level: "High" },
    { title: "Franchise Agreement", description: "High compliance & royalty commitments", level: "High" },
    { title: "Shareholder / Subscription", description: "Voting imbalance; anti-dilution drawbacks", level: "High" },
    { title: "Joint Venture Agreement", description: "Unclear profit sharing; exit disputes", level: "High" },
    { title: "Service / Vendor / SLA", description: "One-sided penalty/liability clauses", level: "Medium" },
    { title: "Litigation Funding Agreement", description: "Third-party funding and enforcement risks", level: "High" },
    { title: "Anti-competitive Agreement", description: "Cartel, price fixing or market allocation", level: "High" },
    { title: "Prenuptial / Restrictive Marriage", description: "Often unenforceable / invalid clauses in India", level: "High" },
    { title: "Wagering / Restrictive Contracts", description: "Contracts against public policy (void)", level: "High" },
    { title: "Cross-Border Agreement", description: "Regulatory & enforcement complexity", level: "High" },
    { title: "Construction Contract", description: "Delay, cost-overrun & liability risks", level: "High" },
    { title: "Government Tender Contract", description: "Compliance, termination & blacklisting risk", level: "High" },
    { title: "Insurance Agreement", description: "Ambiguous terms may deny claims", level: "Medium" },
    { title: "Investment Agreement", description: "Fraud, mismanagement risk", level: "High" }
];

const riskStyles: { [key: string]: { badgeVariant: 'destructive' | 'default' | 'secondary', icon: React.ElementType, className?: string } } = {
    High: {
        badgeVariant: 'destructive',
        icon: ShieldAlert,
    },
    Medium: {
        badgeVariant: 'default',
        icon: ShieldHalf,
        className: 'bg-amber-500 text-black hover:bg-amber-600',
    },
    Safe: {
        badgeVariant: 'secondary',
        icon: ShieldCheck,
        className: 'bg-green-500 text-white hover:bg-green-600',
    }
}

const RiskCard = ({ title, description, level }: { title: string, description: string, level: 'High' | 'Medium' | 'Safe' }) => {
    const style = riskStyles[level];
    const Icon = style.icon;
    
    return (
        <Card className="glass-card">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <Badge variant={style.badgeVariant} className={style.className}>
                        <Icon className="h-4 w-4 mr-2" />
                        {level} Risk
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}

export default function RiskPage() {
    const agreements = [
        {
            name: "Employment Contract",
            risk: "HIGH RISK",
            issues: 3,
            lastAnalyzed: "May 18, 2026",
            details: [
                {
                    title: "Non-compete clause",
                    description: "Restricts employment within the same industry for 2 years post-exit.",
                    severity: "High",
                },
                {
                    title: "Forced arbitration",
                    description: "Waives right to court proceedings. Disputes resolved internally only.",
                    severity: "High",
                },
                {
                    title: "Early termination penalty",
                    description: "Penalty of 3 months salary applicable if contract broken early.",
                    severity: "Medium",
                },
            ],
        },
    ];

    const [selectedAgreement, setSelectedAgreement] = useState(agreements[0]);

    return (
        <main className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-lg)]">
            {/* Left Panel */}
            <div className="col-span-2">
                <ul className="divide-y divide-border-subtle">
                    {agreements.map((agreement, index) => (
                        <li
                            key={index}
                            className="py-[var(--space-sm)] px-[var(--space-md)] hover:bg-secondary cursor-pointer"
                            onClick={() => setSelectedAgreement(agreement)}
                        >
                            <div className="flex justify-between">
                                <p className="font-medium text-sm">{agreement.name}</p>
                                <p className="text-danger text-sm font-medium">{agreement.risk}</p>
                            </div>
                            <div className="flex justify-between text-xs text-muted">
                                <p>Detected issues: {agreement.issues}</p>
                                <p>Last analyzed: {agreement.lastAnalyzed}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right Panel */}
            <div className="col-span-1 space-y-[var(--space-md)]">
                <h2 className="font-serif text-[28px] font-normal leading-[1.15]">
                    {selectedAgreement.name}
                </h2>
                <p className="text-danger text-[11px] font-medium uppercase tracking-[0.08em]">
                    RISK LEVEL: {selectedAgreement.risk}
                </p>
                <div className="space-y-[var(--space-sm)]">
                    <p className="text-sm font-medium">Issues detected:</p>
                    <ul className="space-y-[var(--space-sm)]">
                        {selectedAgreement.details.map((issue, index) => (
                            <li
                                key={index}
                                className={`pl-[var(--space-sm)] border-l-2 ${
                                    issue.severity === "High"
                                        ? "border-danger"
                                        : "border-warning"
                                }`}
                            >
                                <p className="font-medium text-sm">{issue.title}</p>
                                <p className="text-xs text-muted">{issue.description}</p>
                                <p className="text-xs text-muted">Severity: {issue.severity}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </main>
    );
}
