import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft } from "lucide-react"
import type { StoreFormData } from "./index"

interface CompanyAddressStepProps {
  formData: StoreFormData
  updateFormData: (data: Partial<StoreFormData>) => void
  onNext: () => void
  onBack: () => void
}

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export function CompanyAddressStep({ formData, updateFormData, onNext, onBack }: CompanyAddressStepProps) {
  const isValid = formData.city && formData.state && formData.zipCode

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add a company address to get paid and set up delivery.</h2>
          <p className="text-sm text-gray-600 mt-2">
            The address is required to get you ready for receiving payments and setting up delivery.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="city" className="text-base font-medium text-gray-900 mb-2 block">
            What's your company address?
          </Label>
          <p className="text-sm text-gray-600 mb-4">
            This is the address where your company and store are located. If you don't have a company address yet,
            please enter an address from where you will be shipping your orders.
          </p>
          <Input
            id="city"
            placeholder="City"
            value={formData.city}
            onChange={(e) => updateFormData({ city: e.target.value })}
            className="mb-4"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select value={formData.state} onValueChange={(state) => updateFormData({ state })}>
              <SelectTrigger>
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Zip/Postal Code"
              value={formData.zipCode}
              onChange={(e) => updateFormData({ zipCode: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="phone" className="text-base font-medium text-gray-900 mb-2 block">
            Contact Information
          </Label>
          <div className="space-y-4">
            <Input
              id="phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={(e) => updateFormData({ phone: e.target.value })}
            />
            <Input
              placeholder="Contact email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => updateFormData({ contact_email: e.target.value })}
            />
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
