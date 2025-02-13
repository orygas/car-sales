import { Card } from "@/components/ui/card"
import { Shield, Users, Share2, Lock, UserCog, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const sections = [
  {
    title: "Information We Collect",
    icon: Users,
    description: "When you use Auto Market, we collect information that you provide directly to us:",
    items: [
      "Account information (name, email, phone number)",
      "Listing information (vehicle details, photos, location)",
      "Communication data between buyers and sellers",
      "Usage information and preferences"
    ],
    className: "md:col-span-2"
  },
  {
    title: "How We Use Your Information",
    icon: Shield,
    description: "We use the information we collect to:",
    items: [
      "Provide and maintain our services",
      "Process and display your vehicle listings",
      "Facilitate communication between users",
      "Improve our platform and user experience",
      "Send important updates and notifications",
      "Prevent fraud and ensure platform safety"
    ],
    className: "md:col-span-1 md:row-span-2"
  },
  {
    title: "Information Sharing",
    icon: Share2,
    description: "We share your information only in specific circumstances:",
    items: [
      "With other users as necessary (e.g., seller contact information)",
      "With service providers who assist in our operations",
      "When required by law or to protect rights",
      "In the event of a business transaction"
    ],
    className: "md:col-span-1"
  },
  {
    title: "Data Security",
    icon: Lock,
    description: "We implement appropriate security measures to protect your personal information:",
    items: [
      "Encryption of sensitive data",
      "Regular security assessments",
      "Access controls and monitoring",
      "Secure data storage practices"
    ],
    className: "md:col-span-1"
  },
  {
    title: "Your Rights",
    icon: UserCog,
    description: "You have the right to:",
    items: [
      "Access your personal information",
      "Correct inaccurate data",
      "Request deletion of your data",
      "Opt-out of marketing communications",
      "Export your data"
    ],
    className: "md:col-span-2"
  },
  {
    title: "Contact Us",
    icon: Mail,
    description: "If you have any questions about this Privacy Policy, please contact us at:",
    items: [
      "Email: privacy@automarket.pl",
      "Address: ul. Example 123, Warsaw, Poland",
      "Phone: +48 123 456 789"
    ],
    footer: "Or send us a direct message:",
    button: {
      text: "Contact Us",
      href: "/contact"
    },
    className: "md:col-span-1"
  }
]

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-6">
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="text-xl text-muted-foreground">
          Last updated: March 2024
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <Card key={section.title} className={`p-6 ${section.className}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">{section.title}</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>{section.description}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {section.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                {section.footer && (
                  <p className="mt-4">{section.footer}</p>
                )}
                {section.button && (
                  <Button asChild className="w-full mt-2">
                    <Link href={section.button.href}>{section.button.text}</Link>
                  </Button>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 