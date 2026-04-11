import * as React from "react"

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}

export function Tabs({ value, onValueChange, children }: TabsProps) {
  return (
    <div className="w-full">
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<{ value: string; onValueChange: (v: string) => void }>, { value, onValueChange })
          : child
      )}
    </div>
  )
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

export function TabsList({ children, className = "" }: TabsListProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function TabsTrigger({ value, children, className = "" }: TabsTriggerProps) {
  // This would need context to know if it's active - for simplicity using a wrapper
  return <>{children}</>
}

export function TabButton({ 
  value, 
  activeValue, 
  onClick, 
  children, 
  className = "",
  activeClass = "bg-blue-600 text-white",
  inactiveClass = "bg-gray-800 text-gray-300 hover:bg-gray-700"
}: { 
  value: string
  activeValue: string
  onClick: () => void
  children: React.ReactNode
  className?: string
  activeClass?: string
  inactiveClass?: string
}) {
  const isActive = value === activeValue
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition-colors ${isActive ? activeClass : inactiveClass} ${className}`}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  activeValue: string
  children: React.ReactNode
}

export function TabsContent({ value, activeValue, children }: TabsContentProps) {
  if (value !== activeValue) return null
  return <>{children}</>
}