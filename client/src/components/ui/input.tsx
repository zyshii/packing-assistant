import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border-2 border-light-sand bg-warm-beige px-4 py-3 text-base text-charcoal ring-offset-background transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-warm-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-orange focus-visible:ring-offset-2 focus-visible:border-warm-orange focus-visible:bg-cream disabled:cursor-not-allowed disabled:opacity-50 hover:border-warm-orange/50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
