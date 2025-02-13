import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    details: "+48 123 456 789",
    subtext: "Mon-Fri 9:00-17:00"
  },
  {
    icon: Mail,
    title: "Email",
    details: "contact@automarket.pl",
    subtext: "We'll respond within 24h"
  },
  {
    icon: MapPin,
    title: "Office",
    details: "Warsaw, Poland",
    subtext: "ul. Example 123"
  },
  {
    icon: Clock,
    title: "Hours",
    details: "9:00 - 17:00",
    subtext: "Monday to Friday"
  }
]

export default function ContactPage() {
  return (
    <div className="container py-6">
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="text-xl text-muted-foreground">
          Get in touch with our team
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
          <form className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Input placeholder="Name" />
              </div>
              <div>
                <Input type="email" placeholder="Email" />
              </div>
            </div>
            <div>
              <Input placeholder="Subject" />
            </div>
            <div>
              <Textarea 
                placeholder="Your message" 
                className="min-h-[150px]" 
              />
            </div>
            <Button className="w-full md:w-auto">Send Message</Button>
          </form>
        </Card>

        <div className="space-y-6">
          {contactInfo.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.title}>
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-lg">{item.details}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.subtext}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
