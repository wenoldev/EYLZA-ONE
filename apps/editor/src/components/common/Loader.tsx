import { Loader2 } from "lucide-react"

const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[100px]">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  )
}

export default Loader
