import "./ShadeLoader.css";

export default function StorefrontLoader() {
  return (
    <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-sm">
      <div className="min-h-screen animate-pulse">
        {/* Header */}
        <div className="border-b border-border/40 bg-background px-6 py-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="h-8 w-32 rounded-lg shimmer bg-muted/40" />
            <div className="h-10 w-[40%] rounded-xl shimmer bg-muted/30" />
            <div className="flex gap-3">
              <div className="h-9 w-9 rounded-full shimmer bg-muted/30" />
              <div className="h-9 w-9 rounded-full shimmer bg-muted/30" />
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="h-48 w-full rounded-3xl shimmer bg-muted/30 mb-8" />

          {/* Categories */}
          <div className="mb-8 flex gap-3 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-24 rounded-full shimmer bg-muted/30"
              />
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/30 p-3"
              >
                <div className="aspect-square w-full rounded-xl shimmer bg-muted/30 mb-3" />
                <div className="h-4 w-3/4 rounded-full shimmer bg-muted/30 mb-2" />
                <div className="h-3 w-1/2 rounded-full shimmer bg-muted/20 mb-3" />
                <div className="flex items-center justify-between">
                  <div className="h-4 w-16 rounded-full shimmer bg-muted/30" />
                  <div className="h-8 w-20 rounded-lg shimmer bg-muted/30" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}