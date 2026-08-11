import { useState, useEffect } from "react"
import type { User } from "@/types/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Loader2 } from "lucide-react"
import { useAuthStore } from "@/stores/authStore"
import { toast } from "sonner"
import api from "@/lib/api"

export function ProfileSettings() {
    const { user } = useAuthStore()
    const [isUpdating, setIsUpdating] = useState(false)
    const [userName, setUserName] = useState("")
    const [userPhone, setUserPhone] = useState("")
    const [userMetadata, setUserMetadata] = useState<User | null>(null)

    useEffect(() => {
        if (user) {
            setUserName(user.user_metadata?.name || user.email?.split('@')[0] || "")
            setUserPhone(user.user_metadata?.phone || "")
        }

        const fetchUserData = async () => {
            if (!user?.id) return
            try {
                const response = await api.get(`/api/v1/users/${user.id}`)
                if (response.data.data?.user) {
                    const data = response.data.data.user
                    setUserMetadata(data)
                    setUserName(data.name || "")
                    setUserPhone(data.phone || "")
                }
            } catch (error) {
                console.error("Failed to fetch user metadata:", error)
            }
        }
        fetchUserData()
    }, [user])

    const handleSaveProfile = async () => {
        if (!user?.id) return

        setIsUpdating(true)
        try {
            const response = await api.patch(`/api/v1/users/${user.id}`, {
                name: userName,
                phone: userPhone,
            })

            if (response.data.error) {
                toast.error(response.data.error.message)
            } else {
                toast.success("Profile updated successfully")
                setUserMetadata(response.data.data.user)
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
            toast.error(errorMessage)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className="max-w-4xl space-y-8 pb-10">
            <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Profile</h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Manage your personal information</p>
            </div>

            <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border space-y-8">
                <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24 rounded-xl">
                        <AvatarImage src={user?.user_metadata?.avatar_url} className="rounded-xl object-cover" />
                        <AvatarFallback className="text-3xl rounded-xl bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 font-medium">
                            {userName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" /> Change Photo
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-zinc-300">Full Name</Label>
                        <Input
                            id="name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-zinc-300">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={user?.email || ""}
                            disabled
                            className="bg-gray-50 dark:bg-black"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-zinc-300">Phone</Label>
                    <Input
                        id="phone"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        placeholder="+1 234 567 8900"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="bg-gray-50 dark:bg-black p-4 rounded-lg">
                        <Label className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Role</Label>
                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-zinc-100 capitalize">
                            {userMetadata?.role || user?.user_metadata?.role || user?.role || "Vendor"}
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-black p-4 rounded-lg">
                        <Label className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Member Since</Label>
                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-zinc-100">
                            {userMetadata?.created_at
                                ? new Date(userMetadata.created_at).toLocaleDateString()
                                : user?.created_at
                                    ? new Date(user.created_at).toLocaleDateString()
                                    : "15/2/2026"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end border-t pt-6">
                <Button 
                    onClick={handleSaveProfile} 
                    disabled={isUpdating} 
                    className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black shadow-sm transition-all"
                >
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>
        </div>
    )
}
