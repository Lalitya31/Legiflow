'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CaseRecord } from "@/lib/dashboard-data";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CaseTimelineProps {
    cases: CaseRecord[];
}

export function CaseTimeline({ cases }: CaseTimelineProps) {
    if (cases.length === 0) {
        return (
            <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                    <CardTitle>Case Progress</CardTitle>
                </CardHeader>
                <CardContent className="py-[var(--space-2xl)] text-center text-muted-foreground">
                    No cases available for tracking.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
                <CardTitle>Detailed Case Tracking</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-[var(--space-md)]">
                    <div className="space-y-[var(--space-2xl)]">
                        {cases.map((record) => (
                            <div key={record.id} className="p-[var(--space-lg)] border rounded bg-card/50 cursor-pointer transition-all duration-150 ease-out hover:bg-card">
                                <div className="flex flex-col md:flex-row justify-between mb-[var(--space-lg)] gap-[var(--space-sm)] md:gap-0">
                                    <div>
                                        <h4 className="font-semibold">{record.title}</h4>
                                        <div className="flex gap-[var(--space-sm)] mt-[var(--space-xs)]">
                                            <Badge variant="outline" className="text-xs">{record.id}</Badge>
                                            <Badge variant={record.status === 'Open' ? 'default' : record.status === 'Closed' ? 'secondary' : 'destructive'} className="text-xs">
                                                {record.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col justify-center">
                                        <div className="text-sm font-medium mb-[var(--space-xs)]">{record.progress}% Completed</div>
                                        <Progress value={record.progress} className="w-[120px] h-2" />
                                    </div>
                                </div>

                                {/* Timeline Stepper */}
                                <div className="relative pt-[var(--space-sm)]">
                                    {/* Timeline line */}
                                    <div className="absolute top-[18px] left-[14px] right-[14px] h-[2px] bg-muted z-0 hidden md:block"></div>
                                    
                                    <div className="flex flex-col md:flex-row justify-between gap-[var(--space-lg)] relative z-10">
                                        {record.milestones.map((milestone, idx) => (
                                            <div key={idx} className="flex md:flex-col items-center gap-[var(--space-md)] md:gap-[var(--space-sm)] text-center group">
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center bg-background border-2 ${milestone.completed ? 'border-primary text-primary' : 'border-muted-foreground text-muted-foreground'} transition-all duration-150 ease-out`}>
                                                    {milestone.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-3 h-3" />}
                                                </div>
                                                <div className="text-left md:text-center shrink-0">
                                                    <p className={`text-xs font-medium ${milestone.completed ? 'text-foreground' : 'text-muted-foreground'}`}>{milestone.name}</p>
                                                    {milestone.date && <p className="text-[10px] text-muted-foreground">{new Date(milestone.date).toLocaleDateString()}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
