"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="h-10 w-10">
        <Monitor className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }
  
  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme('light')
    } else if (theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('system')
    }
  }

  const ThemeIcon = () => {
    if (theme === 'system') return <Monitor className="h-[1.2rem] w-[1.2rem]" />
    if (theme === 'light') return <Sun className="h-[1.2rem] w-[1.2rem]" />
    return <Moon className="h-[1.2rem] w-[1.2rem]" />
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      title={`Current theme: ${theme}`}
      className="h-10 w-10"
    >
      <ThemeIcon />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
} 