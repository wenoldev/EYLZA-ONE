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
        <div className="max-w-2xl space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-gray-900">Profile</h3>
                <p className="text-sm text-gray-500">Manage your personal information</p>
            </div>

            <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="text-lg">
                        {userName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                </Avatar>
                <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" /> Change Photo
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="bg-gray-50"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                    id="phone"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="+1 234 567 8900"
                />
            </div>

            <div>
                <Label>Role</Label>
                <p className="mt-1 text-gray-700 capitalize">
                    {userMetadata?.role || user?.user_metadata?.role || user?.role || "N/A"}
                </p>
            </div>

            <div>
                <Label>Member Since</Label>
                <p className="mt-1 text-gray-700">
                    {userMetadata?.created_at
                        ? new Date(userMetadata.created_at).toLocaleDateString()
                        : user?.created_at
                            ? new Date(user.created_at).toLocaleDateString()
                            : "N/A"}
                </p>
            </div>

            <Button onClick={handleSaveProfile} disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
        </div>
    )
}
