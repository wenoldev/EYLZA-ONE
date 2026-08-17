"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, Key, Shield, Eye, EyeOff } from "lucide-react"
import { useAuthStore } from "@/stores/authStore"
import { toast } from "sonner"
import api from "@/lib/api"

export function SecuritySettings() {
    const { user } = useAuthStore()
    const [isUpdating, setIsUpdating] = useState(false)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
    
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("All password fields are required")
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match")
            return
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters")
            return
        }

        setIsUpdating(true)
        try {
            const response = await api.post("/api/v1/auth/change-password", {
                currentPassword,
                newPassword,
            })

            if (response.data.error) {
                toast.error(response.data.error.message)
            } else {
                toast.success("Password changed successfully")
                if (response.data.data?.session) {
                    useAuthStore.setState({ session: response.data.data.session })
                }
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to change password";
            toast.error(errorMessage)
        } finally {
            setIsUpdating(false)
        }
    }

    const handleToggle2FA = async (enabled: boolean) => {
        if (!user?.id) return

        setIsUpdating(true)
        try {
            const response = await api.post("/api/v1/auth/toggle-2fa", {
                enabled,
            })

            if (response.data.error) {
                toast.error(response.data.error.message)
                setTwoFactorEnabled(!enabled)
            } else {
                setTwoFactorEnabled(enabled)
                toast.success(response.data.data.message || (enabled ? "2FA enabled" : "2FA disabled"))
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to toggle 2FA";
            toast.error(errorMessage)
            setTwoFactorEnabled(!enabled)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className="max-w-4xl space-y-8 pb-10">
            <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Security</h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Manage your security settings</p>
            </div>

            <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border space-y-6">
                <div className="flex items-center gap-2 mb-2">
                    <Key className="w-5 h-5 text-gray-700 dark:text-zinc-300" />
                    <h4 className="font-semibold text-gray-900 dark:text-zinc-100">Change Password</h4>
                </div>
                <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                            <Input
                                id="currentPassword"
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                autoComplete="current-password"
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                autoComplete="new-password"
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-500 dark:text-zinc-400">Must be at least 8 characters</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="pt-2">
                        <Button onClick={handleChangePassword} disabled={isUpdating} className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black shadow-sm transition-all">
                            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Change Password
                        </Button>
                    </div>
                </div>
            </div>

            {/* <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-gray-700 dark:text-zinc-300" />
                    <h4 className="font-semibold text-gray-900 dark:text-zinc-100">Two-Factor Authentication</h4>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4 bg-gray-50 dark:bg-black/50">
                    <div>
                        <p className="font-medium text-gray-900 dark:text-zinc-100">Enable 2FA via Email</p>
                        <p className="text-sm text-gray-500 dark:text-zinc-400">
                            Add an extra layer of security to your account
                        </p>
                    </div>
                    <Switch
                        checked={twoFactorEnabled}
                        onCheckedChange={handleToggle2FA}
                        disabled={isUpdating}
                    />
                </div>
            </div> */}
        </div>
    )
}
