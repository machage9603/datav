import React from "react"
import { ChartTooltip as RechartsTooltip } from "recharts"

export function ChartContainer({ children, config, className }) {
  return (
    <div className={className}>
      <style jsx global>{`
        :root {
          ${config &&
          Object.entries(config)
            .map(
              ([key, value]) => `
                --color-${key}: ${value.color};
              `
            )
            .join("")}
        }
      `}</style>
      {children}
    </div>
  )
}

export function ChartTooltip({ content }) {
  return (
    <RechartsTooltip
      content={content}
      wrapperStyle={{ outline: "none" }}
      cursor={{ fill: "var(--background)" }}
    />
  )
}

export function ChartTooltipContent({ active, payload, label, hideLabel }) {
  if (!active || !payload) return null

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      {!hideLabel && <div className="font-medium">{label}</div>}
      {payload.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="font-medium">{item.value.toLocaleString()}</div>
          <div className="text-muted-foreground">{item.name}</div>
        </div>
      ))}
    </div>
  )
}
