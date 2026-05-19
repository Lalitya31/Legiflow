'use client';
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";
import { useSidebar } from "../ui/sidebar";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const { state } = useSidebar();
    return (
        <Button 
            variant="outline" 
            className="w-full justify-center transition-all duration-150 ease-out cursor-pointer"
            onClick={toggleTheme}
        >
          {theme === 'light' ? (
            <>
                <Moon className="w-5 h-5" />
                <span className="group-data-[collapsible=icon]:hidden ml-[var(--space-sm)]">Dark Mode</span>
            </>
          ) : (
            <>
                <Sun className="w-5 h-5" />
                <span className="group-data-[collapsible=icon]:hidden ml-[var(--space-sm)]">Light Mode</span>
            </>
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
