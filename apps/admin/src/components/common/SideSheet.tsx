import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ShareableSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  resizable?: boolean;
}

export function SideSheet({ 
  children,
  isOpen,
  onOpenChange, 
  title, 
  description,
  resizable = false
}: ShareableSheetProps) {
  const [isFullWidth, setIsFullWidth] = React.useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent 
        className={cn(
          'overflow-auto px-4 transition-all duration-300 ease-in-out',
          isFullWidth ? 'sm:max-w-none w-full' : 'sm:max-w-md w-3/4'
        )}
      >
        <SheetHeader className="relative pr-12">
          <div className="flex flex-col space-y-1.5">
            <SheetTitle>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </div>
          
          {resizable && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-8 top-0 h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setIsFullWidth(!isFullWidth)}
              title={isFullWidth ? "Minimize" : "Maximize"}
            >
              {isFullWidth ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          )}
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}

