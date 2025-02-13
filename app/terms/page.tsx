import { Card } from "@/components/ui/card"
import { FileCheck, UserCheck, ClipboardList, ShieldX, ShieldAlert, Scale, FileWarning, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const sections = [
  {
    title: "1. Acceptance of Terms",
    icon: FileCheck,
    description: "By accessing or using Auto Market, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.",
    className: "md:col-span-3"
  },
  {
    title: "2. User Responsibilities",
    icon: UserCheck,
    description: "As a user of Auto Market, you agree to:",
    items: [
      "Provide accurate and truthful information about vehicles and yourself",
      "Maintain the confidentiality of your account credentials",
      "Not engage in fraudulent or deceptive practices",
      "Respect other users' rights and privacy",
      "Comply with all applicable laws and regulations"
    ],
    className: "md:col-span-2"
  },
  {
    title: "3. Listing Guidelines",
    icon: ClipboardList,
    description: "When listing a vehicle, you must:",
    items: [
      "Own the vehicle or have authority to sell it",
      "Provide accurate vehicle information and condition",
      "Include clear, current photos of the actual vehicle",
      "Set fair and transparent pricing",
      "Respond to inquiries in a timely manner",
      "Remove listings once a vehicle is sold"
    ],
    className: "md:col-span-1 md:row-span-2"
  },
  {
    title: "4. Prohibited Activities",
    icon: ShieldX,
    description: "Users are prohibited from:",
    items: [
      "Posting fraudulent or misleading listings",
      "Harassing or discriminating against other users",
      "Attempting to circumvent our platform fees",
      "Using automated systems or bots",
      "Violating intellectual property rights",
      "Sharing other users' personal information"
    ],
    className: "md:col-span-2"
  },
  {
    title: "5. Transactions and Safety",
    icon: ShieldAlert,
    description: "For safe transactions:",
    items: [
      "Meet in safe, public locations for vehicle inspections",
      "Verify vehicle documentation and ownership",
      "Use secure payment methods",
      "Report suspicious activity to our support team",
      "Consider professional inspection services"
    ],
    className: "md:col-span-2"
  },
  {
    title: "6. Limitation of Liability",
    icon: Scale,
    description: "Auto Market serves as a platform connecting buyers and sellers. We are not:",
    items: [
      "Responsible for the accuracy of listings",
      "A party to any transaction between users",
      "Liable for vehicle condition or quality",
      "Responsible for user disputes or damages"
    ],
    className: "md:col-span-1"
  },
  {
    title: "7. Modifications to Terms",
    icon: FileWarning,
    description: "We reserve the right to modify these terms at any time. Continued use of Auto Market after changes constitutes acceptance of the modified terms. Users will be notified of significant changes.",
    className: "md:col-span-2"
  },
  {
    title: "8. Contact Information",
    icon: Mail,
    description: "For questions about these Terms of Service, please contact us at:",
    items: [
      "Email: legal@automarket.pl",
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

export default function TermsPage() {
  return (
    <div className="container py-6">
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold">Terms of Service</h1>
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
                {section.items && (
                  <ul className="list-disc pl-6 space-y-2">
                    {section.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
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