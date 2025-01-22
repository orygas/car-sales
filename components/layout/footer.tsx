"use client"

import { useTheme } from "next-themes"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"

export function Footer() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <footer className="border-t mt-20 bg-background">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="md:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {/* Company Info */}
              <div>
                <h3 className="font-semibold mb-3">Auto Market</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="/support" className="text-muted-foreground hover:text-primary transition-colors">
                      Support
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Legal */}
              <div>
                <h3 className="font-semibold mb-3">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="md:col-span-4">
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Language</label>
                <Select defaultValue="en" onValueChange={() => {}}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block font-semibold mb-2">Theme</label>
                <Select value={theme || "system"} onValueChange={setTheme}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Auto Market. All rights reserved.
        </div>
      </div>
    </footer>
  )
} 