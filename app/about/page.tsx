import { Card, CardContent } from "@/components/ui/card"
import { Shield, Car, Users, Clock } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "Every listing is verified and transactions are monitored for your safety"
  },
  {
    icon: Car,
    title: "Wide Selection",
    description: "Browse thousands of cars from trusted sellers across the country"
  },
  {
    icon: Users,
    title: "Direct Contact",
    description: "Connect directly with sellers and arrange viewings on your terms"
  },
  {
    icon: Clock,
    title: "Quick & Easy",
    description: "List your car in minutes with our streamlined process"
  }
]

export default function AboutPage() {
  return (
    <div className="container py-6">
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold">About Auto Market</h1>
        <p className="text-xl text-muted-foreground">
          Your trusted platform for buying and selling cars
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-muted-foreground">
            Auto Market is dedicated to making car trading simple, secure, and transparent. 
            We connect buyers with sellers, providing all the tools and information needed 
            to make informed decisions about your next vehicle purchase or sale.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
          <p className="text-muted-foreground">
            With years of experience in the automotive market, we understand what matters 
            most to our users. Our platform is built with advanced features to ensure 
            a smooth experience, whether you&apos;re buying or selling.
          </p>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Card key={feature.title}>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
