const StoreSwitcherSkeleton = () => {
  return (
    <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gray-300 animate-pulse" />
            <div className="flex flex-col gap-1">
              <div className="w-24 h-3 bg-gray-300 rounded animate-pulse" />
              <div className="w-16 h-2 bg-gray-200 rounded animate-pulse" />
            </div>
    </div>
  )
}

export default StoreSwitcherSkeleton