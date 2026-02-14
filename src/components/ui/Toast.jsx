import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useState, useEffect, createContext, useContext } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 4000);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);

const Toast = ({ toast, onDismiss }) => {
    const variants = {
        initial: { opacity: 0, x: 50, scale: 0.9 },
        animate: { opacity: 1, x: 0, scale: 1 },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
    };

    const styles = {
        success: { border: 'border-success', icon: CheckCircle, color: 'text-success', bg: 'bg-[#0f1a00]' },
        error: { border: 'border-danger', icon: AlertCircle, color: 'text-danger', bg: 'bg-[#1a0505]' },
        info: { border: 'border-blue', icon: Info, color: 'text-blue', bg: 'bg-[#05101a]' }
    }[toast.type];

    const Icon = styles.icon;

    return (
        <motion.div
            layout
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`pointer-events-auto min-w-[300px] p-4 rounded-xl border ${styles.border} ${styles.bg} backdrop-blur-md shadow-2xl flex items-start gap-3`}
        >
            <Icon className={`${styles.color} mt-0.5 shrink-0`} size={18} />
            <div className="flex-1">
                <p className="text-sm font-mono font-medium text-white">{toast.message}</p>
            </div>
            <button onClick={() => onDismiss(toast.id)} className="text-text-muted hover:text-white transition-colors">
                <X size={14} />
            </button>
        </motion.div>
    );
};
