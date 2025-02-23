"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import CartReview from "./CartReview"
import ShippingForm from "./ShippingForm"
import PaymentForm from "./PaymentForm"
import OrderConfirmation from "./OrderConfirmation"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { useCart } from "@/contexts/CartContext"

const steps = ["Cart Review", "Shipping", "Payment", "Confirmation"]

interface Address {
  fullName: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
  country: string
}

export default function CheckoutProcess() {
  const [currentStep, setCurrentStep] = useState(0)
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null)
  const { createOrder } = useCart()
  const router = useRouter()

  const nextStep = () => {
    if (currentStep === steps.length - 2 && shippingAddress) {
      createOrder(shippingAddress)
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleFinish = () => {
    router.push("/profile")
  }

  const handleAddressSelect = (address: Address | null) => {
    if (address === null) {
      prevStep()
    } else {
      setShippingAddress(address)
      nextStep()
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="mb-8 px-4 md:px-8">
        <div className="flex items-center justify-between w-full">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className="flex items-center">
                <span
                  className={`text-lg md:text-xl font-bold mr-2 ${index === currentStep ? "text-blue-600" : "text-gray-400"}`}
                >
                  {index + 1}
                </span>
                <span
                  className={`text-sm md:text-lg font-bold ${index === currentStep ? "text-blue-600" : "text-gray-400"}`}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="mx-2 md:mx-8">
                  <ChevronRight size={24} className="text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-grow px-4 md:px-8">
        {currentStep === 0 && <CartReview />}
        {currentStep === 1 && <ShippingForm onAddressSelect={handleAddressSelect} />}
        {currentStep === 2 && <PaymentForm />}
        {currentStep === 3 && <OrderConfirmation />}
      </div>

      {currentStep !== 1 && (
        <div className="mt-8 px-4 md:px-8">
          <div className="flex justify-between">
            {currentStep > 0 && currentStep < steps.length - 1 && (
              <Button onClick={prevStep} variant="outline" size="lg">
                Back
              </Button>
            )}
            {currentStep < steps.length - 1 && currentStep !== 1 && (
              <Button onClick={nextStep} size="lg" className="min-w-[120px]">
                {currentStep === steps.length - 2 ? "Place Order" : "Next"}
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button onClick={handleFinish} size="lg" className="min-w-[120px]">
                Go to Profile
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

