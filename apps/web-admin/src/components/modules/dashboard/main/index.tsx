import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/common/StatCard"
import { UpgradeCard } from "@/components/common/UpgradeCard"
import { DollarSign, ShoppingCart, Users } from "lucide-react"
import { ResponsiveContainer, LineChart, Line } from "recharts"
import { Link } from "react-router-dom"

const lineData = [
  { month: "Jan", revenue: 420, orders: 20 },
  { month: "Feb", revenue: 680, orders: 34 },
  { month: "Mar", revenue: 530, orders: 29 },
  { month: "Apr", revenue: 910, orders: 41 },
  { month: "May", revenue: 760, orders: 37 },
  { month: "Jun", revenue: 660, orders: 33 },
]

const invoices = [
  {
    no: 1,
    id: "#8545",
    customer: "Jane Cooper",
    city: "Sydney",
    date: "01 Oct 11:29 am",
    status: "Paid",
    amount: "$84",
  },
  {
    no: 2,
    id: "#5412",
    customer: "Wade Warren",
    city: "Perth",
    date: "01 Oct 11:45 am",
    status: "Paid",
    amount: "$557",
  },
  {
    no: 3,
    id: "#6822",
    customer: "Jenny Wilson",
    city: "Darwin",
    date: "01 Oct 12:10 pm",
    status: "Pending",
    amount: "$156",
  },
]

export default function DashboardPage() {
  return (
    <main className="min-h-screen w-full p-4 md:p-8 space-y-6">
      {/* Top stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Revenue"
          value="$25,565"
          change="+12%"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Orders"
          value="456"
          change="+8%"
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Customers"
          value="7,956"
          change="+5%"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Charts + Upgrade */}
      <div className="grid gap-4 md:grid-cols-12">
        <Card className="md:col-span-12 lg:col-span-8">
          <CardHeader>
            <CardTitle>Revenue vs Orders</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <Line type="monotone" dataKey="revenue" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="orders" stroke="var(--color-chart-3)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <UpgradeCard />
      </div>

      {/* Recent orders (limited table with fade + "See all") */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest activity</CardDescription>
          </div>
          <Button variant="secondary">Filter</Button>
        </CardHeader>
        <CardContent className="relative overflow-hidden">
          <div className="max-h-64 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground">
                <tr className="text-left">
                  <th className="py-2 pr-4">No.</th>
                  <th className="py-2 pr-4">Id Customer</th>
                  <th className="py-2 pr-4">Customer Name</th>
                  <th className="py-2 pr-4">City</th>
                  <th className="py-2 pr-4">Order Date</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-0">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((i) => (
                  <tr key={i.id} className="border-t">
                    <td className="py-2 pr-4">{i.no}.</td>
                    <td className="py-2 pr-4">{i.id}</td>
                    <td className="py-2 pr-4">{i.customer}</td>
                    <td className="py-2 pr-4">{i.city}</td>
                    <td className="py-2 pr-4">{i.date}</td>
                    <td className="py-2 pr-4">{i.status}</td>
                    <td className="py-2 pr-0">{i.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pointer-events-none absolute bottom-12 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
          <div className="mt-4 flex justify-end">
            <Button asChild>
              <Link to="orders">See all</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
