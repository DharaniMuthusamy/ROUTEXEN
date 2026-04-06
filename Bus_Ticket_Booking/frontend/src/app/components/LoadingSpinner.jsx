export function LoadingSpinner({ size = 'md', color = 'text-[#0033A0]' }) {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div className={`${sizeClasses[size]} ${color} border-t-transparent rounded-full animate-spin`}></div>
    );
}
