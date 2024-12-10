// components/ui/slider.jsx
"use client"

import React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

// Utility function for class name merging
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center group",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
      <SliderPrimitive.Range className="absolute h-full bg-indigo-500 dark:bg-indigo-400" />
    </SliderPrimitive.Track>
    {props.value?.map((_, index) => (
      <SliderPrimitive.Thumb
        key={index}
        className={cn(
          "block h-5 w-5 rounded-full border-2 border-indigo-500 bg-white ring-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-indigo-400 dark:focus-visible:ring-indigo-400",
          props.value && props.value.length > 1 ? "first:ml-1" : ""
        )}
      />
    ))}
  </SliderPrimitive.Root>
))

Slider.displayName = 'Slider'

export { Slider }