import { Skeleton } from "@/components/ui/skeleton"

export function EditorSkeleton() {
  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      {/* Top Bar Skeleton */}
      <div className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-24 hidden sm:block" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar Skeleton */}
        <div className="flex w-16 flex-col items-center border-r border-border bg-card py-4 gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>

        {/* Left Panel (e.g. Layers) Skeleton - Optional, but good to show */}
        <div className="w-72 border-r border-border bg-card flex flex-col p-4 gap-4 hidden lg:flex">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-4" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>

        {/* Canvas/Playground Skeleton */}
        <div className="flex-1 bg-muted/20 p-8 flex items-center justify-center">
          <div className="w-full max-w-4xl space-y-4">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>

        {/* Right Sidebar Skeleton */}
        <div className="w-80 border-l border-border bg-card flex flex-col p-4 gap-6 hidden lg:flex">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-4" />
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
