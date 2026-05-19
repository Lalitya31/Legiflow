
'use client';
import { useState, useTransition, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { answerContractQuestion, AnswerContractQuestionOutput } from '@/ai/flows/answer-contract-questions';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle, Send, User, Bot, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QaViewProps {
  documentText: string;
}

interface Message {
    sender: 'user' | 'bot';
    content: React.ReactNode;
}

export function QaView({ documentText }: QaViewProps) {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isAnswering, startAnswering] = useTransition();
    const { toast } = useToast();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const handleAskQuestion = () => {
        if (!question.trim()) return;

        const userMessage: Message = { sender: 'user', content: <p>{question}</p> };
        setMessages(prev => [...prev, userMessage]);
        
        startAnswering(async () => {
            try {
                const result = await answerContractQuestion({ contractText: documentText, question });
                const botMessage: Message = { sender: 'bot', content: <BotAnswer result={result} /> };
                setMessages(prev => [...prev, botMessage]);
            } catch (error) {
                console.error('Q&A Error:', error);
                const errorMessage: Message = { sender: 'bot', content: <p className="text-destructive">Sorry, I couldn't answer that question. Please try rephrasing it.</p> };
                setMessages(prev => [...prev, errorMessage]);
                toast({
                  variant: 'destructive',
                  title: 'Answer Failed',
                  description: 'An error occurred while getting the answer.',
                });
            }
        });

        setQuestion('');
    };
    
    return (
        <Card className="h-[70vh] flex flex-col">
            <CardHeader>
                <CardTitle>Interactive Q&A</CardTitle>
                <CardDescription>Ask specific questions about your document.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
                <ScrollArea className="h-full pr-[var(--space-md)]" ref={scrollAreaRef}>
                    <div className="space-y-[var(--space-2xl)]">
                        {messages.length === 0 ? (
                            <div className="text-center text-muted-foreground py-[var(--space-2xl)]">
                                <Bot className="mx-auto h-12 w-12 mb-[var(--space-lg)]" />
                                <p>I'm ready to answer your questions.</p>
                                <p className="text-sm">e.g., "What is the penalty for early termination?"</p>
                            </div>
                        ) : (
                             messages.map((msg, index) => (
                                <div key={index} className={`flex items-start gap-[var(--space-md)] ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                    {msg.sender === 'bot' && <div className="p-[var(--space-sm)] bg-primary rounded text-primary-foreground"><Bot className="h-5 w-5 flex-shrink-0" /></div>}
                                    <div className={`p-[var(--space-md)] rounded max-w-[80%] ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        {msg.content}
                                    </div>
                                    {msg.sender === 'user' && <div className="p-[var(--space-sm)] bg-muted rounded text-foreground"><User className="h-5 w-5 flex-shrink-0" /></div>}
                                </div>
                            ))
                        )}
                        {isAnswering && (
                             <div className="flex items-start gap-[var(--space-md)]">
                                <div className="p-[var(--space-sm)] bg-primary rounded text-primary-foreground"><Bot className="h-5 w-5 flex-shrink-0" /></div>
                                <div className="p-[var(--space-md)] rounded bg-muted">
                                    <LoaderCircle className="h-5 w-5 animate-spin" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="border-t pt-[var(--space-lg)]">
                 <div className="flex w-full items-center gap-[var(--space-sm)]">
                    <Input
                        type="text"
                        placeholder="e.g., 'What happens if I pay rent late?'"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                        disabled={isAnswering}
                        className="bg-transparent"
                    />
                    <Button onClick={handleAskQuestion} disabled={isAnswering || !question.trim()}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Ask</span>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}

const BotAnswer = ({ result }: { result: AnswerContractQuestionOutput }) => (
    <div className="space-y-[var(--space-md)] text-sm">
        <p>{result.answer}</p>
        <div>
            <div className="flex justify-between items-center mb-[var(--space-xs)]">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground">Confidence</h4>
                <span className="text-sm font-medium">{Math.round(result.confidence * 100)}%</span>
            </div>
            <Progress value={result.confidence * 100} className="h-2" />
        </div>
        {result.sources && result.sources.length > 0 && (
            <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-[var(--space-md)] flex items-center gap-[var(--space-sm)]"><FileText className="h-4 w-4" /> Sources</h4>
                <div className="space-y-[var(--space-md)]">
                    {result.sources.map((source, i) => (
                        <p key={i} className="text-xs p-[var(--space-sm)] bg-background/50 border rounded text-muted-foreground italic">"{source}"</p>
                    ))}
                </div>
            </div>
        )}
    </div>
);
