
'use client';
import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { LoaderCircle, Search } from 'lucide-react';
import { motion } from "framer-motion";
import { searchClauses } from '@/ai/flows/search-clauses';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [documentText, setDocumentText] = useState('');
    const [results, setResults] = useState<string[]>([]);
    const [isSearching, startSearching] = useTransition();
    const { toast } = useToast();

    const handleSearch = () => {
        if (!query.trim() || !documentText.trim()) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please provide both a document and a search query.',
            });
            return;
        }

        startSearching(async () => {
            try {
                const response = await searchClauses({ documentText, query });
                setResults(response.clauses);
            } catch (error) {
                console.error('Search error:', error);
                toast({
                    variant: 'destructive',
                    title: 'Search Failed',
                    description: 'Could not perform the search. Please try again.',
                });
            }
        });
    };

    return (
        <main>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">🔍 Clause Search</CardTitle>
                        <CardDescription>Find specific clauses within any legal document.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-[var(--space-2xl)]">
                            <div>
                                <h3 className="font-semibold mb-[var(--space-sm)]">Document Text</h3>
                                <Textarea
                                    placeholder="Paste the full text of the legal document here..."
                                    value={documentText}
                                    onChange={(e) => setDocumentText(e.target.value)}
                                    className="min-h-80 text-sm bg-background/80 transition-all duration-150 ease-out"
                                    disabled={isSearching}
                                />
                            </div>
                             <div>
                                <h3 className="font-semibold mb-[var(--space-sm)]">Search Query & Results</h3>
                               <div className="flex items-center gap-[var(--space-sm)] mb-[var(--space-lg)]">
                                    <Input 
                                        type="text" 
                                        placeholder="e.g. 'Termination for cause'" 
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        disabled={isSearching}
                                        className="transition-all duration-150 ease-out"
                                    />
                                    <Button onClick={handleSearch} disabled={isSearching} className="transition-all duration-150 ease-out cursor-pointer">
                                        {isSearching ? <LoaderCircle className="animate-spin" /> : <Search />}
                                        <span className="ml-2 hidden sm:inline">Search</span>
                                    </Button>
                                </div>
                                <div className="space-y-[var(--space-lg)] h-80 overflow-y-auto pr-[var(--space-sm)] border rounded p-[var(--space-lg)] bg-muted/40">
                                    {isSearching ? (
                                        <div className="flex items-center justify-center h-full">
                                            <LoaderCircle className="w-8 h-8 animate-spin text-ring" />
                                        </div>
                                    ) : results.length > 0 ? (
                                        results.map((clause, index) => (
                                            <Card key={index} className="p-[var(--space-lg)] bg-background cursor-pointer transition-all duration-150 ease-out hover:bg-card">
                                                <p className="text-sm">{clause}</p>
                                            </Card>
                                        ))
                                    ) : (
                                        <div className="text-center text-muted-foreground pt-[var(--space-2xl)]">
                                            <p>Results will be displayed here.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </main>
    )
}
