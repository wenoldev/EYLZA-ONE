/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react"
import { SideSheet } from "@/components/common/SideSheet"
// import { Badge } from "@/components/ui/badge"

interface OrderDetailsSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  order: any | null
  onStatusChange?: (orderId: string, status: string) => void
  onPaymentStatusChange?: (orderId: string, paymentStatus: string) => void
}

export const OrderDetailsSheet: React.FC<OrderDetailsSheetProps> = ({
  isOpen,
  onOpenChange,
  order,
  onStatusChange,
  onPaymentStatusChange,
}) => {
  if (!order) return null

  // const getStatusBadge = (status: string) => {
  //   const map: Record<string, string> = {
  //     pending: "bg-yellow-100 text-yellow-800",
  //     confirmed: "bg-blue-100 text-blue-800",
  //     processing: "bg-purple-100 text-purple-800",
  //     shipped: "bg-indigo-100 text-indigo-800",
  //     delivered: "bg-green-100 text-green-800",
  //     cancelled: "bg-red-100 text-red-800",
  //     refunded: "bg-gray-100 text-gray-800",
  //   }
  //   return (
  //     <Badge className={map[status] ?? "bg-gray-100 text-gray-800"}>
  //       {status}
  //     </Badge>
  //   )
  // }

  // const getPaymentStatusBadge = (status: string) => {
  //   const map: Record<string, string> = {
  //     pending: "bg-yellow-100 text-yellow-800",
  //     paid: "bg-green-100 text-green-800",
  //     failed: "bg-red-100 text-red-800",
  //     refunded: "bg-gray-100 text-gray-800",
  //   }
  //   return (
  //     <Badge className={map[status] ?? "bg-gray-100 text-gray-800"}>
  //       {status}
  //     </Badge>
  //   )
  // }

  return (
    <SideSheet
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={order ? "Order Details" : "Order Details"}
    >
      {order && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Order #{order.id.slice(-8)}</h3>
            <p className="text-sm text-gray-500">
              Created on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer</label>
              <div className="mt-1">
                <p className="font-medium">{order.customer_name}</p>
                <p className="text-sm text-gray-500">{order.customer_email}</p>
                {order.customer_phone && (
                  <p className="text-sm text-gray-500">{order.customer_phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={order.status}
                  onChange={(e) => onStatusChange?.(order.id, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                <select
                  value={order.payment_status}
                  onChange={(e) => onPaymentStatusChange?.(order.id, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Order Items</label>
              <div className="mt-2 space-y-2">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.product?.name || "Product"}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {order.currency} {item.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.currency} {item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>
                    {order.currency} {order.subtotal.toFixed(2)}
                  </span>
                </div>
                {order.tax_amount > 0 && (
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>
                      {order.currency} {order.tax_amount.toFixed(2)}
                    </span>
                  </div>
                )}
                {order.shipping_amount > 0 && (
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>
                      {order.currency} {order.shipping_amount.toFixed(2)}
                    </span>
                  </div>
                )}
                {order.discount_amount > 0 && (
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>
                      -{order.currency} {order.discount_amount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>
                    {order.currency} {order.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SideSheet>
  )
}
