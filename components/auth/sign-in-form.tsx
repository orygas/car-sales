"use client"

import { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

// Types
type SignInFormProps = React.HTMLAttributes<HTMLDivElement>;

interface ClerkError {
  errors?: Array<{ message: string; code?: string }>;
}

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  autoComplete?: string;
  isLoading?: boolean;
  pattern?: string;
  title?: string;
}

interface SocialButtonProps {
  provider: "oauth_google" | "oauth_facebook";
  isLoading: boolean;
  onClick: () => void;
}

interface VerificationFormProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
  email: string;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  isLoading: boolean;
  error: string | null;
  onSubmit: React.FormEventHandler;
  onResend: () => Promise<void>;
}

// Components
const PasswordInput = ({
  id,
  label,
  value,
  onChange,
  showPassword,
  onTogglePassword,
  autoComplete = "current-password",
  isLoading = false,
  pattern,
  title,
}: PasswordInputProps) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <div className="relative">
      <Input
        id={id}
        placeholder="••••••••"
        type={showPassword ? "text" : "password"}
        autoComplete={autoComplete}
        disabled={isLoading}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        pattern={pattern}
        title={title}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={onTogglePassword}
        disabled={isLoading}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Eye className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span>
      </Button>
    </div>
  </div>
);

const SocialButton = ({ provider, isLoading, onClick }: SocialButtonProps) => (
  <Button
    variant="outline"
    type="button"
    disabled={isLoading}
    onClick={onClick}
  >
    {isLoading ? (
      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
    ) : provider === "oauth_google" ? (
      <Icons.google className="mr-2 h-4 w-4" />
    ) : (
      <Icons.facebook className="mr-2 h-4 w-4" />
    )}
    {provider === "oauth_google" ? "Google" : "Facebook"}
  </Button>
);

const VerificationForm = ({
  email,
  verificationCode,
  setVerificationCode,
  isLoading,
  error,
  onSubmit,
  onResend,
  className,
  ...props
}: VerificationFormProps) => (
  <div className={cn("grid gap-6 p-8", className)} {...props}>
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Please check your email</h2>
        <p className="text-sm text-muted-foreground">
          We&apos;ve sent a code to {email}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex justify-center">
          <InputOTP
            value={verificationCode}
            onChange={setVerificationCode}
            maxLength={6}
            disabled={isLoading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error && (
          <div className="text-sm font-medium text-destructive text-center">
            {error}
          </div>
        )}

        <Button 
          className="w-full" 
          disabled={isLoading || verificationCode.length < 6}
          type="submit"
        >
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Verify
        </Button>

        <Button
          variant="ghost"
          className="w-full text-sm text-muted-foreground hover:text-primary"
          onClick={onResend}
          disabled={isLoading}
          type="button"
        >
          Didn&apos;t receive an email? Resend
        </Button>
      </form>
    </div>
  </div>
);

// Main Component
export function SignInForm({ className, ...props }: SignInFormProps) {
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { signIn, isLoaded: signInLoaded, setActive } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();

  // Handlers
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInLoaded || !signIn || !setActive) return;

    try {
      setIsLoading(true);
      setError(null);
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      }
    } catch (err) {
      const clerkError = err as ClerkError;
      console.error("Error signing in", clerkError);
      setError(clerkError.errors?.[0]?.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpLoaded || !signUp || !setActive) return;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setIsVerifying(true);
      
    } catch (err) {
      const clerkError = err as ClerkError;
      console.error("Error signing up:", clerkError);
      setError(clerkError.errors?.[0]?.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!signUpLoaded || !signUp || !setActive) return;

    try {
      setIsLoading(true);
      setError(null);

      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        setIsVerifying(false);
      } else {
        setError("Verification failed. Please try again.");
      }
    } catch (err) {
      const clerkError = err as ClerkError;
      console.error("Error verifying:", clerkError);
      setError(clerkError.errors?.[0]?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!signUpLoaded || !signUp) return;
    
    try {
      setIsLoading(true);
      setError(null);
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    } catch (err) {
      const clerkError = err as ClerkError;
      console.error("Error resending code:", clerkError);
      setError(clerkError.errors?.[0]?.message || "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithSocial = async (provider: "oauth_google" | "oauth_facebook") => {
    if (!signIn) return;

    try {
      setIsLoading(true);
      setError(null);
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err) {
      const clerkError = err as ClerkError;
      console.error(`Error signing in with ${provider}`, clerkError);
      setError(`Failed to sign in with ${provider}`);
      setIsLoading(false);
    }
  };

  // Render verification form if in verification state
  if (isVerifying) {
    return (
      <VerificationForm
        email={email}
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        isLoading={isLoading}
        error={error}
        onSubmit={handleVerification}
        onResend={handleResendCode}
        className={className}
        {...props}
      />
    );
  }

  // Main form
  return (
    <div className={cn("grid gap-6 p-4", className)} {...props}>
      <Tabs defaultValue="sign-in" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sign-in">Sign In</TabsTrigger>
          <TabsTrigger value="sign-up">Create Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sign-in" className="space-y-4">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sign-in-email">Email</Label>
              <Input
                id="sign-in-email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <PasswordInput
              id="sign-in-password"
              label="Password"
              value={password}
              onChange={setPassword}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              isLoading={isLoading}
            />

            {error && (
              <div className="text-sm font-medium text-destructive">
                {error}
              </div>
            )}

            <Button className="w-full" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="sign-up" className="space-y-4">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sign-up-email">Email</Label>
              <Input
                id="sign-up-email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <PasswordInput
              id="sign-up-password"
              label="Password"
              value={password}
              onChange={setPassword}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              autoComplete="new-password"
              isLoading={isLoading}
              pattern="(?=.*[A-Z])(?=.*[0-9]).*"
              title="Password must contain at least 8 characters, one uppercase letter, and one number"
            />

            <PasswordInput
              id="sign-up-confirm-password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              autoComplete="new-password"
              isLoading={isLoading}
            />

            <div className="text-sm text-muted-foreground">
              Password must:
              <ul className="list-disc pl-4 space-y-1">
                <li>Be at least 8 characters long</li>
                <li>Contain at least one uppercase letter</li>
                <li>Contain at least one number</li>
              </ul>
            </div>

            {error && (
              <div className="text-sm font-medium text-destructive">
                {error}
              </div>
            )}

            <div id="clerk-captcha" className="my-3" />

            <Button className="w-full" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Account
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SocialButton
          provider="oauth_google"
          isLoading={isLoading}
          onClick={() => signInWithSocial("oauth_google")}
        />
        <SocialButton
          provider="oauth_facebook"
          isLoading={isLoading}
          onClick={() => signInWithSocial("oauth_facebook")}
        />
      </div>
    </div>
  );
} 