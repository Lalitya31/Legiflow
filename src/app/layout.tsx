'use client';

import './globals.css';
import { useEffect } from 'react';
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

const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/analyze', icon: FileUp, label: 'Upload Documents' },
    { href: '/samples', icon: FileCheck, label: 'Sample Agreements' },
    { href: '/agreements', icon: FileText, label: 'Agreements' },
    { href: '/risk', icon: ShieldAlert, label: 'High-Risk Agreements' },
    { href: '/reference', icon: Book, label: 'Legal Reference' },
    { href: '/search', icon: FileQuestion, label: 'Clause Search' },
    { href: '/compare', icon: BarChart, label: 'Compare' },
];

function AppHeader() {
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();

    const pageTitle = navItems.find(item => pathname.startsWith(item.href))?.label || 'LegiFlow';

    return (
        <header className="fixed left-0 right-0 top-0 h-13 flex items-center justify-between px-5 z-30 backdrop-blur-md bg-background/30">
            <div className="text-sm font-medium text-foreground">{pageTitle}</div>
            <div className="flex items-center gap-5">
                <button className="hover:bg-foreground/10 p-2 rounded-full">
                    <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M15 11a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                </button>
                <button onClick={toggleTheme} className="hover:bg-foreground/10 p-2 rounded-full">
                    {theme === 'dark' ? '🌙' : '☀️'}
                </button>
                <button className="hover:bg-foreground/10 p-2 rounded-full">
                    <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20h.01M12 4h.01"></path>
                    </svg>
                </button>
                <button className="hover:bg-foreground/10 p-2 rounded-full">
                    <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M12 4h.01"></path>
                    </svg>
                </button>
                <div className="w-7 h-7 bg-secondary text-primary flex items-center justify-center rounded-full">LL</div>
                <button className="hover:bg-foreground/10 p-2 rounded-full">
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
                <aside className="w-64 flex-col fixed h-full p-3 bg-gradient-to-b from-card/60 to-card/20 border-r border-border/50">
                    <nav className="flex-grow space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    pathname === item.href
                                        ? 'bg-gradient-to-r from-sky-500/10 to-purple-500/10 text-accent-foreground'
                                        : 'text-muted-foreground hover:bg-card hover:text-foreground'
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>
                <main className="flex-1 ml-64 p-7 overflow-y-auto">
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

