"use client"

import * as React from "react"
import { CarStep, carSteps, CarListing } from "@/lib/schemas/car"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import { toast } from "@/hooks/use-toast"

interface CarFormStepperProps {
  currentStep: CarStep
  setCurrentStep: (step: CarStep) => void
  completedSteps: Set<string>
  form: UseFormReturn<CarListing>
}

export function CarFormStepper({
  currentStep,
  setCurrentStep,
  completedSteps,
  form
}: CarFormStepperProps) {
  const handleStepClick = async (step: CarStep) => {
    const currentStepIndex = carSteps.findIndex(s => s.id === currentStep.id)
    const targetStepIndex = carSteps.findIndex(s => s.id === step.id)

    // Allow going to any completed step or current step
    if (completedSteps.has(step.id) || step.id === currentStep.id) {
      setCurrentStep(step)
      return
    }

    // Find the last completed step index
    const lastCompletedIndex = Math.max(...carSteps
      .map((s, index) => completedSteps.has(s.id) ? index : -1)
    )

    // Allow going to the step right after the last completed step
    if (targetStepIndex === lastCompletedIndex + 1) {
      setCurrentStep(step)
      return
    }

    // Validate current step before proceeding to next step
    if (targetStepIndex === currentStepIndex + 1) {
      const currentFields = currentStep.fields
      const result = await form.trigger(currentFields)
      
      if (!result) {
        toast({
          title: "Please complete the current step",
          description: "Fill in all required fields before proceeding.",
          variant: "destructive",
        })
        return
      }

      setCurrentStep(step)
    }
  }

  const progress = Math.round((completedSteps.size / carSteps.length) * 100)

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-sm font-medium">Progress</p>
        <Progress value={progress} className="h-2" />
      </div>
      <nav aria-label="Progress" className="flex gap-2 overflow-x-auto pb-2">
        {carSteps.map((step) => {
          const lastCompletedIndex = Math.max(...carSteps
            .map((s, index) => completedSteps.has(s.id) ? index : -1)
          )
          const stepIndex = carSteps.findIndex(s => s.id === step.id)
          const isDisabled = !completedSteps.has(step.id) && 
                           step.id !== currentStep.id && 
                           stepIndex !== lastCompletedIndex + 1

          return (
            <Button
              key={step.id}
              variant={step.id === currentStep.id ? "default" : "outline"}
              className={cn(
                "flex-1 min-w-fit text-left px-3 py-2 h-auto",
                step.id === currentStep.id 
                  ? "text-primary-foreground" 
                  : completedSteps.has(step.id) 
                    ? "text-primary" 
                    : "",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => handleStepClick(step)}
              disabled={isDisabled}
            >
              <div className="flex items-center gap-2">
                <div className="shrink-0 flex items-center justify-center w-5 h-5">
                  {completedSteps.has(step.id) ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-current" />
                  )}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-medium truncate">
                    {step.title}
                  </span>
                </div>
              </div>
            </Button>
          )
        })}
      </nav>
    </div>
  )
} 