import * as React from "react"

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const Dialog = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { open?: boolean; onOpenChange?: (open: boolean) => void }
>(({ className, open, onOpenChange, children, ...props }, ref) => {
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={() => onOpenChange?.(false)}
      />
      <div
        ref={ref}
        className="relative z-50 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-4 pt-10 sm:p-6 sm:pt-12 max-w-3xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-y-auto shadow-2xl animate-scaleIn"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        {...props}
      >
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <button
          onClick={() => onOpenChange?.(false)}
          className="absolute top-3 right-3 text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors z-10"
        >
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>
  )
})
Dialog.displayName = "Dialog"

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={className} {...props}>{children}</div>
))
DialogContent.displayName = "DialogContent"

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex flex-col space-y-2 ${className}`} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className="text-xl font-semibold text-[var(--color-foreground)]"
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className="text-sm text-[var(--color-foreground-muted)]"
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

const DialogBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={`flex-1 overflow-y-auto ${className}`} {...props} />
))
DialogBody.displayName = "DialogBody"

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody }
