"use client"

import * as React from "react"

type ThemeProviderProps = {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "light",
  ...props
}: ThemeProviderProps) {
  return (
    <div className={defaultTheme} {...props}>
      {children}
    </div>
  )
}
