import { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info';
type StatusType = 'watching' | 'completed' | 'plan_to_watch' | 'on_hold' | 'dropped';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  status?: StatusType;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, status?: StatusType) => void;
}

const STATUS_COLORS: Record<StatusType, string> = {
  watching: 'bg-[#3b82f6]',
  completed: 'bg-[#22c55e]',
  plan_to_watch: 'bg-[#eab308]',
  on_hold: 'bg-[#f97316]',
  dropped: 'bg-[#ef4444]',
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
  toastFnRef?: React.MutableRefObject<((message: string, type?: ToastType, status?: StatusType) => void) | null>;
}

export function ToastProvider({ children, toastFnRef }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = 'success', status?: StatusType) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, status }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  useEffect(() => {
    if (toastFnRef) {
      toastFnRef.current = addToast;
    }
  }, [toastFnRef]);

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function toast(message: string, type: ToastType = 'success') {
  console.warn('toast called outside ToastProvider');
}