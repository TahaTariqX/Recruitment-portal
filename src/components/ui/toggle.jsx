import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-gray-900 data-[state=on]:text-white",
  {
    variants: {
      variant: {
        default: "bg-white border border-gray-200",
        outline: "border border-gray-200 bg-transparent hover:bg-gray-100 hover:text-gray-900",
      },
      size: {
        default: "h-9 px-3",
        sm: "h-8 px-2.5 text-xs",
        lg: "h-10 px-3",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

const Toggle = React.forwardRef(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root ref={ref} className={cn(toggleVariants({ variant, size, className }))} {...props}/>
))
Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
