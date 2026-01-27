

interface Theme {
  id: string
  name: string
  preview?: string
}

export default function ThemePreview({ theme }: { theme: Theme | null }) {
  if (!theme) return <div className="h-[30vh] border-b border-border bg-muted/50" />;

  return (
    <div className="h-[30vh] border-b border-border bg-muted/50 overflow-hidden">
      <div className="h-full flex items-center justify-center p-8">
        <div className="w-full h-full rounded-lg border border-border overflow-hidden shadow-sm bg-white">
          <img
            src={theme.preview || "/placeholder.svg"}
            alt={`${theme.name} preview`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}
