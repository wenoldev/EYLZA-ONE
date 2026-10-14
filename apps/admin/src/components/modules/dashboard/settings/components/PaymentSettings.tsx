import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Key, ShieldCheck, AlertCircle, Loader2, CheckCircle2, ExternalLink, Banknote } from "lucide-react"
import { useStoreStore } from "@/stores/storeStore"
import { toast } from "sonner"
import api from "@/lib/api"

export function PaymentSettings() {
    const { stores } = useStoreStore()
    const currentStore = stores?.[0]

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [pluginActive, setPluginActive] = useState(false)
    const [activatingPlugin, setActivatingPlugin] = useState(false)

    const [formData, setFormData] = useState({
        key_id: "",
        key_secret: "",
        enabled: true,
        cod_enabled: true
    })

    const [configState, setConfigState] = useState<{
        configured: boolean
        has_secret: boolean
        key_id?: string
    }>({
        configured: false,
        has_secret: false
    })

    useEffect(() => {
        if (currentStore) {
            loadPaymentData()
        }
    }, [currentStore])

    const loadPaymentData = async () => {
        if (!currentStore) return
        setLoading(true)
        try {
            // 1. Check if razorpay plugin is installed for store
            const pluginsRes = await api.get(`/api/v1/stores/${currentStore.id}/plugins`).catch(() => ({ data: { data: { plugins: [] } } }))
            const storePlugins = pluginsRes.data?.data?.plugins || []
            const isInstalled = storePlugins.some((p: any) => p.slug === 'razorpay')
            setPluginActive(isInstalled)

            // 2. Fetch current payment config
            const configRes = await api.get(`/api/v1/stores/${currentStore.id}/payment-config`)
            if (configRes.data?.data) {
                const conf = configRes.data.data
                setConfigState({
                    configured: !!conf.configured,
                    has_secret: !!conf.has_secret,
                    key_id: conf.key_id
                })
                setFormData(prev => ({
                    ...prev,
                    key_id: conf.key_id || "",
                    enabled: conf.enabled !== false,
                    cod_enabled: conf.cod_enabled !== false
                }))
            }
        } catch (err: any) {
            console.error("Failed to load payment config:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleEnablePlugin = async () => {
        if (!currentStore) return
        setActivatingPlugin(true)
        try {
            // Find razorpay plugin id
            const allPlugins = await api.get('/api/v1/plugins')
            const rzp = (allPlugins.data?.data?.plugins || []).find((p: any) => p.slug === 'razorpay')
            if (!rzp) throw new Error("Razorpay plugin not registered in catalog")

            await api.post('/api/v1/plugins/purchase', {
                plugin_id: rzp.id,
                store_id: currentStore.id
            })

            toast.success("Razorpay payment plugin enabled!")
            setPluginActive(true)
        } catch (err: any) {
            toast.error(err.response?.data?.error?.message || err.message || "Failed to enable plugin")
        } finally {
            setActivatingPlugin(false)
        }
    }

    const handleSaveConfig = async () => {
        if (!currentStore) return

        if (formData.enabled && (!formData.key_id || (!configState.has_secret && !formData.key_secret))) {
            toast.error("Please provide both Razorpay Key ID and Key Secret to enable Razorpay payments.")
            return
        }

        setSaving(true)
        try {
            const payload: any = {
                enabled: formData.enabled,
                cod_enabled: formData.cod_enabled,
                key_id: formData.key_id.trim()
            }
            if (formData.key_secret) {
                payload.key_secret = formData.key_secret.trim()
            }

            const res = await api.post(`/api/v1/stores/${currentStore.id}/payment-config`, payload)
            if (res.data?.success) {
                toast.success("Payment credentials saved successfully!")
                setConfigState(prev => ({
                    ...prev,
                    configured: true,
                    has_secret: true,
                    key_id: formData.key_id
                }))
                // Clear password input for security
                setFormData(prev => ({ ...prev, key_secret: "" }))
            } else {
                throw new Error(res.data?.error || "Failed to update configuration")
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error || err.message || "Failed to save payment configuration")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground text-sm">Loading payment settings...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h3 className="text-2xl font-bold tracking-tight">Payment Gateway & Methods</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Connect your own Razorpay account. Customer payments are deposited directly into your bank account.
                </p>
            </div>

            {/* Plugin Status Banner */}
            {!pluginActive && (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-amber-900 dark:text-amber-200">Payment Plugin Inactive</h4>
                            <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
                                Enable the Razorpay plugin for your store to activate online card, UPI, and netbanking checkout.
                            </p>
                        </div>
                    </div>
                    <Button 
                        onClick={handleEnablePlugin} 
                        disabled={activatingPlugin}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-medium"
                    >
                        {activatingPlugin ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Enable Plugin
                    </Button>
                </div>
            )}

            {/* Razorpay Gateway Card */}
            <Card className="border-2 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    Razorpay Payment Gateway
                                    {configState.configured ? (
                                        <Badge className="bg-emerald-600 text-white text-xs">Connected</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-xs">Not Configured</Badge>
                                    )}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Direct payout to your Razorpay merchant account (Cards, UPI, Netbanking, Wallets).
                                </CardDescription>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2 sm:pt-0">
                            <Label htmlFor="online-toggle" className="text-sm font-medium cursor-pointer">
                                {formData.enabled ? "Enabled" : "Disabled"}
                            </Label>
                            <Switch 
                                id="online-toggle" 
                                checked={formData.enabled} 
                                onCheckedChange={(val) => setFormData(p => ({ ...p, enabled: val }))} 
                            />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-2">
                    <div className="bg-muted/50 rounded-lg p-4 border text-sm text-muted-foreground space-y-2">
                        <div className="flex items-center gap-2 font-medium text-foreground">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            How Multi-Vendor Payments Work:
                        </div>
                        <p>
                            1. Go to your <a href="https://dashboard.razorpay.com/#/access/api-keys" target="_blank" rel="noreferrer" className="text-primary underline font-medium inline-flex items-center gap-1">Razorpay Dashboard <ExternalLink className="w-3 h-3" /></a>.
                        </p>
                        <p>
                            2. Generate or copy your <strong>Key ID</strong> and <strong>Key Secret</strong> (Test or Live).
                        </p>
                        <p>
                            3. Save them below. Customers will pay directly to your account, and our platform tracks orders in your store records.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="key_id" className="flex items-center gap-1.5 font-semibold">
                                <Key className="w-4 h-4 text-muted-foreground" />
                                Razorpay Key ID
                            </Label>
                            <Input
                                id="key_id"
                                placeholder="rzp_test_... or rzp_live_..."
                                value={formData.key_id}
                                onChange={(e) => setFormData(p => ({ ...p, key_id: e.target.value }))}
                                className="font-mono text-sm"
                            />
                            <p className="text-xs text-muted-foreground">Public key provided by Razorpay.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="key_secret" className="flex items-center gap-1.5 font-semibold">
                                <Key className="w-4 h-4 text-muted-foreground" />
                                Razorpay Key Secret
                            </Label>
                            <Input
                                id="key_secret"
                                type="password"
                                placeholder={configState.has_secret ? "•••••••••••••••• (Leave blank to keep unchanged)" : "Enter your secret key"}
                                value={formData.key_secret}
                                onChange={(e) => setFormData(p => ({ ...p, key_secret: e.target.value }))}
                                className="font-mono text-sm"
                            />
                            <p className="text-xs text-muted-foreground">Kept securely on our server to verify customer signatures.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Offline / Cash on Delivery Card */}
            <Card className="border-2 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
                                <Banknote className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Cash on Delivery (COD)</CardTitle>
                                <CardDescription className="mt-1">
                                    Allow customers to pay cash when their order is delivered to their doorstep.
                                </CardDescription>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Label htmlFor="cod-toggle" className="text-sm font-medium cursor-pointer">
                                {formData.cod_enabled ? "Enabled" : "Disabled"}
                            </Label>
                            <Switch 
                                id="cod-toggle" 
                                checked={formData.cod_enabled} 
                                onCheckedChange={(val) => setFormData(p => ({ ...p, cod_enabled: val }))} 
                            />
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {configState.configured && (
                        <span className="flex items-center gap-1 text-emerald-600 font-medium">
                            <CheckCircle2 className="w-4 h-4" /> Ready to accept payments
                        </span>
                    )}
                </div>

                <Button 
                    onClick={handleSaveConfig} 
                    disabled={saving}
                    className="bg-black hover:bg-neutral-800 text-white font-bold px-8 h-11"
                >
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Save Payment Settings
                </Button>
            </div>
        </div>
    )
}
