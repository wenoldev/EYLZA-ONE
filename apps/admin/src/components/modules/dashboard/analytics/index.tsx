
import { Suspense } from "react"
import Loader from "@/components/common/Loader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/common/StatCard"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { DollarSign, ShoppingCart, Users, Box, Package, ArrowDownCircle } from "lucide-react"

// Mock analytics data
const analytics = {
  revenue: [
    { month: "Jan", amount: 12000 },
    { month: "Feb", amount: 15400 },
    { month: "Mar", amount: 13800 },
    { month: "Apr", amount: 18200 },
    { month: "May", amount: 16500 },
    { month: "Jun", amount: 17600 },
  ],
  orders: [
    { date: "01", count: 25 },
    { date: "05", count: 31 },
    { date: "10", count: 28 },
    { date: "15", count: 42 },
    { date: "20", count: 33 },
    { date: "25", count: 36 },
  ],
  categoryRevenue: [
    { category: "Women", amount: 42000 },
    { category: "Home", amount: 26000 },
    { category: "Men", amount: 24000 },
    { category: "Wellness", amount: 16000 },
  ],
  funnel: [
    { stage: "Visits", value: 12000 },
    { stage: "Product Views", value: 8500 },
    { stage: "Add to Cart", value: 4900 },
    { stage: "Checkout", value: 3000 },
    { stage: "Purchased", value: 2100 },
  ],
  topProducts: [
    { product: "Speed Force - Knit", sales: 935 },
    { product: "Assorted Cross Bag", sales: 731 },
    { product: "Fur Pom Pom Gloves", sales: 520 },
    { product: "Happy Days Candle", sales: 415 },
  ],
  customers: { new: 820, repeat: 410 },
  inventory: { lowStock: 14, outOfStock: 6, totalSkus: 248 },
  refunds: 18,
}

const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)"]

export default function AnalyticsPage() {
  const totalRevenue = analytics.revenue.reduce((a, b) => a + b.amount, 0)
  const totalOrders = analytics.orders.reduce((a, b) => a + b.count, 0)

  return (
    <Suspense fallback={<Loader />}>
      <div className="flex min-h-screen w-full flex-col gap-6 p-4 md:p-8">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            change="+12%"
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Orders"
            value={`${totalOrders}`}
            change="+8%"
            icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Customers"
            value={`${analytics.customers.new + analytics.customers.repeat}`}
            change="+5%"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Active Products"
            value={`${analytics.inventory.totalSkus}`}
            change="-2%"
            icon={<Box className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Refunds"
            value={`${analytics.refunds}`}
            change="-1%"
            icon={<ArrowDownCircle className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        {/* Revenue Bar only */}
        <div className="grid gap-4 md:grid-cols-12">
          <Card className="md:col-span-12 lg:col-span-8">
            <CardHeader>
              <CardTitle>Revenue Summary</CardTitle>
              <CardDescription>Monthly revenue overview</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.revenue}>
                  <Bar dataKey="amount" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Insights card */}
          <Card className="md:col-span-12 lg:col-span-4">
            <CardHeader>
              <CardTitle>Quick Insights</CardTitle>
              <CardDescription>This month so far</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mini sparkline for revenue trend */}
              <div className="h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.revenue}>
                    <Line type="monotone" dataKey="amount" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* KPI rows */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Avg order value</span>
                  <span className="font-medium">
                    {`$${Math.round(totalRevenue / Math.max(totalOrders, 1)).toLocaleString()}`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">MoM revenue change</span>
                  {(() => {
                    // Simple MoM comparison using last 2 data points
                    const len = analytics.revenue.length
                    const prev = analytics.revenue[len - 2]?.amount ?? 1
                    const curr = analytics.revenue[len - 1]?.amount ?? prev
                    const pct = Math.round(((curr - prev) / Math.max(prev, 1)) * 100)
                    const sign = pct >= 0 ? "+" : ""
                    return (
                      <span
                        className={
                          pct >= 0
                            ? "text-emerald-600 dark:text-emerald-400 font-medium"
                            : "text-red-600 dark:text-red-400 font-medium"
                        }
                      >
                        {`${sign}${pct}%`}
                      </span>
                    )
                  })()}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Conversion rate</span>
                  <span className="font-medium">
                    {`${((analytics.funnel[analytics.funnel.length - 1].value / analytics.funnel[0].value) * 100).toFixed(1)}%`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Line + Category Pie */}
        <div className="grid gap-4 md:grid-cols-12">
          <Card className="md:col-span-12 lg:col-span-8">
            <CardHeader>
              <CardTitle>Orders Overview</CardTitle>
              <CardDescription>Orders per day</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.orders}>
                  <Line type="monotone" dataKey="count" stroke="var(--color-chart-2)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="md:col-span-12 lg:col-span-4">
            <CardHeader>
              <CardTitle>Revenue by Category</CardTitle>
              <CardDescription>Distribution of sales</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={analytics.categoryRevenue}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {analytics.categoryRevenue.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Funnel + Top Products */}
        <div className="grid gap-4 md:grid-cols-12">
          <Card className="md:col-span-12 lg:col-span-6">
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>Track customer journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.funnel.map((stage, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{stage.stage}</span>
                      <span className="font-medium">{stage.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${(stage.value / analytics.funnel[0].value) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-12 lg:col-span-6">
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Best sellers this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics.topProducts.map((p) => (
                <div key={p.product} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{p.product}</p>
                    <p className="text-xs text-muted-foreground">{p.sales} sales</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">In stock</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Customer Insights + Inventory */}
        <div className="grid gap-4 md:grid-cols-12">
          <Card className="md:col-span-6">
            <CardHeader>
              <CardTitle>Customer Insights</CardTitle>
              <CardDescription>Behavior analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium">New Customers</p>
                  <p className="text-2xl font-bold">{analytics.customers.new}</p>
                  <p className="text-xs text-muted-foreground">vs last month</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Repeat Customers</p>
                  <p className="text-2xl font-bold">{analytics.customers.repeat}</p>
                  <p className="text-xs text-muted-foreground">vs last month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-6">
            <CardHeader>
              <CardTitle>Inventory Summary</CardTitle>
              <CardDescription>Stock levels & alerts</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <InventoryBox
                label="Low Stock"
                value={analytics.inventory.lowStock}
                note="Check urgently"
                highlight="yellow"
              />
              <InventoryBox
                label="Out of Stock"
                value={analytics.inventory.outOfStock}
                note="Restock needed"
                highlight="red"
              />
              <InventoryBox label="Total SKUs" value={analytics.inventory.totalSkus} note="All items" />
            </CardContent>
          </Card>
        </div>
      </div>
    </Suspense>
  )
}

function InventoryBox({
  label,
  value,
  note,
  highlight,
}: { label: string; value: number; note: string; highlight?: "yellow" | "red" }) {
  const color = highlight === "red" ? "text-destructive" : highlight === "yellow" ? "text-chart-4" : "text-foreground"
  return (
    <div>
      <div className="flex justify-between">
        <p className="text-sm font-medium">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
      <p className="text-xs text-muted-foreground">{note}</p>
    </div>
  )
}
