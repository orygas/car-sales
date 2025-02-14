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
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

// Types
type SignInFormProps = React.HTMLAttributes<HTMLDivElement> & {
  showWelcomeText?: boolean;
};

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

// interface SocialButtonProps {
//   provider: "oauth_google" | "oauth_facebook";
//   isLoading: boolean;
//   onClick: () => void;
// }

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

// const SocialButton = ({ provider, isLoading, onClick }: SocialButtonProps) => (
//   <Button
//     variant="outline"
//     type="button"
//     disabled={isLoading}
//     onClick={onClick}
//   >
//     {isLoading ? (
//       <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
//     ) : provider === "oauth_google" ? (
//       <Icons.google className="mr-2 h-4 w-4" />
//     ) : (
//       <Icons.facebook className="mr-2 h-4 w-4" />
//     )}
//     {provider === "oauth_google" ? "Google" : "Facebook"}
//   </Button>
// );

// Main Component
export function SignInForm({ className, showWelcomeText, ...props }: SignInFormProps) {
  const router = useRouter();
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
        identifier,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push('/');
      }
    } catch (err) {
      const clerkError = err as ClerkError;
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
        username,
        password,
        firstName,
        lastName,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setIsVerifying(true);
      
    } catch (err) {
      const clerkError = err as ClerkError;
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
        router.push('/');
      } else {
        setError("Verification failed. Please try again.");
      }
    } catch (err) {
      const clerkError = err as ClerkError;
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
      setError(clerkError.errors?.[0]?.message || "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  // const signInWithSocial = async (provider: "oauth_google" | "oauth_facebook") => {
  //   if (!signIn) return;

  //   try {
  //     setIsLoading(true);
  //     setError(null);
  //     await signIn.authenticateWithRedirect({
  //       strategy: provider,
  //       redirectUrl: "/sso-callback",
  //       redirectUrlComplete: "/",
  //     });
  //   } catch (err) {
  //     const clerkError = err as ClerkError;
  //     console.error(`Error signing in with ${provider}`, clerkError);
  //     setError(`Failed to sign in with ${provider}`);
  //     setIsLoading(false);
  //   }
  // };

  // Main form
  return (
    <div className={cn("w-full max-w-[400px]", className)} {...props}>
      {isVerifying ? (
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">Verify your email</h2>
            <p className="text-sm text-muted-foreground">
              We&apos;ve sent a code to {email}
            </p>
          </div>

          <form onSubmit={handleVerification} className="space-y-4">
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
              Verify Email
            </Button>

            <Button
              variant="ghost"
              className="w-full text-sm text-muted-foreground hover:text-primary"
              onClick={handleResendCode}
              disabled={isLoading}
              type="button"
            >
              Didn&apos;t receive a code? Resend
            </Button>
          </form>
        </div>
      ) : (
        <>
          {showWelcomeText && (
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold">Welcome Back</h1>
              <p className="text-sm text-muted-foreground">Sign in to your account or create a new one</p>
            </div>
          )}
          <Tabs defaultValue="sign-in" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sign-in">Sign In</TabsTrigger>
              <TabsTrigger value="sign-up">Create Account</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="sign-in">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="identifier">Email or Username</Label>
                    <Input
                      id="identifier"
                      placeholder="name@example.com"
                      type="text"
                      autoCapitalize="none"
                      autoCorrect="off"
                      disabled={isLoading}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
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

              <TabsContent value="sign-up">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        placeholder="John"
                        disabled={isLoading}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        placeholder="Doe"
                        disabled={isLoading}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="johndoe"
                      disabled={isLoading}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

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

                  <div className="rounded-md bg-muted px-4 py-3">
                    <div className="text-sm font-medium">Password requirements:</div>
                    <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside space-y-1">
                      <li>At least 8 characters</li>
                      <li>One uppercase letter</li>
                      <li>One number</li>
                    </ul>
                  </div>

                  {error && (
                    <div className="text-sm font-medium text-destructive">
                      {error}
                    </div>
                  )}

                  <div id="clerk-captcha" />

                  <Button className="w-full" disabled={isLoading}>
                    {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </div>
          </Tabs>
        </>
      )}
    </div>
  );
} 