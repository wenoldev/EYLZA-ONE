import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Check } from "lucide-react"
import type { StoreFormData } from "./index"
import { useEffect } from "react"

interface StoreDetailsStepProps {
  formData: StoreFormData
  updateFormData: (data: Partial<StoreFormData>) => void
  onNext: () => void
}

const countries = [
  { value: "US", label: "United States", currency: "USD" },
  { value: "IN", label: "India", currency: "INR" },
  { value: "GB", label: "United Kingdom", currency: "GBP" },
  { value: "CA", label: "Canada", currency: "CAD" },
  { value: "AU", label: "Australia", currency: "AUD" },
]

const currencies = [
  { value: "USD", label: "US Dollar" },
  { value: "INR", label: "Indian Rupee" },
  { value: "GBP", label: "British Pound" },
  { value: "CAD", label: "Canadian Dollar" },
  { value: "AUD", label: "Australian Dollar" },
]

export function StoreDetailsStep({ formData, updateFormData, onNext }: StoreDetailsStepProps) {
  useEffect(()=>{
    handleCountryChange("IN")
  },[])
  const handleCountryChange = (country: string) => {
    const selectedCountry = countries.find((c) => c.value === country)
    updateFormData({
      country,
      currency: selectedCountry?.currency || formData.currency,
    })
  }

  const isValid = formData.name && formData.country && formData.currency

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Get a head start on your store setup.</h2>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="storeName" className="text-base font-medium text-gray-900 mb-2 block">
            What's your store name?
          </Label>
          <p className="text-sm text-gray-600 mb-4">
            Enter the name of your store as you want it to appear to your customers. You can change the name of your
            store at any time later.
          </p>
          <div className="relative">
            <Input
              id="storeName"
              placeholder="Store name"
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
              className="pr-10"
            />
            {formData.name && (
              <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
            )}
          </div>
        </div>

        <div>
          <Label className="text-base font-medium text-gray-900 mb-2 block">Store Description (Optional)</Label>
          <Textarea
            placeholder="Tell customers about your store..."
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            rows={3}
          />
        </div>

        <div>
          <Label className="text-base font-medium text-gray-900 mb-2 block">What's your country and currency?</Label>
          <p className="text-sm text-gray-600 mb-4">Confirm that we guessed your regional settings right.</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Select value={formData.country} disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.country && (
                <Check className="absolute right-10 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600 pointer-events-none" />
              )}
            </div>
            <div className="relative">
              <Select value={formData.currency} onValueChange={(currency) => updateFormData({ currency })}>
                <SelectTrigger>
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.currency && (
                <Check className="absolute right-10 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600 pointer-events-none" />
              )}
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={onNext}
        disabled={!isValid}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
      >
        Next
      </Button>
    </div>
  )
}
