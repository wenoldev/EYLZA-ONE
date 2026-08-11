/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react"
import { useState, useEffect } from "react"
import { X, Loader2 } from "lucide-react"
import { buildFormSchema } from "@/lib/zodSchemaBuilder"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { FormField } from "@/types/form"
import { toast } from "sonner"
import { UploadDialog } from "@/components/common/UploadImage"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { ImageData } from "@/types"
import ReactSelect from "react-select";

type DynamicFormProps = {
  fields: FormField[] | undefined
  onSubmit: (formData: Record<string, any>) => Promise<void>
  initialValues?: Record<string, any>
  buttonConfig?: {
    isFull?: boolean
    isResetButton?: boolean
    buttonText?: string
  }
}

const DynamicForm: React.FC<DynamicFormProps> = ({ fields, onSubmit, initialValues = {}, buttonConfig = {} }) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [imagePreview, setImagePreview] = useState<string>(initialValues.image_url || "")
  const [imageGroupPreview, setImageGroupPreview] = useState<ImageData[]>(initialValues.images || [])

  const formSchema = buildFormSchema(fields ?? [])

  useEffect(() => {
    validateForm()
  }, [formData, touched])

  const validateForm = () => {
    const result = formSchema.safeParse(formData)
    if (!result.success) {
      const zodErrors: Record<string, string> = {}
      result.error.issues.forEach((err) => {
        const fieldName = err.path[0] as string
        if (touched[fieldName]) {
          zodErrors[fieldName] = err.message
        }
      })
      setErrors(zodErrors)
    } else {
      setErrors({})
    }
  }

  const handleChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }))
  }

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }))
  }


  const handleRemoveFile = (fieldName: string) => {
    setImagePreview("")
    handleChange(fieldName, null)

    // Reset the file input
    const fileInput = document.getElementById(fieldName) as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const handleImageGroupChange = (fieldName: string, images: ImageData[]) => {
    setImageGroupPreview(images)
    handleChange(fieldName, images)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = formSchema.safeParse(formData)
    if (!result.success) {
      const zodErrors: Record<string, string> = {}
      result.error.issues.forEach((err) => {
        const fieldName = err.path[0] as string
        zodErrors[fieldName] = err.message
      })
      setErrors(zodErrors)
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
      return
    }

    try {
      setIsSubmitting(true)
      setErrors({})
      await onSubmit(formData)
    } catch (err: any) {
      console.error(err)
      toast.error("Error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData(initialValues)
    setErrors({})
    setTouched({})
    setImagePreview("")
    setImageGroupPreview([])
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields &&
        fields.map((field) => {
          const fieldError = errors[field.name]

          return (
            <div key={field.name} className="flex flex-col space-y-1">
              <label htmlFor={field.name} className="font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {/* ---- Field Types ---- */}
              {field.type === "textarea" && (
                <>
                  <Textarea
                    id={field.name}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    onBlur={() => handleBlur(field.name)}
                    className={fieldError ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
                </>
              )}

              {field.type === "select" && (
                <>
                  <Select
                    onValueChange={(value) => handleChange(field.name, value)}
                    value={formData[field.name] || field.defaultValue || ""}
                    onOpenChange={() => handleBlur(field.name)}
                  >
                    <SelectTrigger
                      className={`w-full ${fieldError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    >
                      <SelectValue placeholder={field.placeholder || "Select an option"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{field.label}</SelectLabel>
                        {field.options?.map((option) => (
                          <SelectItem key={option?.value} value={option.value}>
                            {option?.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
                </>
              )}

              {field.type === "multi-select" && (
                <>
                  <ReactSelect
                    isMulti
                    options={field.options}
                    value={field.options?.filter((opt) =>
                      (formData[field.name] || []).includes(opt.value)
                    )}
                    onChange={(selected) =>
                      handleChange(
                        field.name,
                        selected ? selected.map((s) => s.value) : []
                      )
                    }
                    className="w-full"
                  />
                  {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
                </>
              )}

              {(field.type === "checkbox" || field.type === "radio") && (
                <div className="space-y-1">
                  {field.options?.map((option) => (
                    <label key={option?.value} className="flex items-center space-x-2">
                      <input
                        type={field.type}
                        name={field.name}
                        value={option?.value}
                        checked={
                          field.type === "checkbox" ? !!formData[field.name] : formData[field.name] === option?.label
                        }
                        required={field.required}
                        onChange={(e) =>
                          handleChange(field.name, field.type === "checkbox" ? e.target.checked : option?.value)
                        }
                        onBlur={() => handleBlur(field.name)}
                        className="border p-2 rounded"
                      />
                      <span>{option?.label}</span>
                    </label>
                  ))}
                  {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
                </div>
              )}

              {field.type === "toggle" && (
                <div className="space-y-1">
                  <label className="flex items-center space-x-2">
                    <Switch
                      checked={!!formData[field.name]}
                      onCheckedChange={(newValue) => handleChange(field.name, newValue)}
                    />
                    <span>{field.label}</span>
                  </label>
                  {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
                </div>
              )}

              {(field.type === "file" || field.type === "image") && (
                <div className="space-y-2">
                  <UploadDialog
                    multiple={false}
                    onImagesSelected={(images) => {
                      if (images.length > 0) {
                        const img = images[0]
                        if (typeof img.image_url === "string") {
                          setImagePreview(img.image_url)
                          handleChange(field.name, img.image_url)
                        } else {
                          setImagePreview(img.image_url.fileContent)
                          handleChange(field.name, img.image_url)
                        }
                      }
                    }}
                    initialValues={
                      formData[field.name]
                        ? [{ image_url: formData[field.name], isPrimary: true }]
                        : []
                    }
                  />
                  {imagePreview && (
                    <div className="relative w-32 h-32">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="File preview"
                        className="w-full h-full object-cover rounded-md"
                        width={128}
                        height={128}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => handleRemoveFile(field.name)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
                </div>
              )}

              {field.type === "image-group" && (
                <div className="space-y-2">
                  <UploadDialog
                    multiple={true}
                    onImagesSelected={(images) => handleImageGroupChange(field.name, images)}
                    initialValues={initialValues[field.name] as ImageData[]}
                  />
                  {imageGroupPreview.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {imageGroupPreview.slice(0, 3).map((image: any, index) => (
                        <div key={index} className="relative">
                          <img
                            src={
                              typeof image.url === "string"
                                ? image.url
                                : "/placeholder.svg"
                            }
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md"
                            width={96}
                            height={96}
                          />
                          {image.isPrimary && (
                            <Badge className="absolute top-1 left-1" variant="secondary">
                              Primary
                            </Badge>
                          )}
                        </div>
                      ))}
                      {imageGroupPreview.length > 3 && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="h-24 w-full">
                              +{imageGroupPreview.length - 3} more
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogTitle>All images</DialogTitle>
                            <div className="grid grid-cols-3 gap-4">
                              {imageGroupPreview.map((image: any, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={
                                      typeof image.url === "string"
                                        ? image.url
                                        : "/placeholder.svg"
                                    }
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-md"
                                    width={128}
                                    height={128}
                                  />
                                  {image.isPrimary && (
                                    <Badge className="absolute top-1 left-1" variant="secondary">
                                      Primary
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  )}
                  {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
                </div>
              )}

              {["text", "password", "email", "number", "date", "datetime-local", "time"].includes(field.type) && (
                <>
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    onBlur={() => handleBlur(field.name)}
                    className={fieldError ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
                </>
              )}
            </div>
          )
        })}

      <div className={`flex ${buttonConfig.isFull ? "w-full" : ""} gap-2`}>
        <Button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center ${buttonConfig.isFull ? "flex-1" : ""}`}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {buttonConfig.buttonText || (isSubmitting ? "Submitting..." : "Submit")}
        </Button>
        {buttonConfig.isResetButton && (
          <Button
            type="button"
            onClick={handleReset}
            variant="secondary"
            className={buttonConfig.isFull ? "flex-1" : ""}
          >
            Reset
          </Button>
        )}
      </div>
    </form>
  )
}

export default DynamicForm
