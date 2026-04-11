import { useToast } from '../../context/ToastContext';

export function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  const typeStyles = {
    success: 'bg-[var(--color-status-completed)] text-white',
    error: 'bg-[var(--color-status-dropped)] text-white',
    info: 'bg-[var(--color-status-watching)] text-white',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right duration-200 ${typeStyles[t.type]}`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}