export const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: 'bg-surface border-border text-text-secondary',
        primary: 'bg-primary/10 border-primary/20 text-primary',
        secondary: 'bg-secondary/10 border-secondary/20 text-secondary',
        success: 'bg-success/10 border-success/20 text-success',
        danger: 'bg-danger/10 border-danger/20 text-danger',
    };

    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border uppercase tracking-wider ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};
