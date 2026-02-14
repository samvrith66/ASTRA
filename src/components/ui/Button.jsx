import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({ children, variant = 'primary', className, ...props }) => {
    const variants = {
        primary: "bg-primary text-black hover:bg-white hover:shadow-[0_0_15px_rgba(184,255,87,0.5)] border-transparent",
        secondary: "bg-surface border-border text-text-secondary hover:border-primary/50 hover:text-primary",
        outline: "bg-transparent border-primary text-primary hover:bg-primary/10",
        ghost: "bg-transparent text-text-secondary hover:text-white"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={twMerge(
                "px-6 py-3 rounded-xl font-display font-semibold transition-all duration-300 border flex items-center justify-center gap-2",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
};
