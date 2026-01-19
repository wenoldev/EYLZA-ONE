"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
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
        <div className="max-w-md space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-gray-900">Security</h3>
                <p className="text-sm text-gray-500">Manage your security settings</p>
            </div>

            <div className="border-b pb-6">
                <h4 className="mb-4 font-medium">Change Password</h4>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>
                    <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                        <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
                    </div>
                    <div>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                    </div>
                    <Button onClick={handleChangePassword} disabled={isUpdating}>
                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Change Password
                    </Button>
                </div>
            </div>

            <div>
                <h4 className="mb-4 font-medium">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <p className="font-medium">Enable 2FA via Email</p>
                        <p className="text-sm text-gray-500">
                            Add an extra layer of security to your account
                        </p>
                    </div>
                    <Switch
                        checked={twoFactorEnabled}
                        onCheckedChange={handleToggle2FA}
                        disabled={isUpdating}
                    />
                </div>
            </div>
        </div>
    )
}
