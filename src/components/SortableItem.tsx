"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ReactNode, useEffect, useState } from "react"

export const SortableItem = ({
  id,
  children,
}: {
  id: string
  children: ReactNode
}) => {
  const [mounted, setMounted] = useState(false)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  useEffect(() => {
    setMounted(true)
  }, [])

  const style = mounted ? {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : "auto",
  } : {}

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      {...(mounted ? attributes : {})}
      {...(mounted ? listeners : {})}
    >
      {children}
    </div>
  )
}