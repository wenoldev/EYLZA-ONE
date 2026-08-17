"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Loader2, Bell, BellOff, MessageSquare, Mail } from "lucide-react"
// import { useAuthStore } from "@/stores/authStore"
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
    // const { user } = useAuthStore()
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
            const registration = await navigator.serviceWorker.register('/sw.js')
            await navigator.serviceWorker.ready // Ensure it's active before interacting
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

        if (checked && Notification.permission === "denied") {
            toast.error("Notifications are blocked by your browser. Please enable them in your browser settings (usually the lock icon next to the URL).")
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

                const registration = await navigator.serviceWorker.register('/sw.js')
                await navigator.serviceWorker.ready
                const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY?.trim()

                if (!vapidPublicKey) {
                    toast.error("VAPID Public Key not found. Please contact administrator.")
                    setIsPushLoading(false)
                    return
                }

                // Chrome will throw "Registration failed - push service error" 
                // if there is an existing hidden subscription with a different VAPID key.
                const existingSub = await registration.pushManager.getSubscription()
                if (existingSub) {
                    await existingSub.unsubscribe()
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
                const registration = await navigator.serviceWorker.register('/sw.js')
                await navigator.serviceWorker.ready
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
        } catch (error: unknown) {
            console.error("Error toggling push notifications:", error)
            const errorMessage = error instanceof Error ? error.message : String(error)
            toast.error(`Failed to update push notification settings: ${errorMessage}`)
        } finally {
            setIsPushLoading(false)
        }
    }

    return (
        <div className="max-w-4xl space-y-8 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">Manage how you receive alerts for {currentStore?.name || "your store"}</p>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-5 h-5 text-gray-700 dark:text-zinc-300" />
                    <h4 className="font-semibold text-gray-900 dark:text-zinc-100">Real-time Notifications</h4>
                </div>

                <div className="bg-gray-50 dark:bg-black rounded-xl p-6 border border-gray-200 dark:border-zinc-800 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            {isPushEnabled ? <Bell className="text-gray-900 dark:text-zinc-100 w-5 h-5" /> : <BellOff className="text-gray-400 dark:text-zinc-500 w-5 h-5" />}
                            <h4 className="font-semibold text-gray-900 dark:text-zinc-100 text-lg">Push Notifications (This Device)</h4>
                        </div>
                        <Switch
                            checked={isPushEnabled}
                            onCheckedChange={togglePushNotifications}
                            disabled={isPushLoading}
                        />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
                        Enable browser push notifications to receive real-time alerts even when the dashboard is closed. This setting only applies to the current device.
                    </p>
                </div>

                <div className={`space-y-4 pl-4 border-l-2 border-gray-100 dark:border-zinc-800 ${!isPushEnabled ? 'opacity-50' : ''}`}>
                    <div className="flex items-center justify-between rounded-lg border p-4 bg-gray-50 dark:bg-black/50">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 p-2 bg-white dark:bg-zinc-950 border rounded-lg text-gray-700 dark:text-zinc-300 shadow-sm">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-zinc-100">Customer Queries</p>
                                <p className="text-sm text-gray-500 dark:text-zinc-400">Get notified when a customer sends a message</p>
                            </div>
                        </div>
                        <Switch
                            checked={settings.query_enabled}
                            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, query_enabled: checked }))}
                            disabled={isUpdating || !isPushEnabled}
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4 bg-gray-50 dark:bg-black/50">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 p-2 bg-white dark:bg-zinc-950 border rounded-lg text-gray-700 dark:text-zinc-300 shadow-sm">
                                <Bell className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-zinc-100">Order Updates</p>
                                <p className="text-sm text-gray-500 dark:text-zinc-400">Receive alerts about new orders and status changes</p>
                            </div>
                        </div>
                        <Switch
                            checked={settings.order_enabled}
                            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, order_enabled: checked }))}
                            disabled={isUpdating || !isPushEnabled}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-5 h-5 text-gray-700 dark:text-zinc-300" />
                    <h4 className="font-semibold text-gray-900 dark:text-zinc-100">Email Notifications</h4>
                </div>
                
                <div className="flex items-center justify-between rounded-lg border p-4 bg-gray-50 dark:bg-black/50">
                    <div className="flex items-start gap-3">
                        <div className="mt-1 p-2 bg-white dark:bg-zinc-950 border rounded-lg text-gray-700 dark:text-zinc-300 shadow-sm">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-zinc-100">Email Alerts</p>
                            <p className="text-sm text-gray-500 dark:text-zinc-400">Periodic email summaries and critical alerts</p>
                        </div>
                    </div>
                    <Switch
                        checked={settings.email_enabled}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, email_enabled: checked }))}
                        disabled={isUpdating}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4 border-t pt-6">
                <Button 
                    onClick={handleSaveSettings} 
                    disabled={isUpdating} 
                    className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black shadow-sm transition-all"
                >
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Global Preferences
                </Button>
            </div>
        </div>
    )
}
