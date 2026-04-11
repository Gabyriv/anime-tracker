import * as React from "react"

const ChevronDownIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

interface DropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: "left" | "right"
}

interface DropdownMenuProps {
  children: React.ReactNode
  onClose?: () => void
  align?: "left" | "right"
}

export function Dropdown({ trigger, children, align = "right" }: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={handleTriggerClick}>{trigger}</div>
      {isOpen && (
        <div className={`absolute bottom-full mb-1 ${align === "right" ? "right-0" : "left-0"} bg-gray-800 rounded-lg shadow-lg py-1 z-[100] min-w-[140px]`}>
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return child;
            const originalOnSelect = (child.props as { onSelect?: (e: React.MouseEvent) => void }).onSelect;
            return React.cloneElement(child as React.ReactElement<{ onSelect?: (e: React.MouseEvent) => void }>, {
              onSelect: (e: React.MouseEvent) => {
                e.stopPropagation();
                originalOnSelect?.(e);
                setIsOpen(false);
              }
            });
          })}
        </div>
      )}
    </div>
  )
}

interface DropdownItemProps {
  children: React.ReactNode
  onSelect?: (e: React.MouseEvent) => void
  className?: string
}

export function DropdownItem({ children, onSelect, className = "" }: DropdownItemProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(e);
      }}
      className={`block w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-gray-700 ${className}`}
    >
      {children}
    </button>
  )
}

export function DropdownSeparator() {
  return <div className="h-px bg-gray-700 my-1" />
}