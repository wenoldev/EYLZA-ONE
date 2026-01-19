
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { StoreDetailsStep } from "./store-details-setup"
import { CompanyAddressStep } from "./company-address-setup"
import { StoreUrlStep } from "./store-url-setup"
import { useStoreStore } from "@/stores/storeStore"
import { toast } from "sonner"

export interface StoreFormData {
  name: string
  description: string
  country: string
  currency: string
  city: string
  state: string
  zipCode: string
  phone: string
  contact_email: string
  slug: string
  timezone: string
}

const initialFormData: StoreFormData = {
  name: "",
  description: "",
  country: "",
  currency: "",
  city: "",
  state: "",
  zipCode: "",
  phone: "",
  contact_email: "",
  slug: "",
  timezone: "",
}

export default function StoreSetupWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<StoreFormData>(initialFormData)
  const { createStore, loading ,error} = useStoreStore()
  const navigate = useNavigate()

  const totalSteps = 3

  const updateFormData = (data: Partial<StoreFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }
  useEffect(() => {
    if (error) {
      toast.error(error || "Something went wrong");
    }
  }, [error]);
  
  const handleSubmit = async () => {
    try {
      const storePayload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        contact_email: formData.contact_email,
        phone: formData.phone,
        currency: formData.currency,
        country: formData.country,
        city: formData.city,
        timezone: formData.timezone,
      }

      const store = await createStore(storePayload)
      if (store) {
        navigate(`/`)
      }
    } catch (error) {
      console.error("Failed to create store:", error)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StoreDetailsStep formData={formData} updateFormData={updateFormData} onNext={nextStep} />
      case 2:
        return (
          <CompanyAddressStep formData={formData} updateFormData={updateFormData} onNext={nextStep} onBack={prevStep} />
        )
      case 3:
        return (
          <StoreUrlStep
            formData={formData}
            updateFormData={updateFormData}
            onBack={prevStep}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex gap-8">
        {/* Sidebar */}
        <div className="w-80 bg-white rounded-lg p-6 h-fit">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-black rounded-sm"></div>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold">Ecwid</h1>
              <p className="text-sm text-gray-600">by Lightspeed</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">
              Complete your registration{" "}
              <span className="text-green-600">
                Step {currentStep} of {totalSteps}.
              </span>
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
            <p className="text-gray-600 text-sm">Give us some details to help you launch a store.</p>
          </div>

          {/* Step indicators */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  currentStep >= 1 ? "bg-green-600 text-white" : "bg-gray-200"
                }`}
              >
                {currentStep > 1 ? <Check className="w-4 h-4" /> : "1"}
              </div>
              <span className={currentStep >= 1 ? "text-gray-900" : "text-gray-500"}>Store Details</span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  currentStep >= 2 ? "bg-green-600 text-white" : "bg-gray-200"
                }`}
              >
                {currentStep > 2 ? <Check className="w-4 h-4" /> : "2"}
              </div>
              <span className={currentStep >= 2 ? "text-gray-900" : "text-gray-500"}>Company Address</span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  currentStep >= 3 ? "bg-green-600 text-white" : "bg-gray-200"
                }`}
              >
                {currentStep > 3 ? <Check className="w-4 h-4" /> : "3"}
              </div>
              <span className={currentStep >= 3 ? "text-gray-900" : "text-gray-500"}>Store URL</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <Card className="bg-white">
            <CardContent className="p-8">{renderStep()}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
