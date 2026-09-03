import * as React from "react"
import { cn } from "../../utils/utils"

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-secondary/80", className)}
      {...props}
    />
  )
}

export { Skeleton }
