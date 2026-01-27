import { Skeleton } from '@/components/ui/skeleton'

function PageSkeleton() {
  return (
    <div className='flex flex-col gap-2'>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
    </div>
  )
}

export default PageSkeleton