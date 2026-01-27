"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { useAuthStore } from "@/stores/authStore"
import { toast } from "sonner"
import api from "@/lib/api"

export function NotificationSettings() {
    const { user } = useAuthStore()
    const [isUpdating, setIsUpdating] = useState(false)

    const [emailNotifications, setEmailNotifications] = useState(true)
    const [orderUpdates, setOrderUpdates] = useState(true)
    const [marketingEmails, setMarketingEmails] = useState(false)

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.id) return
            try {
                const response = await api.get(`/api/v1/users/${user.id}`)
                if (response.data.data?.user) {
                    const u = response.data.data.user
                    setEmailNotifications(u.email_notifications !== false)
                    setOrderUpdates(u.order_notifications !== false)
                    setMarketingEmails(u.marketing_notifications || false)
                }
            } catch (error) {
                console.error("Failed to fetch user metadata:", error)
            }
        }
        fetchUserData()
    }, [user])

    const handleSaveNotifications = async () => {
        if (!user?.id) return

        setIsUpdating(true)
        try {
            const response = await api.patch(`/api/v1/users/${user.id}`, {
                email_notifications: emailNotifications,
                order_notifications: orderUpdates,
                marketing_notifications: marketingEmails,
            })

            if (response.data.error) {
                toast.error(response.data.error.message)
            } else {
                toast.success("Notification preferences saved")
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to save preferences";
            toast.error(errorMessage)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-500">Choose what notifications you want</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive email updates about your account</p>
                    </div>
                    <Switch
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                        disabled={isUpdating}
                    />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <p className="font-medium">Order Updates</p>
                        <p className="text-sm text-gray-500">Get notified about order status changes</p>
                    </div>
                    <Switch
                        checked={orderUpdates}
                        onCheckedChange={setOrderUpdates}
                        disabled={isUpdating}
                    />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <p className="font-medium">Marketing Emails</p>
                        <p className="text-sm text-gray-500">Receive promotional content and special offers</p>
                    </div>
                    <Switch
                        checked={marketingEmails}
                        onCheckedChange={setMarketingEmails}
                        disabled={isUpdating}
                    />
                </div>
            </div>

            <Button onClick={handleSaveNotifications} disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Preferences
            </Button>
        </div>
    )
}
