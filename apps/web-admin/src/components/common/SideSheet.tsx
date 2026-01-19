import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface ShareableSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
}

export function SideSheet({ 
  children,
  isOpen,
  onOpenChange, 
  title, 
  description 
}: ShareableSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className='overflow-auto px-4'>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {children}
        </div>
        {/* <SheetFooter>
          <Button onClick={handleSubmit}>Submit</Button>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  )
}

