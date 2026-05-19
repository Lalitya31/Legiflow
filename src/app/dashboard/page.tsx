import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { mockDashboardCases, getStats, getCasesPerMonth, getStatusDistribution, CaseType, CaseStatus } from "@/lib/dashboard-data";
import { DashboardStats } from "@/components/legiflow/dashboard-stats";
import { CasesPerMonthChart, CaseStatusChart } from "@/components/legiflow/dashboard-charts";
import { CaseTimeline } from "@/components/legiflow/case-timeline";

export default function DashboardPage() {
    const [selectedType, setSelectedType] = useState<CaseType | 'All'>('All');
    const [selectedStatus, setSelectedStatus] = useState<CaseStatus | 'All'>('All');
    const recentActivity = [
        { icon: '📄', title: 'NDA analyzed', time: '2 hours ago', detail: '3 high-risk clauses detected' },
        { icon: '🔍', title: 'Clause search: "termination"', time: 'Yesterday', detail: 'Found in Employment Agreement' },
        { icon: '📋', title: 'IPC Section 302 viewed', time: '2 days ago', detail: '' },
    ];

    // Filter pipeline
    const filteredCases = useMemo(() => {
        let cases = mockDashboardCases;
        if (selectedType !== 'All') cases = cases.filter(c => c.type === selectedType);
        if (selectedStatus !== 'All') cases = cases.filter(c => c.status === selectedStatus);
        return cases;
    }, [selectedType, selectedStatus]);

    // Data Aggregation
    const stats = useMemo(() => getStats(filteredCases), [filteredCases]);
    const monthlyData = useMemo(() => getCasesPerMonth(filteredCases), [filteredCases]);
    const distributionData = useMemo(() => getStatusDistribution(filteredCases), [filteredCases]);

    // Generate a simple Smart Insight
    const insightText = useMemo(() => {
        if (filteredCases.length === 0) return "No data available for the current filters.";
        if (stats.pending > 0) return `You currently have ${stats.pending} pending cases requiring attention.`;
        if (stats.open > 0) return `You have ${stats.open} active cases progressing normally.`;
        return `All filtered cases are closed. Great job!`;
    }, [stats, filteredCases]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-[var(--space-lg)]">
            {/* Left Column */}
            <div className="col-span-3 space-y-[var(--space-lg)]">
                {/* Hero Section */}
                <section>
                    <h1 className="font-serif text-[40px] font-normal leading-[1.15] tracking-[-0.02em]">
                        Understand Legal Documents Clearly.
                    </h1>
                    <p className="text-muted mt-[var(--space-sm)]">
                        Upload agreements, identify risky clauses, and explore Indian law in plain language.
                    </p>
                    <button className="mt-[var(--space-md)] bg-primary text-primary-foreground px-[var(--space-lg)] py-[var(--space-sm)] rounded transition-all duration-150 ease-out cursor-pointer hover:bg-primary/90">
                        Upload a Document
                    </button>
                </section>

                {/* Recent Legal Activity */}
                <section>
                    <h2 className="font-sans text-[18px] font-medium leading-[1.3] mb-[var(--space-sm)]">Recent Legal Activity</h2>
                    {recentActivity.length > 0 ? (
                        <ul className="space-y-[var(--space-sm)]">
                            {recentActivity.map((activity, index) => (
                                <li key={index} className="flex items-start gap-[var(--space-sm)]">
                                    <span className="text-lg">{activity.icon}</span>
                                    <div>
                                        <p className="font-medium text-sm">{activity.title}</p>
                                        <p className="text-muted text-xs">{activity.detail}</p>
                                        <p className="text-muted text-xs">{activity.time}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted">Your legal activity will appear here.</p>
                    )}
                </section>
            </div>

            {/* Right Column */}
            <div className="col-span-2">
                <h2 className="font-sans text-[18px] font-medium leading-[1.3] mb-[var(--space-sm)]">Quick Actions</h2>
                <ul className="space-y-[var(--space-sm)]">
                    <li className="flex justify-between items-center">
                        <a href="/upload" className="text-primary hover:underline">Upload Document</a>
                        <span className="text-muted">→</span>
                    </li>
                    <li className="flex justify-between items-center">
                        <a href="/search" className="text-primary hover:underline">Search Clauses</a>
                        <span className="text-muted">→</span>
                    </li>
                    <li className="flex justify-between items-center">
                        <a href="/browse" className="text-primary hover:underline">Browse IPC</a>
                        <span className="text-muted">→</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
