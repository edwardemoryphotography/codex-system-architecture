import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => string;
  error: (title: string, message?: string) => string;
  warning: (title: string, message?: string) => string;
  info: (title: string, message?: string) => string;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: React.ReactNode;
  isDarkMode?: boolean;
}

export function ToastProvider({ children, isDarkMode = false }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const success = useCallback(
    (title: string, message?: string) => addToast({ type: 'success', title, message, duration: 4000 }),
    [addToast]
  );

  const error = useCallback(
    (title: string, message?: string) => addToast({ type: 'error', title, message, duration: 6000 }),
    [addToast]
  );

  const warning = useCallback(
    (title: string, message?: string) => addToast({ type: 'warning', title, message, duration: 5000 }),
    [addToast]
  );

  const info = useCallback(
    (title: string, message?: string) => addToast({ type: 'info', title, message, duration: 4000 }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} isDarkMode={isDarkMode} />
    </ToastContext.Provider>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
  isDarkMode: boolean;
}

function ToastContainer({ toasts, onRemove, isDarkMode }: ToastContainerProps) {
  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} isDarkMode={isDarkMode} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
  isDarkMode: boolean;
}

function ToastItem({ toast, onRemove, isDarkMode }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  const handleRemove = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 200);
  }, [toast.id, onRemove]);

  useEffect(() => {
    if (!toast.duration) return;

    const startTime = Date.now();
    const endTime = startTime + toast.duration;

    const progressInterval = setInterval(() => {
      const remaining = endTime - Date.now();
      const newProgress = (remaining / toast.duration!) * 100;
      setProgress(Math.max(0, newProgress));
    }, 50);

    const timeout = setTimeout(handleRemove, toast.duration);

    return () => {
      clearTimeout(timeout);
      clearInterval(progressInterval);
    };
  }, [toast.duration, handleRemove]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const colors = {
    success: isDarkMode ? 'border-green-500/30' : 'border-green-200',
    error: isDarkMode ? 'border-red-500/30' : 'border-red-200',
    warning: isDarkMode ? 'border-amber-500/30' : 'border-amber-200',
    info: isDarkMode ? 'border-blue-500/30' : 'border-blue-200',
  };

  const progressColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
  };

  return (
    <div
      role="alert"
      className={`
        pointer-events-auto w-full rounded-xl border-2 shadow-xl overflow-hidden
        transform transition-all duration-200 ease-out
        ${isDarkMode ? 'bg-gray-800/95 backdrop-blur-xl' : 'bg-white/95 backdrop-blur-xl'}
        ${colors[toast.type]}
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      `}
      style={{ animation: isExiting ? undefined : 'toastSlideIn 0.3s ease-out' }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>

          <div className="flex-1 min-w-0">
            <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {toast.title}
            </p>
            {toast.message && (
              <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {toast.message}
              </p>
            )}
            {toast.action && (
              <button
                onClick={() => {
                  toast.action?.onClick();
                  handleRemove();
                }}
                className={`mt-2 text-sm font-medium transition-colors ${
                  toast.type === 'success' ? 'text-green-500 hover:text-green-600' :
                  toast.type === 'error' ? 'text-red-500 hover:text-red-600' :
                  toast.type === 'warning' ? 'text-amber-500 hover:text-amber-600' :
                  'text-blue-500 hover:text-blue-600'
                }`}
              >
                {toast.action.label}
              </button>
            )}
          </div>

          <button
            onClick={handleRemove}
            className={`flex-shrink-0 p-1 rounded-lg transition-colors ${
              isDarkMode
                ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-700'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {toast.duration && (
        <div className="h-1 w-full bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-full transition-all duration-100 ${progressColors[toast.type]}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
