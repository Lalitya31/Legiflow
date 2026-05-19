
'use client';
import { useState, useEffect, useTransition } from 'react';
import { extractKeyTermsAndDates, ExtractKeyTermsAndDatesOutput } from '@/ai/flows/extract-key-terms-and-dates';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, CircleDollarSign, FileText, Users } from 'lucide-react';

interface KeyInfoViewProps {
  documentText: string;
}

const InfoCard = ({ title, icon, children }: { title: string; icon: React.ReactNode, children: React.ReactNode }) => (
    <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-[var(--space-sm)]">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
    </Card>
);

export function KeyInfoView({ documentText }: KeyInfoViewProps) {
  const [keyInfo, setKeyInfo] = useState<ExtractKeyTermsAndDatesOutput | null>(null);
  const [isLoading, startLoading] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (!documentText || keyInfo) return;
    startLoading(async () => {
      try {
        const result = await extractKeyTermsAndDates({ legalDocument: documentText });
        setKeyInfo(result);
      } catch (error) {
        console.error('Key Info Extraction Error:', error);
        toast({
          variant: 'destructive',
          title: 'Key Info Extraction Failed',
          description: 'Could not extract key information. Please try again later.',
        });
      }
    });
  }, [documentText, toast, keyInfo]);

  if (isLoading) {
    return (
        <div className="grid gap-[var(--space-lg)] md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
                <Card key={i} className="glass-card">
                    <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                    <CardContent><Skeleton className="h-20 w-full" /></CardContent>
                </Card>
            ))}
        </div>
    );
  }

  if (!keyInfo) {
    return <p className="text-muted-foreground text-center">No key information available.</p>;
  }

  return (
    <div className="space-y-[var(--space-2xl)]">
        <InfoCard title="Timeline" icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />} >
            {keyInfo.timeline.length > 0 ? (
                <ul className="space-y-[var(--space-lg)]">
                    {keyInfo.timeline.map((item, index) => (
                        <li key={index} className="flex items-start gap-[var(--space-lg)]">
                           <div className="flex-shrink-0 w-28 font-semibold text-accent">{item.date}</div>
                           <div className="relative flex-1 pb-[var(--space-lg)]">
                            <span className="absolute top-1 left-[-25px] h-full w-px bg-border"></span>
                            <span className="absolute top-1 left-[-29px] h-3 w-3 rounded-full bg-accent"></span>
                                <p className="text-sm">{item.description}</p>
                           </div>
                        </li>
                    ))}
                </ul>
            ) : <p className="text-sm text-muted-foreground">No timeline events found.</p>}
        </InfoCard>
    
        <div className="grid gap-[var(--space-2xl)] md:grid-cols-3">
            <InfoCard title="Key Terms" icon={<FileText className="h-4 w-4 text-muted-foreground" />}>
                {keyInfo.keyTerms.length > 0 ? (
                    <div className="flex flex-wrap gap-[var(--space-sm)]">
                        {keyInfo.keyTerms.map((term, index) => (
                            <p key={index} className="text-sm px-[var(--space-sm)] py-[var(--space-xs)] bg-secondary/50 rounded">{term}</p>
                        ))}
                    </div>
                ) : <p className="text-sm text-muted-foreground">No key terms found.</p>}
            </InfoCard>

            <InfoCard title="Parties Involved" icon={<Users className="h-4 w-4 text-muted-foreground" />}>
                 {keyInfo.parties.length > 0 ? (
                    <ul className="list-disc list-inside space-y-[var(--space-xs)]">
                        {keyInfo.parties.map((party, index) => (
                            <li key={index} className="text-sm">{party}</li>
                        ))}
                    </ul>
                ) : <p className="text-sm text-muted-foreground">No parties found.</p>}
            </InfoCard>
            
            <InfoCard title="Financial Amounts" icon={<CircleDollarSign className="h-4 w-4 text-muted-foreground" />}>
                 {keyInfo.financialAmounts.length > 0 ? (
                    <ul className="list-disc list-inside space-y-[var(--space-xs)]">
                        {keyInfo.financialAmounts.map((amount, index) => (
                            <li key={index} className="text-sm font-mono">{amount}</li>
                        ))}
                    </ul>
                ) : <p className="text-sm text-muted-foreground">No financial amounts found.</p>}
            </InfoCard>
        </div>
    </div>
  );
}
