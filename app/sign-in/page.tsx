import { SignInForm } from "@/components/auth/sign-in-form"
import { Card } from "@/components/ui/card"

export default function SignInPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-[400px] p-6">
        <SignInForm showWelcomeText />
      </Card>
    </div>
  )
} 