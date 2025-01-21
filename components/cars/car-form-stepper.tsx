"use client"

import * as React from "react"
import { CarStep, carSteps, CarListing } from "@/lib/schemas/car"
import { Button } from "@/components/ui/button"
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

  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-2">
        {carSteps.map((step) => {
          // Find the last completed step index
          const lastCompletedIndex = Math.max(...carSteps
            .map((s, index) => completedSteps.has(s.id) ? index : -1)
          )
          const stepIndex = carSteps.findIndex(s => s.id === step.id)
          
          // A step is disabled if it's not completed, not the current step, and not the next step after last completed
          const isDisabled = !completedSteps.has(step.id) && 
                           step.id !== currentStep.id && 
                           stepIndex !== lastCompletedIndex + 1

          return (
            <li key={step.id}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full flex items-center text-left px-3 py-2 h-auto",
                  step.id === currentStep.id && "bg-accent",
                  completedSteps.has(step.id) && "text-primary",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => handleStepClick(step)}
                disabled={isDisabled}
              >
                <div className="flex items-center gap-3 w-full">
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
                    <span className="text-xs text-muted-foreground">
                      {step.description}
                    </span>
                  </div>
                </div>
              </Button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
} 