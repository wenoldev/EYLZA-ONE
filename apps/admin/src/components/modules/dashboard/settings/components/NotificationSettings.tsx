"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Loader2, Bell, BellOff, MessageSquare } from "lucide-react"
import { useAuthStore } from "@/stores/authStore"
import { useStoreStore } from "@/stores/storeStore"
import { toast } from "sonner"
import api from "@/lib/api"

// Helper to convert base64 to Uint8Array for VAPID key
function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

export function NotificationSettings() {
    const { user } = useAuthStore()
    const { stores, fetchStores } = useStoreStore()
    const currentStore = stores?.[0]
    const storeId = currentStore?.id

    const [isUpdating, setIsUpdating] = useState(false)
    const [isPushLoading, setIsPushLoading] = useState(false)
    const [isPushEnabled, setIsPushEnabled] = useState(false)

    const [settings, setSettings] = useState({
        email_enabled: true,
        order_enabled: true,
        marketing_enabled: false,
        query_enabled: true,
    })

    useEffect(() => {
        if (!stores || stores.length === 0) {
            fetchStores({ page: 1, limit: 1 })
        }
    }, [fetchStores, stores])

    const fetchSettings = useCallback(async () => {
        if (!storeId) return
        try {
            const response = await api.get(`/api/v1/notifications/settings/${storeId}`)
            if (response.data.data?.settings) {
                setSettings(response.data.data.settings)
            }
        } catch (error) {
            console.error("Failed to fetch notification settings:", error)
        }
    }, [storeId])

    const checkPushSubscription = useCallback(async () => {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
            return
        }

        try {
            const registration = await navigator.serviceWorker.ready
            const subscription = await registration.pushManager.getSubscription()
            setIsPushEnabled(!!subscription)
        } catch (error) {
            console.error("Error checking push subscription:", error)
        }
    }, [])

    useEffect(() => {
        fetchSettings()
        checkPushSubscription()
    }, [fetchSettings, checkPushSubscription])

    const handleSaveSettings = async () => {
        if (!storeId) return

        setIsUpdating(true)
        try {
            const response = await api.patch(`/api/v1/notifications/settings/${storeId}`, settings)

            if (response.data.error) {
                toast.error(response.data.error.message)
            } else {
                toast.success("Notification preferences saved")
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to save preferences"
            toast.error(errorMessage)
        } finally {
            setIsUpdating(false)
        }
    }

    const togglePushNotifications = async (checked: boolean) => {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
            toast.error("Push notifications are not supported in this browser.")
            return
        }

        setIsPushLoading(true)
        try {
            if (checked) {
                const permission = await Notification.requestPermission()
                if (permission !== "granted") {
                    toast.error("Permission not granted for notifications.")
                    setIsPushLoading(false)
                    return
                }

                const registration = await navigator.serviceWorker.ready
                const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY

                if (!vapidPublicKey) {
                    toast.error("VAPID Public Key not found. Please contact administrator.")
                    setIsPushLoading(false)
                    return
                }

                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
                })

                await api.post("/api/v1/notifications/subscribe", {
                    subscription,
                    device_info: `${navigator.userAgent}`,
                })

                setIsPushEnabled(true)
                toast.success("Push notifications enabled on this device")
            } else {
                const registration = await navigator.serviceWorker.ready
                const subscription = await registration.pushManager.getSubscription()

                if (subscription) {
                    await subscription.unsubscribe()
                    await api.delete("/api/v1/notifications/subscribe", {
                        data: { endpoint: subscription.endpoint },
                    })
                }

                setIsPushEnabled(false)
                toast.success("Push notifications disabled on this device")
            }
        } catch (error) {
            console.error("Error toggling push notifications:", error)
            toast.error("Failed to update push notification settings")
        } finally {
            setIsPushLoading(false)
        }
    }

    return (
        <div className="max-w-2xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">Notifications</h3>
                    <p className="text-sm text-gray-500">Manage how you receive alerts for {currentStore?.name || "your store"}</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4 bg-white shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="mt-1 p-2 bg-blue-50 rounded-lg text-blue-600">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-medium">Customer Queries</p>
                            <p className="text-sm text-gray-500">Get notified when a customer sends a message</p>
                        </div>
                    </div>
                    <Switch
                        checked={settings.query_enabled}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, query_enabled: checked }))}
                        disabled={isUpdating}
                    />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4 bg-white shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="mt-1 p-2 bg-green-50 rounded-lg text-green-600">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-medium">Order Updates</p>
                            <p className="text-sm text-gray-500">Receive alerts about new orders and status changes</p>
                        </div>
                    </div>
                    <Switch
                        checked={settings.order_enabled}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, order_enabled: checked }))}
                        disabled={isUpdating}
                    />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4 bg-white shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="mt-1 p-2 bg-purple-50 rounded-lg text-purple-600">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-gray-500">Periodic email summaries and critical alerts</p>
                        </div>
                    </div>
                    <Switch
                        checked={settings.email_enabled}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, email_enabled: checked }))}
                        disabled={isUpdating}
                    />
                </div>

                <hr className="my-6" />

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            {isPushEnabled ? <Bell className="text-green-600 w-5 h-5" /> : <BellOff className="text-gray-400 w-5 h-5" />}
                            <h4 className="font-semibold text-gray-900 text-lg">Push Notifications (This Device)</h4>
                        </div>
                        <Switch
                            checked={isPushEnabled}
                            onCheckedChange={togglePushNotifications}
                            disabled={isPushLoading}
                        />
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Enable browser push notifications to receive real-time alerts even when the dashboard is closed. This setting only applies to the current device.
                    </p>
                </div>
            </div>

            <Button onClick={handleSaveSettings} disabled={isUpdating} className="w-full sm:w-auto">
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Global Preferences
            </Button>
        </div>
    )
}
