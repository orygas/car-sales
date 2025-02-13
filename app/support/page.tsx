import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"

const faqs = [
  {
    question: "How do I list my car for sale?",
    answer: "Click the 'Sell Your Car' button in the navigation bar, fill in your car's details, upload photos, and submit. Your listing will be published as soon as possible."
  },
  {
    question: "Is it free to list my car?",
    answer: "Yes, listings are completely free. We believe in providing a transparent platform for both buyers and sellers without any hidden costs."
  },
  {
    question: "How do I contact a seller?",
    answer: "Each listing has contact information. You can view the seller's phone number or send them a message directly through our platform. For your security, always communicate through our platform initially."
  },
  {
    question: "Are the cars verified?",
    answer: "While we verify seller information, we recommend buyers to inspect vehicles in person and request vehicle history reports before purchase. Always meet in a safe, public location for viewings."
  },
  {
    question: "How long does it take for my listing to appear?",
    answer: "Listings typically appear immediately after submission. However, they may be briefly reviewed for quality and compliance with our guidelines."
  },
  {
    question: "Can I edit my listing after posting?",
    answer: "Yes, you can edit your listing at any time. Simply log in to your account, go to your listings, and click the edit button to make changes."
  },
  {
    question: "What photos should I include in my listing?",
    answer: "Include clear photos of the exterior (front, back, sides), interior (seats, dashboard, trunk), and any notable features or damage. Good quality photos increase the chances of selling your car."
  },
  {
    question: "How do I remove my listing?",
    answer: "You can remove your listing at any time by logging into your account and selecting 'Delete Listing' from your listings dashboard. If your car is sold, please remember to remove the listing."
  }
]

export default function SupportPage() {
  return (
    <div className="container py-6">
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold">Support Center</h1>
        <p className="text-xl text-muted-foreground">
          Find answers to common questions about Auto Market
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-1">
          <Card className="p-6 h-full">
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="p-6 sticky top-20">
            <h2 className="text-2xl font-semibold mb-4">Need More Help?</h2>
            <p className="text-muted-foreground mb-6">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help you with any questions or issues you might have.
            </p>
            <Button asChild className="w-full">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
