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
    <footer className="border-t mt-20">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="h-full flex flex-col">
            <h3 className="text-base font-semibold mb-2">Auto Market</h3>
            <ul className="flex-1 flex flex-col justify-between text-sm">
              <li><a href="/about" className="text-muted-foreground hover:text-primary">About Us</a></li>
              <li><a href="/contact" className="text-muted-foreground hover:text-primary">Contact</a></li>
              <li><a href="/support" className="text-muted-foreground hover:text-primary">Support</a></li>
            </ul>
          </div>
          <div className="md:col-span-3 flex justify-end">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-base font-semibold">Language</label>
                <Select defaultValue="en" onValueChange={() => {}}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-base font-semibold">Theme</label>
                <Select value={theme || "system"} onValueChange={setTheme}>
                  <SelectTrigger className="w-[180px]">
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
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Auto Market. All rights reserved.
        </div>
      </div>
    </footer>
  )
} 