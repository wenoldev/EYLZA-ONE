import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function UpgradeCard() {
  return (
    <Card className="relative overflow-hidden md:col-span-12 lg:col-span-4">
      {/* gradient overlay exactly like original */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 opacity-90" />
      <div className="relative h-full flex flex-col justify-between text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Upgrade to Pro</CardTitle>
          <CardDescription className="text-blue-100">Unlock premium features and advanced analytics</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-between">
          <ul className="space-y-3">
            {["Real-time analytics", "Advanced reporting", "AI-powered insights", "Priority support"].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <div className="text-3xl font-bold">$29</div>
            <div className="text-sm text-blue-100">per month</div>
          </div>
          <Button className="mt-6 w-full bg-white text-blue-600 hover:bg-blue-50" size="lg">
            Upgrade Now
          </Button>
        </CardContent>
      </div>
    </Card>
  )
}
