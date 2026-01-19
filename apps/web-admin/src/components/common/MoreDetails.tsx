
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { Order } from "@/types/api"

interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  product_name: string
  custom_data: Array<{
    type: "text" | "image"
    content: string
  }>
}

interface MoreDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order
}

export function MoreDetailsDialog({ open, onOpenChange, order }: MoreDetailsDialogProps) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrderItems = async () => {
      if (open && order) {
        setLoading(true)
        try {
          // const response = await fetchById<OrderItem>("order_items", order.id, "order_id")
          const response = {success:false,data:[]}
          if (response.success) {
            setOrderItems(response.data)
          }
        } catch (error) {
          console.error("Failed to fetch order items:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchOrderItems()
  }, [open, order])

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[60vh]">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <span className="font-medium">Order ID:</span>
              <span>{order.id}</span>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <span className="font-medium">Store ID:</span>
              <span>{order.store_id}</span>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <span className="font-medium">Customer ID:</span>
              <span>{order.customer_id}</span>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <span className="font-medium">Payment ID:</span>
              <span>{order.payment_id || "N/A"}</span>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <span className="font-medium">Payment Status:</span>
              <Badge variant="outline">{order.payment_status}</Badge>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <span className="font-medium">Order Status:</span>
              <Badge variant="outline">{order.status}</Badge>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <span className="font-medium">Total Price:</span>
              <span>${order.total_price.toFixed(2)}</span>
            </div>
            <div className="col-span-2">
              <h3 className="font-medium mb-2">Order Items:</h3>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <ul className="space-y-4">
                  {orderItems.map((item) => (
                    <li key={item.id} className="border p-4 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{item.product_name}</span>
                        <span>Quantity: {item.quantity}</span>
                      </div>
                      <div className="mb-2">Price: ${item.price.toFixed(2)}</div>
                      {item.custom_data && (
                        <div className="mt-2">
                          <h4 className="font-medium mb-1">Custom Data:</h4>
                          <div className="space-y-2">
                            {item.custom_data.map((data, index) => (
                              <div key={index}>
                                {data.type === "text" ? (
                                  <p>{data.content}</p>
                                ) : (
                                  <img
                                    src={data.content || "/placeholder.svg"}
                                    alt={`Custom image ${index + 1}`}
                                    width={100}
                                    height={100}
                                    className="rounded-md"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

